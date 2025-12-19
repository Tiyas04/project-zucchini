import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import { amount } from "../../../config";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return handleApiError(
        new Error("Razorpay credentials not configured"),
        "Server configuration error"
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt#NU26#${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return handleResponse({ orderId: order.id });
  } catch (error) {
    return handleApiError(error, "Failed to create order");
  }
}
