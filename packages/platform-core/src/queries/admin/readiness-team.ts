import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AssessmentTeam,
  AssessmentMember,
  UpsertAssessmentTeamInput,
  CreateAssessmentMemberInput,
  UpdateMemberPilotInput,
} from "../../types/ai-tools.js";

export async function getAssessmentTeam(assessmentId: string, siteId?: string): Promise<AssessmentTeam | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("assessment_teams")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("site_id", site)
    .single();
  if (error) return null;
  return data;
}

export async function upsertAssessmentTeam(
  assessmentId: string,
  input: UpsertAssessmentTeamInput,
  siteId?: string
): Promise<AssessmentTeam> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const existing = await getAssessmentTeam(assessmentId, site);

  if (existing) {
    const { data, error } = await supabase
      .from("assessment_teams")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("assessment_teams")
      .insert({ assessment_id: assessmentId, site_id: site, ...input })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

export async function listAssessmentMembers(teamId: string, siteId?: string): Promise<AssessmentMember[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("assessment_members")
    .select("*")
    .eq("team_id", teamId)
    .eq("site_id", site)
    .order("created_at");
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createAssessmentMember(
  teamId: string,
  input: CreateAssessmentMemberInput,
  siteId?: string
): Promise<AssessmentMember> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("assessment_members")
    .insert({
      team_id: teamId,
      site_id: site,
      name: input.name,
      email: input.email,
      role: input.role,
      custom_role_label: input.custom_role_label || null,
      seniority: input.seniority || null,
      vendor: input.vendor || null,
      in_pilot: input.in_pilot || false,
      ai_tool: input.ai_tool || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateMemberPilotInfo(
  memberId: string,
  input: UpdateMemberPilotInput,
  siteId?: string
): Promise<AssessmentMember> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("assessment_members")
    .update({
      ...(input.vendor !== undefined && { vendor: input.vendor }),
      ...(input.in_pilot !== undefined && { in_pilot: input.in_pilot }),
      ...(input.ai_tool !== undefined && { ai_tool: input.ai_tool }),
    })
    .eq("id", memberId)
    .eq("site_id", site)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listPilotMembers(teamId: string, siteId?: string): Promise<AssessmentMember[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("assessment_members")
    .select("*")
    .eq("team_id", teamId)
    .eq("site_id", site)
    .eq("in_pilot", true)
    .order("created_at");
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createAssessmentMembersBulk(
  teamId: string,
  members: CreateAssessmentMemberInput[],
  siteId?: string
): Promise<AssessmentMember[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const rows = members.map((m) => ({
    team_id: teamId,
    site_id: site,
    name: m.name,
    email: m.email,
    role: m.role,
    custom_role_label: m.custom_role_label || null,
    seniority: m.seniority || null,
    vendor: m.vendor || null,
    in_pilot: m.in_pilot || false,
    ai_tool: m.ai_tool || null,
  }));
  const { data, error } = await supabase
    .from("assessment_members")
    .insert(rows)
    .select();
  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteAssessmentMember(memberId: string, siteId?: string): Promise<void> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { error } = await supabase
    .from("assessment_members")
    .delete()
    .eq("id", memberId)
    .eq("site_id", site);
  if (error) throw new Error(error.message);
}
