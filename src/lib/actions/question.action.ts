"use server";

import { db } from "@/db/db";
import { checkUserAuthed } from "./user.action";
import {
  AnswerTable,
  QuestionTable,
  QuestionTagTable,
  QuestionVoteTable,
  TagTable,
  user,
} from "@/db/schema";
import { homeFilters, PAGE_SIZE } from "../constants";
import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import { getTableColumns } from "drizzle-orm";
import { GetActionOutput } from "../types";

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

    const insertedTags = await db
      .insert(TagTable)
      .values(
        tags.map((tag) => ({
          name: tag,
        })),
      )
      .onConflictDoNothing()
      .returning();

    await db.insert(QuestionTagTable).values(
      insertedTags.map((tag) => ({
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

type GetQuestionsProps = {
  query: string;
  page: number;
  filter: (typeof homeFilters)[number];
};

export const getQuestions = async (filters: GetQuestionsProps) => {
  const { query, page, filter } = filters;

  if (page < 1) return null;
  const offset = (page - 1) * PAGE_SIZE;

  const filterMap = {
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
