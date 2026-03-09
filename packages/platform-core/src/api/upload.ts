import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "../supabase/server.js";
import { getSiteConfig } from "../config.js";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function handleUploadPost(req: NextRequest): Promise<NextResponse> {
  try {
    const { fileName, fileType, fileSize } = await req.json();

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json({ error: "Missing file info" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: "Only PDF, DOC, and DOCX files are allowed" }, { status: 400 });
    }

    if (fileSize > MAX_SIZE) {
      return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { siteId } = getSiteConfig();

    // Prefix path with site_id for storage isolation
    const path = `${siteId}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUploadUrl(path);

    if (error) {
      return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
