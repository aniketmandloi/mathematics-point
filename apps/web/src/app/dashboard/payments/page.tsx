"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Receipt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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

export default function PaymentHistoryPage() {
  const historyQuery = useQuery(trpc.payment.getHistory.queryOptions());

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Payment History</h1>
      <p className="mt-1 text-muted-foreground">
        Your course purchase transactions
      </p>

      <div className="mt-6">
        {historyQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !historyQuery.data?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No transactions yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your payment history will appear here when you purchase a course.
            </p>
            <Link
              href="/courses"
              className={buttonVariants({ className: "mt-4" })}
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyQuery.data.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">
                      {tx.courseTitle}
                    </TableCell>
                    <TableCell>
                      ₹{tx.amount}{" "}
                      <span className="text-xs text-muted-foreground">
                        {tx.currency}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.status === "completed"
                            ? "default"
                            : tx.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {tx.status === "completed" && tx.courseSlug && (
                        <Link
                          href={`/courses/${tx.courseSlug}`}
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                          })}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
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
