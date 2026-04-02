import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminMatchScore,
  MatchFilters,
  MatchFeedbackInput,
  AdminPositionRequirement,
  UpsertPositionRequirementInput,
} from "../../types/admin.js";
import type { CandidateMatchData, PositionMatchData, MatchResult } from "../../matching/types.js";
import { MatchingEngine } from "../../matching/engine.js";
import { ruleBasedScorers } from "../../matching/strategies/rule-based.js";
import { DEFAULT_CONFIG } from "../../matching/types.js";
import { getPositionById } from "./positions.js";
import { getCandidates } from "./candidates.js";
import { getLatestResumesByCandidateIds } from "./resumes.js";
import { getCertificationsByCandidateIds } from "./certifications.js";
import { getActiveAssignmentsByCandidateIds } from "./assignments.js";

// ── Match Scores ────────────────────────────────────────────────────

const MATCH_SCORE_COLUMNS =
  "id, site_id, candidate_id, position_id, resume_id, overall_score, confidence, dimensions, match_areas, gap_areas, algorithm_version, engine_config, is_stale, match_type, scored_by, feedback_score, feedback_notes, computed_at, created_at, updated_at, candidates(full_name, email, candidate_type)";

export async function getMatchScoresForPosition(
  positionId: string,
  filters: MatchFilters = {}
): Promise<AdminMatchScore[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("match_scores")
    .select(MATCH_SCORE_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("position_id", positionId)
    .order("overall_score", { ascending: false });

  if (filters.match_type) {
    query = query.eq("match_type", filters.match_type);
  }
  if (filters.is_stale !== undefined) {
    query = query.eq("is_stale", filters.is_stale);
  }
  if (filters.min_score !== undefined) {
    query = query.gte("overall_score", filters.min_score);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => {
    const candidates = row.candidates as Record<string, unknown> | null;
    return {
      ...row,
      candidate_name: candidates?.full_name as string | undefined,
      candidate_email: candidates?.email as string | undefined,
      candidate_type: candidates?.candidate_type as string | undefined,
      candidates: undefined,
    } as unknown as AdminMatchScore;
  });
}

export async function getMatchScore(
  candidateId: string,
  positionId: string
): Promise<AdminMatchScore | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("match_scores")
    .select(MATCH_SCORE_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .eq("position_id", positionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const candidates = (data as Record<string, unknown>).candidates as Record<string, unknown> | null;
  return {
    ...data,
    candidate_name: candidates?.full_name,
    candidate_email: candidates?.email,
    candidate_type: candidates?.candidate_type,
    candidates: undefined,
  } as unknown as AdminMatchScore;
}

export async function upsertMatchScore(
  score: {
    candidate_id: string;
    position_id: string;
    resume_id?: string;
    overall_score: number;
    confidence: number;
    dimensions: unknown[];
    match_areas: string[];
    gap_areas: string[];
    algorithm_version: string;
    engine_config?: Record<string, unknown>;
    match_type?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const row = {
    site_id: getSiteId(),
    candidate_id: score.candidate_id,
    position_id: score.position_id,
    resume_id: score.resume_id || null,
    overall_score: score.overall_score,
    confidence: score.confidence,
    dimensions: score.dimensions,
    match_areas: score.match_areas,
    gap_areas: score.gap_areas,
    algorithm_version: score.algorithm_version,
    engine_config: score.engine_config || {},
    match_type: score.match_type || "applied",
    is_stale: false,
    computed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("match_scores")
    .upsert(row, {
      onConflict: "candidate_id,position_id,resume_id",
    });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function markScoresStale(opts: {
  positionId?: string;
  candidateId?: string;
}): Promise<void> {
  const supabase = getServiceClient();
  let query = supabase
    .from("match_scores")
    .update({ is_stale: true, updated_at: new Date().toISOString() })
    .eq("site_id", getSiteId());

  if (opts.positionId) query = query.eq("position_id", opts.positionId);
  if (opts.candidateId) query = query.eq("candidate_id", opts.candidateId);

  await query;
}

export async function submitMatchFeedback(
  scoreId: string,
  staffUserId: string,
  feedback: MatchFeedbackInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("match_scores")
    .update({
      feedback_score: feedback.feedback_score,
      feedback_notes: feedback.feedback_notes || null,
      scored_by: staffUserId,
      updated_at: new Date().toISOString(),
    })
    .eq("site_id", getSiteId())
    .eq("id", scoreId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Position Requirements ───────────────────────────────────────────

const POSITION_REQ_COLUMNS =
  "id, site_id, position_id, required_skills, preferred_skills, min_experience_years, max_experience_years, education_level, required_certifications, location_requirement, work_mode, salary_min, salary_max, industry, extraction_method, created_at, updated_at";

export async function getPositionRequirements(
  positionId: string
): Promise<AdminPositionRequirement | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("position_requirements")
    .select(POSITION_REQ_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("position_id", positionId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function upsertPositionRequirements(
  input: UpsertPositionRequirementInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const row = {
    site_id: getSiteId(),
    position_id: input.position_id,
    required_skills: input.required_skills || [],
    preferred_skills: input.preferred_skills || [],
    min_experience_years: input.min_experience_years ?? null,
    max_experience_years: input.max_experience_years ?? null,
    education_level: input.education_level || null,
    required_certifications: input.required_certifications || [],
    location_requirement: input.location_requirement || null,
    work_mode: input.work_mode || null,
    salary_min: input.salary_min ?? null,
    salary_max: input.salary_max ?? null,
    industry: input.industry || null,
    extraction_method: input.extraction_method || "manual",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("position_requirements")
    .upsert(row, { onConflict: "site_id,position_id" });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Scoring Orchestration ──────────────────────────────────────────

export interface ScoringResult {
  scored: number;
  matched: number;
  results: MatchResult[];
  error?: string;
}

export async function scoreCandidatesForPosition(
  positionId: string
): Promise<ScoringResult> {
  // 1. Load position
  const position = await getPositionById(positionId);
  if (!position) {
    return { scored: 0, matched: 0, results: [], error: "Position not found" };
  }

  // 2. Load position requirements
  const requirements = await getPositionRequirements(positionId);
  if (!requirements) {
    return {
      scored: 0,
      matched: 0,
      results: [],
      error: "No position requirements found. Add requirements before matching.",
    };
  }

  // 3. Build PositionMatchData
  const positionData: PositionMatchData = {
    positionId: position.id,
    title: position.title,
    description: position.description,
    location: position.location,
    workMode: requirements.work_mode || position.work_mode,
    salaryRange:
      requirements.salary_min != null && requirements.salary_max != null
        ? `${requirements.salary_min}-${requirements.salary_max}`
        : position.salary_range,
    requiredSkills: requirements.required_skills || [],
    preferredSkills: requirements.preferred_skills || [],
    minExperienceYears: requirements.min_experience_years,
    maxExperienceYears: requirements.max_experience_years,
    educationLevel: requirements.education_level,
    requiredCertifications: requirements.required_certifications || [],
  };

  // 4. Load all candidates (exclude blacklisted)
  const allCandidates = await getCandidates({});
  const candidates = allCandidates.filter(
    (c) => c.current_status !== "blacklisted"
  );

  if (candidates.length === 0) {
    return { scored: 0, matched: 0, results: [] };
  }

  // 5. Batch-load resumes, certifications, and active assignments
  const candidateIds = candidates.map((c) => c.id);
  const [resumeMap, certMap, assignmentMap] = await Promise.all([
    getLatestResumesByCandidateIds(candidateIds),
    getCertificationsByCandidateIds(candidateIds),
    getActiveAssignmentsByCandidateIds(candidateIds),
  ]);

  // 6. Transform into CandidateMatchData
  const candidateDataArray: CandidateMatchData[] = candidates.map((c) => {
    const resume = resumeMap.get(c.id);
    const certs = certMap.get(c.id) || [];
    const activeAssignment = assignmentMap.get(c.id);

    // Format expected bill rate from salary expectations
    let expectedBillRate: string | null = null;
    if (c.salary_expectation_min != null || c.salary_expectation_max != null) {
      const min = c.salary_expectation_min;
      const max = c.salary_expectation_max;
      if (min != null && max != null) {
        expectedBillRate = `${min}-${max}`;
      } else if (min != null) {
        expectedBillRate = `${min}`;
      } else if (max != null) {
        expectedBillRate = `${max}`;
      }
    }

    // Derive availability from status and active assignments
    let availabilityDate: string | null = null;
    if (c.current_status === "available") {
      // Available now — set to today
      availabilityDate = new Date().toISOString();
    } else if (activeAssignment?.end_date) {
      // On assignment — available when it ends
      availabilityDate = activeAssignment.end_date;
    }

    return {
      candidateId: c.id,
      skills: (resume?.extracted_skills as string[]) || [],
      certifications: certs.map((cert) => cert.certification_name),
      experienceYears:
        (resume?.extracted_experience_years as number) ?? null,
      education:
        (resume?.extracted_education as Array<{
          degree: string;
          institution: string;
          year?: number;
        }>) || [],
      location: c.location || null,
      workPreference: c.work_preference || null,
      resumeText: (resume?.extracted_text as string) ?? null,
      resumeUploadedAt: resume?.uploaded_at ?? "",
      candidateType: c.candidate_type,
      expectedBillRate,
      availabilityDate,
      currentAssignment: activeAssignment
        ? {
            endDate: activeAssignment.end_date,
            roleTitle: activeAssignment.role_title,
          }
        : null,
    };
  });

  // 7. Run the matching engine
  const engine = new MatchingEngine(ruleBasedScorers);
  const rawResults = engine.scoreBatch(
    candidateDataArray,
    positionData,
    "manual_trigger"
  );

  // 8. Fill in resume IDs and filter by minimum score
  const minScore = DEFAULT_CONFIG.thresholds.minimumOverallScore;
  const filtered = rawResults
    .map((r, i) => ({
      ...r,
      resumeId: resumeMap.get(candidates[i].id)?.id || "",
    }))
    .filter((r) => r.overallScore >= minScore)
    .sort((a, b) => b.overallScore - a.overallScore);

  // 9. Persist results
  for (const r of filtered) {
    await upsertMatchScore({
      candidate_id: r.candidateId,
      position_id: r.positionId,
      resume_id: r.resumeId || undefined,
      overall_score: r.overallScore,
      confidence: r.confidence,
      dimensions: r.dimensions,
      match_areas: r.matchAreas,
      gap_areas: r.gapAreas,
      algorithm_version: r.algorithmVersion,
      match_type: r.matchType,
    });
  }

  return {
    scored: candidates.length,
    matched: filtered.length,
    results: filtered,
  };
}
