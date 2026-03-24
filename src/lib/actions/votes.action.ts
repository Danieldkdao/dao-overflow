"use server";

import { db } from "@/db/db";
import { auth } from "../auth/auth";
import { headers } from "next/headers";
import { UNAUTHED_MESSAGE } from "../constants";
import { AnswerVoteTable, QuestionVoteTable, VoteType } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type VoteProps = {
  id: string;
  type: VoteType;
};

export const handleQuestionVoteAction = async ({
  id: questionId,
  type,
}: VoteProps) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    // todo: use checkAuthedUser instead of repeating code
    if (!session) return { error: true, message: UNAUTHED_MESSAGE };

    const [existingVote] = await db
      .select()
      .from(QuestionVoteTable)
      .where(
        and(
          eq(QuestionVoteTable.questionId, questionId),
          eq(QuestionVoteTable.userId, session.user.id),
          eq(QuestionVoteTable.type, type),
        ),
      );
    if (!existingVote) {
      await db
        .delete(QuestionVoteTable)
        .where(
          and(
            eq(QuestionVoteTable.questionId, questionId),
            eq(QuestionVoteTable.userId, session.user.id),
          ),
        );
      await db.insert(QuestionVoteTable).values({
        questionId,
        type,
        userId: session.user.id,
      });
    } else {
      await db
        .delete(QuestionVoteTable)
        .where(
          and(
            eq(QuestionVoteTable.id, existingVote.id),
            eq(QuestionVoteTable.questionId, questionId),
            eq(QuestionVoteTable.userId, session.user.id),
            eq(QuestionVoteTable.type, type),
          ),
        );
    }
    return { error: false, message: `Question ${type} voted successfully!` };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: `Something went wrong. Failed to ${type} vote the question.`,
    };
  }
};

export const handleAnswerVoteAction = async ({
  id: answerId,
  type,
}: VoteProps) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { error: true, message: UNAUTHED_MESSAGE };

    const [existingVote] = await db
      .select()
      .from(AnswerVoteTable)
      .where(
        and(
          eq(AnswerVoteTable.answerId, answerId),
          eq(AnswerVoteTable.userId, session.user.id),
          eq(AnswerVoteTable.type, type),
        ),
      );
    if (!existingVote) {
      await db
        .delete(AnswerVoteTable)
        .where(
          and(
            eq(AnswerVoteTable.answerId, answerId),
            eq(AnswerVoteTable.userId, session.user.id),
          ),
        );
      await db.insert(AnswerVoteTable).values({
        answerId,
        type,
        userId: session.user.id,
      });
    } else {
      await db
        .delete(AnswerVoteTable)
        .where(
          and(
            eq(AnswerVoteTable.id, existingVote.id),
            eq(AnswerVoteTable.answerId, answerId),
            eq(AnswerVoteTable.userId, session.user.id),
            eq(AnswerVoteTable.type, type),
          ),
        );
    }
    return { error: false, message: `Answer ${type} voted successfully!` };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: `Something went wrong. Failed to ${type} vote the answer.`,
    };
  }
};
