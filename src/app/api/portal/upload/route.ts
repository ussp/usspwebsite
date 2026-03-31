import { NextResponse } from "next/server";
import { getPortalCandidate } from "@/lib/portal-auth";
import { getServiceClient } from "@ussp-platform/core/supabase/server";
import { getSiteConfig } from "@ussp-platform/core/config";

const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  const portalUser = await getPortalCandidate();
  if (!portalUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, fileType, fileSize } = await request.json();

  if (!fileName || !fileType || !fileSize) {
    return NextResponse.json({ error: "Missing file info" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(fileType)) {
    return NextResponse.json(
      { error: "Only PDF, PNG, and JPG files are allowed" },
      { status: 400 }
    );
  }
  if (fileSize > MAX_SIZE) {
    return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { siteId } = getSiteConfig();
  const candidateId = portalUser.candidate.id;

  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${siteId}/${candidateId}/${Date.now()}-${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from("candidate-documents")
    .createSignedUploadUrl(path);

  if (error) {
    console.error("Portal upload signed URL error:", error.message);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
  });
}
