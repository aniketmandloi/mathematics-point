import { db } from "@mathematics-point/db";
import { enrollment } from "@mathematics-point/db/schema/course";
import { transaction } from "@mathematics-point/db/schema/payment";
import { and, eq } from "drizzle-orm";

/**
 * Process a successful Polar checkout webhook event.
 * Updates the transaction status and creates an enrollment.
 */
export async function handleCheckoutCompleted(metadata: {
  transactionId: string;
  courseId: string;
  userId: string;
  polarCheckoutId: string;
}) {
  // Update transaction status
  await db
    .update(transaction)
    .set({
      status: "completed",
      polarCheckoutId: metadata.polarCheckoutId,
    })
    .where(eq(transaction.id, Number(metadata.transactionId)));

  // Create enrollment (skip if already exists due to unique constraint)
  const [existing] = await db
    .select()
    .from(enrollment)
    .where(
      and(
        eq(enrollment.userId, metadata.userId),
        eq(enrollment.courseId, Number(metadata.courseId)),
      ),
    );

  if (!existing) {
    await db.insert(enrollment).values({
      userId: metadata.userId,
      courseId: Number(metadata.courseId),
    });
  }
}
