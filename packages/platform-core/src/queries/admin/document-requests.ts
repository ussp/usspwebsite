import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import { decryptPii } from "../../crypto/pii.js";
import { logAuditEvent } from "./audit.js";
import type {
  DocumentRequest,
  CandidateReferenceRecord,
  CreateDocumentRequestInput,
  DocumentRequestStatus,
} from "../../types/admin.js";

const REQUEST_COLUMNS =
  "id, site_id, application_id, candidate_id, request_type, status, description, due_date, min_references, submitted_at, submitted_path, submitted_file_name, submitted_text_encrypted, submitted_dl_state, reviewer_notes, reviewed_by, reviewed_at, created_by, created_at, updated_at";

const REFERENCE_COLUMNS =
  "id, document_request_id, candidate_id, ref_name, ref_title, ref_company, ref_phone, ref_email, relationship, created_at";

export async function getDocumentRequestsForApplication(
  applicationId: string
): Promise<DocumentRequest[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("document_requests")
    .select(REQUEST_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getDocumentRequestById(
  requestId: string
): Promise<DocumentRequest | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("document_requests")
    .select(REQUEST_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", requestId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Decrypt the submitted_text_encrypted field for display to recruiters.
 */
export function decryptSubmittedText(request: DocumentRequest): string | null {
  if (!request.submitted_text_encrypted) return null;
  try {
    return decryptPii(request.submitted_text_encrypted);
  } catch {
    return "[decryption error]";
  }
}

export async function createDocumentRequests(
  inputs: CreateDocumentRequestInput[],
  staffUserId: string
): Promise<{ success: boolean; requests?: DocumentRequest[]; error?: string }> {
  const supabase = getServiceClient();
  const siteId = getSiteId();

  const records = inputs.map((input) => ({
    site_id: siteId,
    application_id: input.application_id,
    candidate_id: input.candidate_id,
    request_type: input.request_type,
    description: input.description || null,
    due_date: input.due_date || null,
    min_references: input.min_references || null,
    created_by: staffUserId,
  }));

  const { data, error } = await supabase
    .from("document_requests")
    .insert(records)
    .select(REQUEST_COLUMNS);

  if (error) return { success: false, error: error.message };

  // Audit log
  await logAuditEvent({
    staffUserId,
    action: "create_document_requests",
    entityType: "application",
    entityId: inputs[0]?.application_id,
    details: {
      request_types: inputs.map((i) => i.request_type),
      count: inputs.length,
    },
  });

  return { success: true, requests: data || [] };
}

export async function reviewDocumentRequest(
  requestId: string,
  status: "approved" | "rejected",
  staffUserId: string,
  reviewerNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("document_requests")
    .update({
      status,
      reviewed_by: staffUserId,
      reviewed_at: new Date().toISOString(),
      reviewer_notes: reviewerNotes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("site_id", getSiteId())
    .eq("id", requestId);

  if (error) return { success: false, error: error.message };

  await logAuditEvent({
    staffUserId,
    action: `review_document_request_${status}`,
    entityType: "document_request",
    entityId: requestId,
    details: { new_status: status },
  });

  return { success: true };
}

export async function getReferencesForRequest(
  requestId: string
): Promise<CandidateReferenceRecord[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidate_references")
    .select(REFERENCE_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("document_request_id", requestId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
}
