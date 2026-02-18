"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";

export default function EditCoursePage() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addChapterOpen, setAddChapterOpen] = useState(false);

  const courseQuery = useQuery(
    trpc.course.getById.queryOptions({ id: courseId }),
  );

  const updateMut = useMutation(
    trpc.course.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.getById.queryKey(),
        });
        toast.success("Course updated");
      },
      onError: () => toast.error("Failed to update course"),
    }),
  );

  const addChapterMut = useMutation(
    trpc.chapter.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.getById.queryKey(),
        });
        setAddChapterOpen(false);
        toast.success("Chapter added");
      },
    }),
  );

  const removeChapterMut = useMutation(
    trpc.chapter.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.getById.queryKey(),
        });
        toast.success("Chapter removed");
      },
    }),
  );

  const course = courseQuery.data;

  const form = useForm({
    defaultValues: {
      title: course?.title ?? "",
      slug: course?.slug ?? "",
      description: course?.description ?? "",
      classLevel: course?.classLevel ?? "",
      subject: course?.subject ?? "",
      difficulty: (course?.difficulty ?? "") as string,
      pricingType: (course?.pricingType ?? "free") as "free" | "paid",
      price: course?.price ?? 0,
    },
    onSubmit: async ({ value }) => {
      await updateMut.mutateAsync({
        id: courseId,
        title: value.title,
        slug: value.slug,
        description: value.description || undefined,
        classLevel: value.classLevel || undefined,
        subject: value.subject || undefined,
        difficulty:
          (value.difficulty as "beginner" | "intermediate" | "advanced") ||
          undefined,
        pricingType: value.pricingType,
        price: value.pricingType === "paid" ? value.price : 0,
      });
    },
    validators: {
      onSubmit: z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string(),
        classLevel: z.string(),
        subject: z.string(),
        difficulty: z.string(),
        pricingType: z.enum(["free", "paid"]),
        price: z.number().min(0),
      }),
    },
  });

  if (courseQuery.isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <Badge
            variant={course.status === "published" ? "default" : "secondary"}
          >
            {course.status}
          </Badge>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {/* Edit Course Details */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="title">
              {(field) => (
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="slug">
              {(field) => (
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </form.Field>

            <div className="grid gap-4 md:grid-cols-2">
              <form.Field name="classLevel">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Class Level</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Class 6",
                          "Class 7",
                          "Class 8",
                          "Class 9",
                          "Class 10",
                          "Class 11",
                          "Class 12",
                        ].map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              <form.Field name="pricingType">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Pricing</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange((v ?? "free") as "free" | "paid")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>
            </div>

            <form.Subscribe selector={(s) => s.values.pricingType}>
              {(pt) =>
                pt === "paid" ? (
                  <form.Field name="price">
                    {(field) => (
                      <div className="space-y-2">
                        <Label>Price (INR)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                        />
                      </div>
                    )}
                  </form.Field>
                ) : null
              }
            </form.Subscribe>

            <form.Subscribe>
              {(state) => (
                <Button type="submit" disabled={state.isSubmitting}>
                  {state.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>

      {/* Chapters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chapters</CardTitle>
          <Dialog open={addChapterOpen} onOpenChange={setAddChapterOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Chapter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Chapter</DialogTitle>
              </DialogHeader>
              <AddChapterForm
                courseId={courseId}
                nextOrder={course.chapters?.length ?? 0}
                onSubmit={(vals) =>
                  addChapterMut.mutate({
                    courseId,
                    title: vals.title,
                    description: vals.description || undefined,
                    order: vals.order,
                  })
                }
                isPending={addChapterMut.isPending}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {course.chapters?.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No chapters yet. Add a chapter to start organizing content.
            </p>
          ) : (
            <div className="space-y-2">
              {course.chapters?.map((ch) => (
                <div
                  key={ch.id}
                  className="flex items-center gap-3 rounded-md border p-3"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <Link
                      href={`/dashboard/admin/courses/${courseId}/chapters/${ch.id}`}
                      className="font-medium hover:underline"
                    >
                      {ch.title}
                    </Link>
                    {ch.description && (
                      <p className="text-xs text-muted-foreground">
                        {ch.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">#{ch.order + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm("Delete this chapter and all its content?")) {
                        removeChapterMut.mutate({ id: ch.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AddChapterForm({
  courseId,
  nextOrder,
  onSubmit,
  isPending,
}: {
  courseId: number;
  nextOrder: number;
  onSubmit: (vals: {
    title: string;
    description: string;
    order: number;
  }) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Quadratic Equations"
        />
      </div>
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>
      <Button
        disabled={!title || isPending}
        onClick={() => onSubmit({ title, description, order: nextOrder })}
      >
        {isPending ? "Adding..." : "Add Chapter"}
      </Button>
    </div>
  );
}
