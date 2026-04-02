import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  CandidateCertification,
  CreateCertificationInput,
  UpdateCertificationInput,
} from "../../types/admin.js";

const CERT_COLUMNS =
  "id, site_id, candidate_id, certification_name, issuing_organization, issue_date, expiry_date, credential_id, source, verified, verified_by, verified_at, created_at, updated_at";

export async function getCertificationsByCandidateId(
  candidateId: string
): Promise<CandidateCertification[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidate_certifications")
    .select(CERT_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function addCertification(
  input: CreateCertificationInput
): Promise<{ success: boolean; certification?: CandidateCertification; error?: string }> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidate_certifications")
    .insert({
      site_id: getSiteId(),
      candidate_id: input.candidate_id,
      certification_name: input.certification_name,
      issuing_organization: input.issuing_organization || null,
      issue_date: input.issue_date || null,
      expiry_date: input.expiry_date || null,
      credential_id: input.credential_id || null,
      source: input.source || "recruiter_added",
    })
    .select(CERT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, certification: data };
}

export async function updateCertification(
  id: string,
  input: UpdateCertificationInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.certification_name !== undefined) updates.certification_name = input.certification_name;
  if (input.issuing_organization !== undefined) updates.issuing_organization = input.issuing_organization;
  if (input.issue_date !== undefined) updates.issue_date = input.issue_date;
  if (input.expiry_date !== undefined) updates.expiry_date = input.expiry_date;
  if (input.credential_id !== undefined) updates.credential_id = input.credential_id;
  if (input.verified !== undefined) updates.verified = input.verified;
  if (input.verified_by !== undefined) updates.verified_by = input.verified_by;
  if (input.verified_at !== undefined) updates.verified_at = input.verified_at;

  const { error } = await supabase
    .from("candidate_certifications")
    .update(updates)
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteCertification(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("candidate_certifications")
    .delete()
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function verifyCertification(
  id: string,
  staffUserId: string
): Promise<{ success: boolean; error?: string }> {
  return updateCertification(id, {
    verified: true,
    verified_by: staffUserId,
    verified_at: new Date().toISOString(),
  });
}

export async function bulkAddCertifications(
  candidateId: string,
  certNames: string[]
): Promise<{ added: number; skipped: number }> {
  const existing = await getCertificationsByCandidateId(candidateId);
  const existingNames = new Set(existing.map((c) => c.certification_name.toLowerCase()));

  let added = 0;
  let skipped = 0;

  for (const name of certNames) {
    if (existingNames.has(name.toLowerCase())) {
      skipped++;
      continue;
    }
    const result = await addCertification({
      candidate_id: candidateId,
      certification_name: name,
      source: "extracted",
    });
    if (result.success) added++;
    else skipped++;
  }

  return { added, skipped };
}
