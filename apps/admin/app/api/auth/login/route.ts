import { NextRequest } from "next/server";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";
import { isAdmin } from "@repo/database";

interface LoginBody {
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email }: LoginBody = await req.json();
    const result = await isAdmin(email);
    return handleResponse({
      amIAdmin: result,
    });
  } catch (error) {
    return handleApiError(error, "Invalid request");
  }
}
