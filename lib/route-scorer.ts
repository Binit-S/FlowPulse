import { DensityLevel, RouteOption } from "../types";
import { WANKHEDE_CONFIG } from "./venue-configs/wankhede";

/** Density multiplier applied to base walking time */
const DENSITY_MULTIPLIERS: Record<DensityLevel, number> = {
  low: 1.0,
  medium: 1.8,
  high: 3.5,
};

/**
 * Ranks entry gates by estimated total walk time factoring in live crowd density.
 * The gate with the lowest adjusted walk time is marked as suggested.
 *
 * @param targetStand - The user's seat stand (e.g. "S3")
 * @param gateDensities - Current density levels per gate from Firebase
 * @returns Sorted list of route options, best first
 */
export function rankGates(
  targetStand: string,
  gateDensities: Record<string, DensityLevel>
): RouteOption[] {
  const stand = WANKHEDE_CONFIG.zones.find((z) => z.id === targetStand);

  interface ScoredRoute extends RouteOption {
    score: number;
  }

  const scored: ScoredRoute[] = [];

  for (const gate of WANKHEDE_CONFIG.gates) {
    const isNear = stand?.nearGates.includes(gate.id) ?? false;
    const baseWalkMinutes = isNear ? 4 : 15;

    const density = gateDensities[`gate-${gate.id}`] || "low";
    const multiplier = DENSITY_MULTIPLIERS[density];
    const totalScore = baseWalkMinutes * multiplier;

    scored.push({
      gate: gate.id,
      walkMinutes: Math.round(totalScore),
      crowdLevel: density,
      steps: [
        { icon: "🚗", label: "Parking" },
        { icon: "🚪", label: `Gate ${gate.id}` },
        { icon: "🪜", label: isNear ? "Direct Ramp" : "Walkway" },
        { icon: "🪑", label: targetStand },
      ],
      isSuggested: false,
      score: totalScore,
    });
  }

  // Sort by score ascending (best route first)
  scored.sort((a, b) => a.score - b.score);

  // Mark top result as suggested
  if (scored.length > 0) {
    scored[0].isSuggested = true;
  }

  // Strip internal score field before returning
  return scored.map((route) => {
    return {
      gate: route.gate,
      walkMinutes: route.walkMinutes,
      crowdLevel: route.crowdLevel,
      steps: route.steps,
      isSuggested: route.isSuggested,
    };
  });
}
