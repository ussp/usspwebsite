import { z } from "zod";
import { Criticality, DemandCategory } from "../specs/common.js";

// ── Scoring Profile ─────────────────────────────────────────────

export const ScoringProfile = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.enum(["resume", "rfp", "universal"]),
  description: z.string(),
  version: z.string(),

  categoryWeights: z.record(DemandCategory, z.number().nonnegative()).refine(
    (weights) => Object.values(weights).some((w) => w > 0),
    { message: "At least one category weight must be positive" },
  ),

  criticalityMultipliers: z.record(Criticality, z.number().nonnegative()),

  levelCurve: z.record(
    z.string(), // keys are stringified integers (e.g., "-2", "-1", "0", "1", "2")
    z.number().min(0).max(2),
  ),

  mandatoryIsGate: z.boolean(),
  evidenceWeight: z.number().min(0).max(1),
  recencyHalfLifeMonths: z.number().positive(),

  gapThreshold: z.number().min(0).max(100).default(50),

  taxonomyMatchScores: z.object({
    exact: z.number().min(0).max(1),
    parent: z.number().min(0).max(1),
    child: z.number().min(0).max(1),
    sibling: z.number().min(0).max(1),
    related: z.number().min(0).max(1),
    none: z.number().min(0).max(1),
  }),
});
export type ScoringProfile = z.infer<typeof ScoringProfile>;
