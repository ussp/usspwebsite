import type { DemandSpec } from "../specs/demand-spec.js";
import type { CapabilitySpec } from "../specs/capability-spec.js";
import type { SpecMatchResult } from "../specs/match-result.js";
import type { ScoringProfile } from "../profiles/types.js";
import type { PositionInput } from "../extractors/position-extractor.js";
import type { ResumeInput } from "../extractors/resume-extractor.js";
import type { LLMProviderConfig } from "../llm/types.js";
import { TaxonomyResolver } from "../taxonomy/resolver.js";
import { createDefaultResolver } from "../taxonomy/index.js";
import { PositionExtractor } from "../extractors/position-extractor.js";
import { ResumeExtractor } from "../extractors/resume-extractor.js";
import { LLMResumeExtractor } from "../extractors/llm-resume-extractor.js";
import { createLLMProvider } from "../llm/index.js";
import { matchSpecs, matchBatch } from "./matcher.js";
import { DEFAULT_PROFILES, SOFTWARE_ENGINEER_PROFILE } from "../profiles/defaults.js";

export type OperationMode = "full" | "standard" | "minimal";

export interface EngineConfig {
  mode?: OperationMode;
  profiles?: ScoringProfile[];
  /** Pass a custom resolver. If omitted, built-in trees are used. */
  resolver?: TaxonomyResolver;
  /** LLM provider config. Required for "full" mode. */
  llm?: LLMProviderConfig;
}

/**
 * Main entry point for OpenSpecMatch.
 *
 * Usage (standard mode — no LLM):
 *   const engine = new OpenSpecMatchEngine();
 *
 * Usage (full mode — with LLM):
 *   const engine = new OpenSpecMatchEngine({
 *     mode: "full",
 *     llm: { type: "anthropic", apiKey: "sk-..." },
 *   });
 *
 *   const result = await engine.matchResumeAsync(position, resume);
 */
export class OpenSpecMatchEngine {
  private resolver: TaxonomyResolver;
  private profiles: Map<string, ScoringProfile> = new Map();
  private positionExtractor: PositionExtractor;
  private resumeExtractor: ResumeExtractor;
  private llmResumeExtractor: LLMResumeExtractor | null = null;
  readonly mode: OperationMode;

  constructor(config: EngineConfig = {}) {
    this.mode = config.mode ?? (config.llm ? "full" : "standard");
    this.resolver = config.resolver ?? createDefaultResolver();
    this.positionExtractor = new PositionExtractor(this.resolver);
    this.resumeExtractor = new ResumeExtractor(this.resolver);

    // Set up LLM extractor if provider configured
    if (config.llm) {
      const provider = createLLMProvider(config.llm);
      this.llmResumeExtractor = new LLMResumeExtractor(this.resolver, provider);
    }

    // Register profiles
    const allProfiles = [...DEFAULT_PROFILES, ...(config.profiles ?? [])];
    for (const p of allProfiles) {
      this.profiles.set(p.id, p);
    }
  }

  // ── Extractors ─────────────────────────────────────────────────

  extractPosition(input: PositionInput): DemandSpec {
    return this.positionExtractor.extract(input);
  }

  /** Rule-based extraction (synchronous, no LLM) */
  extractResume(input: ResumeInput): CapabilitySpec {
    return this.resumeExtractor.extract(input);
  }

  /** LLM-powered extraction (async, requires LLM config) */
  async extractResumeAsync(input: ResumeInput): Promise<CapabilitySpec> {
    if (!this.llmResumeExtractor) {
      throw new Error(
        "LLM resume extraction requires an LLM provider. " +
        "Pass llm config to OpenSpecMatchEngine constructor.",
      );
    }
    return this.llmResumeExtractor.extract(input);
  }

  // ── Matching ───────────────────────────────────────────────────

  match(
    demand: DemandSpec,
    capability: CapabilitySpec,
    profileId?: string,
  ): SpecMatchResult {
    const profile = this.getProfile(profileId);
    return matchSpecs(demand, capability, profile, this.resolver);
  }

  matchBatch(
    demand: DemandSpec,
    capabilities: CapabilitySpec[],
    profileId?: string,
  ): SpecMatchResult[] {
    const profile = this.getProfile(profileId);
    return matchBatch(demand, capabilities, profile, this.resolver);
  }

  // ── Sync convenience: extract + match (rule-based) ─────────────

  matchResume(
    position: PositionInput,
    resume: ResumeInput,
    profileId?: string,
  ): SpecMatchResult {
    const demand = this.extractPosition(position);
    const capability = this.extractResume(resume);
    return this.match(demand, capability, profileId);
  }

  matchResumes(
    position: PositionInput,
    resumes: ResumeInput[],
    profileId?: string,
  ): SpecMatchResult[] {
    const demand = this.extractPosition(position);
    const capabilities = resumes.map((r) => this.extractResume(r));
    return this.matchBatch(demand, capabilities, profileId);
  }

  // ── Async convenience: extract + match (LLM-powered) ──────────

  async matchResumeAsync(
    position: PositionInput,
    resume: ResumeInput,
    profileId?: string,
  ): Promise<SpecMatchResult> {
    const demand = this.extractPosition(position);
    const capability = await this.extractResumeAsync(resume);
    return this.match(demand, capability, profileId);
  }

  async matchResumesAsync(
    position: PositionInput,
    resumes: ResumeInput[],
    profileId?: string,
  ): Promise<SpecMatchResult[]> {
    const demand = this.extractPosition(position);
    const capabilities = await Promise.all(
      resumes.map((r) => this.extractResumeAsync(r)),
    );
    return this.matchBatch(demand, capabilities, profileId);
  }

  // ── Profile Management ─────────────────────────────────────────

  registerProfile(profile: ScoringProfile): void {
    this.profiles.set(profile.id, profile);
  }

  getProfile(id?: string): ScoringProfile {
    if (!id) return SOFTWARE_ENGINEER_PROFILE;
    const profile = this.profiles.get(id);
    if (!profile) throw new Error(`Scoring profile "${id}" not found`);
    return profile;
  }

  listProfiles(): string[] {
    return [...this.profiles.keys()];
  }

  // ── Taxonomy Access ────────────────────────────────────────────

  get taxonomy(): TaxonomyResolver {
    return this.resolver;
  }

  /** Whether this engine has LLM capabilities */
  get hasLLM(): boolean {
    return this.llmResumeExtractor !== null;
  }
}
