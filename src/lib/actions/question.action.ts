"use server";

import { db } from "@/db/db";
import { checkUserAuthed } from "./user.action";
import { QuestionTable, QuestionTagTable, TagTable } from "@/db/schema";

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
