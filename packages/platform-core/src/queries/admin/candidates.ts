import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminCandidate,
  CandidateFilters,
  CreateCandidateInput,
  UpdateCandidateInput,
} from "../../types/admin.js";

const CANDIDATE_COLUMNS =
  "id, site_id, email, full_name, phone, linkedin_sub, profile_picture, candidate_type, current_status, source, tags, summary, location, work_preference, salary_expectation_min, salary_expectation_max, salary_type, created_at, updated_at";

export async function getCandidates(
  filters: CandidateFilters = {}
): Promise<AdminCandidate[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("candidates")
    .select(CANDIDATE_COLUMNS)
    .eq("site_id", getSiteId())
    .order("created_at", { ascending: false });

  if (filters.candidate_type) {
    query = query.eq("candidate_type", filters.candidate_type);
  }
  if (filters.current_status) {
    query = query.eq("current_status", filters.current_status);
  }
  if (filters.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getCandidateById(
  id: string
): Promise<AdminCandidate | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidates")
    .select(CANDIDATE_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getCandidateByEmail(
  email: string
): Promise<AdminCandidate | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidates")
    .select(CANDIDATE_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data;
}

export async function createCandidate(
  input: CreateCandidateInput
): Promise<{ success: boolean; candidate?: AdminCandidate; error?: string }> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidates")
    .insert({
      site_id: getSiteId(),
      email: input.email,
      full_name: input.full_name,
      phone: input.phone || null,
      linkedin_sub: input.linkedin_sub || null,
      profile_picture: input.profile_picture || null,
      candidate_type: input.candidate_type || "external",
      current_status: input.current_status || "available",
      source: input.source || "application",
      tags: input.tags || [],
      summary: input.summary || null,
      location: input.location || null,
      work_preference: input.work_preference || null,
      salary_expectation_min: input.salary_expectation_min || null,
      salary_expectation_max: input.salary_expectation_max || null,
      salary_type: input.salary_type || null,
    })
    .select(CANDIDATE_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, candidate: data };
}

export async function updateCandidate(
  id: string,
  input: UpdateCandidateInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.full_name !== undefined) updates.full_name = input.full_name;
  if (input.phone !== undefined) updates.phone = input.phone;
  if (input.linkedin_sub !== undefined) updates.linkedin_sub = input.linkedin_sub;
  if (input.profile_picture !== undefined) updates.profile_picture = input.profile_picture;
  if (input.candidate_type !== undefined) updates.candidate_type = input.candidate_type;
  if (input.current_status !== undefined) updates.current_status = input.current_status;
  if (input.source !== undefined) updates.source = input.source;
  if (input.tags !== undefined) updates.tags = input.tags;
  if (input.summary !== undefined) updates.summary = input.summary;
  if (input.location !== undefined) updates.location = input.location;
  if (input.work_preference !== undefined) updates.work_preference = input.work_preference;
  if (input.salary_expectation_min !== undefined) updates.salary_expectation_min = input.salary_expectation_min;
  if (input.salary_expectation_max !== undefined) updates.salary_expectation_max = input.salary_expectation_max;
  if (input.salary_type !== undefined) updates.salary_type = input.salary_type;

  const { error } = await supabase
    .from("candidates")
    .update(updates)
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function findOrCreateCandidate(
  input: CreateCandidateInput
): Promise<{ candidate: AdminCandidate; created: boolean }> {
  const existing = await getCandidateByEmail(input.email);
  if (existing) {
    // Update with latest info
    await updateCandidate(existing.id, {
      full_name: input.full_name,
      phone: input.phone,
      linkedin_sub: input.linkedin_sub,
      profile_picture: input.profile_picture,
    });
    const updated = await getCandidateById(existing.id);
    return { candidate: updated || existing, created: false };
  }
  const result = await createCandidate(input);
  if (!result.success || !result.candidate) {
    throw new Error(result.error || "Failed to create candidate");
  }
  return { candidate: result.candidate, created: true };
}
