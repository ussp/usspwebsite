/**
 * Unit tests for readiness deliverables: catalog, scope, constraints,
 * SDLC analysis, use case prioritization, risk register, pilots, traceability.
 */

import { describe, it, expect } from "vitest";
import {
  ASSESSMENT_PILLAR_LABELS,
  PILLAR_PHASE_MAPPING,
  CONSTRAINT_CATEGORY_LABELS,
  CONSTRAINT_TEMPLATES,
  USE_CASE_QUADRANT_LABELS,
  INVESTMENT_TIER_LABELS,
  RISK_CATEGORY_LABELS,
  RISK_TEMPLATES,
  DATA_READINESS_DIMENSIONS,
  ENHANCEMENT_STATUS_LABELS,
  computeQuadrant,
  computeInvestmentTier,
  computeRiskScore,
  getRiskColor,
} from "../types/readiness-deliverables.js";
import type { AssessmentPillar, EnhancementCoverageStats } from "../types/readiness-deliverables.js";

// =============================================================================
// Assessment Pillars
// =============================================================================

describe("Assessment pillars", () => {
  const allPillars = Object.keys(ASSESSMENT_PILLAR_LABELS) as AssessmentPillar[];

  it("has 9 pillars", () => {
    expect(allPillars.length).toBe(9);
  });

  it("each pillar has label, description, and examples", () => {
    for (const pillar of allPillars) {
      const info = ASSESSMENT_PILLAR_LABELS[pillar];
      expect(info.label).toBeTruthy();
      expect(info.description).toBeTruthy();
      expect(info.examples).toBeTruthy();
    }
  });

  it("each pillar has at least one phase mapping", () => {
    for (const pillar of allPillars) {
      expect(PILLAR_PHASE_MAPPING[pillar].length).toBeGreaterThan(0);
    }
  });

  it("scope filtering: only in-scope pillars produce phases", () => {
    const inScope: AssessmentPillar[] = ["development", "testing", "documentation"];
    const outScope: AssessmentPillar[] = ["devops", "data", "security", "design", "pmo", "ba"];

    const inScopePhases = inScope.flatMap((p) => PILLAR_PHASE_MAPPING[p]);
    const outScopePhases = outScope.flatMap((p) => PILLAR_PHASE_MAPPING[p]);

    expect(inScopePhases.length).toBeGreaterThan(0);
    expect(outScopePhases.length).toBeGreaterThan(0);

    // Ensure no overlap in phase names between our in-scope and some out-scope pillars
    const inNames = new Set(inScopePhases.map((p) => p.name));
    const devopsNames = PILLAR_PHASE_MAPPING.devops.map((p) => p.name);
    for (const name of devopsNames) {
      expect(inNames.has(name)).toBe(false);
    }
  });
});

// =============================================================================
// Constraint Categories
// =============================================================================

describe("Constraint categories", () => {
  it("has 6 categories", () => {
    expect(Object.keys(CONSTRAINT_CATEGORY_LABELS).length).toBe(6);
  });

  it("each category has label, description, and examples", () => {
    for (const cat of Object.values(CONSTRAINT_CATEGORY_LABELS)) {
      expect(cat.label).toBeTruthy();
      expect(cat.description).toBeTruthy();
      expect(cat.examples.length).toBeGreaterThan(0);
    }
  });

  it("constraint templates exist for state_agency", () => {
    expect(CONSTRAINT_TEMPLATES.state_agency.length).toBeGreaterThan(0);
  });

  it("constraint templates have valid categories", () => {
    const validCats = Object.keys(CONSTRAINT_CATEGORY_LABELS);
    for (const [, templates] of Object.entries(CONSTRAINT_TEMPLATES)) {
      for (const t of templates) {
        expect(validCats).toContain(t.category);
        expect(["hard", "soft"]).toContain(t.severity);
      }
    }
  });

  it("private companies have no pre-seeded constraints", () => {
    expect(CONSTRAINT_TEMPLATES.private.length).toBe(0);
  });
});

// =============================================================================
// Use Case Quadrants
// =============================================================================

