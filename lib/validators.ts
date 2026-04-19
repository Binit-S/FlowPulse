import { DensityLevel } from "@/types";

/** Valid gate identifiers in the venue */
const VALID_GATES = ["A", "B", "C", "D"] as const;
type ValidGate = (typeof VALID_GATES)[number];

/** Valid density levels */
const VALID_DENSITIES: DensityLevel[] = ["low", "medium", "high"];

/**
 * Type guard: checks if a value is a valid gate identifier.
 */
export function isValidGate(value: unknown): value is ValidGate {
  return typeof value === "string" && VALID_GATES.includes(value as ValidGate);
}

/**
 * Type guard: checks if a value is a valid density level.
 */
export function isValidDensity(value: unknown): value is DensityLevel {
  return typeof value === "string" && VALID_DENSITIES.includes(value as DensityLevel);
}

/**
 * Type guard: checks if a value is a non-empty string.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Type guard: checks if a value is a valid stall ID format.
 */
export function isValidStallId(value: unknown): value is string {
  return typeof value === "string" && /^stall-\d+$/.test(value);
}
