"use server";

import { db } from "@/db/db";
import { checkUserAuthed } from "./user.action";
import {
  AnswerTable,
  AnswerVoteTable,
  CollectionTable,
  QuestionTable,
  QuestionTagTable,
  QuestionVoteTable,
  TagTable,
  user,
  VoteType,
} from "@/db/schema";
import {
  HOME_FILTERS,
  PAGE_SIZE,
  QUESTION_ANSWERS_FILTERS,
  UNAUTHED_MESSAGE,
} from "../constants";
import { and, asc, count, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { getTableColumns } from "drizzle-orm";
import { GetActionOutput } from "../types";
import { isEqual } from "lodash";
import { redirect } from "next/navigation";

type PostQuestionProps = {
  title: string;
  question: string;
  tags: string[];
};

export const postQuestion = async ({
  title,
  question,
  tags,
}: PostQuestionProps) => {
  const session = await checkUserAuthed();
  if (!session) {
    return { error: true, message: "You are not allowed to do this" };
  }

  try {
    const [postedQuestion] = await db
      .insert(QuestionTable)
      .values({
        title,
        question,
        userId: session.user.id,
      })
      .returning();

    await db
      .insert(TagTable)
      .values(
        tags.map((tag) => ({
          name: tag,
        })),
      )
      .onConflictDoNothing()
      .returning();

    const tagIds = await db
      .select({
        id: TagTable.id,
      })
      .from(TagTable)
      .where(inArray(TagTable.name, tags));

    await db.insert(QuestionTagTable).values(
      tagIds.map((tag) => ({
        tagId: tag.id,
        questionId: postedQuestion.id,
      })),
    );

    return { error: false, message: "Question posted successfully!" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Something went wrong" };
  }
};

export const editQuestion = async (
  props: PostQuestionProps & { questionId: string },
) => {
  const { questionId, question, title, tags } = props;
  const session = await checkUserAuthed();
  if (!session) return { error: true, message: UNAUTHED_MESSAGE };
  const normalizedTags = [...new Set(tags.map((tag) => tag.trim()))];

  const [existingQuestion] = await db
    .select({
      ...getTableColumns(QuestionTable),
      tags: sql<{ name: string }[]>`(
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'name', tags.tag_name
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT tt.name AS tag_name
          FROM ${TagTable} tt
          INNER JOIN ${QuestionTagTable} qtt ON qtt.tag_id = tt.id
          WHERE qtt.question_id = ${questionId}
        ) AS tags
      )`,
    })
    .from(QuestionTable)
    .where(
      and(
        eq(QuestionTable.id, questionId),
        eq(QuestionTable.userId, session.user.id),
      ),
    );

  if (!existingQuestion) {
    return { error: true, message: "Question not found." };
  }

  if (
    isEqual(
      { question: question.trim(), title: title.trim(), tags: normalizedTags },
      {
        question: existingQuestion.question.trim(),
        title: existingQuestion.title.trim(),
        tags: existingQuestion.tags.map((tag) => tag.name).sort(),
      },
    )
  ) {
    return { error: true, message: "Question is unchanged." };
  }
  await db
    .update(QuestionTable)
    .set({
      question,
      title,
    })
    .where(
      and(
        eq(QuestionTable.id, questionId),
        eq(QuestionTable.userId, session.user.id),
      ),
    );

  const existingTagNames = existingQuestion.tags.map((tag) => tag.name).sort();
  if (!isEqual(existingTagNames, [...normalizedTags].sort())) {
    await db
      .insert(TagTable)
      .values(normalizedTags.map((tag) => ({ name: tag })))
      .onConflictDoNothing()
      .returning();

    const tagIds = await db
      .select({
        id: TagTable.id,
      })
      .from(TagTable)
      .where(inArray(TagTable.name, normalizedTags));

    await db
      .delete(QuestionTagTable)
      .where(eq(QuestionTagTable.questionId, questionId));

    if (tagIds.length > 0) {
      await db
        .insert(QuestionTagTable)
        .values(tagIds.map((tag) => ({ questionId, tagId: tag.id })))
        .onConflictDoNothing();
    }
  }

  return { error: false, message: "Question updated successfully!" };
};

export const getEditQuestion = async (questionId: string) => {
  const session = await checkUserAuthed();
  if (!session) return redirect("/sign-in");

  const [existingQuestion] = await db
    .select({
      id: QuestionTable.id,
      question: QuestionTable.question,
      title: QuestionTable.title,
      tags: sql<{ name: string }[]>`(
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'name', tags.tag_name
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT tt.name AS tag_name
          FROM ${TagTable} tt
          INNER JOIN ${QuestionTagTable} qtt ON qtt.tag_id = tt.id
          WHERE qtt.question_id = ${questionId}
        ) as tags
      )`,
    })
    .from(QuestionTable)
    .where(
      and(
        eq(QuestionTable.id, questionId),
        eq(QuestionTable.userId, session.user.id),
      ),
    );

  return existingQuestion;
};

export const deleteQuestion = async (questionId: string) => {
  const session = await checkUserAuthed();
  if (!session) return { error: true, message: UNAUTHED_MESSAGE };

  try {
    const [deletedQuestion] = await db
      .delete(QuestionTable)
      .where(
        and(
          eq(QuestionTable.id, questionId),
          eq(QuestionTable.userId, session.user.id),
        ),
      )
      .returning();
    if (!deletedQuestion) {
      throw new Error("Failed to delete question.");
    }
    return { error: false, message: "Question deleted successfully!" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to delete question." };
  }
};

type GetQuestionsProps = {
  query: string;
  page: number;
  filter: (typeof HOME_FILTERS)[number];
};

export const getQuestions = async (filters: GetQuestionsProps) => {
  const { query, page, filter } = filters;

  if (page < 1) return null;
  const offset = (page - 1) * PAGE_SIZE;

  const filterMap: Record<(typeof HOME_FILTERS)[number], any> = {
    newest: [desc(QuestionTable.createdAt), desc(QuestionTable.id)],
    // todo: add recommended, frequent, unanswered filters
    recommended: undefined,
    frequent: undefined,
    unanswered: undefined,
    "": undefined,
  };

  const questions = await db
    .select({
      ...getTableColumns(QuestionTable),
      user: getTableColumns(user),
      voteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${QuestionVoteTable} qvt
        JOIN ${QuestionTable} qt ON qt.id = qvt.question_id
        WHERE qt.id = ${QuestionTable.id}
          AND qvt.type = ${"up"}
      )`,
      answerCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${AnswerTable} ant
        JOIN ${QuestionTable} qt ON qt.id = ant.question_id
        WHERE qt.id = ${QuestionTable.id}
      )`,
      tags: sql<{ id: string; name: string }[]>`
        coalesce(
          jsonb_agg(
            jsonb_build_object(
            'id', ${TagTable.id},
            'name', ${TagTable.name}
            )
          ) FILTER (WHERE ${TagTable.id} IS NOT NULL),
          '[]'::jsonb
        )
      `.as("tags"),
    })
    .from(QuestionTable)
    .innerJoin(user, eq(user.id, QuestionTable.userId))
    .leftJoin(
      QuestionTagTable,
      eq(QuestionTagTable.questionId, QuestionTable.id),
    )
    .leftJoin(TagTable, eq(TagTable.id, QuestionTagTable.tagId))
    .where(
      and(
        filter !== "newest" ? filterMap[filter] : undefined,
        query.trim() ? ilike(QuestionTable.title, `%${query}%`) : undefined,
      ),
    )
    .groupBy(QuestionTable.id, user.id)
    .offset(offset)
    .orderBy(
      ...(filter === "newest"
        ? filterMap[filter]
        : [asc(QuestionTable.createdAt), asc(QuestionTable.id)]),
    )
    .limit(PAGE_SIZE);

  const [questionCount] = await db
    .select({
      count: count(),
    })
    .from(QuestionTable)
    .where(
      and(
        filter !== "newest" ? filterMap[filter] : undefined,
        query.trim() ? undefined : ilike(QuestionTable.title, `%${query}%`),
      ),
    );

  const hasPrevPage = page > 1;
  const hasNextPage = page * PAGE_SIZE < questionCount.count;
  const totalPages = Math.floor(questionCount.count / PAGE_SIZE);

  return {
    questions,
    metadata: {
      hasPrevPage,
      hasNextPage,
      totalPages,
    },
  };
};

export type GetQuestionsOutputType = GetActionOutput<typeof getQuestions>;

export const getTopQuestions = async () => {
  const questions = await db
    .select({
      id: QuestionTable.id,
      title: QuestionTable.title,
    })
    .from(QuestionTable)
    .orderBy(desc(QuestionTable.views), desc(QuestionTable.id))
    .limit(5);

  return questions;
};

export const getQuestion = async (questionId: string) => {
  const session = await checkUserAuthed();
  const [questionToReturn] = await db
    .select({
      ...getTableColumns(QuestionTable),
      user: getTableColumns(user),
      tags: sql<{ id: string; name: string }[]>`
        coalesce(
          jsonb_agg(
            jsonb_build_object(
            'id', ${TagTable.id},
            'name', ${TagTable.name}
            )
          ) FILTER (WHERE ${TagTable.id} IS NOT NULL),
          '[]'::jsonb
        )
      `.as("tags"),
      answerCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${AnswerTable} ant
        JOIN ${QuestionTable} qt ON qt.id = ant.question_id
        WHERE qt.id = ${QuestionTable.id}
      )`,
      upVoteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${QuestionVoteTable} qvt
        JOIN ${QuestionTable} qt ON qt.id = qvt.question_id
        WHERE qt.id = ${QuestionTable.id}
          AND qvt.type = ${"up"}
      )`,
      downVoteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${QuestionVoteTable} qvt
        JOIN ${QuestionTable} qt ON qt.id = qvt.question_id
        WHERE qt.id = ${QuestionTable.id}
          AND qvt.type = ${"down"}
      )`,
      viewerVote: sql<VoteType | null>`(
        SELECT qvt.type
        FROM ${QuestionVoteTable} qvt
        WHERE qvt.question_id = ${QuestionTable.id}
          AND qvt.user_id = ${session?.user.id}
        LIMIT 1
      )`.as("viewerVote"),
      viewerCollection: sql<string | null>`(
        SELECT ct.question_id
        FROM ${CollectionTable} ct
        WHERE ct.question_id = ${QuestionTable.id}
          AND ct.user_id = ${session?.user.id}
        LIMIT 1
      )`.as("viewerCollection"),
    })
    .from(QuestionTable)
    .innerJoin(user, eq(user.id, QuestionTable.userId))
    .leftJoin(
      QuestionTagTable,
      eq(QuestionTagTable.questionId, QuestionTable.id),
    )
    .leftJoin(TagTable, eq(TagTable.id, QuestionTagTable.tagId))
    .where(eq(QuestionTable.id, questionId))
    .groupBy(QuestionTable.id, user.id);

  return questionToReturn ?? null;
};

export type GetQuestionOutputType = GetActionOutput<typeof getQuestion>;

type GetQuestionsAnswersProps = {
  questionId: string;
  page: number;
  filter: (typeof QUESTION_ANSWERS_FILTERS)[number];
};

export const getQuestionAnswers = async ({
  questionId,
  page,
  filter,
}: GetQuestionsAnswersProps) => {
  const session = await checkUserAuthed();
  if (!session) return null;
  const [existingQuestion] = await db
    .select()
    .from(QuestionTable)
    .where(eq(QuestionTable.id, questionId));
  if (!existingQuestion) return null;

  const offset = (page - 1) * PAGE_SIZE;

  const upVoteCount = sql<number>`(
        SELECT COUNT(*)
        FROM ${AnswerTable} asnt
        JOIN ${AnswerVoteTable} avt ON avt.answer_id = asnt.id
        WHERE asnt.id = ${AnswerTable.id}
          AND avt.type = ${"up"}
      )`;

  const downVoteCount = sql<number>`(
        SELECT COUNT(*)
        FROM ${AnswerTable} asnt
        JOIN ${AnswerVoteTable} avt ON avt.answer_id = asnt.id
        WHERE asnt.id = ${AnswerTable.id}
          AND avt.type = ${"down"}
      )`;

  const filterMap: Record<(typeof QUESTION_ANSWERS_FILTERS)[number], any> = {
    "most-recent": [desc(AnswerTable.createdAt), desc(AnswerTable.id)],
    oldest: [asc(AnswerTable.createdAt), asc(AnswerTable.id)],
    "highest-upvotes": [desc(upVoteCount), desc(AnswerTable.id)],
    "lowest-upvotes": [asc(upVoteCount), asc(AnswerTable.id)],
  };

  const filterResult = filterMap[filter];

  const questionAnswers = await db
    .select({
      ...getTableColumns(AnswerTable),
      user: getTableColumns(user),
      upVoteCount: upVoteCount.as("upVoteCount"),
      downVoteCount: downVoteCount.as("downVoteCount"),
      viewerVote: sql<VoteType | null>`(
        SELECT avt.type
        FROM ${AnswerVoteTable} avt
        WHERE avt.answer_id = ${AnswerTable.id}
          AND avt.user_id = ${session.user.id}
        LIMIT 1
      )`.as("viewerVote"),
    })
    .from(AnswerTable)
    .innerJoin(user, eq(user.id, AnswerTable.userId))
    .where(eq(AnswerTable.questionId, questionId))
    .offset(offset)
    .orderBy(...filterResult)
    .limit(PAGE_SIZE);

  const [answerCount] = await db
    .select({
      count: count(),
    })
    .from(AnswerTable)
    .where(eq(AnswerTable.questionId, questionId));

  const hasPrevPage = page > 1;
  const hasNextPage = page * PAGE_SIZE < answerCount.count;
  const totalPages = Math.floor(answerCount.count / PAGE_SIZE);

  return {
    answers: questionAnswers,
    metadata: {
      hasPrevPage,
      hasNextPage,
      totalPages,
    },
  };
};

export type GetQuestionAnswersOutputType = GetActionOutput<
  typeof getQuestionAnswers
>;

export const incrementQuestionViewCount = async (questionId: string) => {
  await db
    .update(QuestionTable)
    .set({
      views: sql`${QuestionTable.views} + 1`,
    })
    .where(eq(QuestionTable.id, questionId));
};
