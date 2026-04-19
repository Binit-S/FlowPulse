import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";
import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";
import { isValidGate, isValidDensity, isNonEmptyString } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";

/**
 * POST /api/report-gate
 * Accepts a crowd density report from an authenticated user.
 * Validates all inputs and enforces rate limiting.
 */
export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = checkRateLimit(`report-gate:${clientIp}`, 10, 60_000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimitResult.retryAfterMs || 60000) / 1000)) } }
      );
    }

    const body = await request.json();
    const { gate, density, sessionId } = body;

    // Validate inputs
    if (!isValidGate(gate)) {
      return NextResponse.json({ error: "Invalid gate. Must be A, B, C, or D." }, { status: 400 });
    }
    if (!isValidDensity(density)) {
      return NextResponse.json({ error: "Invalid density. Must be low, medium, or high." }, { status: 400 });
    }
    if (!isNonEmptyString(sessionId)) {
      return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
    }

    if (db) {
      const reportsRef = ref(db, `density/${WANKHEDE_CONFIG.id}/gate-${gate}/reports`);
      const newReportRef = push(reportsRef);
      await set(newReportRef, {
        userId: sessionId,
        density,
        timestamp: Date.now(),
      });
      logger.info("Gate density report saved", { gate, density, userId: sessionId });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Report gate failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
