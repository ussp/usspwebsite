import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminPosition,
  CreatePositionInput,
  UpdatePositionInput,
  PositionFilters,
} from "../../types/admin.js";

const POSITION_COLUMNS =
  "id, site_id, title, slug, location, type, work_mode, description, salary_range, department, client_id, end_client_id, active, created_at, updated_at, posted_at, closed_at, created_by, clients(name), end_clients(name)";

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
