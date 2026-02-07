import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { QuestionTable } from "./question";

export const TagTable = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tagRelations = relations(TagTable, ({ many }) => ({
  questions: many(QuestionTable),
}));
