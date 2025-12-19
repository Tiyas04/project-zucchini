import { NextRequest } from "next/server";
import { checkCrossRegistration } from "@repo/database";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid } = await request.json();

    if (!firebaseUid) {
      return handleApiError(new Error("Firebase UID is required"), "Authentication required");
    }

    const result = await checkCrossRegistration(firebaseUid);

    return handleResponse(result);
  } catch (error) {
    return handleApiError(error, "Failed to check registration status");
  }
}
