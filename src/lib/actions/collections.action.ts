"use server";

import { db } from "@/db/db";
import { UNAUTHED_MESSAGE } from "../constants";
import { checkUserAuthed } from "./user.action";
import { CollectionTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const updateCollectionAction = async (questionId: string) => {
  try {
    const session = await checkUserAuthed();
    if (!session) return { error: true, message: UNAUTHED_MESSAGE };

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

    return { error: false, message: "Collection updated successfully!" };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Something went wrong. Failed to update collection.",
    };
  }
};
