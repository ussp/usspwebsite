import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AIAssessment,
  AIMetric,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  CreateMetricInput,
} from "../../types/ai-tools.js";

// =============================================================================
// Assessments
// =============================================================================

const ASSESSMENT_COLUMNS = "id, site_id, team_id, assessment_type, period_start, period_end, sprint_count, data_source, status, assessed_by, notes, created_at, updated_at";

export async function getAssessmentsByTeam(
  teamId: string,
  siteId?: string
): Promise<AIAssessment[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_assessments")
    .select(ASSESSMENT_COLUMNS)
    .eq("site_id", site)
    .eq("team_id", teamId)
    .order("assessment_type", { ascending: true });

  if (error || !data) return [];
  return data as AIAssessment[];
}

export async function getAssessmentById(
  id: string,
  siteId?: string
): Promise<AIAssessment | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_assessments")
    .select(ASSESSMENT_COLUMNS)
    .eq("site_id", site)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as AIAssessment;
}

export async function createAssessment(
  input: CreateAssessmentInput,
  assessedBy: string,
  siteId?: string
): Promise<{ success: boolean; data?: AIAssessment; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const insertData: Record<string, unknown> = {
    ...input,
    site_id: site,
    data_source: input.data_source || "manual",
  };
  // Only set assessed_by if it's a valid UUID (staff_users FK)
  if (assessedBy && assessedBy.length > 10) {
    insertData.assessed_by = assessedBy;
  }

  const { data, error } = await supabase
    .from("ai_assessments")
    .insert(insertData as Record<string, unknown>)
    .select(ASSESSMENT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as AIAssessment };
}

export async function updateAssessment(
  id: string,
  input: UpdateAssessmentInput,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const updateData: Record<string, unknown> = {};
  if (input.period_start !== undefined) updateData.period_start = input.period_start;
  if (input.period_end !== undefined) updateData.period_end = input.period_end;
  if (input.sprint_count !== undefined) updateData.sprint_count = input.sprint_count;
  if (input.data_source !== undefined) updateData.data_source = input.data_source;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.notes !== undefined) updateData.notes = input.notes;

  const { error } = await supabase
    .from("ai_assessments")
    .update(updateData)
    .eq("site_id", site)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// =============================================================================
// Metrics
// =============================================================================

export async function getMetricsByAssessment(
  assessmentId: string,
  siteId?: string
): Promise<AIMetric[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_metrics")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("category", { ascending: true })
    .order("metric_name", { ascending: true });

  if (error || !data) return [];
  return data as AIMetric[];
}

export async function upsertMetrics(
  inputs: CreateMetricInput[],
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  if (inputs.length === 0) return { success: true };

  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Delete existing metrics for the same assessment + category + metric_name combinations
  // to prevent duplicates on re-sync
  const assessmentId = inputs[0].assessment_id;
  await supabase
    .from("ai_metrics")
    .delete()
    .eq("site_id", site)
    .eq("assessment_id", assessmentId);

  const rows = inputs.map((input) => ({
    ...input,
    site_id: site,
  }));

  const { error } = await supabase.from("ai_metrics").insert(rows);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function submitSurveyResponses(
  assessmentId: string,
  responses: {
    member_id: string;
    metrics: { category: string; metric_name: string; metric_value: number; metric_unit: string }[];
  }[],
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const rows: Record<string, unknown>[] = [];
  for (const response of responses) {
    for (const metric of response.metrics) {
      rows.push({
        site_id: site,
        assessment_id: assessmentId,
        category: metric.category,
        metric_name: metric.metric_name,
        metric_value: metric.metric_value,
        metric_unit: metric.metric_unit,
        member_id: response.member_id,
      });
    }
  }

  if (rows.length === 0) return { success: true };

  const { error } = await supabase.from("ai_metrics").insert(rows);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
