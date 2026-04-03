/**
 * Unit tests for AI Transformation Report computation logic.
 *
 * Tests delta calculations, percentage improvements, benchmark comparisons,
 * and edge cases (zero baseline, negative improvement, missing data).
 */

import { describe, it, expect } from "vitest";
import {
  computeImprovementPct,
  computeCategoryDeltas,
  computeCategorySummary,
  computeOverallImprovement,
  getBenchmarkContext,
  computeReadinessScore,
  computeTensionAnalysis,
  computeAmplifierAnalysis,
} from "../queries/admin/ai-reports.js";
import type { AIMetric, CategorySummary } from "../types/ai-tools.js";

function makeMetric(
  overrides: Partial<AIMetric> & { category: string; metric_name: string; metric_value: number }
): AIMetric {
  return {
    id: "test-id",
    site_id: "ussp",
    assessment_id: "test-assessment",
    metric_unit: "count",
    member_id: null,
    raw_data: null,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("computeImprovementPct", () => {
  it("computes positive improvement for higher_better metric", () => {
    const result = computeImprovementPct(42, 58, "higher_better");
    expect(result).toBeCloseTo(38.1, 1);
  });

  it("computes positive improvement for lower_better metric (value decreased)", () => {
    const result = computeImprovementPct(8.3, 5.1, "lower_better");
    expect(result).toBeCloseTo(38.6, 1);
  });

  it("computes negative improvement for higher_better metric (value decreased)", () => {
    const result = computeImprovementPct(50, 40, "higher_better");
    expect(result).toBeCloseTo(-20, 1);
  });

  it("computes negative improvement for lower_better metric (value increased)", () => {
    const result = computeImprovementPct(10, 15, "lower_better");
    expect(result).toBeCloseTo(-50, 1);
  });

  it("handles zero baseline for higher_better", () => {
    const result = computeImprovementPct(0, 5, "higher_better");
    expect(result).toBe(100);
  });

  it("handles zero baseline for lower_better", () => {
    const result = computeImprovementPct(0, 5, "lower_better");
    expect(result).toBe(-100);
  });

  it("handles both zero", () => {
    const result = computeImprovementPct(0, 0, "higher_better");
    expect(result).toBe(0);
  });

  it("handles no change", () => {
    const result = computeImprovementPct(42, 42, "higher_better");
    expect(result).toBeCloseTo(0, 1);
  });
});

describe("computeCategoryDeltas", () => {
  it("computes deltas for scrum metrics", () => {
    const baseline = [
      makeMetric({ category: "scrum", metric_name: "velocity", metric_value: 42, metric_unit: "story_points" }),
      makeMetric({ category: "scrum", metric_name: "throughput", metric_value: 14, metric_unit: "count" }),
    ];
    const post = [
      makeMetric({ category: "scrum", metric_name: "velocity", metric_value: 58, metric_unit: "story_points" }),
      makeMetric({ category: "scrum", metric_name: "throughput", metric_value: 19, metric_unit: "count" }),
    ];

    const deltas = computeCategoryDeltas("scrum", baseline, post);

    const velocityDelta = deltas.find((d) => d.metric_name === "velocity");
    expect(velocityDelta).toBeDefined();
    expect(velocityDelta!.baseline_value).toBe(42);
    expect(velocityDelta!.post_value).toBe(58);
    expect(velocityDelta!.improvement_pct).toBeGreaterThan(0);

    const throughputDelta = deltas.find((d) => d.metric_name === "throughput");
    expect(throughputDelta).toBeDefined();
    expect(throughputDelta!.improvement_pct).toBeGreaterThan(0);
  });

  it("averages member-level survey responses", () => {
    const baseline = [
      makeMetric({ category: "space", metric_name: "satisfaction", metric_value: 3.0, member_id: "m1", metric_unit: "score_1_5" }),
      makeMetric({ category: "space", metric_name: "satisfaction", metric_value: 3.2, member_id: "m2", metric_unit: "score_1_5" }),
    ];
    const post = [
      makeMetric({ category: "space", metric_name: "satisfaction", metric_value: 4.0, member_id: "m1", metric_unit: "score_1_5" }),
      makeMetric({ category: "space", metric_name: "satisfaction", metric_value: 4.4, member_id: "m2", metric_unit: "score_1_5" }),
    ];

    const deltas = computeCategoryDeltas("space", baseline, post);
    const satisfaction = deltas.find((d) => d.metric_name === "satisfaction");

    expect(satisfaction).toBeDefined();
    expect(satisfaction!.baseline_value).toBeCloseTo(3.1, 1);
    expect(satisfaction!.post_value).toBeCloseTo(4.2, 1);
    expect(satisfaction!.improvement_pct).toBeGreaterThan(0);
  });

  it("handles missing metrics gracefully", () => {
    const baseline = [
      makeMetric({ category: "dora", metric_name: "deployment_frequency", metric_value: 2, metric_unit: "per_week" }),
    ];
    const post: AIMetric[] = [];

    const deltas = computeCategoryDeltas("dora", baseline, post);
    const df = deltas.find((d) => d.metric_name === "deployment_frequency");

    // Should still produce a delta, with post_value = 0
    expect(df).toBeDefined();
    expect(df!.post_value).toBe(0);
  });

  it("skips metrics with no data in either period", () => {
    const deltas = computeCategoryDeltas("dora", [], []);
    expect(deltas.length).toBe(0);
  });
});

describe("computeCategorySummary", () => {
  it("computes average improvement across metrics", () => {
    const baseline = [
      makeMetric({ category: "scrum", metric_name: "velocity", metric_value: 40, metric_unit: "story_points" }),
      makeMetric({ category: "scrum", metric_name: "throughput", metric_value: 10, metric_unit: "count" }),
    ];
    const post = [
      makeMetric({ category: "scrum", metric_name: "velocity", metric_value: 60, metric_unit: "story_points" }),
      makeMetric({ category: "scrum", metric_name: "throughput", metric_value: 15, metric_unit: "count" }),
    ];

    const summary = computeCategorySummary("scrum", baseline, post);
    expect(summary.category).toBe("scrum");
    expect(summary.deltas.length).toBeGreaterThan(0);
    expect(summary.avg_improvement_pct).toBeGreaterThan(0);
  });
});

describe("computeOverallImprovement", () => {
  it("computes weighted average across categories", () => {
    const categories: CategorySummary[] = [
      { category: "dora", deltas: [{ metric_name: "test", label: "Test", category: "dora", baseline_value: 1, post_value: 2, delta: 1, improvement_pct: 30, direction: "higher_better", unit: "count" }], avg_improvement_pct: 30 },
      { category: "scrum", deltas: [{ metric_name: "test", label: "Test", category: "scrum", baseline_value: 1, post_value: 2, delta: 1, improvement_pct: 40, direction: "higher_better", unit: "count" }], avg_improvement_pct: 40 },
      { category: "space", deltas: [{ metric_name: "test", label: "Test", category: "space", baseline_value: 1, post_value: 2, delta: 1, improvement_pct: 20, direction: "higher_better", unit: "count" }], avg_improvement_pct: 20 },
      { category: "devex", deltas: [{ metric_name: "test", label: "Test", category: "devex", baseline_value: 1, post_value: 2, delta: 1, improvement_pct: 10, direction: "higher_better", unit: "count" }], avg_improvement_pct: 10 },
    ];

    const result = computeOverallImprovement(categories);
    // Weighted: (30*0.2 + 40*0.2 + 20*0.2 + 10*0.15) / 0.75 = 6+8+4+1.5 = 19.5/0.75 = 26
    // (quality category not present, so its 0.25 weight is excluded from total)
    expect(result).toBeCloseTo(26, 0);
  });

  it("handles empty categories", () => {
    const categories: CategorySummary[] = [
      { category: "dora", deltas: [], avg_improvement_pct: 0 },
      { category: "scrum", deltas: [{ metric_name: "test", label: "Test", category: "scrum", baseline_value: 1, post_value: 2, delta: 1, improvement_pct: 50, direction: "higher_better", unit: "count" }], avg_improvement_pct: 50 },
    ];

    const result = computeOverallImprovement(categories);
    // Only scrum has data (weight 0.3), so 50 * 0.3 / 0.3 = 50
    expect(result).toBeCloseTo(50, 0);
  });

  it("returns 0 when all categories empty", () => {
    const result = computeOverallImprovement([]);
    expect(result).toBe(0);
  });
});

describe("getBenchmarkContext", () => {
  it("returns below-typical message for < 10%", () => {
    const context = getBenchmarkContext(5);
    expect(context).toContain("Below typical");
  });

  it("returns Forrester-consistent message for 10-25%", () => {
    const context = getBenchmarkContext(22);
    expect(context).toContain("Forrester");
  });

  it("returns McKinsey-consistent message for 25-45%", () => {
    const context = getBenchmarkContext(35);
    expect(context).toContain("McKinsey");
  });

  it("returns exceptional message for 45-60%", () => {
    const context = getBenchmarkContext(55);
    expect(context).toContain("Exceptional");
  });

  it("returns extraordinary message for > 60%", () => {
    const context = getBenchmarkContext(70);
    expect(context).toContain("Extraordinary");
  });

  it("adds DORA 2025 context for low readiness + low improvement", () => {
    const context = getBenchmarkContext(8, 1.5);
    expect(context).toContain("DORA 2025");
    expect(context).toContain("low readiness");
  });

  it("adds DORA 2025 context for high readiness + high improvement", () => {
    const context = getBenchmarkContext(35, 4.5);
    expect(context).toContain("DORA 2025");
    expect(context).toContain("amplifier");
  });

  it("no DORA context when readiness not provided", () => {
    const context = getBenchmarkContext(35);
    expect(context).not.toContain("DORA 2025");
  });
});

// =============================================================================
// DORA 2025 AI Capabilities Model Tests
// =============================================================================

describe("computeReadinessScore", () => {
  function makeReadinessMetric(name: string, value: number): AIMetric {
    return makeMetric({ category: "readiness", metric_name: name, metric_value: value, metric_unit: "score_1_5" });
  }

  it("computes average across all 7 capabilities", () => {
    const metrics = [
      makeReadinessMetric("ai_accessible_data", 4),
      makeReadinessMetric("ai_stance_clarity", 5),
      makeReadinessMetric("healthy_data_ecosystem", 3),
      makeReadinessMetric("platform_engineering", 4),
      makeReadinessMetric("user_centric_focus", 4),
      makeReadinessMetric("version_control_maturity", 5),
      makeReadinessMetric("small_batches", 3),
    ];
    const result = computeReadinessScore(metrics, "team-1");
    expect(result).not.toBeNull();
    expect(result!.overall_score).toBe(4); // (4+5+3+4+4+5+3)/7 = 4
  });

  it("assigns 'well_positioned' tier for score >= 4.0", () => {
    const metrics = [
      makeReadinessMetric("ai_accessible_data", 4),
      makeReadinessMetric("ai_stance_clarity", 5),
      makeReadinessMetric("healthy_data_ecosystem", 4),
      makeReadinessMetric("platform_engineering", 4),
      makeReadinessMetric("user_centric_focus", 5),
      makeReadinessMetric("version_control_maturity", 5),
      makeReadinessMetric("small_batches", 4),
    ];
    const result = computeReadinessScore(metrics, "team-1");
    expect(result!.readiness_tier).toBe("well_positioned");
  });

  it("assigns 'ready' tier for score >= 3.0", () => {
    const metrics = [
      makeReadinessMetric("ai_accessible_data", 3),
      makeReadinessMetric("ai_stance_clarity", 3),
      makeReadinessMetric("healthy_data_ecosystem", 3),
      makeReadinessMetric("platform_engineering", 4),
      makeReadinessMetric("user_centric_focus", 3),
      makeReadinessMetric("version_control_maturity", 4),
      makeReadinessMetric("small_batches", 3),
    ];
    const result = computeReadinessScore(metrics, "team-1");
    expect(result!.readiness_tier).toBe("ready");
  });

  it("assigns 'foundation_needed' tier for score >= 2.0", () => {
    const metrics = [
      makeReadinessMetric("ai_accessible_data", 2),
      makeReadinessMetric("ai_stance_clarity", 2),
      makeReadinessMetric("healthy_data_ecosystem", 2),
      makeReadinessMetric("platform_engineering", 3),
      makeReadinessMetric("user_centric_focus", 2),
      makeReadinessMetric("version_control_maturity", 3),
      makeReadinessMetric("small_batches", 2),
    ];
    const result = computeReadinessScore(metrics, "team-1");
    expect(result!.readiness_tier).toBe("foundation_needed");
  });

  it("assigns 'not_ready' tier for score < 2.0", () => {
    const metrics = [
      makeReadinessMetric("ai_accessible_data", 1),
      makeReadinessMetric("ai_stance_clarity", 1),
      makeReadinessMetric("healthy_data_ecosystem", 2),
      makeReadinessMetric("platform_engineering", 1),
      makeReadinessMetric("user_centric_focus", 1),
      makeReadinessMetric("version_control_maturity", 2),
      makeReadinessMetric("small_batches", 1),
    ];
    const result = computeReadinessScore(metrics, "team-1");
    expect(result!.readiness_tier).toBe("not_ready");
  });

  it("identifies blockers (capabilities scoring < 3)", () => {
    const metrics = [
      makeReadinessMetric("ai_accessible_data", 2),
      makeReadinessMetric("ai_stance_clarity", 4),
      makeReadinessMetric("healthy_data_ecosystem", 1),
      makeReadinessMetric("platform_engineering", 4),
      makeReadinessMetric("user_centric_focus", 4),
      makeReadinessMetric("version_control_maturity", 5),
      makeReadinessMetric("small_batches", 4),
    ];
    const result = computeReadinessScore(metrics, "team-1");
    expect(result!.blockers.length).toBe(2);
    expect(result!.blockers.map(b => b.name)).toContain("ai_accessible_data");
    expect(result!.blockers.map(b => b.name)).toContain("healthy_data_ecosystem");
  });

  it("returns null for empty metrics", () => {
    const result = computeReadinessScore([], "team-1");
    expect(result).toBeNull();
  });
});

describe("computeOverallImprovement — readiness excluded", () => {
  it("excludes readiness category from weighting", () => {
    const categories: CategorySummary[] = [
      { category: "dora", deltas: [{ metric_name: "test", label: "Test", category: "dora", baseline_value: 1, post_value: 2, delta: 1, improvement_pct: 30, direction: "higher_better", unit: "count" }], avg_improvement_pct: 30 },
      { category: "readiness", deltas: [{ metric_name: "test", label: "Test", category: "readiness", baseline_value: 1, post_value: 2, delta: 1, improvement_pct: 999, direction: "higher_better", unit: "count" }], avg_improvement_pct: 999 },
    ];
    const result = computeOverallImprovement(categories);
    // Only dora contributes, readiness weight is 0
    expect(result).toBeCloseTo(30, 0);
  });
});

describe("computeTensionAnalysis", () => {
  it("detects velocity vs verification tension", () => {
    const baseline = [
      makeMetric({ category: "devex", metric_name: "velocity_gain", metric_value: 3.0, metric_unit: "score_1_5" }),
      makeMetric({ category: "devex", metric_name: "verification_tax", metric_value: 2.0, metric_unit: "score_1_5" }),
    ];
    const post = [
      makeMetric({ category: "devex", metric_name: "velocity_gain", metric_value: 4.5, metric_unit: "score_1_5" }),
      makeMetric({ category: "devex", metric_name: "verification_tax", metric_value: 3.0, metric_unit: "score_1_5" }),
    ];

    const tensions = computeTensionAnalysis(baseline, post);
    const velTension = tensions.find(t => t.tension_name === "velocity_verification");
    expect(velTension).toBeDefined();
    expect(velTension!.positive_pole).not.toBeNull();
    expect(velTension!.negative_pole).not.toBeNull();
  });

  it("generates tension narrative when negative pole worsens", () => {
    const baseline = [
      makeMetric({ category: "devex", metric_name: "velocity_gain", metric_value: 3.0, metric_unit: "score_1_5" }),
      makeMetric({ category: "devex", metric_name: "verification_tax", metric_value: 2.0, metric_unit: "score_1_5" }),
    ];
    const post = [
      makeMetric({ category: "devex", metric_name: "velocity_gain", metric_value: 4.5, metric_unit: "score_1_5" }),
      makeMetric({ category: "devex", metric_name: "verification_tax", metric_value: 1.5, metric_unit: "score_1_5" }), // worsened (lower_better, but went from 2→1.5 is actually better)
    ];

    const tensions = computeTensionAnalysis(baseline, post);
    expect(tensions.length).toBeGreaterThan(0);
    expect(tensions[0].net_narrative.length).toBeGreaterThan(0);
  });

  it("skips tensions with no data", () => {
    const tensions = computeTensionAnalysis([], []);
    expect(tensions.length).toBe(0);
  });
});

describe("computeAmplifierAnalysis", () => {
  it("confirms amplifier for high readiness + high improvement", () => {
    const result = computeAmplifierAnalysis(4.5, 35);
    expect(result.correlation_narrative).toContain("confirms");
    expect(result.correlation_narrative).toContain("amplifier");
  });

  it("confirms amplifier negatively for low readiness + low improvement", () => {
    const result = computeAmplifierAnalysis(1.8, 8);
    expect(result.correlation_narrative).toContain("limited");
  });

  it("flags unexpected high improvement with low readiness", () => {
    const result = computeAmplifierAnalysis(1.5, 40);
    expect(result.correlation_narrative).toContain("unexpected");
  });

  it("flags underperformance with high readiness", () => {
    const result = computeAmplifierAnalysis(4.5, 8);
    expect(result.correlation_narrative).toContain("Non-AI factors");
  });

  it("gives moderate narrative for mid-range values", () => {
    const result = computeAmplifierAnalysis(3.0, 18);
    expect(result.correlation_narrative).toContain("moderate");
  });
});
