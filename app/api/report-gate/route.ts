import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";
import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { gate, density, sessionId } = body;

    if (!gate || !density || !sessionId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (db) {
      const reportsRef = ref(db, `density/${WANKHEDE_CONFIG.id}/gate-${gate}/reports`);
      const newReportRef = push(reportsRef);
      await set(newReportRef, {
        userId: sessionId,
        density,
        timestamp: Date.now()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report Gate Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
