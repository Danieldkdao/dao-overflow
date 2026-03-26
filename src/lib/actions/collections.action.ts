"use server";

import { db } from "@/db/db";
import { PAGE_SIZE, QUESTIONS_FILTERS, UNAUTHED_MESSAGE } from "../constants";
import { checkUserAuthed } from "./auth.action";
import {
  AnswerTable,
  CollectionTable,
  QuestionTable,
  QuestionTagTable,
  QuestionVoteTable,
  TagTable,
  user,
} from "@/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  SQL,
  sql,
} from "drizzle-orm";
import { auth } from "../auth/auth";
import { GetActionOutput } from "../types";
import { headers } from "next/headers";
import { cacheTag } from "next/cache";
import { getCollectionUserTag, revalidateCollectionCache } from "../cache";

export const updateCollectionAction = async (questionId: string) => {
  try {
    const session = await checkUserAuthed();
    if (!session) return { error: true, message: UNAUTHED_MESSAGE };

    const [existingQuestion] = await db
      .select({ questionId: QuestionTable.id, userId: QuestionTable.userId })
      .from(QuestionTable)
      .where(eq(QuestionTable.id, questionId));

    if (!existingQuestion) {
      return { error: true, message: "Question not found." };
    }

    if (existingQuestion.userId === session.user.id) {
      return {
        error: true,
        message: "You cannot add your own question to your collection.",
      };
    }

    const [existingQuestionInCollection] = await db
      .select()
      .from(CollectionTable)
      .where(
        and(
          eq(CollectionTable.questionId, questionId),
          eq(CollectionTable.userId, session.user.id),
        ),
      );

    if (existingQuestionInCollection) {
      await db
        .delete(CollectionTable)
        .where(
          and(
            eq(CollectionTable.questionId, questionId),
            eq(CollectionTable.userId, session.user.id),
          ),
        );
    } else {
      await db.insert(CollectionTable).values({
        questionId,
        userId: session.user.id,
      });
    }

    revalidateCollectionCache({
      userId: session.user.id,
      questionId,
    });

    return { error: false, message: "Collection updated successfully!" };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Something went wrong. Failed to update collection.",
    };
  }
};

type GetCollectionActionProps = {
  query: string;
  page: number;
  filter: (typeof QUESTIONS_FILTERS)[number];
};

export const getCollectionAction = async (
  filters: GetCollectionActionProps,
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  console.log("Ran");
  return getCollectionDataCached(session.user.id, filters);
};

const getCollectionDataCached = async (
  userId: string,
  filters: GetCollectionActionProps,
) => {
  "use cache";

  const { query, page, filter } = filters;
  if (page < 1) return null;

  cacheTag(getCollectionUserTag(userId));

  const offset = (page - 1) * PAGE_SIZE;
  const voteCount = sql<number>`(
        SELECT COUNT(*)
        FROM ${QuestionVoteTable} qvt
        JOIN ${QuestionTable} qt ON qt.id = qvt.question_id
        WHERE qt.id = ${QuestionTable.id}
          AND qvt.type = ${"up"}
      )`;

  const answerCount = sql<number>`(
        SELECT COUNT(*)
        FROM ${AnswerTable} ant
        JOIN ${QuestionTable} qt ON qt.id = ant.question_id
        WHERE qt.id = ${QuestionTable.id}
      )`;

  const filterMap: Record<(typeof QUESTIONS_FILTERS)[number], SQL<unknown>[]> =
    {
      "most-recent": [desc(QuestionTable.createdAt), desc(QuestionTable.id)],
      oldest: [asc(QuestionTable.createdAt), asc(QuestionTable.id)],
      "most-answered": [desc(answerCount), desc(QuestionTable.id)],
      "most-viewed": [desc(QuestionTable.views), desc(QuestionTable.id)],
      "most-voted": [desc(voteCount), desc(QuestionTable.id)],
    };

  const savedQuestions = await db
    .select({
      ...getTableColumns(QuestionTable),
      user: getTableColumns(user),
      voteCount: voteCount.as("voteCount"),
      answerCount: answerCount.as("answerCount"),
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
    .innerJoin(
      CollectionTable,
      eq(CollectionTable.questionId, QuestionTable.id),
    )
    .innerJoin(user, eq(user.id, QuestionTable.userId))
    .leftJoin(
      QuestionTagTable,
      eq(QuestionTagTable.questionId, QuestionTable.id),
    )
    .leftJoin(TagTable, eq(TagTable.id, QuestionTagTable.tagId))
    .where(
      and(
        eq(CollectionTable.userId, userId),
        query ? ilike(QuestionTable.title, `%${query}%`) : undefined,
      ),
    )
    .groupBy(QuestionTable.id, user.id)
    .orderBy(...filterMap[filter])
    .offset(offset)
    .limit(PAGE_SIZE);

  const [questionCount] = await db
    .select({
      count: count(),
    })
    .from(QuestionTable)
    .innerJoin(
      CollectionTable,
      eq(CollectionTable.questionId, QuestionTable.id),
    )
    .where(
      and(
        eq(CollectionTable.userId, userId),
        query ? ilike(QuestionTable.title, `%${query}%`) : undefined,
      ),
    );

  const hasPrevPage = page > 1;
  const hasNextPage = page * PAGE_SIZE < questionCount.count;
  const totalPages = Math.floor(questionCount.count / PAGE_SIZE);

  return {
    questions: savedQuestions,
    metadata: {
      hasPrevPage,
      hasNextPage,
      totalPages,
    },
  };
};

export type GetCollectionActionOutputType = GetActionOutput<
  typeof getCollectionAction
>;
