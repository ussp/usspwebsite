import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminClient,
  AdminClientContact,
  CreateClientInput,
  UpdateClientInput,
  CreateClientContactInput,
  UpdateClientContactInput,
  ClientFilters,
} from "../../types/admin.js";

const CLIENT_COLUMNS = "id, site_id, name, description, active, created_at, updated_at";
const CONTACT_COLUMNS = "id, site_id, client_id, name, email, phone, title, active, created_at";

// ---- Clients ----

export async function getAllClients(
  filters: ClientFilters = {}
): Promise<AdminClient[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("clients")
    .select(CLIENT_COLUMNS)
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

export async function getClientById(
  id: string
): Promise<AdminClient | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("clients")
    .select(CLIENT_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function createClient(
  input: CreateClientInput
): Promise<{ success: boolean; client?: AdminClient; error?: string }> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("clients")
    .insert({
      site_id: getSiteId(),
      name: input.name,
      description: input.description || null,
      active: input.active ?? true,
    })
    .select(CLIENT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, client: data };
}

export async function updateClient(
  id: string,
  input: UpdateClientInput
): Promise<{ success: boolean; client?: AdminClient; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.active !== undefined) updateData.active = input.active;

  const { data, error } = await supabase
    .from("clients")
    .update(updateData)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .select(CLIENT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, client: data };
}

// ---- Client Contacts ----

export async function getClientContacts(
  clientId: string
): Promise<AdminClientContact[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("client_contacts")
    .select(CONTACT_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("client_id", clientId)
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function createClientContact(
  input: CreateClientContactInput
): Promise<{ success: boolean; contact?: AdminClientContact; error?: string }> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("client_contacts")
    .insert({
      site_id: getSiteId(),
      client_id: input.client_id,
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      title: input.title || null,
    })
    .select(CONTACT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, contact: data };
}

export async function updateClientContact(
  id: string,
  input: UpdateClientContactInput
): Promise<{ success: boolean; contact?: AdminClientContact; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.email !== undefined) updateData.email = input.email;
  if (input.phone !== undefined) updateData.phone = input.phone;
  if (input.title !== undefined) updateData.title = input.title;
  if (input.active !== undefined) updateData.active = input.active;

  const { data, error } = await supabase
    .from("client_contacts")
    .update(updateData)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .select(CONTACT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, contact: data };
}
