import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";
import { computeZoneDensity } from "@/lib/density-engine";

export async function GET() {
  if (!db) {
    return NextResponse.json({
      zones: {
        "gate-A": "high",
        "gate-B": "medium",
        "gate-C": "low",
        "gate-D": "medium",
        "S1": "high",
        "S2": "medium",
        "S3": "low",
        "S4": "medium"
      },
      updatedAt: new Date().toISOString()
    });
  }

  try {
    const densityRef = ref(db, `density/${WANKHEDE_CONFIG.id}`);
    const snapshot = await get(densityRef);
    const data = snapshot.val();
    
    if (!data) return NextResponse.json({ zones: {}, updatedAt: new Date().toISOString() });

    const zones: Record<string, string> = {};

    Object.keys(data).forEach(zoneId => {
      const zoneData = data[zoneId];
      if (zoneData.reports) {
        const reportsArray = Object.values(zoneData.reports) as any[];
        zones[zoneId] = computeZoneDensity(reportsArray, zoneId);
      } else if (zoneData.computedLevel) {
        zones[zoneId] = zoneData.computedLevel;
      } else {
        zones[zoneId] = "low";
      }
    });

    return NextResponse.json({
      zones,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
