/**
 * Rule-based Company Capability Extractor
 *
 * Converts a structured company input (list of pre-identified capabilities)
 * into a CapabilitySpec with domain: "company". For profile-doc extraction,
 * use LLMCompanyExtractor.
 */

import type { CapabilityExtractor } from "./types.js";
import type { CapabilitySpec, CapabilityItem } from "../specs/capability-spec.js";
import type {
  DemandCategory,
  Evidence,
  ProficiencyLevel,
  TaxonomyRef,
} from "../specs/common.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";

export interface CompanyCapabilityInput {
  id?: string;
  category: DemandCategory;
  rawText: string;
  level?: ProficiencyLevel;
  years?: number;
  lastUsed?: string;
  evidence?: Array<{
    type?: Evidence["type"];
    description: string;
    source: string;
    date?: string;
    durationMonths?: number;
  }>;
  tools?: string[];
}

export interface CompanyInput {
  id: string;
  name: string;
  capabilities: CompanyCapabilityInput[];
  totalExperienceYears?: number;
  currentRole?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  workPreference?: "remote" | "hybrid" | "onsite" | "open_to_travel";
  metadata?: Record<string, unknown>;
}

export class CompanyExtractor implements CapabilityExtractor<CompanyInput> {
  private itemCounter = 0;

  constructor(
    private resolver: TaxonomyResolver,
    private version: string = "0.1.0",
  ) {}

  extract(input: CompanyInput): CapabilitySpec {
    this.itemCounter = 0;

    const capabilities: CapabilityItem[] = input.capabilities.map((cap) => {
      const resolved = this.resolver.resolve(cap.rawText);
      const taxonomyRef: TaxonomyRef | null = resolved.node
        ? { tree: resolved.tree!, path: resolved.node.path, label: resolved.node.label }
        : null;

      const evidence: Evidence[] = (cap.evidence ?? []).map((e) => ({
        type: e.type ?? "experience",
        description: e.description,
        source: e.source,
        ...(e.date ? { date: e.date } : {}),
        ...(e.durationMonths !== undefined
          ? { durationMonths: e.durationMonths }
          : {}),
      }));

      return {
        id: cap.id ?? `ci-${++this.itemCounter}`,
        category: cap.category,
        taxonomyRef,
        rawText: cap.rawText,
        level: cap.level ?? "advanced",
        ...(cap.years !== undefined ? { years: cap.years } : {}),
        evidence,
        ...(cap.lastUsed ? { lastUsed: cap.lastUsed } : {}),
        ...(cap.tools ? { tools: cap.tools } : {}),
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
        extractorVersion: `company-extractor@${this.version}`,
      },
      capabilities,
      context: {
        ...(input.totalExperienceYears !== undefined
          ? { totalExperienceYears: input.totalExperienceYears }
          : {}),
        ...(input.currentRole ? { currentRole: input.currentRole } : {}),
        ...(input.location ? { location: input.location } : {}),
        ...(input.workPreference ? { workPreference: input.workPreference } : {}),
        ...(input.metadata ? { metadata: input.metadata } : {}),
      },
    };
  }
}
