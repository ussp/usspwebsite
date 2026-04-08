import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import {
  getEngagementDocuments,
  createEngagementDocument,
  deleteEngagementDocument,
  getDocumentUploadUrl,
  getDocumentDownloadUrl,
} from "@ussp-platform/core/queries/admin/ai-documents";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_engagements.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);

  // Download URL for a specific document
  const downloadPath = searchParams.get("download");
  if (downloadPath) {
    const result = await getDocumentDownloadUrl(downloadPath);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ signedUrl: result.signedUrl });
  }

  // Upload URL request
  const uploadFileName = searchParams.get("uploadUrl");
  if (uploadFileName) {
    const result = await getDocumentUploadUrl(id, uploadFileName);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json(result);
  }

  // List all documents
  const docs = await getEngagementDocuments(id);
  return NextResponse.json(docs);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_engagements.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const result = await createEngagementDocument({
    ...body,
    engagement_id: id,
    uploaded_by: (user.name as string) || (user.email as string) || "unknown",
  });
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result.data, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_engagements.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const docId = searchParams.get("docId");
  if (!docId) return NextResponse.json({ error: "Missing docId" }, { status: 400 });

  const result = await deleteEngagementDocument(docId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
