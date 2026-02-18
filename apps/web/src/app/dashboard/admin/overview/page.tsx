"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, DollarSign, GraduationCap, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/utils/trpc";

export default function AdminOverviewPage() {
  const stats = useQuery(trpc.student.getStats.queryOptions());
  const revenue = useQuery(
    trpc.payment.getRevenue.queryOptions({ period: "month" }),
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Overview</h1>
      <p className="mt-1 text-muted-foreground">Key metrics at a glance</p>

      {/* Stats cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Students"
              value={stats.data?.totalStudents ?? 0}
              icon={Users}
            />
            <StatCard
              title="Total Courses"
              value={stats.data?.totalCourses ?? 0}
              icon={BookOpen}
            />
            <StatCard
              title="Enrollments"
              value={stats.data?.totalEnrollments ?? 0}
              icon={GraduationCap}
            />
            <StatCard
              title="Revenue"
              value={`₹${stats.data?.totalRevenue ?? 0}`}
              icon={DollarSign}
            />
          </>
        )}
      </div>

      {/* Revenue by course */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Course (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            {revenue.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : !revenue.data?.byCourse.length ? (
              <p className="text-sm text-muted-foreground py-4">
                No revenue data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {revenue.data.byCourse.map((item) => (
                  <div
                    key={item.courseId}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.courseTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} sales
                      </p>
                    </div>
                    <span className="font-semibold">₹{item.total}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {revenue.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : !revenue.data?.recent.length ? (
              <p className="text-sm text-muted-foreground py-4">
                No transactions yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenue.data.recent.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <p className="text-sm font-medium">{tx.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.userEmail}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {tx.courseTitle}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{tx.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
