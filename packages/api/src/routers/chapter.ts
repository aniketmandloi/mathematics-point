import { db } from "@mathematics-point/db";
import { chapter } from "@mathematics-point/db/schema/course";
import { asc, eq } from "drizzle-orm";
import z from "zod";

import { router, adminProcedure } from "../index";

export const chapterRouter = router({
  listByCourse: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(chapter)
        .where(eq(chapter.courseId, input.courseId))
        .orderBy(asc(chapter.order));
    }),

  create: adminProcedure
    .input(
      z.object({
        courseId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        order: z.number().min(0).default(0),
      }),
    )
    .mutation(async ({ input }) => {
      const [created] = await db.insert(chapter).values(input).returning();
      return created;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        order: z.number().min(0).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db
        .update(chapter)
        .set(data)
        .where(eq(chapter.id, id))
        .returning();
      return updated;
    }),

  remove: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(chapter).where(eq(chapter.id, input.id));
      return { success: true };
    }),

  reorder: adminProcedure
    .input(z.array(z.object({ id: z.number(), order: z.number() })))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.map((item) =>
          db
            .update(chapter)
            .set({ order: item.order })
            .where(eq(chapter.id, item.id)),
        ),
      );
      return { success: true };
    }),
});
