// ── Scoring Dimensions ──────────────────────────────────────────────

export type MatchDimension =
  | "skills"
  | "experience_level"
  | "location"
  | "education"
  | "certifications"
  | "resume_recency"
  | "availability"
  | "rate_compatibility";

export interface DimensionResult {
  dimension: MatchDimension;
  score: number;        // 0-100
  weight: number;       // 0.0-1.0
  weightedScore: number;
  matchedItems: string[];
  missingItems: string[];
  notes: string | null;
}

// ── Match Result ────────────────────────────────────────────────────

export interface MatchResult {
  candidateId: string;
  positionId: string;
  resumeId: string;
  overallScore: number;
  confidence: number;
  dimensions: DimensionResult[];
  matchAreas: string[];
  gapAreas: string[];
  algorithmVersion: string;
  matchType: "applied" | "passive_scan" | "manual_trigger";
}

// ── Config ──────────────────────────────────────────────────────────

export interface MatchConfig {
  engineVersion: string;
  weights: Partial<Record<MatchDimension, number>>;
  thresholds: {
    minimumOverallScore: number;
    passiveScanMinimum: number;
  };
}

export const DEFAULT_WEIGHTS: Record<MatchDimension, number> = {
  skills: 0.30,
  experience_level: 0.20,
  location: 0.10,
  education: 0.10,
  certifications: 0.08,
  resume_recency: 0.07,
  availability: 0.08,
  rate_compatibility: 0.07,
};

export const DEFAULT_CONFIG: MatchConfig = {
  engineVersion: "rule-v1",
  weights: DEFAULT_WEIGHTS,
  thresholds: {
    minimumOverallScore: 30,
    passiveScanMinimum: 50,
  },
};

// ── Matching Strategy Interface (pluggable) ─────────────────────────

export interface CandidateMatchData {
  candidateId: string;
  skills: string[];
  experienceYears: number | null;
  education: Array<{ degree: string; institution: string; year?: number }>;
  location: string | null;
  resumeText: string | null;
  resumeUploadedAt: string;
  candidateType: string;
  expectedBillRate: string | null;
  availabilityDate: string | null;
  currentAssignment?: {
    endDate: string | null;
    roleTitle: string;
  } | null;
}

export interface PositionMatchData {
  positionId: string;
  title: string;
  description: string | null;
  location: string;
  workMode: string | null;
  salaryRange: string | null;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperienceYears: number | null;
  maxExperienceYears: number | null;
  educationLevel: string | null;
  requiredCertifications: string[];
}

export interface DimensionScorer {
  readonly name: MatchDimension;
  score(
    candidate: CandidateMatchData,
    position: PositionMatchData
  ): DimensionResult;
}

// ── Parsed Resume ───────────────────────────────────────────────────

export interface ParsedResume {
  skills: string[];
  experienceYears: number | null;
  educationLevel: string | null;
  certifications: string[];
  jobTitles: string[];
  summary: string | null;
}
