// ── Specs ────────────────────────────────────────────────────────
export {
  ProficiencyLevel,
  LEVEL_ORDINAL,
  Criticality,
  DemandCategory,
  TaxonomyRef,
  EvidenceType,
  Evidence,
  TaxonomyMatchType,
} from "./specs/common.js";

export {
  LocationRequirement,
  CompensationRequirement,
  TimelineRequirement,
  DemandItem,
  DemandSpec,
} from "./specs/demand-spec.js";

export {
  CapabilityItem,
  CapabilitySpec,
} from "./specs/capability-spec.js";

export {
  ScoreBreakdown,
  ItemMatch,
  MatchSummaryItem,
  CategoryScore,
  SpecMatchResult,
  Recommendation,
  RecommendationVerdict,
  BlockerItem,
  RemediationPlan,
} from "./specs/match-result.js";

// ── Profiles ────────────────────────────────────────────────────
export { ScoringProfile } from "./profiles/types.js";
export {
  SOFTWARE_ENGINEER_PROFILE,
  HEALTHCARE_CLINICAL_PROFILE,
  GOVERNMENT_RFP_PROFILE,
  DEFAULT_PROFILES,
} from "./profiles/defaults.js";

// ── Taxonomy ────────────────────────────────────────────────────
export type {
  TaxonomyNode,
  TaxonomyTree,
  ResolveResult,
  TaxonomyRelationship,
} from "./taxonomy/types.js";
export { TaxonomyResolver } from "./taxonomy/resolver.js";
export { buildTree } from "./taxonomy/builder.js";
export {
  technologyTree,
  certificationsTree,
  educationTree,
  domainKnowledgeTree,
  softSkillsTree,
  infrastructureTree,
  financialTree,
  manpowerTree,
  createDefaultResolver,
} from "./taxonomy/index.js";

// ── Extractors ──────────────────────────────────────────────────
export type { DemandExtractor, AsyncDemandExtractor, CapabilityExtractor, AsyncCapabilityExtractor } from "./extractors/types.js";
export { PositionExtractor } from "./extractors/position-extractor.js";
export type { PositionInput } from "./extractors/position-extractor.js";
export { ResumeExtractor } from "./extractors/resume-extractor.js";
export type { ResumeInput } from "./extractors/resume-extractor.js";

// ── LLM ─────────────────────────────────────────────────────────
export type { LLMProvider, LLMChatParams, LLMProviderConfig } from "./llm/types.js";
export { AnthropicAdapter } from "./llm/anthropic-adapter.js";
export { OpenAIAdapter } from "./llm/openai-adapter.js";
export { createLLMProvider } from "./llm/index.js";

// ── LLM Extractors ──────────────────────────────────────────────
export { LLMResumeExtractor } from "./extractors/llm-resume-extractor.js";
export { RFPExtractor } from "./extractors/rfp-extractor.js";
export type { RFPInput, RFPRequirementInput } from "./extractors/rfp-extractor.js";
export { LLMRFPExtractor } from "./extractors/llm-rfp-extractor.js";
export type { LLMRFPInput } from "./extractors/llm-rfp-extractor.js";
export { CompanyExtractor } from "./extractors/company-extractor.js";
export type { CompanyInput, CompanyCapabilityInput } from "./extractors/company-extractor.js";
export { LLMCompanyExtractor } from "./extractors/llm-company-extractor.js";
export type { LLMCompanyInput } from "./extractors/llm-company-extractor.js";

// ── Engine ──────────────────────────────────────────────────────
export { OpenSpecMatchEngine } from "./engine/index.js";
export type { EngineConfig, OperationMode } from "./engine/index.js";
export { matchSpecs, matchBatch } from "./engine/matcher.js";
export { compareItems } from "./engine/comparator.js";
export { combine } from "./engine/combinator.js";
export type { CombinationPolicy } from "./engine/combinator.js";
export { recommend, remediationFromDemand } from "./engine/recommender.js";
export type { RecommenderOptions, RemediationLookup } from "./engine/recommender.js";
