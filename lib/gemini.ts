import { GoogleGenAI } from "@google/genai";
import { logger } from "./logger";

/**
 * Google Gemini AI client instance.
 * Requires GEMINI_API_KEY environment variable to be set.
 */
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

/** In-memory TTL cache for Gemini predictions */
const predictionCache = new Map<string, { data: WaitTimePrediction; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60_000; // 5 minutes

/** Structured response from the wait-time prediction model */
export interface WaitTimePrediction {
  waitMinutes: number;
  confidence: "low" | "medium" | "high";
  reason: string;
}

/** Structured response from the route recommendation model */
export interface RouteRecommendation {
  recommendedGate: string;
  reasoning: string;
  alternativeGate: string;
  crowdTip: string;
}

/**
 * Predicts food stall wait time using Google Gemini Flash.
 * Results are cached in-memory for 5 minutes per stall to reduce API calls.
 * Falls back to a linear queue calculation if the API is unavailable.
 *
 * @param stallName - Name of the food stall
 * @param recentOrders - Number of orders placed in the last 15 minutes
 * @param avgPrepTime - Average preparation time per order in seconds
 * @param queueLength - Current number of people in queue
 * @param matchPhase - Current match phase (e.g. "Over 14", "Half-time")
 * @returns Structured prediction with wait time, confidence, and reasoning
 */
export async function predictWaitTime(
  stallName: string,
  recentOrders: number,
  avgPrepTime: number,
  queueLength: number,
  matchPhase: string
): Promise<WaitTimePrediction | null> {
  const cacheKey = `wait:${stallName}:${queueLength}:${matchPhase}`;

  // Check cache first
  const cached = predictionCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    logger.info("Gemini cache hit", { stallName });
    return cached.data;
  }

  if (!ai) {
    logger.warn("Gemini API key not configured, using fallback calculation");
    return {
      waitMinutes: Math.round((queueLength * avgPrepTime) / 60),
      confidence: "low",
      reason: "Estimate based on linear queue length (AI unavailable).",
    };
  }

  const prompt = `You are a food queue prediction model at a sports stadium.
Stall: ${stallName}
Orders in last 15 min: ${recentOrders}
Average prep time per order: ${avgPrepTime} seconds
Current queue length: ${queueLength} people
Current match phase: ${matchPhase}

Predict wait time in minutes for a new order. Return ONLY a JSON object:
{"waitMinutes": <integer>, "confidence": "low"|"medium"|"high", "reason": "<one sentence>"}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) return null;
    const result: WaitTimePrediction = JSON.parse(response.text);

    // Cache successful predictions
    predictionCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
    return result;
  } catch (error) {
    logger.error("Gemini wait-time prediction failed", error);
    return {
      waitMinutes: Math.round((queueLength * avgPrepTime) / 60),
      confidence: "low",
      reason: "Estimate based on linear queue length (prediction service error).",
    };
  }
}

/**
 * Generates a smart route recommendation using Google Gemini.
 * Analyzes gate densities and user seat location to suggest the optimal entry gate.
 *
 * @param seatStand - User's assigned stand (e.g. "S3")
 * @param gateDensities - Current density levels for each gate
 * @param matchPhase - Current match phase
 * @returns Structured recommendation with reasoning
 */
export async function recommendRoute(
  seatStand: string,
  gateDensities: Record<string, string>,
  matchPhase: string
): Promise<RouteRecommendation | null> {
  if (!ai) {
    logger.warn("Gemini API key not configured, skipping route recommendation");
    return null;
  }

  const prompt = `You are a stadium navigation assistant. A user has a seat in stand ${seatStand}.
Current gate density levels: ${JSON.stringify(gateDensities)}
Match phase: ${matchPhase}

Recommend the best entry gate. Consider both proximity to the seat and current crowd levels.
Return ONLY a JSON object:
{"recommendedGate": "<A|B|C|D>", "reasoning": "<one sentence>", "alternativeGate": "<A|B|C|D>", "crowdTip": "<one sentence tip>"}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) return null;
    return JSON.parse(response.text);
  } catch (error) {
    logger.error("Gemini route recommendation failed", error);
    return null;
  }
}
