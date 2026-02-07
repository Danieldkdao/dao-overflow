import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";
import { voteTypeEnum } from "./question-vote";
import { AnswerTable } from "./answers";

export const AnswerVoteTable = pgTable("answer-votes", {
  id: uuid().primaryKey().defaultRandom(),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  answerId: uuid("answer_id")
    .references(() => AnswerTable.id, { onDelete: "cascade" })
    .notNull(),
  type: voteTypeEnum("type").notNull(),
});

export const answerVoteRelations = relations(AnswerVoteTable, ({ one }) => ({
  user: one(user, {
    fields: [AnswerVoteTable.userId],
    references: [user.id],
  }),
  question: one(AnswerTable, {
    fields: [AnswerVoteTable.answerId],
    references: [AnswerTable.id],
  }),
}));
