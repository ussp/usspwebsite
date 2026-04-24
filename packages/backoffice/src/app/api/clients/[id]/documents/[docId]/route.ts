import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import { clientDocuments } from "@ussp-platform/core";
import type {
  StaffRole,
  UpdateClientDocumentInput,
} from "@ussp-platform/core";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "client_documents.write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { docId } = await params;
  const body = (await request.json()) as UpdateClientDocumentInput;
  const result = await clientDocuments.updateMetadata(docId, body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ data: result.data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "client_documents.delete")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { docId } = await params;
  const result = await clientDocuments.deleteDocument(docId);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
