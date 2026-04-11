import type { DemandItem } from "../specs/demand-spec.js";
import type { CapabilityItem } from "../specs/capability-spec.js";
import type { ItemMatch, ScoreBreakdown } from "../specs/match-result.js";
import type { ScoringProfile } from "../profiles/types.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";
import type { TaxonomyMatchType } from "../specs/common.js";
import { LEVEL_ORDINAL } from "../specs/common.js";

/**
 * Compare a single DemandItem against a single CapabilityItem.
 */
export function compareItems(
  demand: DemandItem,
  capability: CapabilityItem,
  profile: ScoringProfile,
  resolver: TaxonomyResolver,
): ItemMatch {
  const breakdown = computeBreakdown(demand, capability, profile, resolver);
  const score = computeItemScore(breakdown, profile);
  const explanation = buildExplanation(demand, capability, breakdown, score);

  return {
    demandItemId: demand.id,
    capabilityItemId: capability.id,
    score,
    scoreBreakdown: breakdown,
    explanation,
  };
}

function computeBreakdown(
  demand: DemandItem,
  capability: CapabilityItem,
  profile: ScoringProfile,
  resolver: TaxonomyResolver,
): ScoreBreakdown {
  // Taxonomy match
  let taxonomyMatch: TaxonomyMatchType = "none";
  if (demand.taxonomyRef && capability.taxonomyRef) {
    const nodeA = resolver.getNode(demand.taxonomyRef.path);
    const nodeB = resolver.getNode(capability.taxonomyRef.path);
    if (nodeA && nodeB) {
      taxonomyMatch = resolver.relationship(nodeA, nodeB);
    }
  } else if (!demand.taxonomyRef && !capability.taxonomyRef) {
    // Both unresolved — fall back to text similarity
    const sim = textSimilarity(demand.rawText, capability.rawText);
    if (sim > 0.8) taxonomyMatch = "exact";
    else if (sim > 0.5) taxonomyMatch = "related";
  }

  const taxonomyScore = profile.taxonomyMatchScores[taxonomyMatch] ?? 0;

  // Level fit
  const demandOrd = LEVEL_ORDINAL[demand.level];
  const capOrd = LEVEL_ORDINAL[capability.level];
  const levelDiff = capOrd - demandOrd;
  const levelKey = String(Math.max(-2, Math.min(2, levelDiff)));
  const levelMultiplier = profile.levelCurve[levelKey] ?? (levelDiff >= 0 ? 1.0 : 0.5);
  const levelFit = Math.round(levelMultiplier * 100);

  // Evidence strength
  let evidenceStrength = 50; // default when no evidence
  if (capability.evidence.length > 0) {
    const maxDuration = Math.max(...capability.evidence.map(e => e.durationMonths ?? 0));
    if (maxDuration >= 36) evidenceStrength = 95;
    else if (maxDuration >= 24) evidenceStrength = 85;
    else if (maxDuration >= 12) evidenceStrength = 75;
    else if (maxDuration > 0) evidenceStrength = 65;
    else evidenceStrength = 60;
  } else if (capability.years) {
    evidenceStrength = Math.min(95, 50 + capability.years * 5);
  }

  // Recency
  let recency = 70; // default
  if (capability.lastUsed) {
    const lastDate = new Date(capability.lastUsed);
    const now = new Date();
    const monthsAgo = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const halfLife = profile.recencyHalfLifeMonths;
    recency = Math.round(100 * Math.pow(0.5, monthsAgo / halfLife));
    recency = Math.max(10, Math.min(100, recency));
  }

  return {
    taxonomyMatch,
    levelFit,
    evidenceStrength,
    recency,
  };
}

function computeItemScore(breakdown: ScoreBreakdown, profile: ScoringProfile): number {
  const taxonomyMatchScore = profile.taxonomyMatchScores[breakdown.taxonomyMatch] ?? 0;

  // If taxonomy is "none", the item simply doesn't match
  if (breakdown.taxonomyMatch === "none") return 0;

  // Base score from taxonomy match quality (0-100)
  const baseScore = taxonomyMatchScore * 100;

  // Modifiers from level fit, evidence, and recency
  // Level fit is the primary modifier — wrong level substantially reduces score
  const levelModifier = breakdown.levelFit / 100; // 0-1

  // Evidence and recency are secondary modifiers (weighted by profile)
  const ew = profile.evidenceWeight;
  const evidenceModifier = 1.0 - ew + (ew * breakdown.evidenceStrength / 100);
  const recencyModifier = 0.85 + 0.15 * (breakdown.recency / 100); // 0.85–1.0 range

  const raw = baseScore * levelModifier * evidenceModifier * recencyModifier;

  return Math.round(Math.max(0, Math.min(100, raw)));
}

function buildExplanation(
  demand: DemandItem,
  capability: CapabilityItem,
  breakdown: ScoreBreakdown,
  score: number,
): string {
  const parts: string[] = [];

  if (breakdown.taxonomyMatch === "exact") {
    parts.push(`Exact match for "${demand.rawText}"`);
  } else if (breakdown.taxonomyMatch === "sibling") {
    parts.push(`"${capability.rawText}" is related to "${demand.rawText}"`);
  } else if (breakdown.taxonomyMatch === "parent" || breakdown.taxonomyMatch === "child") {
    parts.push(`"${capability.rawText}" is in the same family as "${demand.rawText}"`);
  } else if (breakdown.taxonomyMatch === "related") {
    parts.push(`"${capability.rawText}" is loosely related to "${demand.rawText}"`);
  } else {
    parts.push(`No match found for "${demand.rawText}"`);
  }

  if (breakdown.levelFit >= 100) {
    parts.push("level meets or exceeds requirement");
  } else if (breakdown.levelFit >= 70) {
    parts.push("level slightly below requirement");
  } else {
    parts.push("level significantly below requirement");
  }

  return `${parts.join("; ")} (score: ${score})`;
}

function textSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  const wordsB = new Set(b.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  return intersection / Math.max(wordsA.size, wordsB.size);
}
