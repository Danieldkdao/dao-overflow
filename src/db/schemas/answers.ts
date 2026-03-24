import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { QuestionTable } from "./question";
import { AnswerVoteTable } from "./answer-vote";

export const AnswerTable = pgTable("answers", {
  id: uuid().primaryKey().defaultRandom(),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  questionId: uuid("question_id")
    .references(() => QuestionTable.id, { onDelete: "cascade" })
    .notNull(),
  answerText: varchar("answer_text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const answerRelations = relations(AnswerTable, ({ one, many }) => ({
  user: one(user, {
    fields: [AnswerTable.userId],
    references: [user.id],
  }),
  question: one(QuestionTable, {
    fields: [AnswerTable.questionId],
    references: [QuestionTable.id],
  }),
  votes: many(AnswerVoteTable),
}));
