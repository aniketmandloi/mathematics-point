import { db } from "@mathematics-point/db";
import { user } from "@mathematics-point/db/schema/auth";
import { course, enrollment } from "@mathematics-point/db/schema/course";
import { transaction } from "@mathematics-point/db/schema/payment";
import { count, desc, eq, sql } from "drizzle-orm";
import z from "zod";

import { router, adminProcedure } from "../index";

export const studentRouter = router({
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [eq(user.role, "student")];

      if (input.search) {
        conditions.push(
          sql`(${user.name} ILIKE ${"%" + input.search + "%"} OR ${user.email} ILIKE ${"%" + input.search + "%"})`,
        );
      }

      const [students, [total]] = await Promise.all([
        db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            classLevel: user.classLevel,
            targetExam: user.targetExam,
            createdAt: user.createdAt,
            enrollmentCount: count(enrollment.id),
          })
          .from(user)
          .leftJoin(enrollment, eq(user.id, enrollment.userId))
          .where(sql`${user.role} = 'student'`)
          .groupBy(user.id)
          .orderBy(desc(user.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        db
          .select({ count: count() })
          .from(user)
          .where(eq(user.role, "student")),
      ]);

      return { students, total: total?.count ?? 0 };
    }),

  getStats: adminProcedure.query(async () => {
    const [[studentCount], [courseCount], [enrollmentCount], [revenueResult]] =
      await Promise.all([
        db
          .select({ count: count() })
          .from(user)
          .where(eq(user.role, "student")),
        db.select({ count: count() }).from(course),
        db.select({ count: count() }).from(enrollment),
        db
          .select({
            total: sql<number>`COALESCE(SUM(${transaction.amount}), 0)`,
          })
          .from(transaction)
          .where(eq(transaction.status, "completed")),
      ]);

    return {
      totalStudents: studentCount?.count ?? 0,
      totalCourses: courseCount?.count ?? 0,
      totalEnrollments: enrollmentCount?.count ?? 0,
      totalRevenue: revenueResult?.total ?? 0,
    };
  }),
});
