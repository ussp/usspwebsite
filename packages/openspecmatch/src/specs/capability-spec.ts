import { z } from "zod";
import {
  DemandCategory,
  Evidence,
  ProficiencyLevel,
  TaxonomyRef,
} from "./common.js";

// ── Capability Item ─────────────────────────────────────────────

export const CapabilityItem = z.object({
  id: z.string(),
  category: DemandCategory,
  taxonomyRef: TaxonomyRef.nullable(),
  rawText: z.string(),
  level: ProficiencyLevel,
  years: z.number().nonnegative().optional(),
  evidence: z.array(Evidence),
  lastUsed: z.string().optional(),
  tools: z.array(z.string()).optional(),
});
export type CapabilityItem = z.infer<typeof CapabilityItem>;

// ── Capability Spec ─────────────────────────────────────────────

export const CapabilitySpec = z.object({
  id: z.string(),
  domain: z.enum(["candidate", "company"]),
  name: z.string(),
  source: z.object({
    type: z.enum(["resume", "profile", "company_profile"]),
    id: z.string(),
    extractedAt: z.string(),
    extractorVersion: z.string(),
  }),
  capabilities: z.array(CapabilityItem),
  context: z.object({
    totalExperienceYears: z.number().nonnegative().optional(),
    currentRole: z.string().optional(),
    location: z
      .object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    workPreference: z
      .enum(["remote", "hybrid", "onsite", "open_to_travel"])
      .optional(),
    compensation: z
      .object({
        min: z.number().nonnegative().optional(),
        max: z.number().nonnegative().optional(),
        currency: z.string(),
        type: z.enum(["hourly", "annual"]),
      })
      .optional(),
    availability: z
      .object({
        date: z.string(),
        status: z.enum(["available", "on_assignment", "not_looking"]),
      })
      .optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});
export type CapabilitySpec = z.infer<typeof CapabilitySpec>;
