import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getDocumentRequestById,
  reviewDocumentRequest,
  decryptSubmittedText,
  getReferencesForRequest,
} from "@ussp-platform/core/queries/admin/document-requests";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; reqId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "document_requests.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { reqId } = await params;
  const request_data = await getDocumentRequestById(reqId);
  if (!request_data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Decrypt submitted text for display
  const decryptedText = decryptSubmittedText(request_data);

  // Get references if applicable
  const references =
    request_data.request_type === "references"
      ? await getReferencesForRequest(reqId)
      : [];

  return NextResponse.json({
    ...request_data,
    submitted_text_decrypted: decryptedText,
    references,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; reqId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "document_requests.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { reqId } = await params;
  const body = await request.json();
  const staffUserId = user.staffUserId as string;

  if (!body.status || !["approved", "rejected"].includes(body.status)) {
    return NextResponse.json({ error: "Status must be 'approved' or 'rejected'" }, { status: 400 });
  }

  const result = await reviewDocumentRequest(
    reqId,
    body.status,
    staffUserId,
    body.reviewer_notes
  );

  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
