import { NextRequest } from "next/server";
import { registerMunUser } from "@repo/database";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";
import { type MunRegistration } from "@repo/shared-types";

interface RegisterMunBody extends MunRegistration {
  firebaseUid: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterMunBody = await request.json();

    const { firebaseUid, ...userData } = body;

    if (!firebaseUid) {
      return handleApiError(new Error("Firebase UID is required"), "Authentication required");
    }

    // Parse dateOfBirth from string to Date if it's a string
    if (userData.dateOfBirth && typeof userData.dateOfBirth === "string") {
      userData.dateOfBirth = new Date(userData.dateOfBirth);
    }

    const result = await registerMunUser(userData, firebaseUid);

    return handleResponse(result, 201);
  } catch (error) {
    return handleApiError(error, "MUN registration failed");
  }
}
