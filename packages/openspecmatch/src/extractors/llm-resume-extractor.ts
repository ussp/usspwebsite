import type { AsyncCapabilityExtractor } from "./types.js";
import type { CapabilitySpec, CapabilityItem } from "../specs/capability-spec.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";
import type { LLMProvider } from "../llm/types.js";
import type { ProficiencyLevel, DemandCategory, Evidence, TaxonomyRef } from "../specs/common.js";
import { z } from "zod";

export interface ResumeInput {
  id: string;
  name: string;
  text: string;
}

// ── LLM response schema ─────────────────────────────────────────

const LLMSkillSchema = z.object({
  name: z.string(),
  category: z.enum([
    "technical_skill", "soft_skill", "certification", "education",
    "domain_knowledge", "tool_proficiency",
  ]),
  level: z.enum(["awareness", "beginner", "intermediate", "advanced", "expert"]),
  years: z.number().nullable(),
  lastUsed: z.string().nullable(),
  evidence: z.string(),
  tools: z.array(z.string()).optional(),
});

const LLMResumeSchema = z.object({
  totalExperienceYears: z.number().nullable(),
  currentRole: z.string().nullable(),
  location: z.object({
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
  }).nullable(),
  workPreference: z.enum(["remote", "hybrid", "onsite", "open_to_travel"]).nullable(),
  skills: z.array(LLMSkillSchema),
});

type LLMResumeResult = z.infer<typeof LLMResumeSchema>;

// ── System prompt ────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a resume analysis engine. Extract structured capability data from resume text.

Return ONLY a JSON object (no markdown, no explanation) with this exact structure:

{
  "totalExperienceYears": <number or null>,
  "currentRole": "<string or null>",
  "location": { "city": "<string or null>", "state": "<string or null>", "country": "<string or null>" },
  "workPreference": "<remote|hybrid|onsite|open_to_travel or null>",
  "skills": [
    {
      "name": "<skill/cert/degree name>",
      "category": "<technical_skill|soft_skill|certification|education|domain_knowledge|tool_proficiency>",
      "level": "<awareness|beginner|intermediate|advanced|expert>",
      "years": <number or null>,
      "lastUsed": "<ISO date or year string, or null>",
      "evidence": "<specific evidence from resume that proves this skill>",
      "tools": ["<related tools/libraries>"]
    }
  ]
}

RULES FOR EXTRACTION:
1. Extract EVERY skill, certification, degree, domain expertise, and soft skill mentioned.
2. Infer proficiency level from CONTEXT, not just mention:
   - "awareness": mentioned but no usage evidence
   - "beginner": used briefly, tutorial-level, intern work
   - "intermediate": used in production, 1-3 years, delivered features
   - "advanced": led projects, architected systems, 3-7 years, mentored others
   - "expert": recognized authority, 7+ years, large-scale systems, published/spoke about it
3. Extract YEARS per skill from context — look for durations, date ranges, "X years of".
4. For each skill, provide SPECIFIC evidence from the resume (not generic descriptions).
5. Include soft skills when there's evidence: "led team of 5" → leadership (advanced), "mentored 12 staff" → mentoring (advanced).
6. Include domain knowledge: healthcare, finance, government, etc.
7. Set lastUsed based on the most recent job where the skill was used.
8. For certifications, set category to "certification" and include the cert name and year.
9. For education, set category to "education" — include degree level AND field of study as separate items.
10. Be thorough — extract 15-40 items from a typical resume. More items = better matching.`;

// ── Extractor ────────────────────────────────────────────────────

export class LLMResumeExtractor implements AsyncCapabilityExtractor<ResumeInput> {
  private itemCounter = 0;

  constructor(
    private resolver: TaxonomyResolver,
    private llm: LLMProvider,
    private version: string = "0.1.0",
  ) {}

  async extract(input: ResumeInput): Promise<CapabilitySpec> {
    this.itemCounter = 0;

    const raw = await this.llm.chat({
      system: SYSTEM_PROMPT,
      user: input.text,
      maxTokens: 4096,
      temperature: 0,
    });

    // Parse LLM response
    let parsed: LLMResumeResult;
    try {
      // Strip markdown fences if present
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = LLMResumeSchema.parse(JSON.parse(cleaned));
    } catch (err) {
      throw new Error(
        `LLM returned invalid JSON for resume "${input.name}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // Convert LLM output to CapabilityItems
    const capabilities: CapabilityItem[] = parsed.skills.map((skill) => {
      const resolved = this.resolver.resolve(skill.name);
      const taxonomyRef: TaxonomyRef | null = resolved.node
        ? { tree: resolved.tree!, path: resolved.node.path, label: resolved.node.label }
        : null;

      const evidence: Evidence[] = [];
      if (skill.evidence) {
        const evType = this.inferEvidenceType(skill.category);
        evidence.push({
          type: evType,
          description: skill.evidence,
          source: "resume",
          durationMonths: skill.years ? skill.years * 12 : undefined,
          date: skill.lastUsed ?? undefined,
        });
      }

      return {
        id: `ci-${++this.itemCounter}`,
        category: skill.category as DemandCategory,
        taxonomyRef,
        rawText: skill.name,
        level: skill.level as ProficiencyLevel,
        years: skill.years ?? undefined,
        evidence,
        lastUsed: skill.lastUsed ?? undefined,
        tools: skill.tools,
      };
    });

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
        totalExperienceYears: parsed.totalExperienceYears ?? undefined,
        currentRole: parsed.currentRole ?? undefined,
        location: parsed.location
          ? {
              city: parsed.location.city ?? undefined,
              state: parsed.location.state ?? undefined,
              country: parsed.location.country ?? undefined,
            }
          : undefined,
        workPreference: parsed.workPreference ?? undefined,
      },
    };
  }

  private inferEvidenceType(category: string): Evidence["type"] {
    switch (category) {
      case "certification":
        return "certification";
      case "education":
        return "education";
      default:
        return "experience";
    }
  }
}
