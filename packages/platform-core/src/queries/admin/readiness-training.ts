import { getServiceClient } from "../../supabase/server";
import { getSiteId } from "../../config";
import type {
  TeamTrainingStatus,
  CreateTrainingStatusInput,
  UpdateTrainingStatusInput,
  TrainingTrack,
  AssessmentMember,
} from "../../types/ai-tools";
import { ROLE_TO_DEFAULT_TRACKS } from "../../types/ai-tools";

export async function listTrainingStatus(
  memberId: string,
  siteId?: string
): Promise<TeamTrainingStatus[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("team_training_status")
    .select("*")
    .eq("member_id", memberId)
    .eq("site_id", site)
    .order("track_name");

  if (error) return [];
  return (data || []) as TeamTrainingStatus[];
}

export async function listTeamTrainingStatus(
  teamId: string,
  siteId?: string
): Promise<TeamTrainingStatus[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Get all members for this team, then get their training status
  const { data: members } = await supabase
    .from("assessment_members")
    .select("id")
    .eq("team_id", teamId)
    .eq("site_id", site);

  if (!members || members.length === 0) return [];

  const memberIds = members.map((m: { id: string }) => m.id);
  const { data, error } = await supabase
    .from("team_training_status")
    .select("*")
    .in("member_id", memberIds)
    .eq("site_id", site)
    .order("track_name");

  if (error) return [];
  return (data || []) as TeamTrainingStatus[];
}

export async function createTrainingStatus(
  memberId: string,
  input: CreateTrainingStatusInput,
  siteId?: string
): Promise<TeamTrainingStatus> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("team_training_status")
    .insert({
      member_id: memberId,
      site_id: site,
      track_name: input.track_name,
      status: input.status || "pending",
      scheduled_date: input.scheduled_date || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as TeamTrainingStatus;
}

export async function updateTrainingStatus(
  statusId: string,
  input: UpdateTrainingStatusInput,
  siteId?: string
): Promise<TeamTrainingStatus> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("team_training_status")
    .update({
      status: input.status,
      scheduled_date: input.scheduled_date || null,
      completed_date: input.completed_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", statusId)
    .eq("site_id", site)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as TeamTrainingStatus;
}

export async function deleteTrainingStatus(
  statusId: string,
  siteId?: string
): Promise<void> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { error } = await supabase
    .from("team_training_status")
    .delete()
    .eq("id", statusId)
    .eq("site_id", site);

  if (error) throw new Error(error.message);
}

export async function generateTrainingPlan(
  teamId: string,
  siteId?: string
): Promise<TeamTrainingStatus[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Get pilot members for this team
  const { data: members, error: membersError } = await supabase
    .from("assessment_members")
    .select("*")
    .eq("team_id", teamId)
    .eq("site_id", site)
    .eq("in_pilot", true);

  if (membersError) throw new Error(membersError.message);
  if (!members || members.length === 0) return [];

  const records: {
    member_id: string;
    site_id: string;
    track_name: string;
    status: string;
  }[] = [];

  for (const member of members as AssessmentMember[]) {
    const tracks = ROLE_TO_DEFAULT_TRACKS[member.role] || ROLE_TO_DEFAULT_TRACKS["other"];
    for (const track of tracks) {
      records.push({
        member_id: member.id,
        site_id: site,
        track_name: track,
        status: "pending",
      });
    }
  }

  if (records.length === 0) return [];

  // Delete existing training status for these members first (idempotent)
  const memberIds = members.map((m: AssessmentMember) => m.id);
  await supabase
    .from("team_training_status")
    .delete()
    .in("member_id", memberIds)
    .eq("site_id", site);

  // Insert new plan
  const { data, error } = await supabase
    .from("team_training_status")
    .insert(records)
    .select();

  if (error) throw new Error(error.message);
  return (data || []) as TeamTrainingStatus[];
}

export async function getTeamPilotReadiness(
  teamId: string,
  siteId?: string
): Promise<{
  ready: boolean;
  training_complete: boolean;
  training_pct: number;
  pilot_member_count: number;
  blockers: string[];
}> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Get pilot members
  const { data: members } = await supabase
    .from("assessment_members")
    .select("id")
    .eq("team_id", teamId)
    .eq("site_id", site)
    .eq("in_pilot", true);

  if (!members || members.length === 0) {
    return {
      ready: false,
      training_complete: false,
      training_pct: 0,
      pilot_member_count: 0,
      blockers: ["No pilot members designated"],
    };
  }

  const memberIds = members.map((m: { id: string }) => m.id);

  // Get all training status for pilot members
  const { data: training } = await supabase
    .from("team_training_status")
    .select("*")
    .in("member_id", memberIds)
    .eq("site_id", site);

  const blockers: string[] = [];

  if (!training || training.length === 0) {
    blockers.push("No training plan generated");
    return {
      ready: false,
      training_complete: false,
      training_pct: 0,
      pilot_member_count: members.length,
      blockers,
    };
  }

  const total = training.length;
  const completed = training.filter(
    (t: TeamTrainingStatus) => t.status === "completed"
  ).length;
  const training_pct = Math.round((completed / total) * 100);
  const training_complete = completed === total;

  if (!training_complete) {
    const pending = total - completed;
    blockers.push(`${pending} training tracks not completed (${training_pct}% done)`);
  }

  return {
    ready: training_complete && blockers.length === 0,
    training_complete,
    training_pct,
    pilot_member_count: members.length,
    blockers,
  };
}
