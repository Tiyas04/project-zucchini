import { NextRequest } from "next/server";
import crypto from "crypto";
import { updatePaymentStatus } from "@repo/database";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";

export interface VerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId }: VerifyBody =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return handleApiError(
        new Error("Missing required parameters"),
        "Missing required parameters"
      );
    }

    if (!userId) {
      return handleApiError(new Error("User ID is required"), "User ID is required");
    }

    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    if (!secret) {
      return handleApiError(
        new Error("Razorpay secret not configured"),
        "Server configuration error"
      );
    }

    const HMAC = crypto.createHmac("sha256", secret);
    HMAC.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = HMAC.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return handleApiError(new Error("Invalid signature"), "Invalid payment signature");
    }

    const result = await updatePaymentStatus(Number(userId), "razorpay", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    return handleResponse(result);
  } catch (error) {
    return handleApiError(error, "Payment verification failed");
  }
}
