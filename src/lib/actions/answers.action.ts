"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { UNAUTHED_MESSAGE } from "../constants";
import { db } from "@/db/db";
import { AnswerTable, QuestionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateText } from "ai";
import { cohere } from "@/services/ai/models";
import {
  AI_GENERATE_ANSWER_SYSTEM_PROMPT,
  buildGenerateAnswerPrompt,
} from "../prompts";

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

    await db.insert(AnswerTable).values({
      answerText,
      questionId,
      userId: session.user.id,
    });

    return { error: false, message: "Answer posted successfully!" };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Something went wrong. Please try again later.",
    };
  }
};

export const generateAIAnswer = async (questionId: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { error: true, message: UNAUTHED_MESSAGE };

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
