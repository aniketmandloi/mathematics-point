"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

const chapterColors = [
  "bg-primary/10 text-primary",
  "bg-accent-warm/15 text-accent-warm-foreground",
  "bg-chart-2/10 text-chart-2",
  "bg-chart-3/10 text-chart-3",
  "bg-chart-4/10 text-chart-4",
];

export default function CoursePreviewPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const courseQuery = useQuery(
    trpc.course.getPublicById.queryOptions({ slug: params.slug }),
  );

  const enrollMut = useMutation(
    trpc.course.enroll.mutationOptions({
      onSuccess: (data) => {
        toast.success("Enrolled successfully!");
        router.push(`/dashboard/courses/${data.courseId}`);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  const checkoutMut = useMutation(
    trpc.payment.createCheckout.mutationOptions({
      onSuccess: (data) => {
        window.location.href = data.checkoutUrl;
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  if (courseQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-4 h-6 w-1/2" />
        <Skeleton className="mt-8 h-64 w-full" />
      </div>
    );
  }

  const course = courseQuery.data;

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <p className="mt-2 text-muted-foreground">
          This course may have been removed or is not yet published.
        </p>
      </div>
    );
  }

  const handleEnroll = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    if (course.pricingType === "free") {
      enrollMut.mutate({ courseId: course.id });
    } else {
      checkoutMut.mutate({ courseId: course.id });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap gap-2">
              {course.classLevel && (
                <Badge variant="secondary">{course.classLevel}</Badge>
              )}
              {course.subject && (
                <Badge variant="outline">{course.subject}</Badge>
              )}
              {course.difficulty && (
                <Badge variant="outline" className="capitalize">
                  {course.difficulty}
                </Badge>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {course.title}
            </h1>
            {course.description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {course.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {course.enrollmentCount} enrolled
            </div>
            {course.lectureCount ? (
              <div className="flex items-center gap-1.5">
                <Video className="h-4 w-4" />
                {course.lectureCount} lectures
              </div>
            ) : null}
            {course.totalDuration ? (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {Math.round(course.totalDuration / 60)} min
              </div>
            ) : null}
          </div>

          <Separator />

          {/* Chapters */}
          <div>
            <h2 className="text-xl font-semibold">Course Content</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.chapters.length} chapters
            </p>
            <div className="mt-4 space-y-2">
              {course.chapters.map((ch, i) => (
                <div
                  key={ch.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${chapterColors[i % chapterColors.length]}`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ch.title}</p>
                    {ch.description && (
                      <p className="text-xs text-muted-foreground">
                        {ch.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {ch.contentCount} items
                  </span>
                </div>
              ))}
              {course.chapters.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">
                  Content is being prepared. Check back soon!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar — pricing & enroll */}
        <div>
          <Card className="sticky top-24 overflow-hidden border-t-4 border-t-primary shadow-lg">
            {course.thumbnail ? (
              <div className="aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <CardContent className="pt-6 space-y-4">
              <div className="text-3xl font-bold">
                {course.pricingType === "free" ? "Free" : `₹${course.price}`}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/20"
                size="lg"
                onClick={handleEnroll}
                disabled={enrollMut.isPending || checkoutMut.isPending}
              >
                {enrollMut.isPending
                  ? "Enrolling..."
                  : checkoutMut.isPending
                    ? "Redirecting to payment..."
                    : course.pricingType === "free"
                      ? "Enroll for Free"
                      : "Buy Now"}
              </Button>

              <div className="space-y-2.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-warm" />
                  Full lifetime access
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-accent-warm" />
                  Video lectures
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent-warm" />
                  Downloadable study materials
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-accent-warm" />
                  Progress tracking
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
