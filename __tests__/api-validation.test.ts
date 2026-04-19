import { describe, it, expect } from "vitest";
import { isValidGate, isValidDensity, isValidStallId } from "../lib/validators";

describe("API Input Validators", () => {
  it("validates gates correctly", () => {
    expect(isValidGate("A")).toBe(true);
    expect(isValidGate("Z")).toBe(false);
    expect(isValidGate(null)).toBe(false);
  });

  it("validates density enum correctly", () => {
    expect(isValidDensity("high")).toBe(true);
    expect(isValidDensity("low")).toBe(true);
    expect(isValidDensity("extreme")).toBe(false);
    expect(isValidDensity(123)).toBe(false);
  });

  it("validates stall IDs format", () => {
    expect(isValidStallId("stall-1")).toBe(true);
    expect(isValidStallId("stall-99")).toBe(true);
    expect(isValidStallId("stall-")).toBe(false);
    expect(isValidStallId("notastall")).toBe(false);
  });
});
