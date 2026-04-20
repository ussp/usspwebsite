/**
 * LLM-powered Company Capability Extractor
 *
 * Takes a company profile doc (pitch deck text, overview, about-us, filings)
 * and produces a CapabilitySpec with domain: "company".
 */

import type { AsyncCapabilityExtractor } from "./types.js";
import type {
  CapabilitySpec,
  CapabilityItem,
} from "../specs/capability-spec.js";
import type {
  DemandCategory,
  Evidence,
  ProficiencyLevel,
  TaxonomyRef,
} from "../specs/common.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";
import type { LLMProvider } from "../llm/types.js";
import { z } from "zod";

export interface LLMCompanyInput {
  id: string;
  name: string;
  text: string;
  /** Source doc identifier (e.g. "Fleetronix-AP Govt.pdf") */
  sourceDoc: string;
  metadata?: Record<string, unknown>;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

const LLMCapabilitySchema = z.object({
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
  level: z.enum([
    "awareness",
    "beginner",
    "intermediate",
    "advanced",
    "expert",
  ]),
  years: z.number().nullable(),
  lastUsed: z.string().nullable(),
  evidence: z.string(),
  pageOrSlide: z.string().nullable(),
});

const LLMCompanyResponseSchema = z.object({
  totalExperienceYears: z.number().nullable(),
  location: z.object({
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
  }).nullable(),
  capabilities: z.array(LLMCapabilitySchema),
});

type LLMCompanyResponse = z.infer<typeof LLMCompanyResponseSchema>;

const SYSTEM_PROMPT = `You are a company-profile analysis engine for India government RFP bidding. Extract structured capability data from company profile text (pitch decks, about-us, overview, filings).

Return ONLY a JSON object (no markdown, no explanation) with this structure:

{
  "totalExperienceYears": <number or null>,
  "location": { "city": "<string or null>", "state": "<string or null>", "country": "<string or null>" },
  "capabilities": [
    {
      "rawText": "<the capability as stated in the profile>",
      "category": "<compliance|infrastructure|financial|manpower|past_performance|geographic>",
      "level": "<awareness|beginner|intermediate|advanced|expert>",
      "years": <number or null>,
      "lastUsed": "<ISO date or year string, or null>",
      "evidence": "<specific evidence from the profile that proves this capability, including deployment count/revenue/clients if cited>",
      "pageOrSlide": "<page number, slide number, or section reference if visible>"
    }
  ]
}

RULES:
1. Extract EVERY distinct capability, reference, credential, filing, or past-performance claim.
2. Category mapping:
   - compliance: certifications held (CERT-IN, TAC, ISO, AIS 140), regulatory filings
   - infrastructure: software platforms, hosting, integrations, hardware, connectivity, AI/ML capabilities
   - financial: turnover figures, investment rounds, project capacity, PBG/EMD capability
   - manpower: team size, role mix, 24x7 capability, language coverage
   - past_performance: client references, deployment counts, awards, sector experience
   - geographic: HQ, regional presence, countries served
3. Level inference:
   - "expert": clearly dominant or recognised (largest scale, proprietary IP, founding role)
   - "advanced": deployed in production at scale (thousands of units, enterprise clients)
   - "intermediate": deployed in limited production
   - "beginner": pilot or research project only
   - "awareness": mentioned, no evidence
4. Evidence: cite the specific figure/claim from the profile (e.g. "7,000+ devices deployed", "Fortune 500 clients", "FY24-25 turnover 5.5 Cr").
5. pageOrSlide: include when evident (e.g. "slide 5", "page 21").
6. Do NOT invent capabilities not implied by the text.
7. Be thorough — 15-40 items is typical for a good pitch deck.`;

export class LLMCompanyExtractor
  implements AsyncCapabilityExtractor<LLMCompanyInput> {
  private itemCounter = 0;

  constructor(
    private resolver: TaxonomyResolver,
    private llm: LLMProvider,
    private version: string = "0.1.0",
  ) {}

  async extract(input: LLMCompanyInput): Promise<CapabilitySpec> {
    this.itemCounter = 0;

    const raw = await this.llm.chat({
      system: SYSTEM_PROMPT,
      user: input.text,
      maxTokens: 8192,
      temperature: 0,
    });

    let parsed: LLMCompanyResponse;
    try {
      const cleaned = raw
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = LLMCompanyResponseSchema.parse(JSON.parse(cleaned));
    } catch (err) {
      throw new Error(
        `LLM returned invalid JSON for company "${input.name}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    const capabilities: CapabilityItem[] = parsed.capabilities.map((cap) => {
      const resolved = this.resolver.resolve(cap.rawText);
      const taxonomyRef: TaxonomyRef | null = resolved.node
        ? { tree: resolved.tree!, path: resolved.node.path, label: resolved.node.label }
        : null;

      const evidence: Evidence[] = [
        {
          type: "document",
          description: cap.pageOrSlide
            ? `${cap.evidence} [${cap.pageOrSlide}]`
            : cap.evidence,
          source: input.sourceDoc,
          ...(cap.lastUsed ? { date: cap.lastUsed } : {}),
          ...(cap.years ? { durationMonths: cap.years * 12 } : {}),
        },
      ];

      return {
        id: `ci-${++this.itemCounter}`,
        category: cap.category as DemandCategory,
        taxonomyRef,
        rawText: cap.rawText,
        level: cap.level as ProficiencyLevel,
        ...(cap.years !== null ? { years: cap.years } : {}),
        evidence,
        ...(cap.lastUsed ? { lastUsed: cap.lastUsed } : {}),
      };
    });

    return {
      id: input.id,
      domain: "company",
      name: input.name,
      source: {
        type: "company_profile",
        id: input.id,
        extractedAt: new Date().toISOString(),
        extractorVersion: `llm-company-extractor@${this.version}`,
      },
      capabilities,
      context: {
        ...(parsed.totalExperienceYears !== null
          ? { totalExperienceYears: parsed.totalExperienceYears }
          : {}),
        ...(input.location
          ? { location: input.location }
          : parsed.location
          ? {
              location: {
                ...(parsed.location.city
                  ? { city: parsed.location.city }
                  : {}),
                ...(parsed.location.state
                  ? { state: parsed.location.state }
                  : {}),
                ...(parsed.location.country
                  ? { country: parsed.location.country }
                  : {}),
              },
            }
          : {}),
        ...(input.metadata ? { metadata: input.metadata } : {}),
      },
    };
  }
}
