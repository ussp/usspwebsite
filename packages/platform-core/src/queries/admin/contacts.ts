import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { ContactSubmission } from "../../types/database.js";
import type { ContactFilters } from "../../types/admin.js";

export async function getContactSubmissions(
  filters: ContactFilters = {}
): Promise<ContactSubmission[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("contact_submissions")
    .select("id, site_id, name, email, phone, message, created_at")
    .eq("site_id", getSiteId())
    .order("created_at", { ascending: false });

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getContactById(
  id: string
): Promise<ContactSubmission | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, site_id, name, email, phone, message, created_at")
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}
