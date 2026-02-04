import { NextResponse } from "next/server";
import { getCheckinsList, getCheckinStatistics } from "@repo/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const includeStats = searchParams.get("stats") === "true";

    const data = await getCheckinsList(pageSize, page);

    let stats = null;
    if (includeStats) {
      stats = await getCheckinStatistics();
    }

    return NextResponse.json({
      success: true,
      data: {
        checkins: data.checkins.map((c) => ({
          id: c.id,
          checkInBy: c.checkInBy,
          regType: c.regType,
          timestamp: c.timestamp,
          participant: c.participant,
        })),
        pagination: data.pagination,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch check-ins" },
      { status: 500 }
    );
  }
}
