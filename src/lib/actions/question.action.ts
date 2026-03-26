"use server";

import { db } from "@/db/db";
import { updateUserReputation } from "./user.action";
import { checkUserAuthed } from "./auth.action";
import {
  AnswerTable,
  AnswerVoteTable,
  CollectionTable,
  InteractionTable,
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
import {
  and,
  arrayOverlaps,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  not,
  notExists,
  SQL,
  sql,
} from "drizzle-orm";
import { getTableColumns } from "drizzle-orm";
import { GetActionOutput } from "../types";
import { isEqual } from "lodash";
import { redirect } from "next/navigation";
import { createInteraction } from "./interactions.action";
import {
  getQuestionAnswersTag,
  getQuestionGlobalTag,
  getQuestionIdTag,
  getQuestionUserTag,
  getRecommendedQuestionsTag,
  revalidateQuestionCache,
  revalidateSearchCache,
  revalidateTagCache,
} from "../cache";
import { cacheTag } from "next/cache";

type PostQuestionProps = {
  title: string;
  question: string;
  tags: string[];
};

type GetQuestionsProps = {
  query: string;
  page: number;
  filter: (typeof HOME_FILTERS)[number];
};

type GetQuestionsAnswersProps = {
  questionId: string;
  page: number;
  filter: (typeof QUESTION_ANSWERS_FILTERS)[number];
};

const getEditQuestionCached = async (questionId: string, userId: string) => {
  "use cache";

  cacheTag(getQuestionIdTag(questionId));
  cacheTag(getQuestionUserTag(userId));

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
        eq(QuestionTable.userId, userId),
      ),
    );

  return existingQuestion;
};

const getQuestionsData = async ({
  query,
  page,
  filter,
  userId,
  interactedTags = [],
}: GetQuestionsProps & { userId?: string; interactedTags?: string[] }) => {
  if (page < 1) return null;
  const offset = (page - 1) * PAGE_SIZE;

  const filterMap: Record<(typeof HOME_FILTERS)[number], SQL<unknown>[] | undefined> = {
    newest: [desc(QuestionTable.createdAt), desc(QuestionTable.id)],
    recommended: undefined,
    frequent: [desc(QuestionTable.views), desc(QuestionTable.id)],
    unanswered: undefined,
    "": undefined,
  };

  const questionTagIds = sql<string[]>`ARRAY(
    SELECT ${QuestionTagTable.tagId}
    FROM ${QuestionTagTable}
    WHERE ${QuestionTagTable.questionId} = ${QuestionTable.id}
  )`;

  const recommendedCondition =
    filter === "recommended"
      ? [
          userId ? not(eq(QuestionTable.userId, userId)) : undefined,
          interactedTags.length > 0
            ? arrayOverlaps(
                questionTagIds,
                sql`ARRAY[${sql.join(
                  interactedTags.map((tagId) => sql`${tagId}::uuid`),
                  sql`, `,
                )}]::uuid[]`,
              )
            : sql`false`,
        ]
      : [];

  const orderByClause =
    filter === "newest" || filter === "frequent"
      ? (filterMap[filter] ?? [asc(QuestionTable.createdAt), asc(QuestionTable.id)])
      : [asc(QuestionTable.createdAt), asc(QuestionTable.id)];

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
        filter === "unanswered"
          ? notExists(
              db
                .select({ id: AnswerTable.id })
                .from(AnswerTable)
                .where(eq(AnswerTable.questionId, QuestionTable.id)),
            )
          : undefined,
        ...recommendedCondition,
        query.trim() ? ilike(QuestionTable.title, `%${query}%`) : undefined,
      ),
    )
    .groupBy(QuestionTable.id, user.id)
    .offset(offset)
    .orderBy(...orderByClause)
    .limit(PAGE_SIZE);

  const [questionCount] = await db
    .select({
      count: count(),
    })
    .from(QuestionTable)
    .where(
      and(
        filter === "unanswered"
          ? notExists(
              db
                .select({ id: AnswerTable.id })
                .from(AnswerTable)
                .where(eq(AnswerTable.questionId, QuestionTable.id)),
            )
          : undefined,
        ...recommendedCondition,
        query.trim() ? ilike(QuestionTable.title, `%${query}%`) : undefined,
      ),
    );

  return {
    questions,
    metadata: {
      hasPrevPage: page > 1,
      hasNextPage: page * PAGE_SIZE < questionCount.count,
      totalPages: Math.floor(questionCount.count / PAGE_SIZE),
    },
  };
};

const getQuestionsCached = async (filters: GetQuestionsProps) => {
  "use cache";

  cacheTag(getQuestionGlobalTag());

  return getQuestionsData(filters);
};

const getRecommendedQuestionsCached = async (
  filters: GetQuestionsProps,
  userId: string,
  interactedTags: string[],
) => {
  "use cache";

  cacheTag(getQuestionGlobalTag());
  cacheTag(getRecommendedQuestionsTag(userId));
  cacheTag(getQuestionUserTag(userId));

  return getQuestionsData({
    ...filters,
    userId,
    interactedTags,
  });
};

