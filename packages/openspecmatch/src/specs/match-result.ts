import { z } from "zod";
import { DemandCategory, TaxonomyMatchType } from "./common.js";

// ── Item Match ──────────────────────────────────────────────────

export const ScoreBreakdown = z.object({
  taxonomyMatch: TaxonomyMatchType,
  levelFit: z.number().min(0).max(100),
  evidenceStrength: z.number().min(0).max(100),
  recency: z.number().min(0).max(100),
});
export type ScoreBreakdown = z.infer<typeof ScoreBreakdown>;

export const ItemMatch = z.object({
  demandItemId: z.string(),
  capabilityItemId: z.string().nullable(),
  providedBy: z.string().optional(),
  score: z.number().min(0).max(100),
  scoreBreakdown: ScoreBreakdown,
  explanation: z.string(),
});
export type ItemMatch = z.infer<typeof ItemMatch>;

// ── Match Summary Item ──────────────────────────────────────────

export const MatchSummaryItem = z.object({
  demandItemId: z.string(),
  category: DemandCategory,
  rawText: z.string(),
  score: z.number().min(0).max(100),
  explanation: z.string(),
});
export type MatchSummaryItem = z.infer<typeof MatchSummaryItem>;

// ── Category Score ──────────────────────────────────────────────

export const CategoryScore = z.object({
  score: z.number().min(0).max(100),
  weight: z.number().min(0),
  weightedScore: z.number().min(0),
  itemCount: z.number().int().nonnegative(),
  matchedCount: z.number().int().nonnegative(),
});
export type CategoryScore = z.infer<typeof CategoryScore>;

// ── Recommendation (RFP / bid/no-bid) ───────────────────────────

export const RecommendationVerdict = z.enum(["GO", "GO_WITH_REMEDIATION", "NO_GO"]);
export type RecommendationVerdict = z.infer<typeof RecommendationVerdict>;

export const BlockerItem = z.object({
  demandItemId: z.string(),
  category: DemandCategory,
  rawText: z.string(),
  criticality: z.enum(["mandatory", "important", "preferred", "optional"]),
  score: z.number().min(0).max(100),
});
export type BlockerItem = z.infer<typeof BlockerItem>;

export const RemediationPlan = z.object({
  demandItemId: z.string(),
  description: z.string(),
  estimatedEffortWeeks: z.number().nonnegative().optional(),
  ownerHint: z.string().optional(),
});
export type RemediationPlan = z.infer<typeof RemediationPlan>;

export const Recommendation = z.object({
  verdict: RecommendationVerdict,
  rationale: z.string(),
  blockers: z.array(BlockerItem),
  remediation: z.array(RemediationPlan),
  exposureUSD: z.number().nonnegative().optional(),
});
export type Recommendation = z.infer<typeof Recommendation>;

// ── Spec Match Result ───────────────────────────────────────────

export const SpecMatchResult = z.object({
  demandId: z.string(),
  capabilityIds: z.array(z.string()),
  overallScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  engineVersion: z.string(),
  profileId: z.string(),
  computedAt: z.string(),
  itemMatches: z.array(ItemMatch),
  strengths: z.array(MatchSummaryItem),
  gaps: z.array(MatchSummaryItem),
  unknowns: z.array(MatchSummaryItem),
  categoryScores: z.record(DemandCategory, CategoryScore),
  passedMandatoryGate: z.boolean(),
  failedMandatory: z.array(z.string()),
  summary: z.string().optional(),
  /** Optional bid/no-bid verdict; populated by the recommender for RFP matches. */
  recommendation: Recommendation.optional(),
});
export type SpecMatchResult = z.infer<typeof SpecMatchResult>;
