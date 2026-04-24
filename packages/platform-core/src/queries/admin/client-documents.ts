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
