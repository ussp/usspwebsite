import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AIEngagement,
  AITeam,
  AITeamMember,
  CreateEngagementInput,
  UpdateEngagementInput,
  CreateTeamInput,
  UpdateTeamInput,
  CreateTeamMemberInput,
  EngagementDetail,
  AIToolsDashboardMetrics,
} from "../../types/ai-tools.js";

// =============================================================================
// Engagements
// =============================================================================

const ENGAGEMENT_COLUMNS = "id, site_id, name, client_name, engagement_lead_id, status, integration_type, integration_config, notes, created_at, updated_at";

export async function getAllEngagements(
  filters?: { status?: string; lead_id?: string; search?: string },
  siteId?: string
): Promise<AIEngagement[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  let query = supabase
    .from("ai_engagements")
    .select(ENGAGEMENT_COLUMNS)
    .eq("site_id", site)
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.lead_id) query = query.eq("engagement_lead_id", filters.lead_id);
  if (filters?.search) query = query.ilike("name", `%${filters.search}%`);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as AIEngagement[];
}

export async function getEngagementById(
  id: string,
  siteId?: string
): Promise<AIEngagement | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_engagements")
    .select(ENGAGEMENT_COLUMNS)
    .eq("site_id", site)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as AIEngagement;
}

export async function getEngagementDetail(
  id: string,
  siteId?: string
): Promise<EngagementDetail | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Fetch engagement + lead name
  const { data: engagement, error: engError } = await supabase
    .from("ai_engagements")
    .select(`${ENGAGEMENT_COLUMNS}, staff_users!ai_engagements_engagement_lead_id_fkey(full_name)`)
    .eq("site_id", site)
    .eq("id", id)
    .single();

  if (engError || !engagement) return null;

  // Fetch teams
  const { data: teams } = await supabase
    .from("ai_teams")
    .select("id, site_id, engagement_id, name, team_size, external_team_id, created_at, updated_at")
    .eq("site_id", site)
    .eq("engagement_id", id)
    .order("created_at", { ascending: true });

  // Fetch all members and assessments for these teams
  const teamIds = (teams || []).map((t: Record<string, unknown>) => t.id as string);

  const [membersRes, assessmentsRes] = await Promise.all([
    teamIds.length > 0
      ? supabase.from("ai_team_members").select("*").eq("site_id", site).in("team_id", teamIds)
      : Promise.resolve({ data: [], error: null }),
    teamIds.length > 0
      ? supabase.from("ai_assessments").select("*").eq("site_id", site).in("team_id", teamIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const allMembers = (membersRes.data || []) as AITeamMember[];
  const allAssessments = (assessmentsRes.data || []) as Array<Record<string, unknown>>;

  const staffUser = engagement.staff_users as unknown as Record<string, unknown> | null;
  const leadName = staffUser?.full_name as string | null;

  const enrichedTeams = (teams || []).map((team: Record<string, unknown>) => {
    const teamId = team.id as string;
    const members = allMembers.filter((m) => m.team_id === teamId);
    const readiness = allAssessments.find((a) => a.team_id === teamId && a.assessment_type === "readiness") || null;
    const baseline = allAssessments.find((a) => a.team_id === teamId && a.assessment_type === "baseline") || null;
    const postTraining = allAssessments.find((a) => a.team_id === teamId && a.assessment_type === "post_training") || null;

    return {
      ...(team as unknown as AITeam),
      members,
      readiness,
      baseline,
      post_training: postTraining,
      improvement_pct: null, // computed in reports
      readiness_score: null, // computed in reports
    };
  });

  return {
    ...(engagement as unknown as AIEngagement),
    teams: enrichedTeams,
    lead_name: leadName,
  } as EngagementDetail;
}

export async function createEngagement(
  input: CreateEngagementInput,
  siteId?: string
): Promise<{ success: boolean; data?: AIEngagement; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_engagements")
    .insert({ ...input, site_id: site })
    .select(ENGAGEMENT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as AIEngagement };
}

export async function updateEngagement(
  id: string,
  input: UpdateEngagementInput,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.client_name !== undefined) updateData.client_name = input.client_name;
  if (input.engagement_lead_id !== undefined) updateData.engagement_lead_id = input.engagement_lead_id;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.integration_type !== undefined) updateData.integration_type = input.integration_type;
  if (input.integration_config !== undefined) updateData.integration_config = input.integration_config;
  if (input.notes !== undefined) updateData.notes = input.notes;

  const { error } = await supabase
    .from("ai_engagements")
    .update(updateData)
    .eq("site_id", site)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteEngagement(
  id: string,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { error } = await supabase
    .from("ai_engagements")
    .update({ status: "archived" })
    .eq("site_id", site)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// =============================================================================
// Teams
// =============================================================================

const TEAM_COLUMNS = "id, site_id, engagement_id, name, team_size, external_team_id, created_at, updated_at";

export async function getTeamsByEngagement(
  engagementId: string,
  siteId?: string
): Promise<AITeam[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_teams")
    .select(TEAM_COLUMNS)
    .eq("site_id", site)
    .eq("engagement_id", engagementId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as AITeam[];
}

export async function getTeamById(
  id: string,
  siteId?: string
): Promise<AITeam | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_teams")
    .select(TEAM_COLUMNS)
    .eq("site_id", site)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as AITeam;
}

export async function createTeam(
  input: CreateTeamInput,
  siteId?: string
): Promise<{ success: boolean; data?: AITeam; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_teams")
    .insert({ ...input, site_id: site })
    .select(TEAM_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as AITeam };
}

export async function updateTeam(
  id: string,
  input: UpdateTeamInput,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { error } = await supabase
    .from("ai_teams")
    .update(input)
    .eq("site_id", site)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// =============================================================================
// Team Members
// =============================================================================

export async function getTeamMembers(
  teamId: string,
  siteId?: string
): Promise<AITeamMember[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_team_members")
    .select("*")
    .eq("site_id", site)
    .eq("team_id", teamId)
    .order("role", { ascending: true });

  if (error || !data) return [];
  return data as AITeamMember[];
}

export async function createTeamMember(
  input: CreateTeamMemberInput,
  siteId?: string
): Promise<{ success: boolean; data?: AITeamMember; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_team_members")
    .insert({ ...input, site_id: site })
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as AITeamMember };
}

export async function updateTeamMember(
  id: string,
  input: Partial<Pick<AITeamMember, "display_name" | "role" | "external_user_id">>,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { error } = await supabase
    .from("ai_team_members")
    .update(input)
    .eq("site_id", site)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteTeamMember(
  id: string,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { error } = await supabase
    .from("ai_team_members")
    .delete()
    .eq("site_id", site)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// =============================================================================
// Dashboard
// =============================================================================

export async function getAIToolsDashboard(
  siteId?: string
): Promise<AIToolsDashboardMetrics> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const [engagementsRes, teamsRes, assessmentsRes] = await Promise.all([
    supabase.from("ai_engagements").select("*").eq("site_id", site).order("created_at", { ascending: false }),
    supabase.from("ai_teams").select("id, engagement_id").eq("site_id", site),
    supabase.from("ai_assessments").select("id, team_id, status").eq("site_id", site),
  ]);

  const engagements = (engagementsRes.data || []) as AIEngagement[];
  const teams = (teamsRes.data || []) as { id: string; engagement_id: string }[];
  const assessments = (assessmentsRes.data || []) as { id: string; team_id: string; status: string }[];

  const activeEngagements = engagements.filter((e) =>
    ["baseline", "training", "post_assessment"].includes(e.status)
  );

  const assessmentsInProgress = assessments.filter((a) => a.status !== "completed").length;

  // Count teams per engagement
  const teamCountMap = new Map<string, number>();
  for (const team of teams) {
    teamCountMap.set(team.engagement_id, (teamCountMap.get(team.engagement_id) || 0) + 1);
  }

  const recentEngagements = engagements.slice(0, 10).map((e) => ({
    ...e,
    team_count: teamCountMap.get(e.id) || 0,
    improvement_pct: null as number | null, // computed from reports
  }));

  return {
    total_engagements: engagements.length,
    active_engagements: activeEngagements.length,
    total_teams: teams.length,
    assessments_in_progress: assessmentsInProgress,
    avg_improvement_pct: null, // computed from reports
    recent_engagements: recentEngagements,
  };
}
