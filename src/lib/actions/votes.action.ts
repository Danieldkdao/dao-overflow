"use server";

import { db } from "@/db/db";
import { auth } from "../auth/auth";
import { headers } from "next/headers";
import { UNAUTHED_MESSAGE } from "../constants";
import {
  AnswerTable,
  AnswerVoteTable,
  QuestionTable,
  QuestionVoteTable,
  VoteType,
  user,
} from "@/db/schema";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { checkUserAuthed } from "./auth.action";
import {
  revalidateAnswerVoteCache,
  revalidateQuestionVoteCache,
} from "../cache";

type VoteProps = {
  id: string;
  type: VoteType;
};

const getAuthorDelta = (type: VoteType) => (type === "up" ? 10 : -10);

const applyReputationDelta = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: string,
  amount: number,
) => {
  if (amount === 0) return;

  await tx
    .update(user)
    .set({
      reputation: sql<number>`${user.reputation} + ${amount}`,
    })
    .where(eq(user.id, userId));
};

export const handleQuestionVoteAction = async ({
  id: questionId,
  type,
}: VoteProps) => {
  try {
    const session = await checkUserAuthed();
    if (!session) return { error: true, message: UNAUTHED_MESSAGE };

    const [existingQuestion] = await db
      .select({ questionId: QuestionTable.id, userId: QuestionTable.userId })
      .from(QuestionTable)
      .where(eq(QuestionTable.id, questionId));

    if (!existingQuestion)
      return { error: true, message: "Question not found." };

    if (existingQuestion.userId === session.user.id) {
      return {
        error: true,
        message: "You cannot upvote/downvote your own question.",
      };
    }

    const [existingVote] = await db
      .select({
        ...getTableColumns(QuestionVoteTable),
      })
      .from(QuestionVoteTable)
      .where(
        and(
          eq(QuestionVoteTable.questionId, existingQuestion.questionId),
          eq(QuestionVoteTable.userId, session.user.id),
        ),
      );

    await db.transaction(async (tx) => {
      if (!existingVote) {
        await tx.insert(QuestionVoteTable).values({
          questionId,
          type,
          userId: session.user.id,
        });

        await Promise.all([
          applyReputationDelta(tx, session.user.id, 2),
          applyReputationDelta(
            tx,
            existingQuestion.userId,
            getAuthorDelta(type),
          ),
        ]);

        return;
      }

      if (existingVote.type === type) {
        await tx
          .delete(QuestionVoteTable)
          .where(eq(QuestionVoteTable.id, existingVote.id));

        await Promise.all([
          applyReputationDelta(tx, session.user.id, -2),
          applyReputationDelta(
            tx,
            existingQuestion.userId,
            -getAuthorDelta(type),
          ),
        ]);

        return;
      }

      await tx
        .update(QuestionVoteTable)
        .set({ type })
        .where(eq(QuestionVoteTable.id, existingVote.id));

      await applyReputationDelta(
        tx,
        existingQuestion.userId,
        getAuthorDelta(existingVote.type) * -1 + getAuthorDelta(type),
      );
    });

    revalidateQuestionVoteCache({
      questionId,
      voterId: session.user.id,
      authorId: existingQuestion.userId,
    });

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

    const [existingAnswer] = await db
      .select({
        answerId: AnswerTable.id,
        userId: AnswerTable.userId,
        questionId: AnswerTable.questionId,
      })
      .from(AnswerTable)
      .where(eq(AnswerTable.id, answerId));

    if (!existingAnswer) {
      return { error: true, message: "Answer not found." };
    }

    if (existingAnswer.userId === session.user.id) {
      return {
        error: true,
        message: "You cannot upvote/downvote your own answer.",
      };
    }

    const [existingVote] = await db
      .select()
      .from(AnswerVoteTable)
      .where(
        and(
          eq(AnswerVoteTable.answerId, existingAnswer.answerId),
          eq(AnswerVoteTable.userId, session.user.id),
        ),
      );

    await db.transaction(async (tx) => {
      if (!existingVote) {
        await tx.insert(AnswerVoteTable).values({
          answerId,
          type,
          userId: session.user.id,
        });

        await Promise.all([
          applyReputationDelta(tx, session.user.id, 2),
          applyReputationDelta(tx, existingAnswer.userId, getAuthorDelta(type)),
        ]);

        return;
      }

      if (existingVote.type === type) {
        await tx
          .delete(AnswerVoteTable)
          .where(eq(AnswerVoteTable.id, existingVote.id));

        await Promise.all([
          applyReputationDelta(tx, session.user.id, -2),
          applyReputationDelta(
            tx,
            existingAnswer.userId,
            -getAuthorDelta(type),
          ),
        ]);

        return;
      }

      await tx
        .update(AnswerVoteTable)
        .set({ type })
        .where(eq(AnswerVoteTable.id, existingVote.id));

      await applyReputationDelta(
        tx,
        existingAnswer.userId,
        getAuthorDelta(existingVote.type) * -1 + getAuthorDelta(type),
      );
    });

    revalidateAnswerVoteCache({
      answerId,
      questionId: existingAnswer.questionId,
      voterId: session.user.id,
      authorId: existingAnswer.userId,
    });

    return { error: false, message: `Answer ${type} voted successfully!` };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: `Something went wrong. Failed to ${type} vote the answer.`,
    };
  }
};
