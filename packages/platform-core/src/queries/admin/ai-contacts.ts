import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { AIEngagementContact } from "../../types/ai-tools.js";

const COLUMNS = "id, site_id, engagement_id, display_name, full_name, email, title, organization, category, notes, created_at, updated_at";

export async function getEngagementContacts(
  engagementId: string,
  siteId?: string
): Promise<AIEngagementContact[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data } = await supabase
    .from("ai_engagement_contacts")
    .select(COLUMNS)
    .eq("site_id", site)
    .eq("engagement_id", engagementId)
    .order("category")
    .order("display_name");
  return (data || []) as AIEngagementContact[];
}

export async function createEngagementContact(
  input: {
    engagement_id: string;
    display_name: string;
    full_name?: string;
    email?: string;
    title: string;
    organization?: string;
    category?: string;
    notes?: string;
  },
  siteId?: string
): Promise<{ success: boolean; data?: AIEngagementContact; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("ai_engagement_contacts")
    .insert({ ...input, site_id: site })
    .select(COLUMNS)
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as AIEngagementContact };
}

export async function deleteEngagementContact(
  id: string,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { error } = await supabase
    .from("ai_engagement_contacts")
    .delete()
    .eq("id", id)
    .eq("site_id", site);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
