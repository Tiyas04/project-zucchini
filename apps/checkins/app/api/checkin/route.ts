import { NextRequest, NextResponse } from "next/server";
import { getParticipantForCheckin, createCheckin } from "@repo/database";
import { z } from "zod";

const checkinSchema = z.object({
  userId: z.number().int().positive(),
  type: z.enum(["nu", "mun"]),
  checkInBy: z.object({
    name: z.string().min(1),
    phone: z.string().regex(/^[6-9]\d{9}$/),
  }),
  timestamp: z.string().datetime(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "validation_error", message: "Invalid request data" },
        { status: 400 }
      );
    }

    const { userId, type, checkInBy, timestamp } = parsed.data;

    const result = await getParticipantForCheckin(userId, type);

    if (!result.found) {
      return NextResponse.json(
        { success: false, error: "not_found", message: "Registration not found" },
        { status: 404 }
      );
    }

    if (!result.verified) {
      return NextResponse.json(
        { success: false, error: "not_verified", message: "Registration not verified" },
        { status: 403 }
      );
    }

    if (result.alreadyCheckedIn) {
      return NextResponse.json(
        { success: false, error: "already_checked_in", message: "Participant already checked in" },
        { status: 409 }
      );
    }

    // @ts-ignore checkinby is not nullable
    await createCheckin(userId, type, checkInBy, new Date(timestamp));

    return NextResponse.json({
      success: true,
      participant: result.participant,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { success: false, error: "server_error", message: "An error occurred" },
      { status: 500 }
    );
  }
}
