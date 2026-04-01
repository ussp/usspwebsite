import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import {
  METRIC_CATALOG,
  RESEARCH_BENCHMARKS,
  READINESS_TIER_THRESHOLDS,
} from "../../types/ai-tools.js";
import type {
  AIMetric,
  MetricCategory,
  MetricDelta,
  CategorySummary,
  TransformationReport,
  ReadinessCapability,
  ReadinessAssessmentResult,
  ReadinessTier,
  AmplifierAnalysis,
  TensionAnalysis,
} from "../../types/ai-tools.js";

// =============================================================================
// Core Computation (pure functions, no DB)
// =============================================================================

/**
 * Compute the improvement percentage between a baseline and post value.
 * Handles direction (higher_better vs lower_better).
 */
export function computeImprovementPct(
  baseline: number,
  post: number,
  direction: "higher_better" | "lower_better"
): number {
  if (baseline === 0) {
    if (post === 0) return 0;
    return direction === "higher_better" ? 100 : -100;
  }

  if (direction === "higher_better") {
    return ((post - baseline) / Math.abs(baseline)) * 100;
  } else {
    return ((baseline - post) / Math.abs(baseline)) * 100;
  }
}

/**
 * Compute deltas for a single metric category by comparing baseline and post metrics.
 * For member-level metrics (surveys), averages across all respondents first.
 */
export function computeCategoryDeltas(
  category: MetricCategory,
  baselineMetrics: AIMetric[],
  postMetrics: AIMetric[]
): MetricDelta[] {
  const definitions = METRIC_CATALOG.filter((m) => m.category === category);
  const deltas: MetricDelta[] = [];

  for (const def of definitions) {
    const baselineForMetric = baselineMetrics.filter(
      (m) => m.category === category && m.metric_name === def.name
    );
    const postForMetric = postMetrics.filter(
      (m) => m.category === category && m.metric_name === def.name
    );

    if (baselineForMetric.length === 0 && postForMetric.length === 0) continue;

    const baselineAvg =
      baselineForMetric.length > 0
        ? baselineForMetric.reduce((sum, m) => sum + Number(m.metric_value), 0) / baselineForMetric.length
        : 0;
    const postAvg =
      postForMetric.length > 0
        ? postForMetric.reduce((sum, m) => sum + Number(m.metric_value), 0) / postForMetric.length
        : 0;

    const improvementPct = computeImprovementPct(baselineAvg, postAvg, def.direction);

    deltas.push({
      metric_name: def.name,
      label: def.label,
      category,
      baseline_value: Math.round(baselineAvg * 100) / 100,
      post_value: Math.round(postAvg * 100) / 100,
      delta: Math.round((postAvg - baselineAvg) * 100) / 100,
      improvement_pct: Math.round(improvementPct * 10) / 10,
      direction: def.direction,
      unit: def.unit,
    });
  }

  return deltas;
}

/**
 * Compute a category summary with average improvement.
 */
export function computeCategorySummary(
  category: MetricCategory,
  baselineMetrics: AIMetric[],
  postMetrics: AIMetric[]
): CategorySummary {
  const deltas = computeCategoryDeltas(category, baselineMetrics, postMetrics);
  const avgImprovement =
    deltas.length > 0
      ? deltas.reduce((sum, d) => sum + d.improvement_pct, 0) / deltas.length
      : 0;

  return {
    category,
    deltas,
    avg_improvement_pct: Math.round(avgImprovement * 10) / 10,
  };
}

/**
 * Compute overall improvement as a weighted average across categories.
 * Weights: DORA 30%, Scrum 30%, SPACE 25%, DevEx 15%. Readiness excluded (separate module).
 */
