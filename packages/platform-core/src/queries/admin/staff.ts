import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  StaffUser,
  CreateStaffUserInput,
  UpdateStaffUserInput,
} from "../../types/admin.js";

const STAFF_COLUMNS =
  "id, site_id, email, full_name, role, avatar_url, google_sub, active, last_login_at, created_at, updated_at";

export async function getStaffUsers(
  siteId?: string
): Promise<StaffUser[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("staff_users")
    .select(STAFF_COLUMNS)
    .eq("site_id", siteId || getSiteId())
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function createStaffUser(
  input: CreateStaffUserInput
): Promise<{ success: boolean; user?: StaffUser; error?: string }> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("staff_users")
    .insert({
      site_id: getSiteId(),
      email: input.email,
      full_name: input.full_name,
      role: input.role,
    })
    .select(STAFF_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, user: data };
}

export async function updateStaffUser(
  id: string,
  input: UpdateStaffUserInput
): Promise<{ success: boolean; user?: StaffUser; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.full_name !== undefined) updateData.full_name = input.full_name;
  if (input.role !== undefined) updateData.role = input.role;
  if (input.active !== undefined) updateData.active = input.active;

  const { data, error } = await supabase
    .from("staff_users")
    .update(updateData)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .select(STAFF_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, user: data };
}

export async function deactivateStaffUser(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("staff_users")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function findStaffByEmail(
  email: string,
  siteId?: string
): Promise<StaffUser | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("staff_users")
    .select(STAFF_COLUMNS)
    .eq("site_id", siteId || getSiteId())
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data;
}
