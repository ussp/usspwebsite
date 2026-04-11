import type { DemandExtractor } from "./types.js";
import type { DemandSpec, DemandItem } from "../specs/demand-spec.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";
import type { Criticality, ProficiencyLevel, TaxonomyRef, DemandCategory } from "../specs/common.js";

/** Structured position input (what we expect from a database record or JSON) */
export interface PositionInput {
  id: string;
  title: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  requiredCertifications?: string[];
  preferredCertifications?: string[];
  educationLevel?: string;
  educationField?: string;
  minExperienceYears?: number;
  maxExperienceYears?: number;
  industry?: string;
  /** Organization sector: federal, state, local, commercial, nonprofit, education, healthcare */
  sector?: string;
  /** Specific client/agency (e.g., "DCFS", "DOD", "Cook County") */
  client?: string;
  /** Required domain knowledge areas */
  requiredDomainKnowledge?: string[];
  /** Required compliance frameworks (e.g., "HIPAA", "FedRAMP", "CJIS") */
  requiredCompliance?: string[];
  /** Security clearance requirement */
  securityClearance?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    workMode?: "remote" | "hybrid" | "onsite";
    relocationOk?: boolean;
  };
  compensation?: {
    min?: number;
    max?: number;
    currency?: string;
    type?: "hourly" | "annual" | "monthly" | "project";
  };
  description?: string;
}

export class PositionExtractor implements DemandExtractor<PositionInput> {
  private itemCounter = 0;

  constructor(
    private resolver: TaxonomyResolver,
    private version: string = "0.1.0",
  ) {}

  extract(input: PositionInput): DemandSpec {
    this.itemCounter = 0;
    const requirements: DemandItem[] = [];

    // Extract required skills
    if (input.requiredSkills) {
      for (const skill of input.requiredSkills) {
        requirements.push(this.makeItem(skill, "technical_skill", "mandatory", "advanced"));
      }
    }

    // Extract preferred skills
    if (input.preferredSkills) {
      for (const skill of input.preferredSkills) {
        requirements.push(this.makeItem(skill, "technical_skill", "preferred", "intermediate"));
      }
    }

    // Extract required certifications (mandatory for healthcare, important for others)
    if (input.requiredCertifications) {
      for (const cert of input.requiredCertifications) {
        requirements.push(this.makeItem(cert, "certification", "mandatory", "intermediate"));
      }
    }

    // Extract preferred certifications
    if (input.preferredCertifications) {
      for (const cert of input.preferredCertifications) {
        requirements.push(this.makeItem(cert, "certification", "preferred", "intermediate"));
      }
    }

    // Extract education
    if (input.educationLevel) {
      const rawText = input.educationField
        ? `${input.educationLevel} in ${input.educationField}`
        : input.educationLevel;
      requirements.push(this.makeItem(rawText, "education", "important", "intermediate"));
      if (input.educationField) {
        requirements.push(this.makeItem(input.educationField, "education", "preferred", "intermediate"));
      }
    }

    // Extract sector requirement (federal, state, commercial, etc.)
    if (input.sector) {
      requirements.push(this.makeItem(input.sector, "domain_knowledge", "important", "intermediate"));
    }

    // Extract client/agency as domain knowledge
    if (input.client) {
      requirements.push(this.makeItem(input.client, "domain_knowledge", "preferred", "intermediate"));
    }

    // Extract required domain knowledge
    if (input.requiredDomainKnowledge) {
      for (const dk of input.requiredDomainKnowledge) {
        requirements.push(this.makeItem(dk, "domain_knowledge", "important", "intermediate"));
      }
    }

    // Extract compliance requirements
    if (input.requiredCompliance) {
      for (const comp of input.requiredCompliance) {
        requirements.push(this.makeItem(comp, "compliance", "mandatory", "intermediate"));
      }
    }

    // Extract security clearance
    if (input.securityClearance) {
      requirements.push(this.makeItem(input.securityClearance, "compliance", "mandatory", "intermediate"));
    }

    // Extract experience as domain knowledge if significant
    if (input.minExperienceYears && input.minExperienceYears >= 5) {
      const level: ProficiencyLevel = input.minExperienceYears >= 8 ? "expert" : "advanced";
      requirements.push({
        ...this.makeItem(
          `${input.minExperienceYears}+ years professional experience`,
          "domain_knowledge",
          "important",
          level,
        ),
        minYears: input.minExperienceYears,
        maxYears: input.maxExperienceYears,
      });
    }

    return {
      id: `ds-${input.id}`,
      domain: "position",
      title: input.title,
      source: {
        type: "position",
        id: input.id,
        extractedAt: new Date().toISOString(),
        extractorVersion: this.version,
      },
      requirements,
      context: {
        industry: input.industry,
        location: input.location
          ? {
              workMode: input.location.workMode ?? "onsite",
              city: input.location.city,
              state: input.location.state,
              country: input.location.country,
              relocationOk: input.location.relocationOk,
            }
          : undefined,
        compensation: input.compensation
          ? {
              currency: input.compensation.currency ?? "USD",
              type: input.compensation.type ?? "annual",
              min: input.compensation.min,
              max: input.compensation.max,
            }
          : undefined,
      },
    };
  }

  private makeItem(
    rawText: string,
    category: DemandCategory,
    criticality: Criticality,
    level: ProficiencyLevel,
  ): DemandItem {
    const id = `di-${++this.itemCounter}`;
    const resolved = this.resolver.resolve(rawText);
    const taxonomyRef: TaxonomyRef | null = resolved.node
      ? { tree: resolved.tree!, path: resolved.node.path, label: resolved.node.label }
      : null;

    return {
      id,
      category,
      taxonomyRef,
      rawText,
      level,
      criticality,
    };
  }
}
