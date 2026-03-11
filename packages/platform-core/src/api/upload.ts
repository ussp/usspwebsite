import { getServiceClient } from "../supabase/server.js";
import { getSiteConfig } from "../config.js";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export interface ApiResponse {
  status: number;
  body: Record<string, unknown>;
}

export async function handleUpload(input: {
  fileName: string;
  fileType: string;
  fileSize: number;
}): Promise<ApiResponse> {
  try {
    const { fileName, fileType, fileSize } = input;

    if (!fileName || !fileType || !fileSize) {
      return { status: 400, body: { error: "Missing file info" } };
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return { status: 400, body: { error: "Only PDF, DOC, and DOCX files are allowed" } };
    }

    if (fileSize > MAX_SIZE) {
      return { status: 400, body: { error: "File must be under 5MB" } };
    }

    const supabase = getServiceClient();
    const { siteId } = getSiteConfig();

    // Prefix path with site_id for storage isolation
    const path = `${siteId}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUploadUrl(path);

    if (error) {
      console.error("Upload signed URL error:", error.message);
      return { status: 500, body: { error: "Failed to generate upload URL" } };
    }

    return {
      status: 200,
      body: {
        signedUrl: data.signedUrl,
        token: data.token,
        path,
      },
    };
  } catch (err) {
    console.error("Upload API error:", err);
    return { status: 500, body: { error: "Internal server error" } };
  }
}
