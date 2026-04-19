import { DensityLevel, RouteOption } from "../types";
import { WANKHEDE_CONFIG } from "./venue-configs/wankhede";

export function rankGates(
  targetStand: string,
  gateDensities: Record<string, DensityLevel>
): RouteOption[] {
  const options: RouteOption[] = [];
  const stand = WANKHEDE_CONFIG.zones.find(z => z.id === targetStand);

  for (const gate of WANKHEDE_CONFIG.gates) {
    // Base walk distance in minutes (mock base distance values)
    // If it's a "near gate", distance is smaller.
    const isNear = stand?.nearGates.includes(gate.id);
    const baseWalkMinutes = isNear ? 4 : 15;

    const density = gateDensities[`gate-${gate.id}`] || 'low';
    
    // densityMultiplier: low=1.0, medium=1.8, high=3.5
    let multiplier = 1.0;
    if (density === 'medium') multiplier = 1.8;
    if (density === 'high') multiplier = 3.5;

    const totalScore = baseWalkMinutes * multiplier;

    options.push({
      gate: gate.id,
      walkMinutes: Math.round(totalScore),
      crowdLevel: density as DensityLevel,
      steps: [
        { icon: "🚗", label: "Parking" },
        { icon: "🚪", label: `Gate ${gate.id}` },
        { icon: "🪜", label: isNear ? "Direct Ramp" : "Walkway" },
        { icon: "🪑", label: targetStand }
      ],
      isSuggested: false, // set in next pass
      // Store raw score for sorting
      _score: totalScore
    } as RouteOption & { _score: number });
  }

  // Sort by score ascending
  options.sort((a: any, b: any) => a._score - b._score);
  
  // Mark top 1 as suggested
  if (options.length > 0) {
    options[0].isSuggested = true;
  }

  // Clean up _score
  return options.map(o => {
    const { _score, ...rest } = o as any;
    return rest;
  });
}
