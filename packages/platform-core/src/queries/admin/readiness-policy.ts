import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { AssessmentPolicy, UpsertAssessmentPolicyInput } from "../../types/ai-tools.js";

export async function getAssessmentPolicy(assessmentId: string, siteId?: string): Promise<AssessmentPolicy | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("assessment_policies")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("site_id", site)
    .single();
  if (error) return null;
  return data;
}

export async function upsertAssessmentPolicy(
  assessmentId: string,
  input: UpsertAssessmentPolicyInput,
  siteId?: string
): Promise<AssessmentPolicy> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const existing = await getAssessmentPolicy(assessmentId, site);

  if (existing) {
    const { data, error } = await supabase
      .from("assessment_policies")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("assessment_policies")
      .insert({ assessment_id: assessmentId, site_id: site, ...input })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}
