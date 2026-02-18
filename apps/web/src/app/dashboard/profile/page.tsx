"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const classLevels = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
] as const;

const targetExams = ["CBSE", "ICSE", "JEE", "Olympiad", "Other"] as const;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const profile = useQuery(trpc.user.getProfile.queryOptions());

  const updateProfile = useMutation(
    trpc.user.updateProfile.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.user.getProfile.queryKey(),
        });
        toast.success("Profile updated");
      },
      onError: () => {
        toast.error("Failed to update profile");
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      name: profile.data?.name ?? "",
      phone: profile.data?.phone ?? "",
      classLevel: profile.data?.classLevel ?? "",
      targetExam: profile.data?.targetExam ?? "",
      bio: profile.data?.bio ?? "",
    },
    onSubmit: async ({ value }) => {
      await updateProfile.mutateAsync({
        name: value.name || undefined,
        phone: value.phone || undefined,
        classLevel: value.classLevel || undefined,
        targetExam: value.targetExam || undefined,
        bio: value.bio || undefined,
      });
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string(),
        classLevel: z.string(),
        targetExam: z.string(),
        bio: z.string(),
      }),
    },
  });

  if (profile.isLoading) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Full Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error?.message}
                      className="text-sm text-destructive"
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Phone Number</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="classLevel">
              {(field) => (
                <div className="space-y-2">
                  <Label>Class / Level</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="targetExam">
              {(field) => (
                <div className="space-y-2">
                  <Label>Target Exam</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your target exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetExams.map((exam) => (
                        <SelectItem key={exam} value={exam}>
                          {exam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="bio">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>About You</Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                  />
                </div>
              )}
            </form.Field>

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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Email:</span>{" "}
            {profile.data?.email}
          </p>
          <p>
            <span className="text-muted-foreground">Role:</span>{" "}
            <span className="capitalize">{profile.data?.role}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Email Verified:</span>{" "}
            {profile.data?.emailVerified ? "Yes" : "No"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
