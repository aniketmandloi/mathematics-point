import { db } from "@mathematics-point/db";
import { user } from "@mathematics-point/db/schema/auth";
import { course, enrollment } from "@mathematics-point/db/schema/course";
import { transaction } from "@mathematics-point/db/schema/payment";
import { polarClient } from "@mathematics-point/auth/lib/payments";
import { env } from "@mathematics-point/env/server";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, sql } from "drizzle-orm";
import z from "zod";

import { router, protectedProcedure, adminProcedure } from "../index";

const createCheckout = protectedProcedure
  .input(z.object({ courseId: z.number() }))
  .mutation(async ({ input, ctx }) => {
    const [courseData] = await db
      .select()
      .from(course)
      .where(and(eq(course.id, input.courseId), eq(course.status, "published")));

    if (!courseData) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
    }
    if (courseData.pricingType === "free") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "This is a free course. Use the enroll endpoint.",
      });
    }

    const [existingEnrollment] = await db
      .select()
      .from(enrollment)
      .where(
        and(
          eq(enrollment.userId, ctx.session.user.id),
          eq(enrollment.courseId, input.courseId),
        ),
      );
    if (existingEnrollment) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "You are already enrolled in this course.",
      });
    }

    const [tx] = await db
      .insert(transaction)
      .values({
        userId: ctx.session.user.id,
        courseId: input.courseId,
        amount: courseData.price,
        status: "pending",
      })
      .returning();

    const checkout = await polarClient.checkouts.create({
      products: [env.POLAR_PRODUCT_ID],
      amount: courseData.price,
      successUrl: `${env.POLAR_SUCCESS_URL}?transaction_id=${tx!.id}`,
      customerEmail: ctx.session.user.email,
      metadata: {
        transactionId: String(tx!.id),
        courseId: String(input.courseId),
        userId: ctx.session.user.id,
      },
    });

    return { checkoutUrl: checkout.url, transactionId: tx!.id };
  });

const verifyPayment = protectedProcedure
  .input(z.object({ transactionId: z.number() }))
  .query(async ({ input, ctx }) => {
    const [tx] = await db
      .select({
        id: transaction.id,
        status: transaction.status,
        courseId: transaction.courseId,
        courseTitle: course.title,
        courseSlug: course.slug,
        amount: transaction.amount,
      })
      .from(transaction)
      .innerJoin(course, eq(transaction.courseId, course.id))
      .where(
        and(
          eq(transaction.id, input.transactionId),
          eq(transaction.userId, ctx.session.user.id),
        ),
      );

    return tx ?? null;
  });

const getHistory = protectedProcedure.query(async ({ ctx }) => {
  const transactions = await db
    .select({
      id: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      createdAt: transaction.createdAt,
      courseTitle: course.title,
      courseSlug: course.slug,
    })
    .from(transaction)
    .innerJoin(course, eq(transaction.courseId, course.id))
    .where(eq(transaction.userId, ctx.session.user.id))
    .orderBy(desc(transaction.createdAt));

  return transactions;
});

const getRevenue = adminProcedure
  .input(
    z.object({
      period: z.enum(["week", "month", "year", "all"]).default("month"),
    }),
  )
  .query(async ({ input }) => {
    const conditions = [eq(transaction.status, "completed")];

    if (input.period !== "all") {
      const now = new Date();
      let since: Date;
      switch (input.period) {
        case "week":
          since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }
      conditions.push(sql`${transaction.createdAt} >= ${since!}`);
    }

    const [totals] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${transaction.amount}), 0)`,
        count: count(),
      })
      .from(transaction)
      .where(and(...conditions));

    const byCourse = await db
      .select({
        courseId: transaction.courseId,
        courseTitle: course.title,
        total: sql<number>`SUM(${transaction.amount})`,
        count: count(),
      })
      .from(transaction)
      .innerJoin(course, eq(transaction.courseId, course.id))
      .where(and(...conditions))
      .groupBy(transaction.courseId, course.title)
      .orderBy(sql`SUM(${transaction.amount}) DESC`);

    const recent = await db
      .select({
        id: transaction.id,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        courseTitle: course.title,
        userName: user.name,
        userEmail: user.email,
      })
      .from(transaction)
      .innerJoin(course, eq(transaction.courseId, course.id))
      .innerJoin(user, eq(transaction.userId, user.id))
      .where(eq(transaction.status, "completed"))
      .orderBy(desc(transaction.createdAt))
      .limit(10);

    return {
      totalRevenue: totals?.total ?? 0,
      totalTransactions: totals?.count ?? 0,
      byCourse,
      recent,
    };
  });

export const paymentRouter = router({
  createCheckout,
  verifyPayment,
  getHistory,
  getRevenue,
});
