import { describe, it, expect } from "vitest";
import {
  SpecMatchResult,
  ItemMatch,
  MatchSummaryItem,
  ScoreBreakdown,
  CategoryScore,
} from "../../specs/match-result.js";

const validBreakdown: ScoreBreakdown = {
  taxonomyMatch: "exact",
  levelFit: 85,
  evidenceStrength: 70,
  recency: 90,
};

const validItemMatch: ItemMatch = {
  demandItemId: "di-1",
  capabilityItemId: "ci-1",
  score: 82,
  scoreBreakdown: validBreakdown,
  explanation: "Exact skill match, advanced level meets requirement",
};

const validSummaryItem: MatchSummaryItem = {
  demandItemId: "di-1",
  category: "technical_skill",
  rawText: "Python 5+ years",
  score: 82,
  explanation: "Strong match",
};

const validCategoryScore: CategoryScore = {
  score: 82,
  weight: 0.3,
  weightedScore: 24.6,
  itemCount: 3,
  matchedCount: 2,
};

const validResult: SpecMatchResult = {
  demandId: "ds-1",
  capabilityIds: ["cs-1"],
  overallScore: 78,
  confidence: 85,
  engineVersion: "0.1.0",
  profileId: "software-engineer",
  computedAt: "2026-04-10T00:00:00Z",
  itemMatches: [validItemMatch],
  strengths: [validSummaryItem],
  gaps: [],
  unknowns: [],
  categoryScores: {
    technical_skill: validCategoryScore,
  },
  passedMandatoryGate: true,
  failedMandatory: [],
};

describe("ScoreBreakdown", () => {
  it("accepts valid breakdown", () => {
    expect(ScoreBreakdown.parse(validBreakdown)).toEqual(validBreakdown);
  });

  it("rejects levelFit > 100", () => {
    expect(() => ScoreBreakdown.parse({ ...validBreakdown, levelFit: 150 })).toThrow();
  });

  it("rejects negative evidenceStrength", () => {
    expect(() =>
      ScoreBreakdown.parse({ ...validBreakdown, evidenceStrength: -1 }),
    ).toThrow();
  });
});

describe("ItemMatch", () => {
  it("accepts valid match", () => {
    expect(ItemMatch.parse(validItemMatch)).toEqual(validItemMatch);
  });

  it("accepts null capabilityItemId (unmatched)", () => {
    const unmatched = {
      ...validItemMatch,
      capabilityItemId: null,
      score: 0,
      scoreBreakdown: {
        taxonomyMatch: "none" as const,
        levelFit: 0,
        evidenceStrength: 0,
        recency: 0,
      },
    };
    expect(ItemMatch.parse(unmatched).capabilityItemId).toBeNull();
  });

  it("accepts match with providedBy (multi-entity)", () => {
    const m = { ...validItemMatch, providedBy: "partner-a" };
    expect(ItemMatch.parse(m).providedBy).toBe("partner-a");
  });

  it("rejects score > 100", () => {
    expect(() => ItemMatch.parse({ ...validItemMatch, score: 101 })).toThrow();
  });
});

describe("SpecMatchResult", () => {
  it("accepts valid result", () => {
    expect(SpecMatchResult.parse(validResult)).toEqual(validResult);
  });

  it("accepts result with failed mandatory gate", () => {
    const failed = {
      ...validResult,
      overallScore: 0,
      passedMandatoryGate: false,
      failedMandatory: ["di-2"],
    };
    expect(SpecMatchResult.parse(failed).passedMandatoryGate).toBe(false);
  });

  it("accepts result with optional summary", () => {
    const withSummary = {
      ...validResult,
      summary: "Strong candidate for backend role",
    };
    expect(SpecMatchResult.parse(withSummary).summary).toBe(
      "Strong candidate for backend role",
    );
  });

  it("accepts result with multiple capabilityIds", () => {
    const multi = { ...validResult, capabilityIds: ["cs-1", "cs-2"] };
    expect(SpecMatchResult.parse(multi).capabilityIds).toHaveLength(2);
  });

  it("rejects overallScore > 100", () => {
    expect(() =>
      SpecMatchResult.parse({ ...validResult, overallScore: 101 }),
    ).toThrow();
  });

  it("rejects negative confidence", () => {
    expect(() =>
      SpecMatchResult.parse({ ...validResult, confidence: -5 }),
    ).toThrow();
  });
});