describe("Use case quadrant computation", () => {
  it("high impact + low effort = quick_win", () => {
    expect(computeQuadrant(4, 2)).toBe("quick_win");
    expect(computeQuadrant(5, 1)).toBe("quick_win");
    expect(computeQuadrant(3, 3)).toBe("quick_win");
  });

  it("high impact + high effort = strategic_bet", () => {
    expect(computeQuadrant(4, 4)).toBe("strategic_bet");
    expect(computeQuadrant(5, 5)).toBe("strategic_bet");
    expect(computeQuadrant(3, 4)).toBe("strategic_bet");
  });

  it("low impact + low effort = fill_in", () => {
    expect(computeQuadrant(2, 2)).toBe("fill_in");
    expect(computeQuadrant(1, 1)).toBe("fill_in");
    expect(computeQuadrant(2, 3)).toBe("fill_in");
  });

  it("low impact + high effort = avoid", () => {
    expect(computeQuadrant(2, 4)).toBe("avoid");
    expect(computeQuadrant(1, 5)).toBe("avoid");
  });

  it("boundary: impact=3, effort=3 = quick_win (inclusive)", () => {
    expect(computeQuadrant(3, 3)).toBe("quick_win");
  });

  it("all 4 quadrants have labels", () => {
    expect(Object.keys(USE_CASE_QUADRANT_LABELS).length).toBe(4);
    for (const q of Object.values(USE_CASE_QUADRANT_LABELS)) {
      expect(q.label).toBeTruthy();
      expect(q.color).toBeTruthy();
    }
  });
});

// =============================================================================
// Investment Tiers
// =============================================================================

describe("Investment tier computation", () => {
  it("0-3 months = tier1", () => {
    expect(computeInvestmentTier(1)).toBe("tier1");
    expect(computeInvestmentTier(3)).toBe("tier1");
  });

  it("4-6 months = tier2", () => {
    expect(computeInvestmentTier(4)).toBe("tier2");
    expect(computeInvestmentTier(6)).toBe("tier2");
  });

  it("7-12 months = tier3", () => {
    expect(computeInvestmentTier(7)).toBe("tier3");
    expect(computeInvestmentTier(12)).toBe("tier3");
  });

  it("13+ months = tier4", () => {
    expect(computeInvestmentTier(13)).toBe("tier4");
    expect(computeInvestmentTier(24)).toBe("tier4");
  });

  it("all 4 tiers have labels", () => {
    expect(Object.keys(INVESTMENT_TIER_LABELS).length).toBe(4);
  });
});

// =============================================================================
// Risk Register
// =============================================================================

describe("Risk score computation", () => {
  it("computes likelihood x impact", () => {
    expect(computeRiskScore(4, 5)).toBe(20);
    expect(computeRiskScore(1, 1)).toBe(1);
    expect(computeRiskScore(3, 3)).toBe(9);
  });

  it("red for score >= 15", () => {
    expect(getRiskColor(15)).toBe("red");
    expect(getRiskColor(25)).toBe("red");
  });

  it("amber for score 8-14", () => {
    expect(getRiskColor(8)).toBe("amber");
    expect(getRiskColor(14)).toBe("amber");
  });

  it("green for score < 8", () => {
    expect(getRiskColor(7)).toBe("green");
    expect(getRiskColor(1)).toBe("green");
  });

  it("risk templates exist for all entity types with constraints", () => {
    for (const [type, templates] of Object.entries(RISK_TEMPLATES)) {
      if (type === "private") {
        // Private still has generic risks
        expect(templates.length).toBeGreaterThan(0);
      }
      for (const t of templates) {
        expect(t.description).toBeTruthy();
        expect(Object.keys(RISK_CATEGORY_LABELS)).toContain(t.category);
        expect(t.likelihood).toBeGreaterThanOrEqual(1);
        expect(t.likelihood).toBeLessThanOrEqual(5);
        expect(t.impact).toBeGreaterThanOrEqual(1);
        expect(t.impact).toBeLessThanOrEqual(5);
      }
    }
  });
});

// =============================================================================
// Data Readiness
// =============================================================================

describe("Data readiness dimensions", () => {
  it("has 5 dimensions", () => {
    expect(DATA_READINESS_DIMENSIONS.length).toBe(5);
  });

  it("each dimension has key, label, and rubrics", () => {
    for (const dim of DATA_READINESS_DIMENSIONS) {
      expect(dim.key).toBeTruthy();
      expect(dim.label).toBeTruthy();
      expect(dim.rubric_low).toBeTruthy();
      expect(dim.rubric_high).toBeTruthy();
    }
  });

  it("overall score is average of dimensions", () => {
    const scores = { data_quality: 4, data_accessibility: 3, data_governance: 2, data_pipelines: 5, data_security: 1 };
    const values = Object.values(scores);
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    expect(avg).toBe(3);
  });

  it("score below 2 is a blocker", () => {
    const isBlocker = (score: number) => score < 2.0;
    expect(isBlocker(1.5)).toBe(true);
    expect(isBlocker(2.0)).toBe(false);
    expect(isBlocker(3.0)).toBe(false);
  });
});

// =============================================================================
// Enhancement Catalog Coverage
// =============================================================================

