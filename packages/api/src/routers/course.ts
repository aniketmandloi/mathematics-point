import { db } from "@mathematics-point/db";
import {
  course,
  chapter,
  contentItem,
  enrollment,
  contentProgress,
} from "@mathematics-point/db/schema/course";
import { user } from "@mathematics-point/db/schema/auth";
import { and, asc, desc, eq, ilike, or, count } from "drizzle-orm";
import z from "zod";

import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../index";

// === Public procedures ===

const listPublic = publicProcedure
  .input(
    z.object({
      classLevel: z.string().optional(),
      subject: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(50).default(12),
      offset: z.number().min(0).default(0),
    }),
  )
  .query(async ({ input }) => {
    const conditions = [eq(course.status, "published")];

    if (input.classLevel) {
      conditions.push(eq(course.classLevel, input.classLevel));
    }
    if (input.subject) {
      conditions.push(eq(course.subject, input.subject));
    }
    if (input.search) {
      conditions.push(
        or(
          ilike(course.title, `%${input.search}%`),
          ilike(course.description, `%${input.search}%`),
        )!,
      );
    }

    const [courses, [total]] = await Promise.all([
      db
        .select({
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          thumbnail: course.thumbnail,
          classLevel: course.classLevel,
          subject: course.subject,
          difficulty: course.difficulty,
          price: course.price,
          pricingType: course.pricingType,
          totalDuration: course.totalDuration,
          lectureCount: course.lectureCount,
          teacherName: user.name,
        })
        .from(course)
        .leftJoin(user, eq(course.teacherId, user.id))
        .where(and(...conditions))
        .orderBy(desc(course.createdAt))
        .limit(input.limit)
        .offset(input.offset),
      db
        .select({ count: count() })
        .from(course)
        .where(and(...conditions)),
    ]);

    return { courses, total: total?.count ?? 0 };
  });

const getPublicById = publicProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ input }) => {
    const [courseData] = await db
      .select()
      .from(course)
      .where(and(eq(course.slug, input.slug), eq(course.status, "published")));

    if (!courseData) return null;

    const chapters = await db
      .select({
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        contentCount: count(contentItem.id),
      })
      .from(chapter)
      .leftJoin(contentItem, eq(chapter.id, contentItem.chapterId))
      .where(eq(chapter.courseId, courseData.id))
      .groupBy(chapter.id)
      .orderBy(asc(chapter.order));

    const [enrollmentCount] = await db
      .select({ count: count() })
      .from(enrollment)
      .where(eq(enrollment.courseId, courseData.id));

    return {
      ...courseData,
      chapters,
      enrollmentCount: enrollmentCount?.count ?? 0,
    };
  });

// === Admin procedures ===

const listAll = adminProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }),
  )
  .query(async ({ input }) => {
    const [courses, [total]] = await Promise.all([
      db
        .select({
          id: course.id,
          title: course.title,
          slug: course.slug,
          status: course.status,
          classLevel: course.classLevel,
          subject: course.subject,
          price: course.price,
          pricingType: course.pricingType,
          lectureCount: course.lectureCount,
          createdAt: course.createdAt,
          enrollmentCount: count(enrollment.id),
        })
        .from(course)
        .leftJoin(enrollment, eq(course.id, enrollment.courseId))
        .groupBy(course.id)
        .orderBy(desc(course.createdAt))
        .limit(input.limit)
        .offset(input.offset),
      db.select({ count: count() }).from(course),
    ]);

    return { courses, total: total?.count ?? 0 };
  });

const getById = adminProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const [courseData] = await db
      .select()
      .from(course)
      .where(eq(course.id, input.id));

    if (!courseData) return null;

    const chapters = await db
      .select()
      .from(chapter)
      .where(eq(chapter.courseId, input.id))
      .orderBy(asc(chapter.order));

    return { ...courseData, chapters };
  });

const create = adminProcedure
  .input(
    z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      thumbnail: z.string().optional(),
      classLevel: z.string().optional(),
      subject: z.string().optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      price: z.number().min(0).default(0),
      pricingType: z.enum(["free", "paid"]).default("free"),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const [created] = await db
      .insert(course)
      .values({
        ...input,
        teacherId: ctx.session.user.id,
      })
      .returning();
    return created;
  });

const update = adminProcedure
  .input(
    z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      description: z.string().optional(),
      thumbnail: z.string().optional(),
      classLevel: z.string().optional(),
      subject: z.string().optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      price: z.number().min(0).optional(),
      pricingType: z.enum(["free", "paid"]).optional(),
      totalDuration: z.number().optional(),
      lectureCount: z.number().optional(),
    }),
  )
  .mutation(async ({ input }) => {
    const { id, ...data } = input;
    const [updated] = await db
      .update(course)
      .set(data)
      .where(eq(course.id, id))
      .returning();
    return updated;
  });

const remove = adminProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    await db.delete(course).where(eq(course.id, input.id));
    return { success: true };
  });

const publish = adminProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const [updated] = await db
      .update(course)
      .set({ status: "published" })
      .where(eq(course.id, input.id))
      .returning();
    return updated;
  });

const unpublish = adminProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const [updated] = await db
      .update(course)
      .set({ status: "draft" })
      .where(eq(course.id, input.id))
      .returning();
    return updated;
  });

