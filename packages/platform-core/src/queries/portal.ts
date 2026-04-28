import { getServiceClient } from "../supabase/server.js";
import { getSiteId } from "../config.js";
import { encryptPii } from "../crypto/pii.js";
import type {
  AdminCandidate,
  DocumentRequest,
  SubmitDocumentRequestInput,
  CreateCandidateReferenceInput,
} from "../types/admin.js";

/**
 * Resolve a LinkedIn session to a candidate record.
 */
export async function getCandidateByLinkedInOrEmail(
  linkedinSub: string | undefined,
  email: string | undefined
): Promise<AdminCandidate | null> {
  if (!linkedinSub && !email) return null;

  const supabase = getServiceClient();
  const siteId = getSiteId();

  // Try LinkedIn sub first (more reliable)
  if (linkedinSub) {
    const { data } = await supabase
      .from("candidates")
      .select("*")
      .eq("site_id", siteId)
      .eq("linkedin_sub", linkedinSub)
      .single();
    if (data) return data;
  }

  // Fallback to email
  if (email) {
    const { data } = await supabase
      .from("candidates")
      .select("*")
      .eq("site_id", siteId)
      .eq("email", email)
      .single();
    if (data) {
      // Self-heal: if we matched by email and the row has no linkedin_sub
      // yet, capture the current sub so future logins match by sub directly
      // (faster path) and survive an email change. We only write when sub
      // is null — never overwrite an existing one.
      if (linkedinSub && !data.linkedin_sub) {
        await supabase
          .from("candidates")
          .update({ linkedin_sub: linkedinSub })
          .eq("id", data.id)
          .eq("site_id", siteId)
          .is("linkedin_sub", null);
        data.linkedin_sub = linkedinSub;
      }
      return data;
    }
  }

  return null;
}

/**
 * Get a candidate's applications with status info.
 */
export async function getPortalApplications(
  candidateId: string
): Promise<
  Array<{
    id: string;
    job_title: string;
    status: string;
    created_at: string;
    position_id: string | null;
  }>
> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("applications")
    .select("id, job_title, status, created_at, position_id")
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

/**
 * Get all document requests for a candidate (across all applications).
 */
export async function getPortalDocumentRequests(
  candidateId: string
): Promise<
  Array<
    DocumentRequest & {
      job_title?: string;
    }
  >
> {
  const supabase = getServiceClient();

  // Fetch requests
  const { data: requests, error } = await supabase
    .from("document_requests")
    .select(
      "id, site_id, application_id, candidate_id, request_type, status, description, due_date, min_references, submitted_at, submitted_path, submitted_file_name, submitted_text_encrypted, submitted_dl_state, reviewer_notes, reviewed_by, reviewed_at, created_by, created_at, updated_at"
    )
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: true });

  if (error || !requests) return [];

  // Fetch application titles for context
  const appIds = [...new Set(requests.map((r) => r.application_id))];
  if (appIds.length > 0) {
    const { data: apps } = await supabase
      .from("applications")
      .select("id, job_title")
      .in("id", appIds);

    const appMap = new Map((apps || []).map((a: { id: string; job_title: string }) => [a.id, a.job_title]));
    return requests.map((r) => ({
      ...r,
      job_title: appMap.get(r.application_id) || undefined,
    }));
  }

  return requests;
}

/**
 * Get active assignments for a candidate (portal-safe: no rates).
 */
export async function getPortalAssignments(
  candidateId: string
): Promise<
  Array<{
    id: string;
    role_title: string;
    client_name: string | null;
    end_client_name: string | null;
    start_date: string;
    end_date: string | null;
    status: string;
  }>
> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("employee_assignments")
    .select(
      "id, role_title, start_date, end_date, status, clients(name), end_clients(name)"
    )
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .in("status", ["active", "on_hold"])
    .order("start_date", { ascending: false });

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => {
    const client = row.clients as Record<string, unknown> | null;
    const endClient = row.end_clients as Record<string, unknown> | null;
    return {
      id: row.id as string,
      role_title: row.role_title as string,
      client_name: (client?.name as string) || null,
      end_client_name: (endClient?.name as string) || null,
      start_date: row.start_date as string,
      end_date: (row.end_date as string) || null,
      status: row.status as string,
    };
  });
}

/**
 * Submit a document for a request. Validates candidate ownership.
 * Encrypts text fields (SSN, DOB, DL) before storage.
 */
export async function submitDocumentRequest(
  requestId: string,
  candidateId: string,
  input: SubmitDocumentRequestInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const siteId = getSiteId();

  // Verify this request belongs to the candidate
  const { data: request, error: fetchError } = await supabase
    .from("document_requests")
    .select("id, candidate_id, status, request_type")
    .eq("site_id", siteId)
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    return { success: false, error: "Request not found" };
  }
  if (request.candidate_id !== candidateId) {
    return { success: false, error: "Unauthorized" };
  }
  if (request.status !== "pending" && request.status !== "rejected") {
    return { success: false, error: "Request is not in a submittable state" };
  }

  const updates: Record<string, unknown> = {
    status: "submitted",
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Encrypt text fields
  if (input.submitted_text) {
    updates.submitted_text_encrypted = encryptPii(input.submitted_text);
  }
  if (input.submitted_dl_state) {
    updates.submitted_dl_state = input.submitted_dl_state;
  }
  if (input.submitted_path) {
    updates.submitted_path = input.submitted_path;
  }
  if (input.submitted_file_name) {
    updates.submitted_file_name = input.submitted_file_name;
  }

  const { error } = await supabase
    .from("document_requests")
    .update(updates)
    .eq("id", requestId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Submit references for a document request of type 'references'.
 */
export async function submitReferences(
  requestId: string,
  candidateId: string,
  refs: CreateCandidateReferenceInput[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const siteId = getSiteId();

  // Verify ownership and type
  const { data: request, error: fetchError } = await supabase
    .from("document_requests")
    .select("id, candidate_id, status, request_type, min_references")
    .eq("site_id", siteId)
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    return { success: false, error: "Request not found" };
  }
  if (request.candidate_id !== candidateId) {
    return { success: false, error: "Unauthorized" };
  }
  if (request.request_type !== "references") {
    return { success: false, error: "This request is not for references" };
  }
  if (request.status !== "pending" && request.status !== "rejected") {
    return { success: false, error: "Request is not in a submittable state" };
  }
  if (request.min_references && refs.length < request.min_references) {
    return {
      success: false,
      error: `At least ${request.min_references} references required`,
    };
  }

  // Insert references
  const records = refs.map((ref) => ({
    site_id: siteId,
    document_request_id: requestId,
    candidate_id: candidateId,
    ref_name: ref.ref_name,
    ref_title: ref.ref_title || null,
    ref_company: ref.ref_company || null,
    ref_phone: ref.ref_phone || null,
    ref_email: ref.ref_email || null,
    relationship: ref.relationship || null,
  }));

  const { error: insertError } = await supabase
    .from("candidate_references")
    .insert(records);

  if (insertError) return { success: false, error: insertError.message };

  // Mark request as submitted
  const { error: updateError } = await supabase
    .from("document_requests")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) return { success: false, error: updateError.message };
  return { success: true };
}
