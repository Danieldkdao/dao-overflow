"use server";

import { db } from "@/db/db";
import {
  AnswerTable,
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
import { PAGE_SIZE, TAGS_FILTERS } from "../constants";
import { GetActionOutput } from "../types";

export const getPopularTags = async () => {
  const questionCount = sql<number>`(
      SELECT COUNT(*)
      FROM ${QuestionTagTable} qtt
      WHERE qtt.tag_id = ${TagTable.id}
    )`;
  const tags = await db
    .select({
      id: TagTable.id,
      name: TagTable.name,
      questionCount: questionCount.as("questionCount"),
    })
    .from(TagTable)
    .orderBy(desc(questionCount), desc(TagTable.id))
    .limit(6);

  return tags;
};

type GetTagsProps = {
  query: string;
  page: number;
  filter: (typeof TAGS_FILTERS)[number];
};

export const getTags = async (filters: GetTagsProps) => {
  const { query, page, filter } = filters;

  const offset = (page - 1) * PAGE_SIZE;

  const questionCount = sql<number>`(
      SELECT COUNT(*)
      FROM ${QuestionTagTable} qtt
      WHERE qtt.tag_id = ${TagTable.id}
    )`;

  const filterMap: Record<(typeof TAGS_FILTERS)[number], SQL<unknown>[]> = {
    recent: [desc(TagTable.createdAt), desc(TagTable.id)],
    oldest: [asc(TagTable.createdAt), asc(TagTable.id)],
    popular: [desc(questionCount), desc(TagTable.id)],
  };

  const tags = await db
    .select({
      id: TagTable.id,
      name: TagTable.name,
      questionCount: questionCount.as("questionCount"),
    })
    .from(TagTable)
    .where(query ? ilike(TagTable.name, `%${query}%`) : undefined)
    .orderBy(...filterMap[filter])
    .offset(offset)
    .limit(PAGE_SIZE);

  const [tagCount] = await db
    .select({
      count: count(),
    })
    .from(TagTable)
    .where(query ? ilike(TagTable.name, `%${query}%`) : undefined);

  const hasPrevPage = page > 1;
  const hasNextPage = page * PAGE_SIZE < tagCount.count;
  const totalPages = Math.floor(tagCount.count / PAGE_SIZE);

  return {
    tags,
    metadata: {
      hasPrevPage,
      hasNextPage,
      totalPages,
    },
  };
};

export type GetTagsOutputType = GetActionOutput<typeof getTags>;

type GetTagProps = {
  tagId: string;
  query: string;
  page: number;
};

export const getTagQuestions = async (props: GetTagProps) => {
  const { tagId, query, page } = props;

  const offset = (page - 1) * PAGE_SIZE;

  const [existingTag] = await db
    .select()
    .from(TagTable)
    .where(eq(TagTable.id, tagId));

  if (!existingTag) return null;

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
        query.trim() ? ilike(QuestionTable.title, `%${query}%`) : undefined,
        eq(QuestionTagTable.tagId, existingTag.id),
      ),
    )
    .groupBy(QuestionTable.id, user.id)
    .offset(offset)
    .orderBy(desc(QuestionTable.createdAt), desc(QuestionTable.id))
    .limit(PAGE_SIZE);

  const [questionCount] = await db
    .select({ count: count() })
    .from(QuestionTable)
    .leftJoin(
      QuestionTagTable,
      eq(QuestionTagTable.questionId, QuestionTable.id),
    )
    .leftJoin(TagTable, eq(TagTable.id, QuestionTagTable.tagId))
    .where(
      and(
        query.trim() ? ilike(QuestionTable.title, `%${query}%`) : undefined,
        eq(QuestionTagTable.tagId, existingTag.id),
      ),
    );

  const hasPrevPage = page > 1;
  const hasNextPage = page * PAGE_SIZE < questionCount.count;
  const totalPages = Math.floor(questionCount.count / PAGE_SIZE);

  return {
    questions,
    tag: existingTag,
    metadata: {
      hasPrevPage,
      hasNextPage,
      totalPages,
    },
  };
};

export type GetTagQuestionsOutputType = GetActionOutput<typeof getTagQuestions>;
