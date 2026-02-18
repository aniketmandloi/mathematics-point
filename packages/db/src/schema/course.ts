import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const course = pgTable(
  "course",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    thumbnail: text("thumbnail"),
    classLevel: text("class_level"),
    subject: text("subject"),
    difficulty: text("difficulty", {
      enum: ["beginner", "intermediate", "advanced"],
    }),
    price: integer("price").default(0).notNull(),
    pricingType: text("pricing_type", { enum: ["free", "paid"] })
      .default("free")
      .notNull(),
    teacherId: text("teacher_id").references(() => user.id, {
      onDelete: "set null",
    }),
    status: text("status", { enum: ["draft", "published"] })
      .default("draft")
      .notNull(),
    totalDuration: integer("total_duration").default(0),
    lectureCount: integer("lecture_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("course_teacher_idx").on(table.teacherId),
    index("course_status_idx").on(table.status),
    index("course_slug_idx").on(table.slug),
  ],
);

export const chapter = pgTable(
  "chapter",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("chapter_course_idx").on(table.courseId)],
);

export const contentItem = pgTable(
  "content_item",
  {
    id: serial("id").primaryKey(),
    chapterId: integer("chapter_id")
      .notNull()
      .references(() => chapter.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["video", "pdf"] }).notNull(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    duration: integer("duration"),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("content_item_chapter_idx").on(table.chapterId)],
);

export const enrollment = pgTable(
  "enrollment",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
    status: text("status", { enum: ["active", "expired"] })
      .default("active")
      .notNull(),
  },
  (table) => [
    unique("enrollment_user_course_uniq").on(table.userId, table.courseId),
    index("enrollment_user_idx").on(table.userId),
    index("enrollment_course_idx").on(table.courseId),
  ],
);

export const contentProgress = pgTable(
  "content_progress",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    contentItemId: integer("content_item_id")
      .notNull()
      .references(() => contentItem.id, { onDelete: "cascade" }),
    watchedDuration: integer("watched_duration").default(0),
    completed: boolean("completed").default(false).notNull(),
    lastPosition: integer("last_position").default(0),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("content_progress_user_item_uniq").on(
      table.userId,
      table.contentItemId,
    ),
    index("content_progress_user_idx").on(table.userId),
  ],
);

// Relations
export const courseRelations = relations(course, ({ one, many }) => ({
  teacher: one(user, {
    fields: [course.teacherId],
    references: [user.id],
  }),
  chapters: many(chapter),
  enrollments: many(enrollment),
}));

export const chapterRelations = relations(chapter, ({ one, many }) => ({
  course: one(course, {
    fields: [chapter.courseId],
    references: [course.id],
  }),
  contentItems: many(contentItem),
}));

export const contentItemRelations = relations(contentItem, ({ one }) => ({
  chapter: one(chapter, {
    fields: [contentItem.chapterId],
    references: [chapter.id],
  }),
}));

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  user: one(user, {
    fields: [enrollment.userId],
    references: [user.id],
  }),
  course: one(course, {
    fields: [enrollment.courseId],
    references: [course.id],
  }),
}));

export const contentProgressRelations = relations(
  contentProgress,
  ({ one }) => ({
    user: one(user, {
      fields: [contentProgress.userId],
      references: [user.id],
    }),
    contentItem: one(contentItem, {
      fields: [contentProgress.contentItemId],
      references: [contentItem.id],
    }),
  }),
);
