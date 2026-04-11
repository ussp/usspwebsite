import { describe, it, expect } from "vitest";
import { ScoringProfile } from "../../profiles/types.js";

const validProfile: ScoringProfile = {
  id: "software-engineer",
  name: "Software Engineer",
  domain: "resume",
  description: "Default profile for software engineering positions",
  version: "1.0.0",
  categoryWeights: {
    technical_skill: 35,
    certification: 10,
    education: 10,
    domain_knowledge: 15,
    tool_proficiency: 15,
    soft_skill: 15,
  },
  criticalityMultipliers: {
    mandatory: 2.0,
    important: 1.5,
    preferred: 1.0,
    optional: 0.5,
  },
  levelCurve: {
    "-2": 0.3,
    "-1": 0.7,
    "0": 1.0,
    "1": 1.0,
    "2": 0.95,
  },
  mandatoryIsGate: false,
  evidenceWeight: 0.3,
  recencyHalfLifeMonths: 36,
  gapThreshold: 50,
  taxonomyMatchScores: {
    exact: 1.0,
    parent: 0.7,
    child: 0.8,
    sibling: 0.5,
    related: 0.3,
    none: 0.0,
  },
};

describe("ScoringProfile", () => {
  it("accepts valid profile", () => {
    expect(ScoringProfile.parse(validProfile)).toEqual(validProfile);
  });

  it("accepts healthcare profile with mandatoryIsGate true", () => {
    const healthcare = {
      ...validProfile,
      id: "healthcare-clinical",
      mandatoryIsGate: true,
      evidenceWeight: 0.6,
      categoryWeights: {
        certification: 40,
        technical_skill: 20,
        education: 15,
        domain_knowledge: 15,
        soft_skill: 10,
      },
    };
    expect(ScoringProfile.parse(healthcare).mandatoryIsGate).toBe(true);
  });

  it("rejects profile with all zero weights", () => {
    const zeroWeights = {
      ...validProfile,
      categoryWeights: { technical_skill: 0 },
    };
    expect(() => ScoringProfile.parse(zeroWeights)).toThrow();
  });

  it("rejects evidenceWeight > 1", () => {
    expect(() =>
      ScoringProfile.parse({ ...validProfile, evidenceWeight: 1.5 }),
    ).toThrow();
  });

  it("rejects negative evidenceWeight", () => {
    expect(() =>
      ScoringProfile.parse({ ...validProfile, evidenceWeight: -0.1 }),
    ).toThrow();
  });

  it("rejects non-positive recencyHalfLifeMonths", () => {
    expect(() =>
      ScoringProfile.parse({ ...validProfile, recencyHalfLifeMonths: 0 }),
    ).toThrow();
  });

  it("rejects levelCurve values > 2", () => {
    expect(() =>
      ScoringProfile.parse({
        ...validProfile,
        levelCurve: { "0": 3.0 },
      }),
    ).toThrow();
  });

  it("accepts rfp domain", () => {
    const rfp = { ...validProfile, domain: "rfp" as const };
    expect(ScoringProfile.parse(rfp).domain).toBe("rfp");
  });

  it("rejects invalid domain", () => {
    expect(() =>
      ScoringProfile.parse({ ...validProfile, domain: "custom" }),
    ).toThrow();
  });
});
