import { NextRequest } from "next/server";
import { getMunUserByFirebaseUid } from "@repo/database";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid } = await request.json();

    if (!firebaseUid) {
      return handleApiError(new Error("Firebase UID is required"), "Authentication required");
    }

    const munUser = await getMunUserByFirebaseUid(firebaseUid);

    if (!munUser) {
      return handleResponse({
        isRegistered: false,
      });
    }

    return handleResponse({
      isRegistered: true,
      userId: munUser.id,
      name: munUser.name,
      email: munUser.email,
      isPaymentVerified: munUser.isPaymentVerified,
    });
  } catch (error) {
    return handleApiError(error, "Failed to check MUN registration status");
  }
}
