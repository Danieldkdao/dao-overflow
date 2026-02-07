import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { QuestionTable } from "./question";
import { relations } from "drizzle-orm";
import { user } from "./user";

export const voteTypes = ["up", "down"] as const;
export type VoteType = (typeof voteTypes)[number];
export const voteTypeEnum = pgEnum("vote_type", voteTypes);

export const QuestionVoteTable = pgTable("question-votes", {
  id: uuid().notNull().defaultRandom(),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  questionId: uuid("question_id")
    .references(() => QuestionTable.id, { onDelete: "cascade" })
    .notNull(),
  type: voteTypeEnum("type").notNull(),
});

export const questionVoteRelations = relations(
  QuestionVoteTable,
  ({ one }) => ({
    user: one(user, {
      fields: [QuestionVoteTable.userId],
      references: [user.id],
    }),
    question: one(QuestionTable, {
      fields: [QuestionVoteTable.questionId],
      references: [QuestionTable.id],
    }),
  }),
);
