import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  CorporateDocument,
  CorporateDocType,
  CreateCorporateDocumentInput,
  UpdateCorporateDocumentInput,
} from "../../types/admin.js";

const BUCKET = "corporate-vault";
const COLUMNS =
  "id, site_id, doc_type, display_name, description, file_name, file_type, file_size, storage_path, issued_date, expiry_date, is_current, superseded_by_id, uploaded_by, notes, created_at, updated_at";

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

/** List the current version of every corporate document for a site. */
export async function listCurrent(siteId?: string): Promise<CorporateDocument[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("corporate_documents")
    .select(COLUMNS)
    .eq("site_id", site)
    .eq("is_current", true)
    .order("doc_type");
  if (error) throw new Error(error.message);
  return (data || []) as CorporateDocument[];
}

/** List every version (current + superseded) for a given doc_type. */
export async function listAllVersionsForDocType(
  docType: CorporateDocType,
  siteId?: string
): Promise<CorporateDocument[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("corporate_documents")
    .select(COLUMNS)
    .eq("site_id", site)
    .eq("doc_type", docType)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as CorporateDocument[];
}

export async function getById(id: string, siteId?: string): Promise<CorporateDocument | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("corporate_documents")
    .select(COLUMNS)
    .eq("id", id)
    .eq("site_id", site)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as CorporateDocument) || null;
}

// ── Mutations ──────────────────────────────────────────────────────────

/**
 * Create a NEW doc_type row (first upload). If a current row for this
 * doc_type already exists, callers should use `replace` instead.
 */
export async function create(
  input: CreateCorporateDocumentInput,
  uploadedBy: string,
  siteId?: string
): Promise<{ success: boolean; data?: CorporateDocument; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const validation = validateUpload(input.file_type, input.file_size);
  if (validation) return { success: false, error: validation };

  const { data, error } = await supabase
    .from("corporate_documents")
    .insert({
      ...input,
      site_id: site,
      uploaded_by: uploadedBy,
      is_current: true,
    })
    .select(COLUMNS)
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as CorporateDocument };
}

/**
 * Replace an existing current doc: flips the prior row's is_current to
 * false, sets its superseded_by_id, and inserts a new current row.
 */
export async function replace(
  priorId: string,
  input: CreateCorporateDocumentInput,
  uploadedBy: string,
  siteId?: string
): Promise<{ success: boolean; data?: CorporateDocument; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const validation = validateUpload(input.file_type, input.file_size);
  if (validation) return { success: false, error: validation };

  // Insert the new current row first
  const { data: newRow, error: insertErr } = await supabase
    .from("corporate_documents")
    .insert({
      ...input,
      site_id: site,
      uploaded_by: uploadedBy,
      is_current: true,
    })
    .select(COLUMNS)
    .single();
  if (insertErr || !newRow) return { success: false, error: insertErr?.message || "Insert failed" };

  // Flip the prior row
  const { error: updateErr } = await supabase
    .from("corporate_documents")
    .update({
      is_current: false,
      superseded_by_id: newRow.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", priorId)
    .eq("site_id", site);
  if (updateErr) {
    // Best-effort rollback: delete the new row so we don't end up with two currents
    await supabase.from("corporate_documents").delete().eq("id", newRow.id);
    return { success: false, error: updateErr.message };
  }

  return { success: true, data: newRow as CorporateDocument };
}

export async function updateMetadata(
  id: string,
  input: UpdateCorporateDocumentInput,
  siteId?: string
): Promise<{ success: boolean; data?: CorporateDocument; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("corporate_documents")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("site_id", site)
    .select(COLUMNS)
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as CorporateDocument };
}

export async function deleteDocument(
  id: string,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data: doc } = await supabase
    .from("corporate_documents")
    .select("storage_path")
    .eq("id", id)
    .eq("site_id", site)
    .maybeSingle();

  if (doc?.storage_path) {
    await supabase.storage.from(BUCKET).remove([doc.storage_path]);
  }

  const { error } = await supabase
    .from("corporate_documents")
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
  docType: CorporateDocType,
  fileName: string,
  siteId?: string
): Promise<{ signedUrl?: string; token?: string; path?: string; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const path = `${site}/${yearMonth()}/${docType}/${Date.now()}-${sanitizeFileName(fileName)}`;
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
