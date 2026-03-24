export { MatchingEngine } from "./engine.js";
export { ruleBasedScorers } from "./strategies/rule-based.js";
export { normalizeSkill, areSkillsSimilar } from "./utils/skill-synonyms.js";
export { jaccardSimilarity, tokenize, fuzzyMatch } from "./utils/text-similarity.js";
export type {
  MatchDimension,
  DimensionResult,
  MatchResult,
  MatchConfig,
  CandidateMatchData,
  PositionMatchData,
  DimensionScorer,
  ParsedResume,
} from "./types.js";
export { DEFAULT_WEIGHTS, DEFAULT_CONFIG } from "./types.js";
