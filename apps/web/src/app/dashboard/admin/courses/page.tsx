"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const courses = useQuery(trpc.course.listAll.queryOptions({}));

  const publishMut = useMutation(
    trpc.course.publish.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.listAll.queryKey(),
        });
        toast.success("Course published");
      },
    }),
  );

  const unpublishMut = useMutation(
    trpc.course.unpublish.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.listAll.queryKey(),
        });
        toast.success("Course unpublished");
      },
    }),
  );

  const removeMut = useMutation(
    trpc.course.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.listAll.queryKey(),
        });
        toast.success("Course deleted");
      },
    }),
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your courses and content
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        {courses.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : courses.data?.courses.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No courses yet. Create your first course to get started.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.data?.courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/admin/courses/${course.id}`}
                        className="font-medium hover:underline"
                      >
                        {course.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          course.status === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.classLevel ?? "—"}</TableCell>
                    <TableCell>
                      {course.pricingType === "free"
                        ? "Free"
                        : `₹${course.price}`}
                    </TableCell>
                    <TableCell>{course.enrollmentCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {course.status === "draft" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => publishMut.mutate({ id: course.id })}
                            disabled={publishMut.isPending}
                          >
                            Publish
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              unpublishMut.mutate({ id: course.id })
                            }
                            disabled={unpublishMut.isPending}
                          >
                            Unpublish
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            if (confirm("Delete this course?")) {
                              removeMut.mutate({ id: course.id });
                            }
                          }}
                          disabled={removeMut.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
