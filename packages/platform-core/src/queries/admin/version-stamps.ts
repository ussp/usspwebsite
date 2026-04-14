import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { AssessmentVersionStampRecord } from "../../types/readiness-deliverables.js";

export async function recordVersionStamp(
  assessmentId: string,
  sourceType: string,
  sourceVersion: number,
  sourceDate?: string,
  siteId?: string
): Promise<AssessmentVersionStampRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("assessment_version_stamps")
    .insert({
      assessment_id: assessmentId,
      site_id: site,
      source_type: sourceType,
      source_version: sourceVersion,
      source_date: sourceDate ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as AssessmentVersionStampRecord;
}

export async function getVersionStamps(
  assessmentId: string,
  siteId?: string
): Promise<AssessmentVersionStampRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("assessment_version_stamps")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as AssessmentVersionStampRecord[];
}