export function computeOverallImprovement(categories: CategorySummary[]): number {
  const weights: Record<MetricCategory, number> = {
    dora: 0.3,
    scrum: 0.3,
    space: 0.25,
    devex: 0.15,
    readiness: 0, // readiness is a precondition, not an improvement metric
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const cat of categories) {
    if (cat.deltas.length === 0) continue;
    const weight = weights[cat.category] || 0;
    if (weight === 0) continue;
    weightedSum += cat.avg_improvement_pct * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}

/**
 * Generate benchmark context string based on overall improvement percentage.
 */
export function getBenchmarkContext(overallPct: number, readinessScore?: number): string {
  let context = "";

  if (overallPct < 10) {
    context = "Below typical AI training impact. Consider extending the training period or increasing tool adoption.";
  } else if (overallPct < 25) {
    context = "Consistent with conservative estimates (Forrester TEI: 22% improvement). Solid foundation for continued AI adoption.";
  } else if (overallPct < 45) {
    context = "Consistent with McKinsey (20-45%) and Harvard/BCG (25% faster, 40% higher quality) research findings. Strong AI transformation result.";
  } else if (overallPct < 60) {
    context = "Exceptional result, approaching GitHub Copilot individual task benchmark (55.8%). May include novelty effect — recommend re-measuring in 3 months.";
  } else {
    context = "Extraordinary result (>60%). Likely includes novelty/engagement boost. Recommend sustained measurement over 6+ months to confirm lasting impact.";
  }

  // Add DORA 2025 amplifier context if readiness data available
  if (readinessScore !== undefined) {
    if (readinessScore < 2.0 && overallPct < 15) {
      context += " Per DORA 2025: low readiness score (" + readinessScore.toFixed(1) + "/5) likely limited AI impact — address foundational capabilities first.";
    } else if (readinessScore >= 4.0 && overallPct >= 25) {
      context += " Per DORA 2025: strong readiness (" + readinessScore.toFixed(1) + "/5) amplified AI training impact, confirming the amplifier model.";
    }
  }

  return context;
}

// =============================================================================
// AI Readiness Assessment (DORA 2025 AI Capabilities Model)
// =============================================================================

const READINESS_METRICS = METRIC_CATALOG.filter((m) => m.category === "readiness");

/**
 * Compute readiness score from the 7 DORA AI capability metrics.
 */
export function computeReadinessScore(
  readinessMetrics: AIMetric[],
  teamId: string
): ReadinessAssessmentResult | null {
  if (readinessMetrics.length === 0) return null;

  const capabilities: ReadinessCapability[] = [];

  for (const def of READINESS_METRICS) {
    const metric = readinessMetrics.find((m) => m.metric_name === def.name);
    capabilities.push({
      name: def.name,
      label: def.label,
      score: metric ? Number(metric.metric_value) : 0,
      description: def.description,
    });
  }

  const scoredCapabilities = capabilities.filter((c) => c.score > 0);
  const overallScore = scoredCapabilities.length > 0
    ? scoredCapabilities.reduce((sum, c) => sum + c.score, 0) / scoredCapabilities.length
    : 0;

  const roundedScore = Math.round(overallScore * 10) / 10;

  // Determine tier (thresholds are sorted descending by min)
  let tier: ReadinessTier = "not_ready";
  let tierLabel = "Not Ready";
  let tierDescription = "";
  for (const t of READINESS_TIER_THRESHOLDS) {
    if (roundedScore >= t.min) {
      tier = t.tier;
      tierLabel = t.label;
      tierDescription = t.description;
      break;
    }
  }

  const blockers = capabilities.filter((c) => c.score > 0 && c.score < 3);

  return {
    team_id: teamId,
    capabilities,
    overall_score: roundedScore,
    readiness_tier: tier,
    tier_label: tierLabel,
    tier_description: tierDescription,
    blockers,
    computed_at: new Date().toISOString(),
  };
}

// =============================================================================
// Three AI Tensions (DORA 2025)
// =============================================================================

const TENSION_PAIRS: { name: string; label: string; positive: string; negative: string }[] = [
  { name: "velocity_verification", label: "Velocity vs Verification", positive: "velocity_gain", negative: "verification_tax" },
  { name: "expertise_paradox", label: "Expertise Paradox", positive: "entry_barrier_reduction", negative: "expertise_depth_risk" },
  { name: "workflow_gap", label: "Workflow Gap", positive: "prototyping_speed", negative: "last_mile_friction" },
];

/**
 * Compute tension analysis from DevEx survey data.
 * Each tension has a positive pole (benefit) and negative pole (cost).
 */
export function computeTensionAnalysis(
  baselineMetrics: AIMetric[],
  postMetrics: AIMetric[]
): TensionAnalysis[] {
  const tensions: TensionAnalysis[] = [];

  for (const pair of TENSION_PAIRS) {
    // Compute deltas for each pole
    const allDeltas = computeCategoryDeltas("devex", baselineMetrics, postMetrics);
    const positiveDelta = allDeltas.find((d) => d.metric_name === pair.positive) || null;
    const negativeDelta = allDeltas.find((d) => d.metric_name === pair.negative) || null;

    if (!positiveDelta && !negativeDelta) continue;

    // Generate narrative
    let narrative = "";
    const posImprove = positiveDelta?.improvement_pct ?? 0;
    const negImprove = negativeDelta?.improvement_pct ?? 0;

    if (posImprove > 0 && negImprove > 0) {
      narrative = `Both poles improved: ${pair.positive.replace(/_/g, " ")} gained ${posImprove.toFixed(1)}% and ${pair.negative.replace(/_/g, " ")} reduced by ${negImprove.toFixed(1)}%. Net positive outcome.`;
    } else if (posImprove > 0 && negImprove <= 0) {
      narrative = `Tension detected: ${pair.positive.replace(/_/g, " ")} improved ${posImprove.toFixed(1)}% but ${pair.negative.replace(/_/g, " ")} worsened by ${Math.abs(negImprove).toFixed(1)}%. Monitor the tradeoff.`;
    } else if (posImprove <= 0 && negImprove > 0) {
      narrative = `Unexpected: negative pole improved but positive pole didn't. Investigate whether AI tools are being adopted effectively.`;
    } else {
      narrative = `Both poles showed no improvement or regression. AI training may not have addressed this dimension.`;
    }

    tensions.push({
      tension_name: pair.name,
      label: pair.label,
      positive_pole: positiveDelta,
      negative_pole: negativeDelta,
      net_narrative: narrative,
    });
  }

  return tensions;
}

// =============================================================================
// Amplifier Analysis (DORA 2025)
// =============================================================================

/**
 * Correlate readiness score with improvement outcome.
 * DORA 2025: "AI amplifies existing strengths and weaknesses."
 */
export function computeAmplifierAnalysis(
  readinessScore: number,
  improvementPct: number
): AmplifierAnalysis {
  let narrative = "";

  if (readinessScore >= 4.0 && improvementPct >= 25) {
    narrative = `High readiness (${readinessScore.toFixed(1)}/5) + strong improvement (+${improvementPct.toFixed(1)}%) confirms the DORA amplifier model: strong foundations amplified AI training impact.`;
  } else if (readinessScore < 2.5 && improvementPct < 15) {
    narrative = `Low readiness (${readinessScore.toFixed(1)}/5) + modest improvement (+${improvementPct.toFixed(1)}%) aligns with the DORA amplifier model: weak foundations limited AI benefit. Strengthen the ${readinessScore < 2 ? "critical" : "identified"} capability gaps before further AI investment.`;
  } else if (readinessScore < 2.5 && improvementPct >= 25) {
    narrative = `Low readiness (${readinessScore.toFixed(1)}/5) yet strong improvement (+${improvementPct.toFixed(1)}%) is unexpected per the DORA model. Individual team capability may be compensating for organizational gaps. Verify sustainability.`;
  } else if (readinessScore >= 4.0 && improvementPct < 15) {
    narrative = `High readiness (${readinessScore.toFixed(1)}/5) but modest improvement (+${improvementPct.toFixed(1)}%). Non-AI factors may be limiting results (team disruption, scope changes, or insufficient training duration).`;
  } else {
    narrative = `Readiness (${readinessScore.toFixed(1)}/5) and improvement (+${improvementPct.toFixed(1)}%) are in a moderate range. Per DORA 2025, continued capability building should yield increasing returns.`;
  }

  return {
    readiness_score: readinessScore,
    improvement_score: improvementPct,
    correlation_narrative: narrative,
  };
}

// =============================================================================
// Full Report Generation
// =============================================================================

/**
 * Generate a full transformation report for a team.
 * Optionally includes readiness context if a readiness assessment exists.
 */
export async function generateTransformationReport(
  teamId: string,
  siteId?: string
): Promise<TransformationReport | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Fetch team + engagement info
  const { data: team } = await supabase
    .from("ai_teams")
    .select("id, name, engagement_id")
    .eq("site_id", site)
    .eq("id", teamId)
    .single();

  if (!team) return null;

  const { data: engagement } = await supabase
    .from("ai_engagements")
    .select("name, client_name")
    .eq("site_id", site)
    .eq("id", team.engagement_id)
    .single();

  if (!engagement) return null;

  // Fetch all assessments (readiness + baseline + post_training)
  const { data: assessments } = await supabase
    .from("ai_assessments")
    .select("*")
    .eq("site_id", site)
    .eq("team_id", teamId);

  const readinessAssessment = (assessments || []).find(
    (a: Record<string, unknown>) => a.assessment_type === "readiness"
  );
  const baseline = (assessments || []).find(
    (a: Record<string, unknown>) => a.assessment_type === "baseline"
  );
  const postTraining = (assessments || []).find(
    (a: Record<string, unknown>) => a.assessment_type === "post_training"
  );

  if (!baseline || !postTraining) return null;

  // Fetch metrics for all available assessments
  const assessmentIds = [baseline.id, postTraining.id];
  if (readinessAssessment) assessmentIds.push(readinessAssessment.id);

  const metricsPromises = assessmentIds.map((id) =>
    supabase.from("ai_metrics").select("*").eq("site_id", site).eq("assessment_id", id)
  );
  const metricsResults = await Promise.all(metricsPromises);

  const baselineMetrics = (metricsResults[0].data || []) as AIMetric[];
  const postMetrics = (metricsResults[1].data || []) as AIMetric[];
  const readinessMetrics = readinessAssessment
    ? (metricsResults[2].data || []) as AIMetric[]
    : [];

  // Compute category summaries (readiness excluded from improvement calc)
  const categories: MetricCategory[] = ["dora", "scrum", "space", "devex"];
  const categorySummaries = categories.map((cat) =>
    computeCategorySummary(cat, baselineMetrics, postMetrics)
  );

  const overallImprovement = computeOverallImprovement(categorySummaries);

  // Compute readiness context (optional — linked from standalone readiness module)
  const readinessContext = readinessMetrics.length > 0
    ? computeReadinessScore(readinessMetrics, teamId)
    : null;

  const readinessScore = readinessContext?.overall_score;
  const benchmarkContext = getBenchmarkContext(overallImprovement, readinessScore);

  // Compute amplifier analysis (only if readiness data exists)
  const amplifierAnalysis = readinessScore !== undefined
    ? computeAmplifierAnalysis(readinessScore, overallImprovement)
    : null;

  // Compute tension analysis from devex metrics
  const tensions = computeTensionAnalysis(baselineMetrics, postMetrics);

  return {
    team_id: teamId,
    team_name: team.name,
    engagement_name: engagement.name,
    client_name: engagement.client_name,
    baseline_period: {
      start: baseline.period_start,
      end: baseline.period_end,
      sprint_count: baseline.sprint_count,
    },
    post_period: {
      start: postTraining.period_start,
      end: postTraining.period_end,
      sprint_count: postTraining.sprint_count,
    },
    categories: categorySummaries,
    overall_improvement_pct: overallImprovement,
    benchmark_context: benchmarkContext,
    benchmarks: RESEARCH_BENCHMARKS,
    readiness_context: readinessContext,
    amplifier_analysis: amplifierAnalysis,
    tensions,
    computed_at: new Date().toISOString(),
  };
}
