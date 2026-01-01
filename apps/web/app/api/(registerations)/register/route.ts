import { NextRequest } from "next/server";
import { registerUser } from "@repo/database";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { type Registration } from "@repo/shared-types";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body = await request.json();
    const { isNitrStudent = false, wantsAccommodation = false, referralCode, ...formData } = body;

    const result = await registerUser(
      formData as Registration,
      auth.uid,
      isNitrStudent,
      wantsAccommodation,
      referralCode // Pass referral code for validation
    );
    return handleResponse(result, 201);
  } catch (error) {
    return handleApiError(error, "Registration failed");
  }
}
