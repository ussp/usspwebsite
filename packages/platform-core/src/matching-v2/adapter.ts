/**
 * OpenSpecMatch Adapter for USSP ATS
 *
 * Converts existing CandidateMatchData/PositionMatchData into OpenSpecMatch
 * specs, runs the match, and returns results in the existing MatchResult shape
 * so the rest of the ATS (DB, UI, API) doesn't need to change.
 */

import {
  OpenSpecMatchEngine,
  type PositionInput,
  type ResumeInput,
  type SpecMatchResult,
} from "@openspecmatch/engine";
import type {
  CandidateMatchData,
  PositionMatchData,
  MatchResult,
  DimensionResult,
  MatchDimension,
} from "../types/matching.js";

// Singleton engine — initialized once, reused across requests
let _engine: OpenSpecMatchEngine | null = null;

function getEngine(): OpenSpecMatchEngine {
  if (!_engine) {
    _engine = new OpenSpecMatchEngine({
      mode: "standard", // Rule-based extraction (no LLM in server path for now)
    });
  }
  return _engine;
}

// ── Convert USSP Position → OpenSpecMatch PositionInput ─────────

function toPositionInput(pos: PositionMatchData): PositionInput {
  // Parse location string (format: "Chicago, IL" or "Remote")
  const locParts = parseLocation(pos.location);
  const workMode = normalizeWorkMode(pos.workMode);

  return {
    id: pos.positionId,
    title: pos.title,
    requiredSkills: pos.requiredSkills,
    preferredSkills: pos.preferredSkills,
    requiredCertifications: pos.requiredCertifications,
    educationLevel: pos.educationLevel ?? undefined,
    minExperienceYears: pos.minExperienceYears ?? undefined,
    maxExperienceYears: pos.maxExperienceYears ?? undefined,
    location: {
      city: locParts.city,
      state: locParts.state,
      workMode,
    },
    description: pos.description ?? undefined,
  };
}

// ── Convert USSP Candidate → OpenSpecMatch ResumeInput ──────────

function toResumeInput(cand: CandidateMatchData): ResumeInput {
  // Build a text representation from all available data
  const parts: string[] = [];

  // Add resume text if available (this is the primary source)
  if (cand.resumeText) {
    parts.push(cand.resumeText);
  } else {
    // Fall back to structured data
    if (cand.skills.length > 0) {
      parts.push("SKILLS");
      parts.push(cand.skills.join(", "));
    }

    if (cand.certifications.length > 0) {
      parts.push("\nCERTIFICATIONS");
      parts.push(cand.certifications.join(", "));
    }

    if (cand.education.length > 0) {
      parts.push("\nEDUCATION");
      for (const edu of cand.education) {
        parts.push(`${edu.degree} — ${edu.institution}${edu.year ? ` (${edu.year})` : ""}`);
      }
    }

    if (cand.experienceYears != null) {
      parts.push(`\n${cand.experienceYears} years of professional experience`);
    }

    if (cand.location) {
      parts.push(`\nLocation: ${cand.location}`);
    }

    if (cand.workPreference) {
      parts.push(`Work preference: ${cand.workPreference}`);
    }
  }

  return {
    id: cand.candidateId,
    name: cand.candidateId, // Name not available in CandidateMatchData
    text: parts.join("\n"),
  };
}

// ── Convert OpenSpecMatch Result → USSP MatchResult ─────────────

