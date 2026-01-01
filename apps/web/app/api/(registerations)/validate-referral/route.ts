import { NextRequest } from "next/server";
import { validateReferralCode } from "@repo/database";
import { handleResponse, handleApiError } from "@repo/shared-utils/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return handleResponse({ valid: false, message: "No referral code provided" }, 400);
    }

    const referrer = await validateReferralCode(code);

    if (referrer) {
      return handleResponse({
        valid: true,
        referrerName: referrer.name,
      });
    }

    return handleResponse({
      valid: false,
      message: "Invalid referral code",
    });
  } catch (error) {
    return handleApiError(error, "Failed to validate referral code");
  }
}
