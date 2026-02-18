import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { course } from "./course";

export const transaction = pgTable(
  "transaction",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    currency: text("currency").default("INR").notNull(),
    status: text("status", { enum: ["pending", "completed", "failed"] })
      .default("pending")
      .notNull(),
    polarCheckoutId: text("polar_checkout_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("transaction_user_idx").on(table.userId),
    index("transaction_course_idx").on(table.courseId),
  ],
);

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, {
    fields: [transaction.userId],
    references: [user.id],
  }),
  course: one(course, {
    fields: [transaction.courseId],
    references: [course.id],
  }),
}));
