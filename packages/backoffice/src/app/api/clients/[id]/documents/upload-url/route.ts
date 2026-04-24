import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import { clientDocuments } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "client_documents.write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: clientId } = await params;
  const body = (await request.json()) as {
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  };

  if (!body.fileName || !body.fileType || typeof body.fileSize !== "number") {
    return NextResponse.json({ error: "Missing file info" }, { status: 400 });
  }

  const validation = clientDocuments.validateUpload(body.fileType, body.fileSize);
  if (validation) return NextResponse.json({ error: validation }, { status: 400 });

  const result = await clientDocuments.getUploadUrl(clientId, body.fileName);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({
    signedUrl: result.signedUrl,
    token: result.token,
    path: result.path,
  });
}