function toMatchResult(
  specResult: SpecMatchResult,
  candidate: CandidateMatchData,
  position: PositionMatchData,
  matchType: "applied" | "passive_scan" | "manual_trigger",
): MatchResult {
  // Map OpenSpecMatch category scores → USSP dimension results
  const dimensions: DimensionResult[] = [];

  // Skills dimension (technical_skill + tool_proficiency)
  const techScore = specResult.categoryScores["technical_skill"];
  const toolScore = specResult.categoryScores["tool_proficiency"];
  const skillsScore = techScore
    ? toolScore
      ? Math.round((techScore.score * 0.7 + toolScore.score * 0.3))
      : techScore.score
    : 0;
  const skillMatched = specResult.strengths
    .filter(s => s.category === "technical_skill" || s.category === "tool_proficiency")
    .map(s => s.rawText)
    .slice(0, 3);
  const skillMissing = specResult.gaps
    .filter(s => s.category === "technical_skill" || s.category === "tool_proficiency")
    .map(s => s.rawText)
    .slice(0, 3);

  dimensions.push({
    dimension: "skills" as MatchDimension,
    score: skillsScore,
    weight: 0.30,
    weightedScore: skillsScore * 0.30,
    matchedItems: skillMatched,
    missingItems: skillMissing,
    notes: `${techScore?.matchedCount ?? 0}/${techScore?.itemCount ?? 0} skills matched`,
  });

  // Experience dimension (from domain_knowledge category + context)
  const dkScore = specResult.categoryScores["domain_knowledge"];
  const expScore = dkScore?.score ?? 50; // Default 50 if no domain knowledge requirements
  dimensions.push({
    dimension: "experience_level" as MatchDimension,
    score: expScore,
    weight: 0.20,
    weightedScore: expScore * 0.20,
    matchedItems: specResult.strengths
      .filter(s => s.category === "domain_knowledge")
      .map(s => s.rawText)
      .slice(0, 3),
    missingItems: specResult.gaps
      .filter(s => s.category === "domain_knowledge")
      .map(s => s.rawText)
      .slice(0, 3),
    notes: null,
  });

  // Location dimension (from location scoring in the result)
  const locationSummary = [...specResult.strengths, ...specResult.gaps, ...specResult.unknowns]
    .find(s => s.category === "geographic");
  const locationScore = locationSummary?.score ?? 70; // Default if no location context
  dimensions.push({
    dimension: "location" as MatchDimension,
    score: locationScore,
    weight: 0.10,
    weightedScore: locationScore * 0.10,
    matchedItems: locationScore >= 70 ? [locationSummary?.explanation ?? "Location compatible"] : [],
    missingItems: locationScore < 50 ? [locationSummary?.explanation ?? "Location mismatch"] : [],
    notes: locationSummary?.explanation ?? null,
  });

  // Education dimension
  const eduScore = specResult.categoryScores["education"];
  dimensions.push({
    dimension: "education" as MatchDimension,
    score: eduScore?.score ?? 50,
    weight: 0.10,
    weightedScore: (eduScore?.score ?? 50) * 0.10,
    matchedItems: specResult.strengths
      .filter(s => s.category === "education")
      .map(s => s.rawText)
      .slice(0, 3),
    missingItems: specResult.gaps
      .filter(s => s.category === "education")
      .map(s => s.rawText)
      .slice(0, 3),
    notes: `${eduScore?.matchedCount ?? 0}/${eduScore?.itemCount ?? 0} education items matched`,
  });

  // Certifications dimension
  const certScore = specResult.categoryScores["certification"];
  dimensions.push({
    dimension: "certifications" as MatchDimension,
    score: certScore?.score ?? 50,
    weight: 0.08,
    weightedScore: (certScore?.score ?? 50) * 0.08,
    matchedItems: specResult.strengths
      .filter(s => s.category === "certification")
      .map(s => s.rawText)
      .slice(0, 3),
    missingItems: specResult.gaps
      .filter(s => s.category === "certification")
      .map(s => s.rawText)
      .slice(0, 3),
    notes: specResult.passedMandatoryGate
      ? null
      : `Failed mandatory certs: ${specResult.failedMandatory.join(", ")}`,
  });

  // Resume recency (passthrough — OpenSpecMatch doesn't score this, it's a business metric)
  const daysSinceUpload = candidate.resumeUploadedAt
    ? Math.floor((Date.now() - new Date(candidate.resumeUploadedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  const recencyScore = daysSinceUpload <= 30 ? 100 : daysSinceUpload <= 90 ? 80 : daysSinceUpload <= 180 ? 60 : daysSinceUpload <= 365 ? 40 : 20;
  dimensions.push({
    dimension: "resume_recency" as MatchDimension,
    score: recencyScore,
    weight: 0.07,
    weightedScore: recencyScore * 0.07,
    matchedItems: recencyScore >= 70 ? ["Resume recently updated"] : [],
    missingItems: recencyScore < 50 ? ["Resume is stale"] : [],
    notes: `Uploaded ${daysSinceUpload} days ago`,
  });

  // Availability (passthrough — business metric, not skills)
  const availScore = computeAvailabilityScore(candidate);
  dimensions.push({
    dimension: "availability" as MatchDimension,
    score: availScore,
    weight: 0.08,
    weightedScore: availScore * 0.08,
    matchedItems: availScore >= 70 ? ["Available soon"] : [],
    missingItems: availScore < 50 ? ["Not available soon"] : [],
    notes: candidate.availabilityDate ? `Available: ${candidate.availabilityDate}` : "No data",
  });

  // Rate compatibility (passthrough — business metric)
  const rateScore = 70; // Neutral — rate is a business decision
  dimensions.push({
    dimension: "rate_compatibility" as MatchDimension,
    score: rateScore,
    weight: 0.07,
    weightedScore: rateScore * 0.07,
    matchedItems: [],
    missingItems: [],
    notes: "Rate assessed separately in pipeline",
  });

  // Compute overall score from dimensions
  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.weightedScore, 0)
  );

  // Build match/gap area strings
  const matchAreas = dimensions
    .filter(d => d.score >= 70)
    .flatMap(d => d.matchedItems.length > 0 ? d.matchedItems.slice(0, 3) : [d.dimension + " match"])
    .slice(0, 5);

  const gapAreas = dimensions
    .filter(d => d.score < 50)
    .flatMap(d => d.missingItems.length > 0 ? d.missingItems.slice(0, 3) : [d.dimension + " gap"])
    .slice(0, 5);

  return {
    candidateId: candidate.candidateId,
    positionId: position.positionId,
    resumeId: "", // Filled by caller
    overallScore: Math.min(100, Math.max(0, overallScore)),
    confidence: specResult.confidence,
    dimensions,
    matchAreas,
    gapAreas,
    algorithmVersion: `openspecmatch-v${specResult.engineVersion}`,
    matchType,
  };
}

// ── Public API ───────────────────────────────────────────────────

/**
 * Score a single candidate against a position using OpenSpecMatch.
 * Returns the result in the existing USSP MatchResult shape.
 */
export function scoreWithOpenSpecMatch(
  candidate: CandidateMatchData,
  position: PositionMatchData,
  matchType: "applied" | "passive_scan" | "manual_trigger" = "applied",
): MatchResult {
  const engine = getEngine();
  const posInput = toPositionInput(position);
  const resInput = toResumeInput(candidate);

  const specResult = engine.matchResume(posInput, resInput);
  return toMatchResult(specResult, candidate, position, matchType);
}

/**
 * Score a batch of candidates against a position using OpenSpecMatch.
 */
export function scoreBatchWithOpenSpecMatch(
  candidates: CandidateMatchData[],
  position: PositionMatchData,
  matchType: "applied" | "passive_scan" | "manual_trigger" = "applied",
): MatchResult[] {
  return candidates.map(c => scoreWithOpenSpecMatch(c, position, matchType));
}

// ── Helpers ──────────────────────────────────────────────────────

function parseLocation(loc: string): { city?: string; state?: string } {
  if (!loc) return {};
  const lower = loc.toLowerCase().trim();
  if (lower === "remote" || lower === "n/a") return {};

  // Try "City, ST" format
  const parts = loc.split(",").map(s => s.trim());
  if (parts.length >= 2) {
    return { city: parts[0], state: parts[1] };
  }
  // Single value — could be city or state
  return { city: parts[0] };
}

function normalizeWorkMode(mode: string | null): "remote" | "hybrid" | "onsite" {
  if (!mode) return "onsite";
  const lower = mode.toLowerCase();
  if (lower === "remote") return "remote";
  if (lower === "hybrid") return "hybrid";
  return "onsite";
}

function computeAvailabilityScore(cand: CandidateMatchData): number {
  if (!cand.availabilityDate) return 70; // Unknown = neutral
  const daysUntil = Math.floor(
    (new Date(cand.availabilityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntil <= 0) return 100;   // Available now
  if (daysUntil <= 14) return 100;
  if (daysUntil <= 30) return 80;
  if (daysUntil <= 60) return 60;
  return 40;
}
