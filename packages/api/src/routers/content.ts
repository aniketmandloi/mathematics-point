import { db } from "@mathematics-point/db";
import {
  contentItem,
  contentProgress,
} from "@mathematics-point/db/schema/course";
import { and, asc, eq } from "drizzle-orm";
import z from "zod";

import { router, adminProcedure, protectedProcedure } from "../index";

export const contentRouter = router({
  // === Admin procedures ===
  listByChapter: adminProcedure
    .input(z.object({ chapterId: z.number() }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(contentItem)
        .where(eq(contentItem.chapterId, input.chapterId))
        .orderBy(asc(contentItem.order));
    }),

  create: adminProcedure
    .input(
      z.object({
        chapterId: z.number(),
        type: z.enum(["video", "pdf"]),
        title: z.string().min(1),
        url: z.string().min(1),
        duration: z.number().optional(),
        order: z.number().min(0).default(0),
      }),
    )
    .mutation(async ({ input }) => {
      const [created] = await db.insert(contentItem).values(input).returning();
      return created;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        url: z.string().min(1).optional(),
        type: z.enum(["video", "pdf"]).optional(),
        duration: z.number().optional(),
        order: z.number().min(0).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db
        .update(contentItem)
        .set(data)
        .where(eq(contentItem.id, id))
        .returning();
      return updated;
    }),

  remove: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(contentItem).where(eq(contentItem.id, input.id));
      return { success: true };
    }),

  reorder: adminProcedure
    .input(z.array(z.object({ id: z.number(), order: z.number() })))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.map((item) =>
          db
            .update(contentItem)
            .set({ order: item.order })
            .where(eq(contentItem.id, item.id)),
        ),
      );
      return { success: true };
    }),

  // === Student procedures ===
  updateProgress: protectedProcedure
    .input(
      z.object({
        contentItemId: z.number(),
        watchedDuration: z.number().optional(),
        lastPosition: z.number().optional(),
        completed: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { contentItemId, ...data } = input;

      const [existing] = await db
        .select()
        .from(contentProgress)
        .where(
          and(
            eq(contentProgress.userId, ctx.session.user.id),
            eq(contentProgress.contentItemId, contentItemId),
          ),
        );

      if (existing) {
        const [updated] = await db
          .update(contentProgress)
          .set(data)
          .where(eq(contentProgress.id, existing.id))
          .returning();
        return updated;
      }

      const [created] = await db
        .insert(contentProgress)
        .values({
          userId: ctx.session.user.id,
          contentItemId,
          ...data,
        })
        .returning();
      return created;
    }),

  markComplete: protectedProcedure
    .input(z.object({ contentItemId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const [existing] = await db
        .select()
        .from(contentProgress)
        .where(
          and(
            eq(contentProgress.userId, ctx.session.user.id),
            eq(contentProgress.contentItemId, input.contentItemId),
          ),
        );

      if (existing) {
        const [updated] = await db
          .update(contentProgress)
          .set({ completed: true })
          .where(eq(contentProgress.id, existing.id))
          .returning();
        return updated;
      }

      const [created] = await db
        .insert(contentProgress)
        .values({
          userId: ctx.session.user.id,
          contentItemId: input.contentItemId,
          completed: true,
        })
        .returning();
      return created;
    }),
});
