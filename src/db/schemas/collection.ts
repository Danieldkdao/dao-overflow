import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { QuestionTable } from "./question";
import { relations } from "drizzle-orm";

export const CollectionTable = pgTable("collections", {
  id: uuid().notNull().defaultRandom(),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  questionId: uuid("question_id")
    .references(() => QuestionTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const collectionRelations = relations(CollectionTable, ({ one }) => ({
  user: one(user, {
    fields: [CollectionTable.userId],
    references: [user.id],
  }),
  question: one(QuestionTable, {
    fields: [CollectionTable.questionId],
    references: [QuestionTable.id],
  }),
}));
