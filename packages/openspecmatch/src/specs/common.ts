import { z } from "zod";

// ── Proficiency Levels ──────────────────────────────────────────

export const ProficiencyLevel = z.enum([
  "awareness",
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);
export type ProficiencyLevel = z.infer<typeof ProficiencyLevel>;

export const LEVEL_ORDINAL: Record<ProficiencyLevel, number> = {
  awareness: 1,
  beginner: 2,
  intermediate: 3,
  advanced: 4,
  expert: 5,
};

// ── Criticality ─────────────────────────────────────────────────

export const Criticality = z.enum([
  "mandatory",
  "important",
  "preferred",
  "optional",
]);
export type Criticality = z.infer<typeof Criticality>;

// ── Demand Category ─────────────────────────────────────────────

export const DemandCategory = z.enum([
  // Phase 1: Resume matching
  "technical_skill",
  "soft_skill",
  "certification",
  "education",
  "domain_knowledge",
  "tool_proficiency",
  // Phase 2: RFP matching
  "financial",
  "compliance",
  "infrastructure",
  "manpower",
  "past_performance",
  "geographic",
]);
export type DemandCategory = z.infer<typeof DemandCategory>;

// ── Taxonomy Reference ──────────────────────────────────────────

export const TaxonomyRef = z.object({
  tree: z.string(),
  path: z.string(),
  label: z.string(),
});
export type TaxonomyRef = z.infer<typeof TaxonomyRef>;

// ── Evidence ────────────────────────────────────────────────────

export const EvidenceType = z.enum([
  "experience",
  "certification",
  "education",
  "project",
  "reference",
  "document",
]);
export type EvidenceType = z.infer<typeof EvidenceType>;

export const Evidence = z.object({
  type: EvidenceType,
  description: z.string(),
  date: z.string().optional(),
  durationMonths: z.number().int().nonnegative().optional(),
  source: z.string(),
});
export type Evidence = z.infer<typeof Evidence>;

// ── Taxonomy Match Type ─────────────────────────────────────────

export const TaxonomyMatchType = z.enum([
  "exact",
  "parent",
  "child",
  "sibling",
  "related",
  "none",
]);
export type TaxonomyMatchType = z.infer<typeof TaxonomyMatchType>;
