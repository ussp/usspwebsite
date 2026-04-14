import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  ReadinessAssessment,
  CreateReadinessAssessmentInput,
  UpdateReadinessAssessmentInput,
} from "../../types/ai-tools.js";

export async function listReadinessAssessments(siteId?: string): Promise<ReadinessAssessment[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("readiness_assessments")
    .select("*")
    .eq("site_id", site)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getReadinessAssessment(id: string, siteId?: string): Promise<ReadinessAssessment | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("readiness_assessments")
    .select("*")
    .eq("id", id)
    .eq("site_id", site)
    .single();
  if (error) return null;
  return data;
}

export async function createReadinessAssessment(
  input: CreateReadinessAssessmentInput,
  createdBy: string,
  siteId?: string
): Promise<ReadinessAssessment> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("readiness_assessments")
    .insert({
      site_id: site,
      name: input.name,
      engagement_id: input.engagement_id || null,
      prior_assessment_id: input.prior_assessment_id || null,
      deadline: input.deadline || null,
      created_by: createdBy,
      status: "draft",
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateReadinessAssessment(
  id: string,
  input: UpdateReadinessAssessmentInput,
  siteId?: string
): Promise<ReadinessAssessment> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("readiness_assessments")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("site_id", site)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
