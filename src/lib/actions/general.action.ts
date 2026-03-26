"use server";

import { AnswerTable, QuestionTable, TagTable, user } from "@/db/schema";
import { GlobalSearchType } from "../types";
import { db } from "@/db/db";
import { ilike, sql } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { cacheTag } from "next/cache";
import { getGlobalSearchTag } from "../cache";

type GetGlobalSearchResults = {
  q: string;
  type: GlobalSearchType | null;
};

type GlobalSearchTypeQueryMap = {
  type: GlobalSearchType;
  id: string;
  table: PgTableWithColumns<any>;
  query: string;
};

export type GlobalSearchResultsType = {
  id: string;
  text: string;
  type: GlobalSearchType;
};

export const getGlobalSearchResults = async ({
  q,
  type,
}: GetGlobalSearchResults) => {
  "use cache";

  cacheTag(getGlobalSearchTag());

  const globalSearchTypesQueryMap: GlobalSearchTypeQueryMap[] = [
    { type: "question", table: QuestionTable, query: "title", id: "id" },
    {
      type: "answer",
      table: AnswerTable,
      query: "answerText",
      id: "questionId",
    },
    { type: "user", table: user, query: "name", id: "id" },
    { type: "tag", table: TagTable, query: "name", id: "id" },
  ];

  let finalResults: GlobalSearchResultsType[] = [];

  if (type) {
    const typeQuery = globalSearchTypesQueryMap.find(
      (elem) => elem.type === type,
    );
    if (!typeQuery) return [];

    const { table, query, id } = typeQuery;

    const results = await db
      .select({
        id: table[id],
        text: table[query as string],
        type: sql<GlobalSearchType>`${type}`,
      })
      .from(table)
      .where(ilike(table[query as string], `%${q}%`));

    finalResults = results;
  } else {
    for (const { query, table, type, id } of globalSearchTypesQueryMap) {
      const results = await db
        .select({
          id: table[id],
          text: table[query as string],
          type: sql<GlobalSearchType>`${type}`,
        })
        .from(table)
        .where(ilike(table[query as string], `%${q}%`))
        .limit(2);

      finalResults = [...finalResults, ...results];
    }
  }

  return finalResults;
};
