import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { AdminResume, CreateResumeInput } from "../../types/admin.js";

const RESUME_COLUMNS =
  "id, site_id, candidate_id, storage_path, file_name, file_type, position_id, is_primary, extracted_text, extracted_skills, extracted_experience_years, extracted_education, extraction_status, extraction_error, uploaded_at";

export async function getResumesByCandidateId(
  candidateId: string
): Promise<AdminResume[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("resumes")
    .select(RESUME_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .order("uploaded_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getResumeById(
  id: string
): Promise<AdminResume | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("resumes")
    .select(RESUME_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getLatestResume(
  candidateId: string
): Promise<AdminResume | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("resumes")
    .select(RESUME_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

export async function createResume(
  input: CreateResumeInput
): Promise<{ success: boolean; resume?: AdminResume; error?: string }> {
  const supabase = getServiceClient();

  // Determine file type from name
  const ext = input.file_name.split(".").pop()?.toLowerCase() || null;

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      site_id: getSiteId(),
      candidate_id: input.candidate_id,
      storage_path: input.storage_path,
      file_name: input.file_name,
      file_type: input.file_type || ext,
      position_id: input.position_id || null,
      is_primary: input.is_primary ?? false,
    })
    .select(RESUME_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, resume: data };
}

export async function setPrimaryResume(
  candidateId: string,
  resumeId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const siteId = getSiteId();

  // Unset all primary flags for this candidate
  await supabase
    .from("resumes")
    .update({ is_primary: false })
    .eq("site_id", siteId)
    .eq("candidate_id", candidateId);

  // Set the target resume as primary
  const { error } = await supabase
    .from("resumes")
    .update({ is_primary: true })
    .eq("site_id", siteId)
    .eq("id", resumeId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateResumeExtraction(
  id: string,
  extraction: {
    extracted_text?: string;
    extracted_skills?: string[];
    extracted_experience_years?: number;
    extracted_education?: Array<{ degree: string; institution: string; year?: number }>;
    extraction_status: string;
    extraction_error?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("resumes")
    .update(extraction)
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
