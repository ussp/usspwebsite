import { z } from "zod";
import {
  Criticality,
  DemandCategory,
  EvidenceType,
  ProficiencyLevel,
  TaxonomyRef,
} from "./common.js";

// ── Location Requirement ────────────────────────────────────────

export const LocationRequirement = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  workMode: z.enum(["remote", "hybrid", "onsite"]),
  relocationOk: z.boolean().optional(),
  travelPercent: z.number().min(0).max(100).optional(),
});
export type LocationRequirement = z.infer<typeof LocationRequirement>;

// ── Compensation Requirement ────────────────────────────────────

export const CompensationRequirement = z.object({
  min: z.number().nonnegative().optional(),
  max: z.number().nonnegative().optional(),
  currency: z.string(),
  type: z.enum(["hourly", "annual", "monthly", "project"]),
});
export type CompensationRequirement = z.infer<typeof CompensationRequirement>;

// ── Timeline Requirement ────────────────────────────────────────

export const TimelineRequirement = z.object({
  startDate: z.string().optional(),
  urgency: z.enum(["immediate", "within_30_days", "within_90_days", "flexible"]),
  durationMonths: z.number().positive().optional(),
});
export type TimelineRequirement = z.infer<typeof TimelineRequirement>;

// ── Demand Item ─────────────────────────────────────────────────

export const DemandItem = z.object({
  id: z.string(),
  category: DemandCategory,
  taxonomyRef: TaxonomyRef.nullable(),
  rawText: z.string(),
  level: ProficiencyLevel,
  criticality: Criticality,
  minYears: z.number().nonnegative().optional(),
  maxYears: z.number().nonnegative().optional(),
  context: z.string().optional(),
  acceptableEvidence: z.array(EvidenceType).optional(),
  evaluationWeight: z.number().nonnegative().optional(),
});
export type DemandItem = z.infer<typeof DemandItem>;

// ── Demand Spec ─────────────────────────────────────────────────

export const DemandSpec = z.object({
  id: z.string(),
  domain: z.enum(["position", "rfp"]),
  title: z.string(),
  source: z.object({
    type: z.enum(["position", "rfp_document"]),
    id: z.string(),
    extractedAt: z.string(),
    extractorVersion: z.string(),
  }),
  requirements: z.array(DemandItem),
  context: z.object({
    industry: z.string().optional(),
    location: LocationRequirement.optional(),
    compensation: CompensationRequirement.optional(),
    timeline: TimelineRequirement.optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});
export type DemandSpec = z.infer<typeof DemandSpec>;
