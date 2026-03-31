import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { AuditLogEntry, AuditFilters } from "../../types/admin.js";

export async function logAuditEvent(input: {
  staffUserId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase.from("audit_log").insert({
    site_id: getSiteId(),
    staff_user_id: input.staffUserId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId || null,
    details: input.details || {},
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getAuditLog(
  filters: AuditFilters = {}
): Promise<AuditLogEntry[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("audit_log")
    .select(
      "id, site_id, staff_user_id, action, entity_type, entity_id, details, created_at, staff_users(full_name, email)"
    )
    .eq("site_id", getSiteId())
    .order("created_at", { ascending: false })
    .limit(filters.limit || 100);

  if (filters.entity_type) {
    query = query.eq("entity_type", filters.entity_type);
  }
  if (filters.entity_id) {
    query = query.eq("entity_id", filters.entity_id);
  }
  if (filters.staff_user_id) {
    query = query.eq("staff_user_id", filters.staff_user_id);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((entry: Record<string, unknown>) => ({
    id: entry.id as string,
    site_id: entry.site_id as string,
    staff_user_id: entry.staff_user_id as string,
    action: entry.action as string,
    entity_type: entry.entity_type as string,
    entity_id: entry.entity_id as string | null,
    details: entry.details as Record<string, unknown>,
    created_at: entry.created_at as string,
    staff_user: entry.staff_users as AuditLogEntry["staff_user"],
  }));
}

export async function getPositionActivityFeed(
  positionId: string
): Promise<AuditLogEntry[]> {
  const supabase = getServiceClient();
  const site = getSiteId();

  // Get application IDs for this position
  const { data: apps } = await supabase
    .from("applications")
    .select("id")
    .eq("site_id", site)
    .eq("position_id", positionId);

  const appIds = (apps || []).map((a) => a.id);

  // Get audit entries for position itself
  const { data: positionEntries } = await supabase
    .from("audit_log")
    .select(
      "id, site_id, staff_user_id, action, entity_type, entity_id, details, created_at, staff_users(full_name, email)"
    )
    .eq("site_id", site)
    .eq("entity_type", "position")
    .eq("entity_id", positionId)
    .order("created_at", { ascending: false })
    .limit(50);

  // Get audit entries for applications in this position
  let appEntries: typeof positionEntries = [];
  if (appIds.length > 0) {
    const { data } = await supabase
      .from("audit_log")
      .select(
        "id, site_id, staff_user_id, action, entity_type, entity_id, details, created_at, staff_users(full_name, email)"
      )
      .eq("site_id", site)
      .eq("entity_type", "application")
      .in("entity_id", appIds)
      .order("created_at", { ascending: false })
      .limit(50);
    appEntries = data;
  }

  const allEntries = [...(positionEntries || []), ...(appEntries || [])];
  allEntries.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return allEntries.slice(0, 30).map((entry: Record<string, unknown>) => ({
    id: entry.id as string,
    site_id: entry.site_id as string,
    staff_user_id: entry.staff_user_id as string,
    action: entry.action as string,
    entity_type: entry.entity_type as string,
    entity_id: entry.entity_id as string | null,
    details: entry.details as Record<string, unknown>,
    created_at: entry.created_at as string,
    staff_user: entry.staff_users as AuditLogEntry["staff_user"],
  }));
}
