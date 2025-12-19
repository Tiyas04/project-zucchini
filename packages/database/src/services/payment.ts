import { db } from "../index";
import { usersTable, transactionsTable, razorpayPaymentsTable } from "../schema";
import { eq } from "drizzle-orm";
import { ApiError } from "@repo/shared-types";

export interface RazorpayDetails {
  orderId: string;
  paymentId: string;
  signature: string;
}

export type PaymentMethod = "qr" | "razorpay";

export const updatePaymentStatus = async (
  userId: number,
  paymentMethod: PaymentMethod = "razorpay",
  razorpayDetails?: RazorpayDetails
) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await db.update(usersTable).set({ isVerified: true }).where(eq(usersTable.id, userId));
  const [transaction] = await db
    .update(transactionsTable)
    .set({
      isVerified: true,
      verifiedAt: new Date(),
      paymentMethod,
    })
    .where(eq(transactionsTable.userId, userId))
    .returning();

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  if (paymentMethod === "razorpay" && razorpayDetails) {
    await db.insert(razorpayPaymentsTable).values({
      transactionId: transaction.id,
      orderId: razorpayDetails.orderId,
      paymentId: razorpayDetails.paymentId,
      signature: razorpayDetails.signature,
      isVerified: true,
      verifiedAt: new Date(),
    });
  }

  return {
    message: "Payment verified successfully",
  };
};

export const getPaymentStatus = async (userId: number) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [transaction] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, userId));

  if (!transaction) {
    return {
      isVerified: false,
      paymentMethod: null,
      verifiedAt: null,
      razorpayDetails: null,
    };
  }

  let razorpayDetails = null;
  if (transaction.paymentMethod === "razorpay") {
    const [payment] = await db
      .select()
      .from(razorpayPaymentsTable)
      .where(eq(razorpayPaymentsTable.transactionId, transaction.id));

    if (payment) {
      razorpayDetails = {
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        signature: payment.signature,
        verifiedAt: payment.verifiedAt,
      };
    }
  }

  return {
    isVerified: transaction.isVerified,
    paymentMethod: transaction.paymentMethod,
    verifiedAt: transaction.verifiedAt,
    razorpayDetails,
  };
};
