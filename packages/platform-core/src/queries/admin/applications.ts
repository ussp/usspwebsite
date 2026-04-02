import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminApplication,
  ApplicationFilters,
  ApplicationNote,
  ApplicationStatus,
  StatusHistoryEntry,
} from "../../types/admin.js";

const APPLICATION_COLUMNS =
  "id, site_id, position_id, full_name, email, job_title, job_slug, resume_path, resume_name, auth_provider, created_at, linkedin_sub, given_name, family_name, profile_picture, locale, email_verified, phone, sms_consent, sms_consent_timestamp, job_alerts_opt_in, job_alerts_timestamp, status, status_updated_at, assigned_to, candidate_id, applicant_type, expected_bill_rate, availability_date";

export async function getApplications(
  filters: ApplicationFilters = {}
): Promise<AdminApplication[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("applications")
    .select(APPLICATION_COLUMNS)
    .eq("site_id", getSiteId())
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.assigned_to) {
    query = query.eq("assigned_to", filters.assigned_to);
  }
  if (filters.job_slug) {
    query = query.eq("job_slug", filters.job_slug);
  }
  if (filters.position_id) {
    query = query.eq("position_id", filters.position_id);
  }
  if (filters.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getApplicationsByEmail(
  email: string
): Promise<AdminApplication[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getApplicationById(
  id: string
): Promise<AdminApplication | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  staffUserId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("applications")
    .update({
      status,
      status_updated_at: new Date().toISOString(),
    })
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  // Log the status change
  await supabase.from("audit_log").insert({
    site_id: getSiteId(),
    staff_user_id: staffUserId,
    action: "update_status",
    entity_type: "application",
    entity_id: id,
    details: { new_status: status },
  });

  return { success: true };
}

export async function assignApplication(
  id: string,
  assigneeId: string | null,
  staffUserId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("applications")
    .update({ assigned_to: assigneeId })
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  await supabase.from("audit_log").insert({
    site_id: getSiteId(),
    staff_user_id: staffUserId,
    action: "assign",
    entity_type: "application",
    entity_id: id,
    details: { assigned_to: assigneeId },
  });

  return { success: true };
}

export async function getApplicationNotes(
  applicationId: string
): Promise<ApplicationNote[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("application_notes")
    .select("id, site_id, application_id, staff_user_id, content, created_at, staff_users(full_name, avatar_url)")
    .eq("site_id", getSiteId())
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((note: Record<string, unknown>) => ({
    id: note.id as string,
    site_id: note.site_id as string,
    application_id: note.application_id as string,
    staff_user_id: note.staff_user_id as string,
    content: note.content as string,
    created_at: note.created_at as string,
    staff_user: note.staff_users as ApplicationNote["staff_user"],
  }));
}

export async function addApplicationNote(
  applicationId: string,
  staffUserId: string,
  content: string
): Promise<{ success: boolean; note?: ApplicationNote; error?: string }> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("application_notes")
    .insert({
      site_id: getSiteId(),
      application_id: applicationId,
      staff_user_id: staffUserId,
      content,
    })
    .select("id, site_id, application_id, staff_user_id, content, created_at")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, note: data };
}

export async function updateApplicationNote(
  noteId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("application_notes")
    .update({ content })
    .eq("site_id", getSiteId())
    .eq("id", noteId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteApplicationNote(
  noteId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("application_notes")
    .delete()
    .eq("site_id", getSiteId())
    .eq("id", noteId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getApplicationStatusHistory(
  applicationId: string
): Promise<StatusHistoryEntry[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("audit_log")
    .select("details, created_at, staff_users(full_name)")
    .eq("site_id", getSiteId())
    .eq("entity_type", "application")
    .eq("entity_id", applicationId)
    .eq("action", "update_status")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((entry: Record<string, unknown>) => {
    const details = entry.details as Record<string, unknown>;
    const staffUser = entry.staff_users as { full_name: string } | null;
    return {
      status: (details?.new_status as string) || "unknown",
      changed_at: entry.created_at as string,
      changed_by_name: staffUser?.full_name || null,
    };
  });
}
