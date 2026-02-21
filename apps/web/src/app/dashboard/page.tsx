"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Play,
  Trophy,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimateIn } from "@/components/animate-in";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function DashboardPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  const enrolledQuery = useQuery({
    ...trpc.course.getEnrolled.queryOptions(),
    enabled: !isAdmin,
  });

  const continueQuery = useQuery({
    ...trpc.course.getContinueLearning.queryOptions(),
    enabled: !isAdmin,
  });

  if (sessionPending) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Admin redirect message
  if (isAdmin) {
    return (
      <div className="p-6">
        <AnimateIn animation="fade-in-up">
          <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your coaching platform from the sidebar.
          </p>
          <div className="mt-6">
            <Link href="/dashboard/admin/overview" className={buttonVariants()}>
              Go to Admin Overview
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </AnimateIn>
      </div>
    );
  }

  const enrolled = enrolledQuery.data ?? [];
  const totalEnrolled = enrolled.length;
  const totalCompleted = enrolled.reduce((sum, e) => sum + e.completedItems, 0);
  const totalItems = enrolled.reduce((sum, e) => sum + e.totalItems, 0);
  const continueLearning = continueQuery.data;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <AnimateIn animation="fade-in-up">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {session?.user?.name ?? "Student"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your progress and continue learning.
          </p>
        </div>
      </AnimateIn>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <AnimateIn animation="scale-in" delay={0}>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEnrolled}</p>
                <p className="text-xs text-muted-foreground">
                  Courses Enrolled
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimateIn>
        <AnimateIn animation="scale-in" delay={100}>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCompleted}</p>
                <p className="text-xs text-muted-foreground">
                  Lessons Completed
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimateIn>
        <AnimateIn animation="scale-in" delay={200}>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {totalItems > 0
                    ? Math.round((totalCompleted / totalItems) * 100)
                    : 0}
                  %
                </p>
                <p className="text-xs text-muted-foreground">
                  Overall Progress
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimateIn>
      </div>

      {/* Continue Learning */}
      {continueLearning && (
        <AnimateIn animation="fade-in-up" delay={250}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Continue Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{continueLearning.contentTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {continueLearning.courseTitle}
                  </p>
                </div>
                <Link
                  href={`/dashboard/courses/${continueLearning.courseId}`}
                  className={buttonVariants({ size: "sm" })}
                >
                  <Play className="mr-1 h-3.5 w-3.5" />
                  Resume
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimateIn>
      )}

      {/* My Courses */}
      <div>
        <AnimateIn animation="fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Courses</h2>
            <Link
              href="/courses"
              className="text-sm text-primary hover:underline"
            >
              Browse more
            </Link>
          </div>
        </AnimateIn>

        {enrolledQuery.isLoading ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : enrolled.length === 0 ? (
          <AnimateIn animation="scale-in">
            <Card className="mt-4">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No courses yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse and enroll in courses to start learning.
                </p>
                <Link
                  href="/courses"
                  className={buttonVariants({ className: "mt-4" })}
                >
                  Browse Courses
                </Link>
              </CardContent>
            </Card>
          </AnimateIn>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolled.map((course, i) => {
              const progress =
                course.totalItems > 0
                  ? Math.round(
                      (course.completedItems / course.totalItems) * 100,
                    )
                  : 0;

              return (
                <AnimateIn
                  key={course.enrollmentId}
                  animation="fade-in-up"
                  delay={i * 80}
                >
                  <Link
                    href={`/dashboard/courses/${course.courseId}`}
                    className="group block"
                  >
                    <Card className="h-full transition-shadow hover:shadow-md">
                      {course.courseThumbnail ? (
                        <div className="aspect-video overflow-hidden rounded-t-xl">
                          <img
                            src={course.courseThumbnail}
                            alt={course.courseTitle}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center rounded-t-xl bg-muted">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <CardContent className="pt-4 space-y-2">
                        <h3 className="font-medium line-clamp-1">
                          {course.courseTitle}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {course.completedItems}/{course.totalItems} lessons
                          </span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </CardContent>
                    </Card>
                  </Link>
                </AnimateIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
