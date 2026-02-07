import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { QuestionTable } from "./question";
import { TagTable } from "./tag";

export const QuestionTagTable = pgTable(
  "question-tags",
  {
    questionId: uuid("question_id")
      .references(() => QuestionTable.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => TagTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.questionId, t.tagId] })],
);

export const questionTagTableRelations = relations(
  QuestionTagTable,
  ({ one }) => ({
    question: one(QuestionTable, {
      fields: [QuestionTagTable.questionId],
      references: [QuestionTable.id],
    }),
    tag: one(TagTable, {
      fields: [QuestionTagTable.tagId],
      references: [TagTable.id],
    }),
  }),
);
