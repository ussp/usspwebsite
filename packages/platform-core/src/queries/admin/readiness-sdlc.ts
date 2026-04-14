import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  WorkflowPhaseRecord,
  AIOpportunityRecord,
  CreateWorkflowPhaseInput,
  CreateAIOpportunityInput,
  AssessmentPillar,
} from "../../types/readiness-deliverables.js";
import { PILLAR_PHASE_MAPPING } from "../../types/readiness-deliverables.js";

// ── Workflow Phases ──────────────────────────────────────────────────

export async function listWorkflowPhases(
  assessmentId: string,
  siteId?: string
): Promise<WorkflowPhaseRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("workflow_phases")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("sort_order");

  if (error || !data) return [];
  return data as WorkflowPhaseRecord[];
}

export async function createWorkflowPhase(
  assessmentId: string,
  input: CreateWorkflowPhaseInput,
  siteId?: string
): Promise<WorkflowPhaseRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("workflow_phases")
    .insert({
      assessment_id: assessmentId,
      site_id: site,
      name: input.name,
      description: input.description ?? null,
      pillar: input.pillar ?? null,
      roles_involved: input.roles_involved ?? [],
      current_tools: input.current_tools ?? [],
      time_spent_hours: input.time_spent_hours ?? null,
      pain_points: input.pain_points ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as WorkflowPhaseRecord;
}

export async function updateWorkflowPhase(
  phaseId: string,
  input: Partial<CreateWorkflowPhaseInput>,
  siteId?: string
): Promise<WorkflowPhaseRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.pillar !== undefined) updateData.pillar = input.pillar;
  if (input.roles_involved !== undefined) updateData.roles_involved = input.roles_involved;
  if (input.current_tools !== undefined) updateData.current_tools = input.current_tools;
  if (input.time_spent_hours !== undefined) updateData.time_spent_hours = input.time_spent_hours;
  if (input.pain_points !== undefined) updateData.pain_points = input.pain_points;

  const { data, error } = await supabase
    .from("workflow_phases")
    .update(updateData)
    .eq("site_id", site)
    .eq("id", phaseId)
    .select("*")
    .single();

  if (error || !data) return null;
  return data as WorkflowPhaseRecord;
}

export async function deleteWorkflowPhase(
  phaseId: string,
  siteId?: string
): Promise<void> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  await supabase
    .from("workflow_phases")
    .delete()
    .eq("site_id", site)
    .eq("id", phaseId);
}

export async function loadPhaseTemplate(
  assessmentId: string,
  methodology: string,
  inScopePillars: string[],
  siteId?: string
): Promise<WorkflowPhaseRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const rows: Record<string, unknown>[] = [];
  let sortOrder = 0;

  for (const pillar of inScopePillars) {
    const phases = PILLAR_PHASE_MAPPING[pillar as AssessmentPillar];
    if (!phases) continue;

    for (const phase of phases) {
      rows.push({
        assessment_id: assessmentId,
        site_id: site,
        name: phase.name,
        description: phase.description,
        pillar,
        roles_involved: [],
        current_tools: [],
        sort_order: sortOrder++,
      });
    }
  }

  if (rows.length === 0) return [];

  const { data, error } = await supabase
    .from("workflow_phases")
    .insert(rows)
    .select("*");

  if (error || !data) return [];
  return data as WorkflowPhaseRecord[];
}

// ── AI Opportunities ─────────────────────────────────────────────────

export async function listOpportunities(
  assessmentId: string,
  siteId?: string
): Promise<AIOpportunityRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("ai_opportunities")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("sort_order");

  if (error || !data) return [];
  return data as AIOpportunityRecord[];
}

export async function createOpportunity(
  assessmentId: string,
  input: CreateAIOpportunityInput,
  siteId?: string
): Promise<AIOpportunityRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("ai_opportunities")
    .insert({
      assessment_id: assessmentId,
      site_id: site,
      phase_id: input.phase_id,
      description: input.description,
      approved_tool: input.approved_tool ?? null,
      expected_improvement: input.expected_improvement ?? null,
      improvement_type: input.improvement_type ?? null,
      improvement_pct: input.improvement_pct ?? null,
      constraint_compliant: input.constraint_compliant ?? true,
      is_current_strength: input.is_current_strength ?? false,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as AIOpportunityRecord;
}

export async function updateOpportunity(
  oppId: string,
  input: Partial<CreateAIOpportunityInput>,
  siteId?: string
): Promise<AIOpportunityRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const updateData: Record<string, unknown> = {};
  if (input.phase_id !== undefined) updateData.phase_id = input.phase_id;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.approved_tool !== undefined) updateData.approved_tool = input.approved_tool;
  if (input.expected_improvement !== undefined) updateData.expected_improvement = input.expected_improvement;
  if (input.improvement_type !== undefined) updateData.improvement_type = input.improvement_type;
  if (input.improvement_pct !== undefined) updateData.improvement_pct = input.improvement_pct;
  if (input.constraint_compliant !== undefined) updateData.constraint_compliant = input.constraint_compliant;
  if (input.is_current_strength !== undefined) updateData.is_current_strength = input.is_current_strength;

  const { data, error } = await supabase
    .from("ai_opportunities")
    .update(updateData)
    .eq("site_id", site)
    .eq("id", oppId)
    .select("*")
    .single();

  if (error || !data) return null;
  return data as AIOpportunityRecord;
}

export async function deleteOpportunity(
  oppId: string,
  siteId?: string
): Promise<void> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  await supabase
    .from("ai_opportunities")
    .delete()
    .eq("site_id", site)
    .eq("id", oppId);
}