const getQuestionCached = async (questionId: string) => {
  "use cache";

  cacheTag(getQuestionGlobalTag());
  cacheTag(getQuestionIdTag(questionId));
  cacheTag(getQuestionAnswersTag(questionId));

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

const getQuestionAnswersCached = async ({
  questionId,
  page,
  filter,
}: GetQuestionsAnswersProps) => {
  "use cache";

  cacheTag(getQuestionIdTag(questionId));
  cacheTag(getQuestionAnswersTag(questionId));

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

  const filterMap: Record<
    (typeof QUESTION_ANSWERS_FILTERS)[number],
    SQL<unknown>[]
  > = {
    "most-recent": [desc(AnswerTable.createdAt), desc(AnswerTable.id)],
    oldest: [asc(AnswerTable.createdAt), asc(AnswerTable.id)],
    "highest-upvotes": [desc(upVoteCount), desc(AnswerTable.id)],
    "lowest-upvotes": [asc(upVoteCount), asc(AnswerTable.id)],
  };

  const answers = await db
    .select({
      ...getTableColumns(AnswerTable),
      user: getTableColumns(user),
      upVoteCount: upVoteCount.as("upVoteCount"),
      downVoteCount: downVoteCount.as("downVoteCount"),
    })
    .from(AnswerTable)
    .innerJoin(user, eq(user.id, AnswerTable.userId))
    .where(eq(AnswerTable.questionId, questionId))
    .offset(offset)
    .orderBy(...filterMap[filter])
    .limit(PAGE_SIZE);

  const [answerCount] = await db
    .select({
      count: count(),
    })
    .from(AnswerTable)
    .where(eq(AnswerTable.questionId, questionId));

  return {
    answers,
    metadata: {
      hasPrevPage: page > 1,
      hasNextPage: page * PAGE_SIZE < answerCount.count,
      totalPages: Math.floor(answerCount.count / PAGE_SIZE),
    },
  };
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

    await createInteraction({
      action: "ask-question",
      tags: tagIds.map((tag) => tag.id),
      questionId: postedQuestion.id,
    });

    await updateUserReputation(5, session.user.id);

    revalidateQuestionCache({
      id: postedQuestion.id,
      userId: session.user.id,
      tagIds: tagIds.map((tag) => tag.id),
    });
    for (const tagId of tagIds.map((tag) => tag.id)) {
      revalidateTagCache({ tagId });
    }
    revalidateSearchCache();

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
      tags: sql<{ id: string; name: string }[]>`(
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', tags.tag_id,
              'name', tags.tag_name
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT tt.id AS tag_id, tt.name AS tag_name
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

  let tagIds = existingQuestion.tags.map((tag) => ({ id: tag.id }));

  const existingTagNames = existingQuestion.tags.map((tag) => tag.name).sort();
  if (!isEqual(existingTagNames, [...normalizedTags].sort())) {
    await db
      .insert(TagTable)
      .values(normalizedTags.map((tag) => ({ name: tag })))
      .onConflictDoNothing()
      .returning();

    tagIds = await db
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

  revalidateQuestionCache({
    id: existingQuestion.id,
    userId: session.user.id,
    tagIds: tagIds.map((tag) => tag.id),
  });
  for (const tagId of tagIds.map((tag) => tag.id)) {
    revalidateTagCache({ tagId });
  }
  revalidateSearchCache();

  return { error: false, message: "Question updated successfully!" };
};

export const getEditQuestion = async (questionId: string) => {
  const session = await checkUserAuthed();
  if (!session) return redirect("/sign-in");

  return getEditQuestionCached(questionId, session.user.id);
};

export const deleteQuestion = async (questionId: string) => {
  const session = await checkUserAuthed();
  if (!session) return { error: true, message: UNAUTHED_MESSAGE };

  const [existingQuestion] = await db
    .select({
      id: QuestionTable.id,
      userId: QuestionTable.userId,
      tags: sql<{ id: string }[]>`(
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', tags.tag_id
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT tt.id AS tag_id
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

    revalidateQuestionCache({
      id: existingQuestion.id,
      userId: existingQuestion.userId,
      tagIds: existingQuestion.tags.map((tag) => tag.id),
    });
    for (const tagId of existingQuestion.tags.map((tag) => tag.id)) {
      revalidateTagCache({ tagId });
    }
    revalidateSearchCache();

    return { error: false, message: "Question deleted successfully!" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to delete question." };
  }
};

export const getQuestions = async (filters: GetQuestionsProps) => {
  const { filter } = filters;
  const session = await checkUserAuthed();

  if (filter === "recommended") {
    let interactedTags: string[] = [];

    if (session?.user.id) {
      const userInteractions = await db
        .select()
        .from(InteractionTable)
        .where(eq(InteractionTable.userId, session.user.id));
      interactedTags = [...new Set(userInteractions.flatMap((ui) => ui.tags))];
    }

    return getRecommendedQuestionsCached(
      filters,
      session?.user.id ?? "",
      interactedTags,
    );
  }

  return getQuestionsCached(filters);
};

export type GetQuestionsOutputType = GetActionOutput<typeof getQuestions>;

export const getTopQuestions = async () => {
  "use cache";

  cacheTag(getQuestionGlobalTag());

  return db
    .select({
      id: QuestionTable.id,
      title: QuestionTable.title,
    })
    .from(QuestionTable)
    .orderBy(desc(QuestionTable.views), desc(QuestionTable.id))
    .limit(5);
};

export const getQuestion = async (questionId: string) => {
  const session = await checkUserAuthed();
  const questionToReturn = await getQuestionCached(questionId);
  if (!questionToReturn) return null;

  if (!session) {
    return {
      ...questionToReturn,
      viewerVote: null,
      viewerCollection: null,
    };
  }

  const [viewerState] = await db
    .select({
      viewerVote: sql<VoteType | null>`(
        SELECT qvt.type
        FROM ${QuestionVoteTable} qvt
        WHERE qvt.question_id = ${questionId}
          AND qvt.user_id = ${session.user.id}
        LIMIT 1
      )`.as("viewerVote"),
      viewerCollection: sql<string | null>`(
        SELECT ct.question_id
        FROM ${CollectionTable} ct
        WHERE ct.question_id = ${questionId}
          AND ct.user_id = ${session.user.id}
        LIMIT 1
      )`.as("viewerCollection"),
    })
    .from(QuestionTable)
    .where(eq(QuestionTable.id, questionId));

  return {
    ...questionToReturn,
    viewerVote: viewerState?.viewerVote ?? null,
    viewerCollection: viewerState?.viewerCollection ?? null,
  };
};

export type GetQuestionOutputType = GetActionOutput<typeof getQuestion>;

export const getQuestionAnswers = async ({
  questionId,
  page,
  filter,
}: GetQuestionsAnswersProps) => {
  const session = await checkUserAuthed();
  const questionAnswers = await getQuestionAnswersCached({
    questionId,
    page,
    filter,
  });

  if (!questionAnswers) return null;

  if (!session) {
    return {
      ...questionAnswers,
      answers: questionAnswers.answers.map((answer) => ({
        ...answer,
        viewerVote: null,
      })),
    };
  }

  const answerIds = questionAnswers.answers.map((answer) => answer.id);
  const viewerVotes =
    answerIds.length > 0
      ? await db
          .select({
            answerId: AnswerVoteTable.answerId,
            type: AnswerVoteTable.type,
          })
          .from(AnswerVoteTable)
          .where(
            and(
              eq(AnswerVoteTable.userId, session.user.id),
              inArray(AnswerVoteTable.answerId, answerIds),
            ),
          )
      : [];

  const viewerVoteMap = new Map(
    viewerVotes.map((vote) => [vote.answerId, vote.type]),
  );

  return {
    ...questionAnswers,
    answers: questionAnswers.answers.map((answer) => ({
      ...answer,
      viewerVote: viewerVoteMap.get(answer.id) ?? null,
    })),
  };
};

export type GetQuestionAnswersOutputType = GetActionOutput<
  typeof getQuestionAnswers
>;

export const incrementQuestionViewCount = async (questionId: string) => {
  const session = await checkUserAuthed();

  const [existingQuestion] = await db
    .select({
      id: QuestionTable.id,
      userId: QuestionTable.userId,
      tags: sql<{ id: string }[]>`(
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', tags.tag_id
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT tt.id AS tag_id
          FROM ${TagTable} tt
          INNER JOIN ${QuestionTagTable} qtt ON qtt.tag_id = tt.id
          WHERE qtt.question_id = ${QuestionTable.id}
        ) AS tags
      )`,
    })
    .from(QuestionTable)
    .where(eq(QuestionTable.id, questionId));

  if (!existingQuestion) {
    return;
  }

  await db
    .update(QuestionTable)
    .set({
      views: sql`${QuestionTable.views} + 1`,
    })
    .where(eq(QuestionTable.id, existingQuestion.id));

  revalidateQuestionCache({
    id: existingQuestion.id,
    userId: existingQuestion.userId,
    tagIds: existingQuestion.tags.map((tag) => tag.id),
  });

  const [existingInteraction] = await db
    .select()
    .from(InteractionTable)
    .where(
      and(
        eq(InteractionTable.action, "view"),
        eq(InteractionTable.questionId, existingQuestion.id),
        eq(InteractionTable.userId, session?.user.id ?? ""),
      ),
    );

  if (!existingInteraction) {
    await createInteraction({
      action: "view",
      tags: existingQuestion.tags.map((tag) => tag.id),
      questionId: existingQuestion.id,
    });
  }
};
