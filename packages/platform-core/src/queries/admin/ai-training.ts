import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import {
  TRAINING_CATALOG,
} from "../../types/ai-tools.js";
import type {
  AITrainingPlan,
  AITeamMember,
  CreateTrainingPlanInput,
  UpdateTrainingPlanInput,
  TeamMemberRole,
  RecommendedTool,
  RecommendedTraining,
} from "../../types/ai-tools.js";

// =============================================================================
// Training Plans CRUD
// =============================================================================

export async function getTrainingPlansByTeam(
  teamId: string,
  siteId?: string
): Promise<AITrainingPlan[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_training_plans")
    .select("*")
    .eq("site_id", site)
    .eq("team_id", teamId)
    .order("role", { ascending: true });

  if (error || !data) return [];
  return data as AITrainingPlan[];
}

export async function createTrainingPlan(
  input: CreateTrainingPlanInput,
  siteId?: string
): Promise<{ success: boolean; data?: AITrainingPlan; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("ai_training_plans")
    .insert({ ...input, site_id: site })
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as AITrainingPlan };
}

export async function updateTrainingPlan(
  id: string,
  input: UpdateTrainingPlanInput,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { error } = await supabase
    .from("ai_training_plans")
    .update(input)
    .eq("site_id", site)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// =============================================================================
// Auto-Generate Training Plans from Role
// =============================================================================

/**
 * Generate training recommendations for a specific role based on the
 * TRAINING_CATALOG. This can be enhanced later with activity analysis data
 * from Jira to customize further.
 */
export function generateRecommendationsForRole(
  role: TeamMemberRole,
  activitySummary?: Record<string, unknown>
): { tools: RecommendedTool[]; training: RecommendedTraining[] } {
  const matchingModules = TRAINING_CATALOG.filter((m) =>
    m.target_roles.includes(role)
  );

  const tools: RecommendedTool[] = [];
  const toolSet = new Set<string>();

  for (const mod of matchingModules) {
    for (const tool of mod.tools) {
      if (!toolSet.has(tool)) {
        toolSet.add(tool);
        tools.push({
          tool,
          reason: `Recommended for ${role.replace("_", " ")} role — used in "${mod.module}" training`,
          expected_impact: "Moderate to significant productivity improvement based on research benchmarks",
        });
      }
    }
  }

  const training: RecommendedTraining[] = matchingModules.map((mod, i) => ({
    module: mod.module,
    description: mod.description,
    duration_hours: mod.duration_hours,
    priority: i < 2 ? "high" : i < 4 ? "medium" : "low",
  }));

  return { tools, training };
}

/**
 * Auto-generate training plans for all members of a team.
 * Creates one plan per unique role, linked to specific members.
 */
export async function generateTeamTrainingPlans(
  teamId: string,
  siteId?: string
): Promise<{ success: boolean; plans?: AITrainingPlan[]; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Fetch team members
  const { data: members, error: membersError } = await supabase
    .from("ai_team_members")
    .select("*")
    .eq("site_id", site)
    .eq("team_id", teamId);

  if (membersError || !members || members.length === 0) {
    return { success: false, error: "No team members found" };
  }

  // Delete existing plans for this team (regenerate fresh)
  await supabase
    .from("ai_training_plans")
    .delete()
    .eq("site_id", site)
    .eq("team_id", teamId);

  // Generate per-member plans
  const plans: Record<string, unknown>[] = [];
  for (const member of members as AITeamMember[]) {
    const { tools, training } = generateRecommendationsForRole(member.role);
    plans.push({
      site_id: site,
      team_id: teamId,
      member_id: member.id,
      role: member.role,
      activity_summary: null, // Can be populated from Jira activity analysis later
      recommended_tools: tools,
      recommended_training: training,
      status: "proposed",
    });
  }

  const { data, error } = await supabase
    .from("ai_training_plans")
    .insert(plans)
    .select("*");

  if (error) return { success: false, error: error.message };
  return { success: true, plans: data as AITrainingPlan[] };
}
