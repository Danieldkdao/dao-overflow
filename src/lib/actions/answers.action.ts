"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { UNAUTHED_MESSAGE } from "../constants";
import { db } from "@/db/db";
import {
  AnswerTable,
  QuestionTable,
  QuestionTagTable,
  TagTable,
} from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { generateText } from "ai";
import { cohere } from "@/services/ai/models";
import {
  AI_GENERATE_ANSWER_SYSTEM_PROMPT,
  buildGenerateAnswerPrompt,
} from "../prompts";
import { checkUserAuthed, updateUserReputation } from "./user.action";
import { createInteraction } from "./interactions.action";
import { envServer } from "@/data/env/server";

type PostAnswerProps = {
  questionId: string;
  answerText: string;
};

export const postAnswer = async ({
  questionId,
  answerText,
}: PostAnswerProps) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { error: true, message: UNAUTHED_MESSAGE };

    const [existingQuestion] = await db
      .select({
        id: QuestionTable.id,
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
      return { error: true, message: "Question not found." };
    }

    await db.insert(AnswerTable).values({
      answerText,
      questionId: existingQuestion.id,
      userId: session.user.id,
    });

    await createInteraction({
      action: "answer",
      tags: existingQuestion.tags.map((tag) => tag.id),
      questionId: existingQuestion.id,
    });

    await updateUserReputation(10, session.user.id);

    return { error: false, message: "Answer posted successfully!" };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Something went wrong. Please try again later.",
    };
  }
};

export const deleteAnswer = async (answerId: string) => {
  const session = await checkUserAuthed();
  if (!session) return { error: true, message: UNAUTHED_MESSAGE };

  try {
    const [deletedAnswer] = await db
      .delete(AnswerTable)
      .where(
        and(
          eq(AnswerTable.id, answerId),
          eq(AnswerTable.userId, session.user.id),
        ),
      )
      .returning();
    if (!deletedAnswer) {
      throw new Error("Failed to delete answer.");
    }
    return { error: false, message: "Answer deleted successfully!" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to delete answer." };
  }
};

export const generateAIAnswer = async (questionId: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { error: true, message: UNAUTHED_MESSAGE };

    if (
      process.env.NODE_ENV === "production" &&
      session.user.id !== envServer.ALLOWED_USER
    ) {
      return { error: true, message: "You are not allowed to do this." };
    }

    const [existingQuestion] = await db
      .select()
      .from(QuestionTable)
      .where(eq(QuestionTable.id, questionId));
    if (!existingQuestion)
      return { error: true, message: "Question not found." };

    const { text } = await generateText({
      model: cohere("command-r-08-2024"),
      system: AI_GENERATE_ANSWER_SYSTEM_PROMPT,
      prompt: buildGenerateAnswerPrompt(existingQuestion.question),
    });

    return { error: false, message: text };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Something went wrong. Failed to generate AI answer.",
    };
  }
};
