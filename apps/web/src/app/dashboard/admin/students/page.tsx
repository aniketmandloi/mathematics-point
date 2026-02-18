"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");

  const students = useQuery(
    trpc.student.list.queryOptions({ search: search || undefined }),
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Students</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View and manage enrolled students
      </p>

      <div className="relative mt-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="mt-6">
        {students.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : students.data?.students.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No students found.</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Target Exam</TableHead>
                    <TableHead>Enrollments</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.data?.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.classLevel ?? "—"}</TableCell>
                      <TableCell>
                        {student.targetExam ? (
                          <Badge variant="outline">{student.targetExam}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{student.enrollmentCount}</TableCell>
                      <TableCell>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Showing {students.data?.students.length ?? 0} of{" "}
              {students.data?.total ?? 0} students
            </p>
          </>
        )}
      </div>
    </div>
  );
}
