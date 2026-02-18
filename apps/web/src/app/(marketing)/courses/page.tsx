"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BookOpen, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

const classLevels = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const subjects = [
  "Mathematics",
  "Algebra",
  "Geometry",
  "Calculus",
  "Trigonometry",
  "Statistics",
];

export default function CourseCatalogPage() {
  const [search, setSearch] = useState("");
  const [classLevel, setClassLevel] = useState<string>("");
  const [subject, setSubject] = useState<string>("");

  const courses = useQuery(
    trpc.course.listPublic.queryOptions({
      search: search || undefined,
      classLevel: classLevel || undefined,
      subject: subject || undefined,
    }),
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Course Catalog</h1>
        <p className="mt-3 text-muted-foreground">
          Browse our courses and start learning today
        </p>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={classLevel}
          onValueChange={(v) => setClassLevel(v ?? "")}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Class Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {classLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={subject} onValueChange={(v) => setSubject(v ?? "")}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {courses.isLoading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : courses.data?.courses.length === 0 ? (
        <div className="mt-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.data?.courses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden">
              {course.thumbnail ? (
                <div className="aspect-video bg-muted">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-muted">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <CardContent className="flex-1 pt-4">
                <div className="flex items-center gap-2">
                  {course.classLevel && (
                    <Badge variant="secondary">{course.classLevel}</Badge>
                  )}
                  {course.subject && (
                    <Badge variant="outline">{course.subject}</Badge>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold line-clamp-2">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                )}
                {course.teacherName && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    By {course.teacherName}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <span className="text-lg font-bold">
                  {course.pricingType === "free" ? "Free" : `₹${course.price}`}
                </span>
                <Button size="sm" asChild>
                  <Link href={`/courses/${course.slug}`}>View Course</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination info */}
      {courses.data && courses.data.total > 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Showing {courses.data.courses.length} of {courses.data.total} courses
        </p>
      )}
    </div>
  );
}
