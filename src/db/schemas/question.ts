import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { TagTable } from "./tag";
import { QuestionVoteTable } from "./question-vote";
import { AnswerTable } from "./answers";

export const QuestionTable = pgTable("questions", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  question: varchar("question").notNull(),
  views: integer("views").notNull().default(0),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const questionRelations = relations(QuestionTable, ({ one, many }) => ({
  tags: many(TagTable),
  votes: many(QuestionVoteTable),
  user: one(user, {
    fields: [QuestionTable.userId],
    references: [user.id],
  }),
  answers: many(AnswerTable),
}));
