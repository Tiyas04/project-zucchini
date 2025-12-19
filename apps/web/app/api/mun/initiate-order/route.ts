import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import { getMunRegistrationFee } from "@repo/database";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";

export async function POST(request: NextRequest) {
  try {
    const { studentType, committeeChoice } = await request.json();

    if (!studentType || !committeeChoice) {
      return handleApiError(
        new Error("Student type and committee choice are required"),
        "Invalid request"
      );
    }

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

    // Calculate amount based on student type and committee
    const amount = getMunRegistrationFee(studentType, committeeChoice);

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `mun#${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return handleResponse({ orderId: order.id, amount });
  } catch (error) {
    return handleApiError(error, "Failed to create MUN order");
  }
}
