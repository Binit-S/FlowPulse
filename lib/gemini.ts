import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key", 
});

export async function predictWaitTime(
  stallName: string,
  recentOrders: number,
  avgPrepTime: number,
  queueLength: number,
  matchPhase: string
) {
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
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to naive calculation if key missing or failed
    return {
      waitMinutes: Math.round((queueLength * avgPrepTime) / 60),
      confidence: "low",
      reason: "Prediction based on linear queue length due to service unavailable."
    };
  }
}
