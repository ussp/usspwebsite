import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminEndClient,
  CreateEndClientInput,
  UpdateEndClientInput,
  EndClientFilters,
} from "../../types/admin.js";

const END_CLIENT_COLUMNS = "id, site_id, name, description, active, created_at, updated_at";

export async function getAllEndClients(
  filters: EndClientFilters = {}
): Promise<AdminEndClient[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("end_clients")
    .select(END_CLIENT_COLUMNS)
    .eq("site_id", getSiteId())
    .order("name", { ascending: true });

  if (filters.active !== undefined) {
    query = query.eq("active", filters.active);
  }
  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getEndClientById(
  id: string
): Promise<AdminEndClient | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("end_clients")
    .select(END_CLIENT_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function createEndClient(
  input: CreateEndClientInput
): Promise<{ success: boolean; endClient?: AdminEndClient; error?: string }> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("end_clients")
    .insert({
      site_id: getSiteId(),
      name: input.name,
      description: input.description || null,
      active: input.active ?? true,
    })
    .select(END_CLIENT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, endClient: data };
}

export async function updateEndClient(
  id: string,
  input: UpdateEndClientInput
): Promise<{ success: boolean; endClient?: AdminEndClient; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.active !== undefined) updateData.active = input.active;

  const { data, error } = await supabase
    .from("end_clients")
    .update(updateData)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .select(END_CLIENT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, endClient: data };
}
