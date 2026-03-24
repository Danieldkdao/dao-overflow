"use server";

import { db } from "@/db/db";
import { QuestionTagTable, TagTable } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

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
