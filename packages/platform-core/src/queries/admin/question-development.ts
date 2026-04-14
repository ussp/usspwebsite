import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { QuestionDevelopmentRequest } from "../../types/ai-tools.js";

export async function listDevelopmentRequests(
  status?: string,
  siteId?: string
): Promise<QuestionDevelopmentRequest[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  let query = supabase
    .from("question_development_requests")
    .select("*")
    .eq("site_id", site)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPendingRequestCount(siteId?: string): Promise<number> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { count, error } = await supabase
    .from("question_development_requests")
    .select("*", { count: "exact", head: true })
    .eq("site_id", site)
    .eq("status", "pending");
  if (error) throw new Error(error.message);
  return count || 0;
}

/**
 * Create a development request for an unmapped custom role.
 * Checks if a pending request already exists for this role label.
 */
export async function createDevelopmentRequest(
  customRoleLabel: string,
  assessmentId: string | null,
  siteId?: string
): Promise<QuestionDevelopmentRequest> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Check for existing pending request with same label
  const { data: existing } = await supabase
    .from("question_development_requests")
    .select("*")
    .eq("site_id", site)
    .eq("custom_role_label", customRoleLabel)
    .eq("status", "pending")
    .single();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("question_development_requests")
    .insert({
      site_id: site,
      custom_role_label: customRoleLabel,
      status: "pending",
      requested_from_assessment_id: assessmentId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function resolveDevelopmentRequest(
  requestId: string,
  resolvedBy: string
): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("question_development_requests")
    .update({
      status: "completed",
      resolved_by: resolvedBy,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", requestId);
  if (error) throw new Error(error.message);
}

export async function updateDevelopmentRequestStatus(
  requestId: string,
  status: "pending" | "in_progress" | "completed"
): Promise<void> {
  const supabase = getServiceClient();
  const update: Record<string, unknown> = { status };
  if (status === "completed") {
    update.resolved_at = new Date().toISOString();
  }
  const { error } = await supabase
    .from("question_development_requests")
    .update(update)
    .eq("id", requestId);
  if (error) throw new Error(error.message);
}
