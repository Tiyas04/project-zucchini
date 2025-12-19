import { NextRequest } from "next/server";
import { getUserByFirebaseUid } from "@repo/database";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid } = body;

    if (!firebaseUid) {
      return handleApiError(new Error("Firebase UID is required"), "Authentication required");
    }

    const user = await getUserByFirebaseUid(firebaseUid);

    if (user) {
      return handleResponse({
        isRegistered: true,
        userId: user.id,
        name: user.name,
        email: user.email,
        isPaymentVerified: user.isPaymentVerified,
      });
    }

    return handleResponse({ isRegistered: false });
  } catch (error) {
    return handleApiError(error, "Failed to check registration status");
  }
}
