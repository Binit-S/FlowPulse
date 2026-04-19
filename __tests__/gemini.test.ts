import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the environment variable before importing gemini
beforeEach(() => {
  vi.resetModules();
  process.env.GEMINI_API_KEY = "";
});

it("predictWaitTime uses local fallback if API key is missing", async () => {
  const { predictWaitTime } = await import("../lib/gemini");
  
  // 50 people in queue, 120s (2m) prep time = 100m wait
  const prediction = await predictWaitTime("Test Stall", 10, 120, 50, "Half-time");
  
  expect(prediction).not.toBeNull();
  expect(prediction?.waitMinutes).toBe(100);
  expect(prediction?.confidence).toBe("low");
  expect(prediction?.reason).toContain("unavailable");
});

it("recommendRoute returns null if API key is missing", async () => {
  const { recommendRoute } = await import("../lib/gemini");
  const rec = await recommendRoute("S1", {}, "Toss");
  expect(rec).toBeNull();
});
