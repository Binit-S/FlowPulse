import { describe, it, expect } from 'vitest';
import { computeZoneDensity } from '../lib/density-engine';

describe('computeZoneDensity', () => {
  it('returns high for S1 based on mock data', () => {
    expect(computeZoneDensity([], 'S1')).toBe('high');
  });

  it('increases density properly with high reports', () => {
    const reports = [
      { gate: "A", density: "high" as const, timestamp: Date.now(), userId: "1" },
      { gate: "A", density: "high" as const, timestamp: Date.now(), userId: "2" },
      { gate: "A", density: "high" as const, timestamp: Date.now(), userId: "3" }
    ];
    // S3 mock base is low
    expect(computeZoneDensity(reports, 'S3')).toBe('high');
  });
});