// === Student procedures ===

const enroll = protectedProcedure
  .input(z.object({ courseId: z.number() }))
  .mutation(async ({ input, ctx }) => {
    const [courseData] = await db
      .select({ pricingType: course.pricingType, status: course.status })
      .from(course)
      .where(eq(course.id, input.courseId));

    if (!courseData || courseData.status !== "published") {
      throw new Error("Course not found or not published");
    }

    if (courseData.pricingType === "paid") {
      throw new Error("This is a paid course. Please complete payment first.");
    }

    const [existing] = await db
      .select()
      .from(enrollment)
      .where(
        and(
          eq(enrollment.userId, ctx.session.user.id),
          eq(enrollment.courseId, input.courseId),
        ),
      );

    if (existing) {
      return existing;
    }

    const [created] = await db
      .insert(enrollment)
      .values({
        userId: ctx.session.user.id,
        courseId: input.courseId,
      })
      .returning();
    return created;
  });

const getEnrolled = protectedProcedure.query(async ({ ctx }) => {
  const enrollments = await db
    .select({
      enrollmentId: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      courseId: course.id,
      courseTitle: course.title,
      courseSlug: course.slug,
      courseThumbnail: course.thumbnail,
      courseClassLevel: course.classLevel,
      courseSubject: course.subject,
      courseLectureCount: course.lectureCount,
    })
    .from(enrollment)
    .innerJoin(course, eq(enrollment.courseId, course.id))
    .where(eq(enrollment.userId, ctx.session.user.id))
    .orderBy(desc(enrollment.enrolledAt));

  // Get progress for each course
  const result = await Promise.all(
    enrollments.map(async (e) => {
      const [totalItems] = await db
        .select({ count: count() })
        .from(contentItem)
        .innerJoin(chapter, eq(contentItem.chapterId, chapter.id))
        .where(eq(chapter.courseId, e.courseId));

      const [completedItems] = await db
        .select({ count: count() })
        .from(contentProgress)
        .innerJoin(
          contentItem,
          eq(contentProgress.contentItemId, contentItem.id),
        )
        .innerJoin(chapter, eq(contentItem.chapterId, chapter.id))
        .where(
          and(
            eq(chapter.courseId, e.courseId),
            eq(contentProgress.userId, ctx.session.user.id),
            eq(contentProgress.completed, true),
          ),
        );

      return {
        ...e,
        totalItems: totalItems?.count ?? 0,
        completedItems: completedItems?.count ?? 0,
      };
    }),
  );

  return result;
});

const getEnrolledById = protectedProcedure
  .input(z.object({ courseId: z.number() }))
  .query(async ({ input, ctx }) => {
    // Verify enrollment
    const [enroll] = await db
      .select()
      .from(enrollment)
      .where(
        and(
          eq(enrollment.userId, ctx.session.user.id),
          eq(enrollment.courseId, input.courseId),
        ),
      );

    if (!enroll) return null;

    const [courseData] = await db
      .select()
      .from(course)
      .where(eq(course.id, input.courseId));

    if (!courseData) return null;

    const chapters = await db
      .select()
      .from(chapter)
      .where(eq(chapter.courseId, input.courseId))
      .orderBy(asc(chapter.order));

    const chaptersWithContent = await Promise.all(
      chapters.map(async (ch) => {
        const items = await db
          .select()
          .from(contentItem)
          .where(eq(contentItem.chapterId, ch.id))
          .orderBy(asc(contentItem.order));

        // Get progress for each item
        const itemsWithProgress = await Promise.all(
          items.map(async (item) => {
            const [progress] = await db
              .select()
              .from(contentProgress)
              .where(
                and(
                  eq(contentProgress.userId, ctx.session.user.id),
                  eq(contentProgress.contentItemId, item.id),
                ),
              );
            return { ...item, progress: progress ?? null };
          }),
        );

        return { ...ch, contentItems: itemsWithProgress };
      }),
    );

    return { ...courseData, chapters: chaptersWithContent };
  });

const getContinueLearning = protectedProcedure.query(async ({ ctx }) => {
  // Find the most recently accessed content progress
  const [latest] = await db
    .select({
      contentItemId: contentProgress.contentItemId,
      lastPosition: contentProgress.lastPosition,
      updatedAt: contentProgress.updatedAt,
      contentTitle: contentItem.title,
      contentType: contentItem.type,
      contentUrl: contentItem.url,
      chapterId: contentItem.chapterId,
      courseId: chapter.courseId,
      courseTitle: course.title,
    })
    .from(contentProgress)
    .innerJoin(contentItem, eq(contentProgress.contentItemId, contentItem.id))
    .innerJoin(chapter, eq(contentItem.chapterId, chapter.id))
    .innerJoin(course, eq(chapter.courseId, course.id))
    .where(
      and(
        eq(contentProgress.userId, ctx.session.user.id),
        eq(contentProgress.completed, false),
      ),
    )
    .orderBy(desc(contentProgress.updatedAt))
    .limit(1);

  return latest ?? null;
});

export const courseRouter = router({
  listPublic,
  getPublicById,
  listAll,
  getById,
  create,
  update,
  remove,
  publish,
  unpublish,
  enroll,
  getEnrolled,
  getEnrolledById,
  getContinueLearning,
});
