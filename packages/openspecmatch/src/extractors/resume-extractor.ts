import type { CapabilityExtractor } from "./types.js";
import type { CapabilitySpec, CapabilityItem } from "../specs/capability-spec.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";
import type { ProficiencyLevel, TaxonomyRef, DemandCategory, Evidence } from "../specs/common.js";

/** Resume text input */
export interface ResumeInput {
  id: string;
  name: string;
  text: string;
}

/**
 * Rule-based resume extractor.
 * Parses resume text using patterns to extract skills, certs, education, etc.
 * This is the "standard mode" extractor — no LLM required.
 */
export class ResumeExtractor implements CapabilityExtractor<ResumeInput> {
  private itemCounter = 0;

  constructor(
    private resolver: TaxonomyResolver,
    private version: string = "0.1.0",
  ) {}

  extract(input: ResumeInput): CapabilitySpec {
    this.itemCounter = 0;
    const capabilities: CapabilityItem[] = [];
    const textLower = input.text.toLowerCase();
    const lines = input.text.split("\n");

    // Extract skills by scanning against taxonomy
    const foundSkills = this.extractSkills(textLower);
    for (const match of foundSkills) {
      capabilities.push(match);
    }

    // Extract certifications
    const certs = this.extractCertifications(textLower);
    for (const cert of certs) {
      capabilities.push(cert);
    }

    // Extract education
    const education = this.extractEducation(textLower, lines);
    for (const edu of education) {
      capabilities.push(edu);
    }

    // Extract domain knowledge
    const domains = this.extractDomainKnowledge(textLower);
    for (const d of domains) {
      capabilities.push(d);
    }

    // Extract soft skills from evidence patterns
    const softSkills = this.extractSoftSkills(textLower);
    for (const s of softSkills) {
      capabilities.push(s);
    }

    // Estimate total experience
    const totalYears = this.estimateTotalExperience(input.text);

    return {
      id: `cs-${input.id}`,
      domain: "candidate",
      name: input.name,
      source: {
        type: "resume",
        id: input.id,
        extractedAt: new Date().toISOString(),
        extractorVersion: this.version,
      },
      capabilities,
      context: {
        totalExperienceYears: totalYears > 0 ? totalYears : undefined,
      },
    };
  }

  private extractSkills(textLower: string): CapabilityItem[] {
    const items: CapabilityItem[] = [];
    const seen = new Set<string>();

    // Scan for technology skills from taxonomy
    const techTree = this.resolver.getTree("technology");
    if (techTree) {
      for (const [, node] of techTree.nodes) {
        // Skip category nodes (those with children)
        if (node.children.length > 0) continue;

        const allNames = [node.label.toLowerCase(), node.id.toLowerCase(), ...node.aliases.map(a => a.toLowerCase())];
        for (const name of allNames) {
          if (name.length < 2) continue;
          // Word boundary check: ensure we match whole words
          const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`, "i");
          if (pattern.test(textLower) && !seen.has(node.path)) {
            seen.add(node.path);
            const years = this.extractYearsForSkill(textLower, allNames);
            const level = this.inferLevel(years);
            items.push(this.makeCapItem(
              node.label,
              "technical_skill",
              { tree: "technology", path: node.path, label: node.label },
              level,
              years,
            ));
            break;
          }
        }
      }
    }

    return items;
  }

  private extractCertifications(textLower: string): CapabilityItem[] {
    const items: CapabilityItem[] = [];
    const seen = new Set<string>();

    const certTree = this.resolver.getTree("certifications");
    if (certTree) {
      for (const [, node] of certTree.nodes) {
        if (node.children.length > 0) continue;

        const allNames = [node.label.toLowerCase(), ...node.aliases.map(a => a.toLowerCase())];
        for (const name of allNames) {
          if (name.length < 2) continue;
          const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`, "i");
          if (pattern.test(textLower) && !seen.has(node.path)) {
            seen.add(node.path);
            items.push(this.makeCapItem(
              node.label,
              "certification",
              { tree: "certifications", path: node.path, label: node.label },
              "intermediate",
              undefined,
              [{ type: "certification", description: node.label, source: "resume" }],
            ));
            break;
          }
        }
      }
    }

