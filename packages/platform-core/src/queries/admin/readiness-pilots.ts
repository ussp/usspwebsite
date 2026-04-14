import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  PilotRecord,
  CreatePilotInput,
} from "../../types/readiness-deliverables.js";

export async function listPilots(
  assessmentId: string,
  siteId?: string
): Promise<PilotRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("pilots")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("sort_order");

  if (error || !data) return [];
  return data as PilotRecord[];
}

export async function createPilot(
  assessmentId: string,
  input: CreatePilotInput,
  siteId?: string
): Promise<PilotRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("pilots")
    .insert({
      assessment_id: assessmentId,
      site_id: site,
      use_case_id: input.use_case_id ?? null,
      title: input.title,
      scope_description: input.scope_description ?? null,
      success_criteria: input.success_criteria ?? null,
      timeline: input.timeline ?? null,
      team_roles: input.team_roles ?? [],
      tools_needed: input.tools_needed ?? null,
      estimated_cost: input.estimated_cost ?? null,
      go_nogo_criteria: input.go_nogo_criteria ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as PilotRecord;
}

export async function updatePilot(
  id: string,
  input: Partial<CreatePilotInput>,
  siteId?: string
): Promise<PilotRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.use_case_id !== undefined) updateData.use_case_id = input.use_case_id;
  if (input.title !== undefined) updateData.title = input.title;
  if (input.scope_description !== undefined) updateData.scope_description = input.scope_description;
  if (input.success_criteria !== undefined) updateData.success_criteria = input.success_criteria;
  if (input.timeline !== undefined) updateData.timeline = input.timeline;
  if (input.team_roles !== undefined) updateData.team_roles = input.team_roles;
  if (input.tools_needed !== undefined) updateData.tools_needed = input.tools_needed;
  if (input.estimated_cost !== undefined) updateData.estimated_cost = input.estimated_cost;
  if (input.go_nogo_criteria !== undefined) updateData.go_nogo_criteria = input.go_nogo_criteria;

  const { data, error } = await supabase
    .from("pilots")
    .update(updateData)
    .eq("site_id", site)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) return null;
  return data as PilotRecord;
}

export async function deletePilot(
  id: string,
  siteId?: string
): Promise<void> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  await supabase
    .from("pilots")
    .delete()
    .eq("site_id", site)
    .eq("id", id);
}
