import type { DemandSpec } from "../specs/demand-spec.js";
import type { CapabilitySpec } from "../specs/capability-spec.js";
import type {
  SpecMatchResult,
  ItemMatch,
  MatchSummaryItem,
  CategoryScore,
} from "../specs/match-result.js";
import type { ScoringProfile } from "../profiles/types.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";
import type { DemandCategory } from "../specs/common.js";
import { compareItems } from "./comparator.js";
import { matchLocation } from "./location-matcher.js";

const ENGINE_VERSION = "0.2.0";

/**
 * Match a DemandSpec against a CapabilitySpec and produce a full result.
 */
export function matchSpecs(
  demand: DemandSpec,
  capability: CapabilitySpec,
  profile: ScoringProfile,
  resolver: TaxonomyResolver,
): SpecMatchResult {
  // For each demand item, find the best matching capability item
  const itemMatches: ItemMatch[] = [];

  for (const demandItem of demand.requirements) {
    let bestMatch: ItemMatch | null = null;

    for (const capItem of capability.capabilities) {
      // Only compare within same category (or allow cross-category if taxonomy matches)
      if (capItem.category !== demandItem.category) continue;

      const match = compareItems(demandItem, capItem, profile, resolver);
      if (!bestMatch || match.score > bestMatch.score) {
        bestMatch = match;
      }
    }

    // If no same-category match, try cross-category
    if (!bestMatch || bestMatch.score === 0) {
      for (const capItem of capability.capabilities) {
        if (capItem.category === demandItem.category) continue;
        const match = compareItems(demandItem, capItem, profile, resolver);
        if (match.score > 0 && (!bestMatch || match.score > bestMatch.score)) {
          bestMatch = match;
        }
      }
    }

    if (!bestMatch) {
      bestMatch = {
        demandItemId: demandItem.id,
        capabilityItemId: null,
        score: 0,
        scoreBreakdown: {
          taxonomyMatch: "none",
          levelFit: 0,
          evidenceStrength: 0,
          recency: 0,
        },
        explanation: `No match found for "${demandItem.rawText}"`,
      };
    }

    itemMatches.push(bestMatch);
  }

  // Check mandatory gate
  const failedMandatory: string[] = [];
  if (profile.mandatoryIsGate) {
    for (let i = 0; i < demand.requirements.length; i++) {
      const req = demand.requirements[i];
      const match = itemMatches[i];
      if (req.criticality === "mandatory" && match.score < profile.gapThreshold) {
        failedMandatory.push(req.id);
      }
    }
  }
  const passedMandatoryGate = failedMandatory.length === 0;

  // Compute category scores
  const categoryScores = computeCategoryScores(demand, itemMatches, profile);

  // Compute skills/requirements score
  let requirementsScore = 0;
  if (passedMandatoryGate) {
    let totalWeight = 0;
    let weightedSum = 0;
    for (const [, cs] of Object.entries(categoryScores)) {
      weightedSum += cs.weightedScore;
      totalWeight += cs.weight;
    }
    requirementsScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  // ── Location scoring ─────────────────────────────────────────
  const locationResult = matchLocation(
    demand.context.location,
    capability.context.location,
    capability.context.workPreference,
  );

  // ── Combine: requirements (80%) + location (20%) ─────────────
  // Location weight depends on work mode:
  //   Remote positions: location is 5% of score
  //   Hybrid: location is 15%
  //   Onsite: location is 20%
  const locationWeight =
    demand.context.location?.workMode === "remote" ? 0.05 :
    demand.context.location?.workMode === "hybrid" ? 0.15 : 0.20;
  const requirementsWeight = 1.0 - locationWeight;

  let overallScore = 0;
  if (passedMandatoryGate) {
    overallScore = Math.round(
      requirementsScore * requirementsWeight +
      locationResult.score * locationWeight,
    );
  }

  // Compute confidence
  const confidence = computeConfidence(demand, capability, itemMatches);

  // Build summaries
  const strengths: MatchSummaryItem[] = [];
  const gaps: MatchSummaryItem[] = [];
  const unknowns: MatchSummaryItem[] = [];

  for (let i = 0; i < demand.requirements.length; i++) {
    const req = demand.requirements[i];
    const match = itemMatches[i];
    const summary: MatchSummaryItem = {
      demandItemId: req.id,
      category: req.category,
      rawText: req.rawText,
      score: match.score,
      explanation: match.explanation,
    };
    if (match.capabilityItemId === null && match.score === 0) {
      unknowns.push(summary);
    } else if (match.score >= 70) {
      strengths.push(summary);
    } else if (match.score < 50) {
      gaps.push(summary);
    }
  }

  // Add location as a summary item if relevant
  if (demand.context.location && demand.context.location.workMode !== "remote") {
    const locSummary: MatchSummaryItem = {
      demandItemId: "ctx-location",
      category: "geographic",
      rawText: `Location: ${[demand.context.location.city, demand.context.location.state].filter(Boolean).join(", ")} (${demand.context.location.workMode})`,
      score: locationResult.score,
      explanation: `${locationResult.explanation} [work mode: ${locationResult.workModeMatch}]`,
    };
    if (locationResult.score >= 70) strengths.push(locSummary);
    else if (locationResult.score < 50) gaps.push(locSummary);
  }

  // Build summary text
  const summaryParts: string[] = [];
  if (locationResult.score < 50 && demand.context.location?.workMode !== "remote") {
    summaryParts.push(`Location concern: ${locationResult.explanation}`);
  }
  if (failedMandatory.length > 0) {
    summaryParts.push(`Failed mandatory requirements: ${failedMandatory.join(", ")}`);
  }

  return {
    demandId: demand.id,
    capabilityIds: [capability.id],
    overallScore,
    confidence,
    engineVersion: ENGINE_VERSION,
    profileId: profile.id,
    computedAt: new Date().toISOString(),
    itemMatches,
    strengths,
    gaps,
    unknowns,
    categoryScores,
    passedMandatoryGate,
    failedMandatory,
    summary: summaryParts.length > 0 ? summaryParts.join(". ") : undefined,
  };
}

/**
 * Match multiple capability specs against one demand spec.
 */
export function matchBatch(
  demand: DemandSpec,
  capabilities: CapabilitySpec[],
  profile: ScoringProfile,
  resolver: TaxonomyResolver,
): SpecMatchResult[] {
  if (capabilities.length === 0) return [];

  return capabilities
    .map((cap) => matchSpecs(demand, cap, profile, resolver))
    .sort((a, b) => b.overallScore - a.overallScore);
}

function computeCategoryScores(
  demand: DemandSpec,
  itemMatches: ItemMatch[],
  profile: ScoringProfile,
): Record<string, CategoryScore> {
  const scores: Record<string, CategoryScore> = {};

  // Group demand items by category
  const byCategory = new Map<DemandCategory, { req: typeof demand.requirements[0]; match: ItemMatch }[]>();
  for (let i = 0; i < demand.requirements.length; i++) {
    const req = demand.requirements[i];
    const match = itemMatches[i];
    const list = byCategory.get(req.category) ?? [];
    list.push({ req, match });
    byCategory.set(req.category, list);
  }

  for (const [cat, items] of byCategory) {
    const weight = profile.categoryWeights[cat] ?? 0;
    let totalScore = 0;
    let matchedCount = 0;

    for (const { req, match } of items) {
      const multiplier = profile.criticalityMultipliers[req.criticality] ?? 1.0;

      // Use evaluationWeight if provided, otherwise use criticality multiplier
      const effectiveWeight = req.evaluationWeight ?? multiplier;
      totalScore += match.score * effectiveWeight;

      if (match.score > 0) matchedCount++;
    }

    const maxPossible = items.reduce((sum, { req }) => {
      const multiplier = profile.criticalityMultipliers[req.criticality] ?? 1.0;
      return sum + 100 * (req.evaluationWeight ?? multiplier);
    }, 0);

    const categoryScore = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

    scores[cat] = {
      score: categoryScore,
      weight,
      weightedScore: categoryScore * weight,
      itemCount: items.length,
      matchedCount,
    };
  }

  return scores;
}

function computeConfidence(
  demand: DemandSpec,
  capability: CapabilitySpec,
  itemMatches: ItemMatch[],
): number {
  if (demand.requirements.length === 0) return 20;

  let confidence = 50; // Base

  // More items matched = higher confidence
  const matchedCount = itemMatches.filter(m => m.capabilityItemId !== null).length;
  const matchRatio = matchedCount / demand.requirements.length;
  confidence += matchRatio * 30;

  // More capabilities = richer data
  if (capability.capabilities.length >= 10) confidence += 10;
  else if (capability.capabilities.length >= 5) confidence += 5;

  // Context available boosts confidence
  if (capability.context.totalExperienceYears) confidence += 3;
  if (capability.context.location) confidence += 2;
  if (capability.context.workPreference) confidence += 2;

  return Math.round(Math.max(10, Math.min(100, confidence)));
}
