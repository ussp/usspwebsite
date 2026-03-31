import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminPosition,
  CreatePositionInput,
  UpdatePositionInput,
  PositionFilters,
  PositionStats,
  PositionListItem,
  ApplicationStatus,
} from "../../types/admin.js";
import { PIPELINE_STAGES, TERMINAL_STATUSES } from "../../types/admin.js";

const POSITION_COLUMNS =
  "id, site_id, title, slug, location, type, work_mode, description, salary_range, department, client_id, end_client_id, active, is_hot, bill_rate, duration_hours, created_at, updated_at, posted_at, closed_at, created_by, clients(name), end_clients(name)";

export async function getAllPositions(
  filters: PositionFilters = {}
): Promise<AdminPosition[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("positions")
    .select(POSITION_COLUMNS)
    .eq("site_id", getSiteId())
    .order("created_at", { ascending: false });

  if (filters.active !== undefined) {
    query = query.eq("active", filters.active);
  }
  if (filters.department) {
    query = query.eq("department", filters.department);
  }
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  // Flatten joined names
  return data.map((row: Record<string, unknown>) => ({
    ...row,
    client_name: (row.clients as { name: string } | null)?.name || null,
    end_client_name: (row.end_clients as { name: string } | null)?.name || null,
    clients: undefined,
    end_clients: undefined,
  })) as unknown as AdminPosition[];
}

export async function getPositionById(
  id: string
): Promise<AdminPosition | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("positions")
    .select(POSITION_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  // Flatten joined names
  const row = data as Record<string, unknown>;
  return {
    ...row,
    client_name: (row.clients as { name: string } | null)?.name || null,
    end_client_name: (row.end_clients as { name: string } | null)?.name || null,
    clients: undefined,
    end_clients: undefined,
  } as unknown as AdminPosition;
}

export async function createPosition(
  input: CreatePositionInput,
  staffUserId?: string
): Promise<{ success: boolean; position?: AdminPosition; error?: string }> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("positions")
    .insert({
      site_id: getSiteId(),
      title: input.title,
      slug: input.slug,
      location: input.location,
      type: input.type,
      work_mode: input.work_mode || null,
      description: input.description || null,
      salary_range: input.salary_range || null,
      department: input.department || null,
      client_id: input.client_id || null,
      end_client_id: input.end_client_id || null,
      active: input.active ?? true,
      is_hot: input.is_hot ?? false,
      bill_rate: input.bill_rate || null,
      duration_hours: input.duration_hours || null,
      posted_at: input.posted_at || new Date().toISOString(),
      created_by: staffUserId || null,
    })
    .select(POSITION_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, position: data };
}

export async function updatePosition(
  id: string,
  input: UpdatePositionInput
): Promise<{ success: boolean; position?: AdminPosition; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.location !== undefined) updateData.location = input.location;
  if (input.type !== undefined) updateData.type = input.type;
  if (input.work_mode !== undefined) updateData.work_mode = input.work_mode;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.salary_range !== undefined) updateData.salary_range = input.salary_range;
  if (input.department !== undefined) updateData.department = input.department;
  if (input.client_id !== undefined) updateData.client_id = input.client_id;
  if (input.end_client_id !== undefined) updateData.end_client_id = input.end_client_id;
  if (input.active !== undefined) updateData.active = input.active;
  if (input.is_hot !== undefined) updateData.is_hot = input.is_hot;
  if (input.bill_rate !== undefined) updateData.bill_rate = input.bill_rate;
  if (input.duration_hours !== undefined) updateData.duration_hours = input.duration_hours;
  if (input.posted_at !== undefined) updateData.posted_at = input.posted_at;
  if (input.closed_at !== undefined) updateData.closed_at = input.closed_at;

  const { data, error } = await supabase
    .from("positions")
    .update(updateData)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .select(POSITION_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, position: data };
}

export async function togglePositionActive(
  id: string
): Promise<{ success: boolean; active?: boolean; error?: string }> {
  const supabase = getServiceClient();

  // Get current state
  const { data: current } = await supabase
    .from("positions")
    .select("active")
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (!current) return { success: false, error: "Position not found" };

  const newActive = !current.active;
  const { error } = await supabase
    .from("positions")
    .update({
      active: newActive,
      updated_at: new Date().toISOString(),
      closed_at: newActive ? null : new Date().toISOString(),
    })
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true, active: newActive };
}

export async function getPositionStats(
  positionId: string
): Promise<PositionStats> {
  const supabase = getServiceClient();
  const site = getSiteId();

  const { data: apps } = await supabase
    .from("applications")
    .select("id, full_name, status, status_updated_at, created_at")
    .eq("site_id", site)
    .eq("position_id", positionId);

  const applicationData = apps || [];
  const allStatuses = [...PIPELINE_STAGES, ...TERMINAL_STATUSES];

  // Status breakdown
  const statusBreakdown = {} as Record<ApplicationStatus, number>;
  for (const s of allStatuses) statusBreakdown[s] = 0;
  for (const app of applicationData) {
    const s = (app.status || "new") as ApplicationStatus;
    if (s in statusBreakdown) statusBreakdown[s]++;
  }

  const newApplicants = statusBreakdown.new;
  const hiredCount = statusBreakdown.hired;
  const rejectedCount = statusBreakdown.rejected;
  const inProgressCount = applicationData.filter((a) => {
    const s = a.status || "new";
    return s !== "new" && s !== "hired" && s !== "rejected" && s !== "withdrawn";
  }).length;

  // Recent candidates (last 5 by status_updated_at or created_at)
  const recentCandidates = [...applicationData]
    .sort((a, b) => {
      const aDate = a.status_updated_at || a.created_at;
      const bDate = b.status_updated_at || b.created_at;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      full_name: a.full_name,
      status: (a.status || "new") as ApplicationStatus,
      status_updated_at: a.status_updated_at,
      created_at: a.created_at,
    }));

  // Applicant flow: weekly counts for past 8 weeks
  const applicantFlow: Array<{ week: string; count: number }> = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = applicationData.filter((a) => {
      const d = new Date(a.created_at);
      return d >= weekStart && d < weekEnd;
    }).length;

    applicantFlow.push({
      week: `${(weekStart.getMonth() + 1).toString().padStart(2, "0")}/${weekStart.getDate().toString().padStart(2, "0")}`,
      count,
    });
  }

  return {
    totalApplicants: applicationData.length,
    newApplicants,
    rejectedCount,
    inProgressCount,
    hiredCount,
    statusBreakdown,
    recentCandidates,
    applicantFlow,
  };
}

export async function getAllPositionsWithCounts(
  filters: PositionFilters = {}
): Promise<PositionListItem[]> {
  const supabase = getServiceClient();
  const site = getSiteId();

  // Get positions
  const positions = await getAllPositions(filters);

  // Get application counts grouped by position_id
  const { data: apps } = await supabase
    .from("applications")
    .select("position_id, status")
    .eq("site_id", site);

  const appCounts = new Map<string, { total: number; new_count: number }>();
  for (const app of apps || []) {
    if (!app.position_id) continue;
    if (!appCounts.has(app.position_id)) {
      appCounts.set(app.position_id, { total: 0, new_count: 0 });
    }
    const entry = appCounts.get(app.position_id)!;
    entry.total++;
    if (app.status === "new") entry.new_count++;
  }

  return positions.map((p) => {
    const counts = appCounts.get(p.id);
    return {
      ...p,
      applicant_count: counts?.total || 0,
      new_applicant_count: counts?.new_count || 0,
    };
  });
}
