"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transaction_id");

  const txQuery = useQuery({
    ...trpc.payment.verifyPayment.queryOptions({
      transactionId: Number(transactionId),
    }),
    enabled: !!transactionId,
    refetchInterval: (query) => {
      if (query.state.data?.status === "completed") return false;
      return 2000;
    },
  });

  const tx = txQuery.data;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          {!transactionId ? (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h1 className="text-2xl font-bold">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Your payment has been processed.
              </p>
              <Link href="/dashboard" className={buttonVariants()}>
                Go to Dashboard
              </Link>
            </>
          ) : tx?.status === "completed" ? (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h1 className="text-2xl font-bold">Enrollment Confirmed!</h1>
              <p className="text-muted-foreground">
                You are now enrolled in <strong>{tx.courseTitle}</strong>.
              </p>
              <p className="text-sm text-muted-foreground">
                Amount paid: ₹{tx.amount}
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href={`/dashboard/courses/${tx.courseId}`}
                  className={buttonVariants()}
                >
                  Start Learning
                </Link>
                <Link
                  href="/dashboard"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Go to Dashboard
                </Link>
              </div>
            </>
          ) : tx?.status === "pending" ? (
            <>
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <h1 className="text-2xl font-bold">Processing Payment...</h1>
              <p className="text-muted-foreground">
                We're confirming your payment. This usually takes a few seconds.
              </p>
            </>
          ) : txQuery.isLoading ? (
            <>
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading...</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-muted-foreground">
                We couldn't verify your payment. Please contact support if you
                were charged.
              </p>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "outline" })}
              >
                Go to Dashboard
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
