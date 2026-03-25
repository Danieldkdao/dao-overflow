"use server";

import { db } from "@/db/db";
import { QuestionTagTable, TagTable } from "@/db/schema";
import { asc, count, desc, ilike, SQL, sql } from "drizzle-orm";
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
