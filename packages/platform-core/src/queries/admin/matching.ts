import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminMatchScore,
  MatchFilters,
  MatchFeedbackInput,
  AdminPositionRequirement,
  UpsertPositionRequirementInput,
} from "../../types/admin.js";

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
