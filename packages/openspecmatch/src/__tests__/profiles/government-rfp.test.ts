import { describe, it, expect } from "vitest";
import { GOVERNMENT_RFP_PROFILE, DEFAULT_PROFILES } from "../../profiles/defaults.js";
import { ScoringProfile } from "../../profiles/types.js";

describe("GOVERNMENT_RFP_PROFILE", () => {
  it("passes schema validation", () => {
    expect(() => ScoringProfile.parse(GOVERNMENT_RFP_PROFILE)).not.toThrow();
  });

  it("is registered in DEFAULT_PROFILES", () => {
    expect(DEFAULT_PROFILES.some((p) => p.id === "government-rfp")).toBe(true);
  });

  it("has domain: rfp", () => {
    expect(GOVERNMENT_RFP_PROFILE.domain).toBe("rfp");
  });

  it("has mandatoryIsGate enabled", () => {
    expect(GOVERNMENT_RFP_PROFILE.mandatoryIsGate).toBe(true);
  });

  it("has evidenceWeight in [0.4, 0.5] per spec", () => {
    expect(GOVERNMENT_RFP_PROFILE.evidenceWeight).toBeGreaterThanOrEqual(0.4);
    expect(GOVERNMENT_RFP_PROFILE.evidenceWeight).toBeLessThanOrEqual(0.5);
  });

  it("has positive total category weight", () => {
    const sum = Object.values(GOVERNMENT_RFP_PROFILE.categoryWeights).reduce(
      (a, b) => a + b,
      0,
    );
    expect(sum).toBeGreaterThan(0);
  });

  it("places compliance and infrastructure among top three categories by weight", () => {
    const sorted = Object.entries(GOVERNMENT_RFP_PROFILE.categoryWeights)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k]) => k);
    expect(sorted).toContain("compliance");
    expect(sorted).toContain("infrastructure");
  });

  it("uses a 48-month recency half-life", () => {
    expect(GOVERNMENT_RFP_PROFILE.recencyHalfLifeMonths).toBe(48);
  });

  it("has mandatory criticality multiplier >= 3x optional", () => {
    const mandatory = GOVERNMENT_RFP_PROFILE.criticalityMultipliers.mandatory;
    const optional = GOVERNMENT_RFP_PROFILE.criticalityMultipliers.optional;
    expect(mandatory).toBeDefined();
    expect(optional).toBeDefined();
    expect(mandatory!).toBeGreaterThanOrEqual(optional! * 3);
  });
});
