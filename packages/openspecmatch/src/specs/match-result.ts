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
});
export type SpecMatchResult = z.infer<typeof SpecMatchResult>;
