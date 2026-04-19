import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";
import { computeZoneDensity } from "@/lib/density-engine";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";
import { GateReport } from "@/types";

/**
 * GET /api/density
 * Returns computed crowd density levels for all venue zones.
 * Falls back to mock data when Firebase is not configured.
 */
export async function GET(request: Request) {
  // Rate limit by IP
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimitResult = checkRateLimit(`density:${clientIp}`, 60, 60_000);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429 }
    );
  }

  if (!db) {
    return NextResponse.json(
      {
        zones: {
          "gate-A": "high",
          "gate-B": "medium",
          "gate-C": "low",
          "gate-D": "medium",
          S1: "high",
          S2: "medium",
          S3: "low",
          S4: "medium",
        },
        updatedAt: new Date().toISOString(),
      },
      {
        headers: { "Cache-Control": "public, max-age=30, s-maxage=30" },
      }
    );
  }

  try {
    const densityRef = ref(db, `density/${WANKHEDE_CONFIG.id}`);
    const snapshot = await get(densityRef);
    const data = snapshot.val() as Record<string, { reports?: Record<string, GateReport>; computedLevel?: string }> | null;

    if (!data) {
      return NextResponse.json(
        { zones: {}, updatedAt: new Date().toISOString() },
        { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } }
      );
    }

    const zones: Record<string, string> = {};

    Object.keys(data).forEach((zoneId) => {
      const zoneData = data[zoneId];
      if (zoneData.reports) {
        const reportsArray = Object.values(zoneData.reports);
        zones[zoneId] = computeZoneDensity(reportsArray, zoneId);
      } else if (zoneData.computedLevel) {
        zones[zoneId] = zoneData.computedLevel;
      } else {
        zones[zoneId] = "low";
      }
    });

    logger.info("Density data fetched", { zoneCount: Object.keys(zones).length });

    return NextResponse.json(
      { zones, updatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } }
    );
  } catch (error) {
    logger.error("Density fetch failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
