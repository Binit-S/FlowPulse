import { NextResponse } from "next/server";
import { askConcierge } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";

/** Max characters for a chat message to prevent context bloating */
const MAX_QUERY_LENGTH = 300;

export async function POST(request: Request) {
  // Rate limits specific to expensive AI features (15 req / min)
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimitResult = checkRateLimit(`chat:${clientIp}`, 15, 60_000);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Query limit exceeded. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimitResult.retryAfterMs || 60000) / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    const { query, location, liveData } = body;

    // Strict input sanitization & validation
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing or invalid query." }, { status: 400 });
    }
    
    const sanitizedQuery = query.trim().substring(0, MAX_QUERY_LENGTH);
    if (sanitizedQuery.length === 0) {
      return NextResponse.json({ error: "Query cannot be empty." }, { status: 400 });
    }

    const safeLocation = typeof location === "string" ? location.substring(0, 100) : "Unknown Stand";
    
    // Ensure liveData is an object to prevent prompt injection payload issues
    const safeLiveData: Record<string, string | number> = {};
    if (liveData && typeof liveData === "object") {
      for (const [key, value] of Object.entries(liveData)) {
        if (typeof value === "string" || typeof value === "number") {
          safeLiveData[key] = value;
        }
      }
    }

    logger.info("Processing concierge chat", { location: safeLocation, queryLength: sanitizedQuery.length });

    // Internal proxy call to Gemini -- keeps API keys safe server-side
    const responseText = await askConcierge(sanitizedQuery, safeLocation, safeLiveData);

    return NextResponse.json({ text: responseText });
  } catch (error) {
    logger.error("Concierge API failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
