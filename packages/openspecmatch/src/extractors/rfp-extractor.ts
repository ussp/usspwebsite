/**
 * Rule-based RFP Demand Extractor
 *
 * Converts a structured RFP input (list of pre-identified requirements, usually
 * prepared by a bid team reading the RFP) into a DemandSpec with domain: "rfp".
 *
 * For PDF-first extraction, use LLMRFPExtractor.
 */

import type { DemandExtractor } from "./types.js";
import type { DemandSpec, DemandItem } from "../specs/demand-spec.js";
import type {
  Criticality,
  DemandCategory,
  ProficiencyLevel,
  TaxonomyRef,
} from "../specs/common.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";

export interface RFPRequirementInput {
  /** Short identifier such as "cmp-001" or "inf-NIC" */
  id?: string;
  /** Phase 2 category */
  category: DemandCategory;
  /** Natural-language requirement text pulled from the RFP */
  rawText: string;
  /** mandatory / important / preferred / optional */
  criticality: Criticality;
  /** Level of capability expected */
  level?: ProficiencyLevel;
  /** Free-text source citation, e.g. "Gazette 2018 clause (a)" or inline remediation tag */
  context?: string;
  minYears?: number;
  maxYears?: number;
  evaluationWeight?: number;
}

export interface RFPInput {
  id: string;
  title: string;
  /** Pre-identified requirements (from bid-team reading or LLM pre-pass) */
  requirements: RFPRequirementInput[];
  /** Scheme/industry context */
  industry?: string;
  /** Location scope (e.g. state or region the RFP applies to) */
  location?: {
    city?: string;
    state?: string;
    country?: string;
    workMode?: "remote" | "hybrid" | "onsite";
  };
  /** Scheme metadata (project cost, category, funding pattern) */
  metadata?: Record<string, unknown>;
}

export class RFPExtractor implements DemandExtractor<RFPInput> {
  private itemCounter = 0;

  constructor(
    private resolver: TaxonomyResolver,
    private version: string = "0.1.0",
  ) {}

  extract(input: RFPInput): DemandSpec {
    this.itemCounter = 0;

    const requirements: DemandItem[] = input.requirements.map((req) => {
      const resolved = this.resolver.resolve(req.rawText);
      const taxonomyRef: TaxonomyRef | null = resolved.node
        ? { tree: resolved.tree!, path: resolved.node.path, label: resolved.node.label }
        : null;

      return {
        id: req.id ?? `di-${++this.itemCounter}`,
        category: req.category,
        taxonomyRef,
        rawText: req.rawText,
        level: req.level ?? "advanced",
        criticality: req.criticality,
        ...(req.minYears !== undefined ? { minYears: req.minYears } : {}),
        ...(req.maxYears !== undefined ? { maxYears: req.maxYears } : {}),
        ...(req.context ? { context: req.context } : {}),
        ...(req.evaluationWeight !== undefined
          ? { evaluationWeight: req.evaluationWeight }
          : {}),
      };
    });

    return {
      id: input.id,
      domain: "rfp",
      title: input.title,
      source: {
        type: "rfp_document",
        id: input.id,
        extractedAt: new Date().toISOString(),
        extractorVersion: `rfp-extractor@${this.version}`,
      },
      requirements,
      context: {
        ...(input.industry ? { industry: input.industry } : {}),
        ...(input.location
          ? {
              location: {
                ...(input.location.city ? { city: input.location.city } : {}),
                ...(input.location.state ? { state: input.location.state } : {}),
                ...(input.location.country ? { country: input.location.country } : {}),
                workMode: input.location.workMode ?? "onsite",
              },
            }
          : {}),
        ...(input.metadata ? { metadata: input.metadata } : {}),
      },
    };
  }
}
