import { NextResponse } from "next/server";
import { predictWaitTime } from "@/lib/gemini";
import { MOCK_STALLS } from "@/lib/mock-data";
import { isValidStallId } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";

/**
 * GET /api/wait-time?stallId=stall-1
 * Returns AI-predicted wait time for a food stall using Google Gemini.
 */
export async function GET(request: Request) {
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimitResult = checkRateLimit(`wait-time:${clientIp}`, 20, 60_000);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const stallId = searchParams.get("stallId");

  if (!isValidStallId(stallId)) {
    return NextResponse.json({ error: "Invalid or missing stallId. Expected format: stall-1" }, { status: 400 });
  }

  const stall = MOCK_STALLS.find((s) => s.id === stallId);
  if (!stall) {
    return NextResponse.json({ error: "Stall not found" }, { status: 404 });
  }

  const prediction = await predictWaitTime(
    stall.name,
    stall.queueLength * 3,
    120,
    stall.queueLength,
    "Over 14"
  );

  if (!prediction) {
    logger.warn("Gemini prediction returned null", { stallId });
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 });
  }

  logger.info("Wait time predicted", { stallId, waitMinutes: prediction.waitMinutes });

  return NextResponse.json(
    {
      stallId,
      ...prediction,
      cachedUntil: new Date(Date.now() + 5 * 60_000).toISOString(),
    },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } }
  );
}
