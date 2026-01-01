import { NextResponse } from "next/server";
import { getReferralLeaderboard } from "@repo/database";

export async function GET() {
  try {
    const data = await getReferralLeaderboard();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch referral stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch referral statistics" },
      { status: 500 }
    );
  }
}
