import { NextResponse } from "next/server";
import { predictWaitTime } from "@/lib/gemini";
import { MOCK_STALLS } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stallId = searchParams.get("stallId");

  if (!stallId) {
    return NextResponse.json({ error: "stallId required" }, { status: 400 });
  }

  const stall = MOCK_STALLS.find(s => s.id === stallId);
  if (!stall) {
    return NextResponse.json({ error: "Stall not found" }, { status: 404 });
  }

  const prediction = await predictWaitTime(
    stall.name,
    stall.queueLength * 3, // mock recent orders based on queue
    120, // 2 mins per order
    stall.queueLength,
    "Over 14"
  );

  if (!prediction) {
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 });
  }

  return NextResponse.json({
    stallId,
    ...prediction,
    cachedUntil: new Date(Date.now() + 5 * 60000).toISOString()
  });
}
