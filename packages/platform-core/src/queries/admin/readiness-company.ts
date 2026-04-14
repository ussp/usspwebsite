import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { AssessmentCompany, UpsertAssessmentCompanyInput } from "../../types/ai-tools.js";

export async function getAssessmentCompany(assessmentId: string, siteId?: string): Promise<AssessmentCompany | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("assessment_companies")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("site_id", site)
    .single();
  if (error) return null;
  return data;
}

export async function upsertAssessmentCompany(
  assessmentId: string,
  input: UpsertAssessmentCompanyInput,
  siteId?: string
): Promise<AssessmentCompany> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Check if exists
  const existing = await getAssessmentCompany(assessmentId, site);

  if (existing) {
    const { data, error } = await supabase
      .from("assessment_companies")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("assessment_companies")
      .insert({ assessment_id: assessmentId, site_id: site, ...input })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}
