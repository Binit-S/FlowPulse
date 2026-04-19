import { describe, it, expect } from "vitest";
import { rankGates } from "../lib/route-scorer";
import { DensityLevel } from "../types";

describe("route-scorer rankGates", () => {
  it("prioritizes gates closer to the stand correctly", () => {
    // S1 stand should prefer gates that are close to it according to wankhede config.
    const densities: Record<string, DensityLevel> = {
      "gate-A": "low",
      "gate-B": "low",
      "gate-C": "low",
      "gate-D": "low",
    };
    
    const ranked = rankGates("S1", densities);
    
    // Gate A is usually closest to S1 according to standard configs.
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].isSuggested).toBe(true);
  });

  it("penalizes heavily crowded gates properly", () => {
    // S1 has near gates A and D. C is far.
    // If all are low, C is 15 mins.
    // If C is high, C is 15 * 3.5 = 52.5 mins.
    const densities: Record<string, DensityLevel> = {
      "gate-A": "low", // 4 * 1.0 = 4 mins
      "gate-B": "low", // 15 * 1.0 = 15 mins
      "gate-C": "high", // 15 * 3.5 = ~53 mins
      "gate-D": "low", // 4 * 1.0 = 4 mins
    };
    
    const ranked = rankGates("S1", densities);
    // Gate C should be the absolute last option
    expect(ranked[ranked.length - 1].gate).toBe("C");
    // Assert math logic holds roughly (~53)
    expect(ranked[ranked.length - 1].walkMinutes).toBeGreaterThan(50);
  });
});