    return items;
  }

  private extractEducation(textLower: string, _lines: string[]): CapabilityItem[] {
    const items: CapabilityItem[] = [];

    // Degree detection
    const degreePatterns: { pattern: RegExp; level: string; label: string }[] = [
      { pattern: /\b(ph\.?d|doctorate|doctoral)\b/i, level: "degrees.doctorate", label: "Doctorate" },
      { pattern: /\b(master'?s?|m\.?s\.?|m\.?a\.?|mba|m\.?eng)\b/i, level: "degrees.master", label: "Master's Degree" },
      { pattern: /\b(bachelor'?s?|b\.?s\.?|b\.?a\.?|b\.?eng|undergraduate)\b/i, level: "degrees.bachelor", label: "Bachelor's Degree" },
      { pattern: /\b(associate'?s?|a\.?a\.?|a\.?s\.?)\b/i, level: "degrees.associate", label: "Associate's Degree" },
      { pattern: /\b(bootcamp|coding academy)\b/i, level: "degrees.bootcamp", label: "Coding Bootcamp" },
    ];

    for (const dp of degreePatterns) {
      if (dp.pattern.test(textLower)) {
        items.push(this.makeCapItem(
          dp.label,
          "education",
          { tree: "education", path: dp.level, label: dp.label },
          "intermediate",
          undefined,
          [{ type: "education", description: dp.label, source: "resume" }],
        ));
        break; // Take highest degree found
      }
    }

    // Field of study
    const fieldTree = this.resolver.getTree("education");
    if (fieldTree) {
      for (const [path, node] of fieldTree.nodes) {
        if (!path.startsWith("fields.") || node.children.length > 0) continue;
        const allNames = [node.label.toLowerCase(), ...node.aliases.map(a => a.toLowerCase())];
        for (const name of allNames) {
          if (name.length < 3) continue;
          const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`, "i");
          if (pattern.test(textLower)) {
            items.push(this.makeCapItem(
              node.label,
              "education",
              { tree: "education", path: node.path, label: node.label },
              "intermediate",
            ));
            return items; // Take first field match
          }
        }
      }
    }

    return items;
  }

  private extractYearsForSkill(textLower: string, skillNames: string[]): number | undefined {
    for (const name of skillNames) {
      // Pattern: "5 years of Python", "Python (7 years)", "8+ years Python"
      const patterns = [
        new RegExp(`(\\d+)\\+?\\s*(?:years?|yrs?)\\s*(?:of\\s+)?${escapeRegex(name)}`, "i"),
        new RegExp(`${escapeRegex(name)}\\s*[:(]?\\s*(\\d+)\\+?\\s*(?:years?|yrs?)`, "i"),
        new RegExp(`(\\d+)\\+?\\s*(?:years?|yrs?).*?${escapeRegex(name)}`, "i"),
      ];
      for (const p of patterns) {
        const match = textLower.match(p);
        if (match && match[1]) {
          return parseInt(match[1], 10);
        }
      }
    }
    return undefined;
  }

  private estimateTotalExperience(text: string): number {
    // Look for "X years of experience" or similar patterns
    const patterns = [
      /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:professional\s+)?experience/i,
      /experience[:\s]+(\d+)\+?\s*(?:years?|yrs?)/i,
    ];
    for (const p of patterns) {
      const match = text.match(p);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }

    // Try to infer from date ranges
    const yearPattern = /(?:19|20)\d{2}/g;
    const years = [...text.matchAll(yearPattern)].map(m => parseInt(m[0], 10));
    if (years.length >= 2) {
      const min = Math.min(...years);
      const max = Math.max(...years);
      if (max - min > 0 && max - min < 50) {
        return max - min;
      }
    }

    return 0;
  }

  private inferLevel(years: number | undefined): ProficiencyLevel {
    if (!years) return "intermediate";
    if (years >= 8) return "expert";
    if (years >= 5) return "advanced";
    if (years >= 2) return "intermediate";
    if (years >= 1) return "beginner";
    return "awareness";
  }

  private extractDomainKnowledge(textLower: string): CapabilityItem[] {
    const items: CapabilityItem[] = [];
    const seen = new Set<string>();

    const domainTree = this.resolver.getTree("domain-knowledge");
    if (domainTree) {
      for (const [, node] of domainTree.nodes) {
        if (node.children.length > 0) continue;
        const allNames = [node.label.toLowerCase(), ...node.aliases.map(a => a.toLowerCase())];
        for (const name of allNames) {
          if (name.length < 3) continue;
          const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`, "i");
          if (pattern.test(textLower) && !seen.has(node.path)) {
            seen.add(node.path);
            items.push(this.makeCapItem(
              node.label,
              "domain_knowledge",
              { tree: "domain-knowledge", path: node.path, label: node.label },
              "intermediate",
            ));
            break;
          }
        }
      }
    }

    return items;
  }

  private extractSoftSkills(textLower: string): CapabilityItem[] {
    const items: CapabilityItem[] = [];
    const patterns: { pattern: RegExp; skill: string; level: ProficiencyLevel }[] = [
      { pattern: /\b(led|leading|lead)\s+(a\s+)?team/i, skill: "Leadership", level: "advanced" },
      { pattern: /\bmentor(ed|ing)\b/i, skill: "Mentoring", level: "advanced" },
      { pattern: /\bcollaborat(ed|ing|ion)\b/i, skill: "Collaboration", level: "intermediate" },
      { pattern: /\bcommunicat(ed|ing|ion)\b.*\b(stakeholder|client|cross-functional)/i, skill: "Stakeholder Communication", level: "advanced" },
      { pattern: /\bpresent(ed|ing|ation)\b/i, skill: "Presentation Skills", level: "intermediate" },
      { pattern: /\bproject\s+manag(ed|ing|ement)/i, skill: "Project Management", level: "intermediate" },
      { pattern: /\bagile\b.*\b(scrum|sprint|kanban)/i, skill: "Agile Methodology", level: "intermediate" },
      { pattern: /\bproblem[\s-]solv(ed|ing)\b/i, skill: "Problem Solving", level: "intermediate" },
    ];

    for (const { pattern, skill, level } of patterns) {
      if (pattern.test(textLower)) {
        items.push(this.makeCapItem(skill, "soft_skill", null, level));
      }
    }

    return items;
  }

  private makeCapItem(
    rawText: string,
    category: DemandCategory,
    taxonomyRef: TaxonomyRef | null,
    level: ProficiencyLevel,
    years?: number,
    evidence?: Evidence[],
  ): CapabilityItem {
    return {
      id: `ci-${++this.itemCounter}`,
      category,
      taxonomyRef,
      rawText,
      level,
      years,
      evidence: evidence ?? [],
    };
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
