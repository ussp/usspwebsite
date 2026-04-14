import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { AssessmentScopeRecord } from "../../types/readiness-deliverables.js";

export async function getScopePillars(
  assessmentId: string,
  siteId?: string
): Promise<AssessmentScopeRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("assessment_scope")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("pillar");

  if (error || !data) return [];
  return data as AssessmentScopeRecord[];
}

export async function setScopePillars(
  assessmentId: string,
  pillars: { pillar: string; in_scope: boolean }[],
  siteId?: string
): Promise<AssessmentScopeRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const rows = pillars.map((p) => ({
    assessment_id: assessmentId,
    site_id: site,
    pillar: p.pillar,
    in_scope: p.in_scope,
  }));

  const { data, error } = await supabase
    .from("assessment_scope")
    .upsert(rows, { onConflict: "assessment_id,site_id,pillar" })
    .select("*");

  if (error || !data) return [];
  return data as AssessmentScopeRecord[];
}

export async function isPillarInScope(
  assessmentId: string,
  pillar: string,
  siteId?: string
): Promise<boolean> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data } = await supabase
    .from("assessment_scope")
    .select("in_scope")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .eq("pillar", pillar)
    .single();

  return data?.in_scope === true;
}

export async function getInScopePillars(
  assessmentId: string,
  siteId?: string
): Promise<string[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("assessment_scope")
    .select("pillar")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .eq("in_scope", true)
    .order("pillar");

  if (error || !data) return [];
  return data.map((r: { pillar: string }) => r.pillar);
}
