"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";

export default function NewCoursePage() {
  const router = useRouter();

  const createMut = useMutation(
    trpc.course.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Course created");
        router.push(`/dashboard/admin/courses/${data.id}`);
      },
      onError: () => {
        toast.error("Failed to create course");
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      classLevel: "",
      subject: "",
      difficulty: "",
      pricingType: "free" as "free" | "paid",
      price: 0,
    },
    onSubmit: async ({ value }) => {
      await createMut.mutateAsync({
        title: value.title,
        slug: value.slug,
        description: value.description || undefined,
        classLevel: value.classLevel || undefined,
        subject: value.subject || undefined,
        difficulty: (value.difficulty || undefined) as
          | "beginner"
          | "intermediate"
          | "advanced"
          | undefined,
        pricingType: value.pricingType,
        price: value.pricingType === "paid" ? value.price : 0,
      });
    },
    validators: {
      onSubmit: z.object({
        title: z.string().min(1, "Title is required"),
        slug: z.string().min(1, "Slug is required"),
        description: z.string(),
        classLevel: z.string(),
        subject: z.string(),
        difficulty: z.string(),
        pricingType: z.enum(["free", "paid"]),
        price: z.number().min(0),
      }),
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Create New Course</h1>

      <Card className="mt-6 max-w-2xl">
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
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      // Auto-generate slug from title
                      const slug = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      form.setFieldValue("slug", slug);
                    }}
                    placeholder="e.g., Class 10 Mathematics"
                  />
                  {field.state.meta.errors.map((err) => (
                    <p key={err?.message} className="text-sm text-destructive">
                      {err?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="slug">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL-friendly)</Label>
                  <Input
                    id="slug"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g., class-10-mathematics"
                  />
                  {field.state.meta.errors.map((err) => (
                    <p key={err?.message} className="text-sm text-destructive">
                      {err?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                    placeholder="Describe what students will learn..."
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
                      onValueChange={(val) => field.handleChange(val ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
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

              <form.Field name="subject">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Mathematics",
                          "Algebra",
                          "Geometry",
                          "Calculus",
                          "Trigonometry",
                          "Statistics",
                        ].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <form.Field name="difficulty">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(
                          (val ?? "") as typeof field.state.value,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
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
                      onValueChange={(val) =>
                        field.handleChange((val ?? "free") as "free" | "paid")
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
              {(pricingType) =>
                pricingType === "paid" ? (
                  <form.Field name="price">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (INR)</Label>
                        <Input
                          id="price"
                          type="number"
                          min={0}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          placeholder="e.g., 999"
                        />
                      </div>
                    )}
                  </form.Field>
                ) : null
              }
            </form.Subscribe>

            <div className="flex gap-3 pt-2">
              <form.Subscribe>
                {(state) => (
                  <Button type="submit" disabled={state.isSubmitting}>
                    {state.isSubmitting ? "Creating..." : "Create Course"}
                  </Button>
                )}
              </form.Subscribe>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
