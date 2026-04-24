// ============================================================================
// CONFIDENTIAL — INTERNAL ONLY
// ============================================================================
// Client documents (MVA, NDA, SSA, Work Orders) contain commercial terms,
// bill rates, pay rates, and client-specific pricing. These records MUST
// NEVER be exposed to:
//   - The candidate / consultant the Work Order is for
//   - External clients other than the owning client
//   - Any candidate-facing portal or public API route
//
// RBAC: admin + recruiter only (see rbac.ts `client_documents.*` + the
// PROTECTED_RESOURCES set that excludes viewer's `*.read` wildcard).
//
// If you are adding a candidate-facing feature, DO NOT import from this
// module. Use candidate-scoped queries only.
// ============================================================================

import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  ClientDocument,
  CreateClientDocumentInput,
  UpdateClientDocumentInput,
} from "../../types/admin.js";

const BUCKET = "client-documents";
const COLUMNS =
  "id, site_id, client_id, assignment_id, doc_type, display_name, description, file_name, file_type, file_size, storage_path, effective_date, expiry_date, uploaded_by, notes, created_at, updated_at";

/**
 * Rate-free projection of an assignment for the Work Order picker and row
 * display. DO NOT add bill_rate / pay_rate to this type — those fields
 * must stay off the document UI per the confidentiality model.
 */
export interface AssignmentSummaryForDoc {
  id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_type: "internal_employee" | "external" | "vendor" | string;
  role_title: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
}

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateUpload(fileType: string, fileSize: number): string | null {
  if (!ALLOWED_MIME_TYPES.includes(fileType)) {
    return "Only PDF, DOC, and DOCX files are allowed";
  }
  if (fileSize > MAX_FILE_SIZE) {
    return "File must be under 10 MB";
  }
  return null;
}

// ── Listing ────────────────────────────────────────────────────────────

export async function listForClient(
  clientId: string,
  siteId?: string
): Promise<ClientDocument[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("client_documents")
    .select(COLUMNS)
    .eq("site_id", site)
    .eq("client_id", clientId)
    .order("doc_type")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as ClientDocument[];
}

export async function listForAssignment(
  assignmentId: string,
  siteId?: string
): Promise<ClientDocument[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("client_documents")
    .select(COLUMNS)
    .eq("site_id", site)
    .eq("assignment_id", assignmentId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as ClientDocument[];
}

export async function getById(id: string, siteId?: string): Promise<ClientDocument | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("client_documents")
    .select(COLUMNS)
    .eq("id", id)
    .eq("site_id", site)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ClientDocument) || null;
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function create(
  input: CreateClientDocumentInput,
  uploadedBy: string,
  siteId?: string
): Promise<{ success: boolean; data?: ClientDocument; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const validation = validateUpload(input.file_type, input.file_size);
  if (validation) return { success: false, error: validation };

  const { data, error } = await supabase
    .from("client_documents")
    .insert({
      ...input,
      site_id: site,
      uploaded_by: uploadedBy,
    })
    .select(COLUMNS)
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as ClientDocument };
}

export async function updateMetadata(
  id: string,
  input: UpdateClientDocumentInput,
  siteId?: string
): Promise<{ success: boolean; data?: ClientDocument; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("client_documents")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("site_id", site)
    .select(COLUMNS)
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as ClientDocument };
}

export async function deleteDocument(
  id: string,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data: doc } = await supabase
    .from("client_documents")
    .select("storage_path")
    .eq("id", id)
    .eq("site_id", site)
    .maybeSingle();

  if (doc?.storage_path) {
    await supabase.storage.from(BUCKET).remove([doc.storage_path]);
  }

  const { error } = await supabase
    .from("client_documents")
    .delete()
    .eq("id", id)
    .eq("site_id", site);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Storage ────────────────────────────────────────────────────────────

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function yearMonth(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function getUploadUrl(
  clientId: string,
  fileName: string,
  siteId?: string
): Promise<{ signedUrl?: string; token?: string; path?: string; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const path = `${site}/${clientId}/${yearMonth()}/${Date.now()}-${sanitizeFileName(fileName)}`;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error) return { error: error.message };
  return { signedUrl: data.signedUrl, token: data.token, path };
}

export async function getDownloadUrl(
  storagePath: string
): Promise<{ signedUrl?: string; error?: string }> {
  const supabase = getServiceClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60);
  if (error) return { error: error.message };
  return { signedUrl: data.signedUrl };
}

// ── Assignment lookups (rate-free projection) ──────────────────────────

/**
 * List assignments for a client, projected without bill_rate / pay_rate,
 * for use in the Work Order picker and row display. Default sort: active
 * status first, then by end_date ascending (soonest-ending on top).
 */
export async function listAssignmentsForClient(
  clientId: string,
  siteId?: string
): Promise<AssignmentSummaryForDoc[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("employee_assignments")
    .select(
      "id, candidate_id, role_title, start_date, end_date, status, candidates(full_name, candidate_type)"
    )
    .eq("site_id", site)
    .eq("client_id", clientId)
    .order("status")
    .order("end_date", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const raw = row as unknown as Record<string, unknown>;
    const cRaw = raw.candidates as unknown;
    const c = (Array.isArray(cRaw) ? cRaw[0] : cRaw) as Record<string, unknown> | null;
    return {
      id: raw.id as string,
      candidate_id: raw.candidate_id as string,
      candidate_name: (c?.full_name as string) || "Unknown",
      candidate_type: (c?.candidate_type as string) || "external",
      role_title: raw.role_title as string,
      start_date: (raw.start_date as string) || null,
      end_date: (raw.end_date as string) || null,
      status: raw.status as string,
    };
  });
}

/**
 * Fetch a single assignment summary by id (rate-free). Used to render
 * Work Order rows.
 */
export async function getAssignmentSummary(
  assignmentId: string,
  siteId?: string
): Promise<AssignmentSummaryForDoc | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("employee_assignments")
    .select(
      "id, candidate_id, role_title, start_date, end_date, status, candidates(full_name, candidate_type)"
    )
    .eq("site_id", site)
    .eq("id", assignmentId)
    .maybeSingle();
  if (error || !data) return null;
  const raw = data as unknown as Record<string, unknown>;
  const cRaw = raw.candidates as unknown;
  const c = (Array.isArray(cRaw) ? cRaw[0] : cRaw) as Record<string, unknown> | null;
  return {
    id: raw.id as string,
    candidate_id: raw.candidate_id as string,
    candidate_name: (c?.full_name as string) || "Unknown",
    candidate_type: (c?.candidate_type as string) || "external",
    role_title: raw.role_title as string,
    start_date: (raw.start_date as string) || null,
    end_date: (raw.end_date as string) || null,
    status: raw.status as string,
  };
}
