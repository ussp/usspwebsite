import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AssessmentConstraintRecord,
  ApprovedToolRecord,
  CreateConstraintInput,
  CreateApprovedToolInput,
} from "../../types/readiness-deliverables.js";
import { CONSTRAINT_TEMPLATES } from "../../types/readiness-deliverables.js";

export async function listConstraints(
  assessmentId: string,
  siteId?: string
): Promise<AssessmentConstraintRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("assessment_constraints")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("sort_order");

  if (error || !data) return [];
  return data as AssessmentConstraintRecord[];
}

export async function createConstraint(
  assessmentId: string,
  input: CreateConstraintInput,
  siteId?: string
): Promise<AssessmentConstraintRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("assessment_constraints")
    .insert({
      assessment_id: assessmentId,
      site_id: site,
      description: input.description,
      category: input.category,
      severity: input.severity,
      source: input.source ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as AssessmentConstraintRecord;
}

export async function deleteConstraint(
  constraintId: string,
  siteId?: string
): Promise<void> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  await supabase
    .from("assessment_constraints")
    .delete()
    .eq("site_id", site)
    .eq("id", constraintId);
}

export async function listApprovedTools(
  assessmentId: string,
  siteId?: string
): Promise<ApprovedToolRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("approved_tools")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("tool_name");

  if (error || !data) return [];
  return data as ApprovedToolRecord[];
}

export async function createApprovedTool(
  assessmentId: string,
  input: CreateApprovedToolInput,
  siteId?: string
): Promise<ApprovedToolRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("approved_tools")
    .insert({
      assessment_id: assessmentId,
      site_id: site,
      tool_name: input.tool_name,
      vendor: input.vendor ?? null,
      capabilities: input.capabilities ?? null,
      restrictions: input.restrictions ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as ApprovedToolRecord;
}

export async function deleteApprovedTool(
  toolId: string,
  siteId?: string
): Promise<void> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  await supabase
    .from("approved_tools")
    .delete()
    .eq("site_id", site)
    .eq("id", toolId);
}

export async function seedConstraintsByEntityType(
  assessmentId: string,
  entityType: string,
  siteId?: string
): Promise<AssessmentConstraintRecord[]> {
  const templates = CONSTRAINT_TEMPLATES[entityType];
  if (!templates || templates.length === 0) return [];

  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const rows = templates.map((t, i) => ({
    assessment_id: assessmentId,
    site_id: site,
    description: t.description,
    category: t.category,
    severity: t.severity,
    source: entityType,
    sort_order: i,
  }));

  const { data, error } = await supabase
    .from("assessment_constraints")
    .insert(rows)
    .select("*");

  if (error || !data) return [];
  return data as AssessmentConstraintRecord[];
}

export async function getHardConstraints(
  assessmentId: string,
  siteId?: string
): Promise<AssessmentConstraintRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("assessment_constraints")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .eq("severity", "hard")
    .order("sort_order");

  if (error || !data) return [];
  return data as AssessmentConstraintRecord[];
}
