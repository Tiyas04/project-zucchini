import { NextRequest } from "next/server";
import crypto from "crypto";
import { updateMunPaymentStatus } from "@repo/database";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";

export interface VerifyMunBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  munRegistrationId: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      munRegistrationId,
      amount,
    }: VerifyMunBody = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return handleApiError(
        new Error("Missing required parameters"),
        "Missing required parameters"
      );
    }

    if (!munRegistrationId || !amount) {
      return handleApiError(
        new Error("MUN registration ID and amount are required"),
        "Invalid request"
      );
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

    const result = await updateMunPaymentStatus(Number(munRegistrationId), amount, "razorpay", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    return handleResponse(result);
  } catch (error) {
    return handleApiError(error, "MUN payment verification failed");
  }
}
