import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { AIEngagementDocument } from "../../types/ai-tools.js";

const COLUMNS = "id, site_id, engagement_id, file_name, file_type, file_size, storage_path, category, description, uploaded_by, created_at";

export async function getEngagementDocuments(
  engagementId: string,
  siteId?: string
): Promise<AIEngagementDocument[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data } = await supabase
    .from("ai_engagement_documents")
    .select(COLUMNS)
    .eq("site_id", site)
    .eq("engagement_id", engagementId)
    .order("category")
    .order("created_at", { ascending: false });
  return (data || []) as AIEngagementDocument[];
}

export async function createEngagementDocument(
  input: {
    engagement_id: string;
    file_name: string;
    file_type?: string;
    file_size?: number;
    storage_path: string;
    category?: string;
    description?: string;
    uploaded_by?: string;
  },
  siteId?: string
): Promise<{ success: boolean; data?: AIEngagementDocument; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("ai_engagement_documents")
    .insert({ ...input, site_id: site })
    .select(COLUMNS)
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as AIEngagementDocument };
}

export async function deleteEngagementDocument(
  id: string,
  siteId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Get the document to find storage path
  const { data: doc } = await supabase
    .from("ai_engagement_documents")
    .select("storage_path")
    .eq("id", id)
    .eq("site_id", site)
    .single();

  if (doc) {
    // Delete from storage
    await supabase.storage.from("engagement-docs").remove([doc.storage_path]);
  }

  const { error } = await supabase
    .from("ai_engagement_documents")
    .delete()
    .eq("id", id)
    .eq("site_id", site);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getDocumentUploadUrl(
  engagementId: string,
  fileName: string,
  siteId?: string
): Promise<{ signedUrl?: string; path?: string; error?: string }> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${site}/${engagementId}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from("engagement-docs")
    .createSignedUploadUrl(path);

  if (error) return { error: error.message };
  return { signedUrl: data.signedUrl, path };
}

export async function getDocumentDownloadUrl(
  storagePath: string
): Promise<{ signedUrl?: string; error?: string }> {
  const supabase = getServiceClient();
  const { data, error } = await supabase.storage
    .from("engagement-docs")
    .createSignedUrl(storagePath, 3600); // 1 hour
  if (error) return { error: error.message };
  return { signedUrl: data.signedUrl };
}
