import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  DataReadinessRecord,
  UpsertDataReadinessInput,
} from "../../types/readiness-deliverables.js";

export async function getDataReadiness(
  assessmentId: string,
  siteId?: string
): Promise<DataReadinessRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("data_readiness")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .single();

  if (error || !data) return null;
  return data as DataReadinessRecord;
}

export async function upsertDataReadiness(
  assessmentId: string,
  input: UpsertDataReadinessInput,
  siteId?: string
): Promise<DataReadinessRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const row: Record<string, unknown> = {
    assessment_id: assessmentId,
    site_id: site,
    updated_at: new Date().toISOString(),
  };

  if (input.data_quality !== undefined) row.data_quality = input.data_quality;
  if (input.data_accessibility !== undefined) row.data_accessibility = input.data_accessibility;
  if (input.data_governance !== undefined) row.data_governance = input.data_governance;
  if (input.data_pipelines !== undefined) row.data_pipelines = input.data_pipelines;
  if (input.data_security !== undefined) row.data_security = input.data_security;
  if (input.evidence_notes !== undefined) row.evidence_notes = input.evidence_notes;

  const { data, error } = await supabase
    .from("data_readiness")
    .upsert(row, { onConflict: "assessment_id,site_id" })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as DataReadinessRecord;
}
