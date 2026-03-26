import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { QuestionTable } from "./question";
import { relations } from "drizzle-orm";

export const interactionActions = ["ask-question", "answer", "view"] as const;
export type InteractionAction = (typeof interactionActions)[number];
export const interactionActionEnum = pgEnum(
  "interaction-actions",
  interactionActions,
);

export const InteractionTable = pgTable("interactions", {
  id: uuid().primaryKey().defaultRandom(),
  action: interactionActionEnum("action").notNull(),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  questionId: uuid("question_id").references(() => QuestionTable.id, {
    onDelete: "cascade",
  }),
  tags: uuid("tags").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const interactionRelations = relations(InteractionTable, ({ one }) => ({
  user: one(user, {
    fields: [InteractionTable.userId],
    references: [user.id],
  }),
  question: one(QuestionTable, {
    fields: [InteractionTable.questionId],
    references: [QuestionTable.id],
  }),
}));
