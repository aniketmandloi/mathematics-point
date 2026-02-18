import { db } from "@mathematics-point/db";
import { user } from "@mathematics-point/db/schema/auth";
import { eq } from "drizzle-orm";
import z from "zod";

import { router, protectedProcedure } from "../index";

export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [profile] = await db
      .select()
      .from(user)
      .where(eq(user.id, ctx.session.user.id));
    return profile ?? null;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        classLevel: z.string().optional(),
        targetExam: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db
        .update(user)
        .set(input)
        .where(eq(user.id, ctx.session.user.id))
        .returning();
      return updated;
    }),
});
