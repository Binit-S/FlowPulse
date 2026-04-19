import { DensityLevel, GateReport } from "../types";

// Mock booked ratios for the baseline based on the prompt's `lib/mock-data.ts` snippet
const BOOKED_RATIOS: Record<string, number> = {
  S1: 0.65, // High
  S2: 0.40, // Medium
  S3: 0.30, // Low
  S4: 0.50, // Medium
};

export function computeZoneDensity(
  reports: GateReport[],
  zoneId: string
): DensityLevel {
  // If it's a stand, we use the booked ratio baseline + recent reports.
  // For MVP let's just use simple threshold logic as requested.

  let score = 0;

  // Add booked seat density baseline for stands
  if (BOOKED_RATIOS[zoneId]) {
    score += BOOKED_RATIOS[zoneId];
  }

  // Weight recent reports in last 30 minutes
  const now = Date.now();
  const thirtyMins = 30 * 60 * 1000;
  
  const recentReports = reports.filter(r => (now - r.timestamp) < thirtyMins);

  for (const r of recentReports) {
    const age = now - r.timestamp;
    const decay = 1 - (age / thirtyMins); // linear decay for simplicity

    const reportScore = r.density === 'high' ? 0.3 : r.density === 'medium' ? 0.1 : -0.1;
    score += reportScore * decay;
  }

  // Threshold: >=0.65 high, 0.40-0.64 medium, <0.40 low
  if (score >= 0.65) return 'high';
  if (score >= 0.40) return 'medium';
  return 'low';
}
