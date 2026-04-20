/**
 * LLM-powered RFP Demand Extractor
 *
 * Takes raw RFP text (typically a concatenation of PDF-extracted content from
 * multiple scheme/annexure docs) and produces a DemandSpec with domain: "rfp".
 *
 * LLM-only items are tagged in their context field with `extractor:llm_only`
 * per the add-rfp-matching-phase2 spec.
 */

import type { AsyncDemandExtractor } from "./types.js";
import type { DemandSpec, DemandItem } from "../specs/demand-spec.js";
import type {
  Criticality,
  DemandCategory,
  ProficiencyLevel,
  TaxonomyRef,
} from "../specs/common.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";
import type { LLMProvider } from "../llm/types.js";
import { z } from "zod";

export interface LLMRFPInput {
  /** Unique RFP identifier (e.g. "morth-rt-16011-1-2018-T") */
  id: string;
  /** RFP title */
  title: string;
  /** Raw extracted text from RFP document(s) — concatenate multiple files if needed */
  text: string;
  /** Optional scheme metadata to pass as context */
  metadata?: Record<string, unknown>;
  /** Optional location scope */
  location?: {
    city?: string;
    state?: string;
    country?: string;
    workMode?: "remote" | "hybrid" | "onsite";
  };
  industry?: string;
}

const LLMRFPRequirementSchema = z.object({
  rawText: z.string(),
  category: z.enum([
    "compliance",
    "infrastructure",
    "financial",
    "manpower",
    "past_performance",
    "geographic",
    "technical_skill",
    "soft_skill",
    "certification",
    "education",
    "domain_knowledge",
    "tool_proficiency",
  ]),
  criticality: z.enum(["mandatory", "important", "preferred", "optional"]),
  level: z.enum([
    "awareness",
    "beginner",
    "intermediate",
    "advanced",
    "expert",
  ]).nullable(),
  citation: z.string().nullable(),
  confidence: z.enum(["high", "medium", "low"]),
});

const LLMRFPResponseSchema = z.object({
  requirements: z.array(LLMRFPRequirementSchema),
});

type LLMRFPResponse = z.infer<typeof LLMRFPResponseSchema>;

const SYSTEM_PROMPT = `You are an RFP analysis engine for India government tenders. Extract structured requirements from RFP / scheme text.

Return ONLY a JSON object (no markdown, no explanation) with this structure:

{
  "requirements": [
    {
      "rawText": "<the requirement as written in the RFP>",
      "category": "<compliance|infrastructure|financial|manpower|past_performance|geographic>",
      "criticality": "<mandatory|important|preferred|optional>",
      "level": "<awareness|beginner|intermediate|advanced|expert or null>",
      "citation": "<clause/annexure/section reference, e.g. 'Gazette clause (a)' or 'Annexure B section 2.6' or null>",
      "confidence": "<high|medium|low>"
    }
  ]
}

RULES:
1. Extract EVERY distinct requirement. RFPs are dense — aim for 30-60+ items for a typical scheme.
2. Map to these categories:
   - compliance: certifications, standards, regulatory requirements (AIS 140, CERT-IN, SSL, type approvals)
   - infrastructure: software platforms, hosting (NIC Cloud), integrations (VAHAN, ERSS), hardware, connectivity
   - financial: PBG, EMD, turnover thresholds, working capital, funding frameworks
   - manpower: team roles (PIU, nodal officer, helpdesk), 24x7 coverage, language requirements, PMC/PMU roles
   - past_performance: prior references, deployment scale, sector experience
   - geographic: location-of-presence / regional scope requirements
3. Criticality:
   - mandatory: "shall", "must", "required", gazetted obligations, RFP disqualifiers
   - important: "should", core functional features, evaluation-heavy items
   - preferred: "may", "nice to have", value-adds, bonus items
   - optional: explicitly optional or clarifying text
4. Level: expertise expected (null if unclear).
5. Citation: include scheme clause/annexure reference when available.
6. Confidence: "high" if requirement is explicit, "medium" if inferred from context, "low" if speculative.
7. Do NOT invent requirements not implied by the text.
8. Preserve the source wording in rawText — don't paraphrase aggressively.`;

export class LLMRFPExtractor implements AsyncDemandExtractor<LLMRFPInput> {
  private itemCounter = 0;

  constructor(
    private resolver: TaxonomyResolver,
    private llm: LLMProvider,
    private version: string = "0.1.0",
  ) {}

  async extract(input: LLMRFPInput): Promise<DemandSpec> {
    this.itemCounter = 0;

    const raw = await this.llm.chat({
      system: SYSTEM_PROMPT,
      user: input.text,
      maxTokens: 8192,
      temperature: 0,
    });

    let parsed: LLMRFPResponse;
    try {
      const cleaned = raw
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = LLMRFPResponseSchema.parse(JSON.parse(cleaned));
    } catch (err) {
      throw new Error(
        `LLM returned invalid JSON for RFP "${input.title}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    const requirements: DemandItem[] = parsed.requirements.map((req) => {
      const resolved = this.resolver.resolve(req.rawText);
      const taxonomyRef: TaxonomyRef | null = resolved.node
        ? { tree: resolved.tree!, path: resolved.node.path, label: resolved.node.label }
        : null;

      // Flag low-confidence / LLM-only items so humans can review
      const contextParts: string[] = [];
      if (req.citation) contextParts.push(req.citation);
      if (req.confidence !== "high") {
        contextParts.push(`extractor:llm_only:${req.confidence}`);
      }

      return {
        id: `di-${++this.itemCounter}`,
        category: req.category as DemandCategory,
        taxonomyRef,
        rawText: req.rawText,
        level: (req.level ?? "advanced") as ProficiencyLevel,
        criticality: req.criticality as Criticality,
        ...(contextParts.length > 0 ? { context: contextParts.join(" | ") } : {}),
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
        extractorVersion: `llm-rfp-extractor@${this.version}`,
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
