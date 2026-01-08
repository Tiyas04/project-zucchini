import { NextRequest } from "next/server";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { isAdmin, getAdminByUid } from "@repo/database";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.uid) {
      return handleApiError(new Error("Firebase UID not found in token"), "Invalid token");
    }

    const admin = await getAdminByUid(auth.uid);
    const isVerified = admin?.isVerified || false;
    const role = admin?.role || null;

    let redirectUrl: string | null = null;
    if (isVerified) {
      if (role === "ADMIN") redirectUrl = "/";
      else if (role === "NU") redirectUrl = "/nitrutsav";
      else if (role === "MUN") redirectUrl = "/mun";
      else redirectUrl = "/"; // Default fallback for verified users
    }

    return handleResponse({
      isVerified,
      role,
      redirectUrl,
      amIAdmin: isVerified,
    });
  } catch (error) {
    return handleApiError(error, "Invalid request");
  }
}