describe("Enhancement coverage computation", () => {
  function computeCoverage(
    statuses: { pillar: string; status: string }[],
    inScopePillars: string[]
  ): { total: number; evaluated: number; pct: number } {
    const applicable = statuses.filter((s) => inScopePillars.includes(s.pillar));
    const evaluated = applicable.filter((s) => s.status !== "not_evaluated");
    const pct = applicable.length > 0 ? Math.round((evaluated.length / applicable.length) * 100) : 0;
    return { total: applicable.length, evaluated: evaluated.length, pct };
  }

  it("100% when all evaluated", () => {
    const statuses = [
      { pillar: "development", status: "in_use" },
      { pillar: "development", status: "opportunity" },
      { pillar: "testing", status: "blocked" },
    ];
    const result = computeCoverage(statuses, ["development", "testing"]);
    expect(result.pct).toBe(100);
  });

  it("0% when none evaluated", () => {
    const statuses = [
      { pillar: "development", status: "not_evaluated" },
      { pillar: "development", status: "not_evaluated" },
    ];
    const result = computeCoverage(statuses, ["development"]);
    expect(result.pct).toBe(0);
  });

  it("excludes out-of-scope pillars", () => {
    const statuses = [
      { pillar: "development", status: "in_use" },
      { pillar: "devops", status: "not_evaluated" },
    ];
    const result = computeCoverage(statuses, ["development"]);
    expect(result.total).toBe(1);
    expect(result.evaluated).toBe(1);
    expect(result.pct).toBe(100);
  });

  it("partial coverage computed correctly", () => {
    const statuses = [
      { pillar: "development", status: "in_use" },
      { pillar: "development", status: "not_evaluated" },
      { pillar: "development", status: "opportunity" },
      { pillar: "development", status: "not_evaluated" },
    ];
    const result = computeCoverage(statuses, ["development"]);
    expect(result.total).toBe(4);
    expect(result.evaluated).toBe(2);
    expect(result.pct).toBe(50);
  });

  it("handles empty input", () => {
    const result = computeCoverage([], ["development"]);
    expect(result.total).toBe(0);
    expect(result.pct).toBe(0);
  });
});

// =============================================================================
// Enhancement Status Labels
// =============================================================================

describe("Enhancement status labels", () => {
  it("has 5 statuses", () => {
    expect(Object.keys(ENHANCEMENT_STATUS_LABELS).length).toBe(5);
  });

  it("each status has label, color, and description", () => {
    for (const s of Object.values(ENHANCEMENT_STATUS_LABELS)) {
      expect(s.label).toBeTruthy();
      expect(s.color).toBeTruthy();
      expect(s.description).toBeTruthy();
    }
  });
});

// =============================================================================
// Conditional Report Sections
// =============================================================================

describe("Conditional report section logic", () => {
  function shouldShowSection(sectionPillar: string | null, inScopePillars: string[], hasData: boolean): boolean {
    if (sectionPillar && !inScopePillars.includes(sectionPillar)) return false;
    return hasData;
  }

  it("shows section when in scope and has data", () => {
    expect(shouldShowSection("data", ["data", "development"], true)).toBe(true);
  });

  it("hides section when out of scope", () => {
    expect(shouldShowSection("data", ["development"], true)).toBe(false);
  });

  it("hides section when no data", () => {
    expect(shouldShowSection("data", ["data"], false)).toBe(false);
  });

  it("shows non-pillar section when has data", () => {
    expect(shouldShowSection(null, ["development"], true)).toBe(true);
  });

  it("hides non-pillar section when no data", () => {
    expect(shouldShowSection(null, ["development"], false)).toBe(false);
  });
});

// =============================================================================
// Pilot Blocker Check
// =============================================================================

describe("Pilot blocker check", () => {
  interface Blocker { capability: string; avg_score: number }

  function checkPilotBlockers(
    pilotRequirements: string[],
    blockers: Blocker[]
  ): { hasBlockers: boolean; blockerDetails: Blocker[] } {
    const matching = blockers.filter((b) =>
      pilotRequirements.some((r) => b.capability.includes(r) || r.includes(b.capability))
    );
    return { hasBlockers: matching.length > 0, blockerDetails: matching };
  }

  it("warns when pilot depends on a blocker", () => {
    const blockers = [{ capability: "version_control_maturity", avg_score: 2.1 }];
    const result = checkPilotBlockers(["version_control"], blockers);
    expect(result.hasBlockers).toBe(true);
  });

  it("no warning when no blockers match", () => {
    const blockers = [{ capability: "platform_engineering", avg_score: 1.5 }];
    const result = checkPilotBlockers(["version_control"], blockers);
    expect(result.hasBlockers).toBe(false);
  });

  it("no warning when no blockers exist", () => {
    const result = checkPilotBlockers(["version_control"], []);
    expect(result.hasBlockers).toBe(false);
  });
});
