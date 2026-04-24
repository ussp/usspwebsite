import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import { clientDocuments } from "@ussp-platform/core";
import type {
  StaffRole,
  ClientDocType,
  CreateClientDocumentInput,
} from "@ussp-platform/core";
import { CLIENT_DOC_TYPES } from "@ussp-platform/core";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "client_documents.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: clientId } = await params;
  try {
    const docs = await clientDocuments.listForClient(clientId);
    return NextResponse.json({ data: docs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  const uploadedBy = (user.id as string) || "";
  if (!hasPermission(role, "client_documents.write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!uploadedBy) {
    return NextResponse.json({ error: "Missing staff user id" }, { status: 400 });
  }

  const { id: clientId } = await params;
  const body = (await request.json()) as Partial<CreateClientDocumentInput>;
  if (
    !body.doc_type ||
    !CLIENT_DOC_TYPES.includes(body.doc_type as ClientDocType) ||
    !body.display_name ||
    !body.file_name ||
    !body.file_type ||
    typeof body.file_size !== "number" ||
    !body.storage_path
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const input: CreateClientDocumentInput = {
    client_id: clientId,
    assignment_id: body.assignment_id ?? null,
    doc_type: body.doc_type as ClientDocType,
    display_name: body.display_name,
    description: body.description,
    file_name: body.file_name,
    file_type: body.file_type,
    file_size: body.file_size,
    storage_path: body.storage_path,
    effective_date: body.effective_date ?? null,
    expiry_date: body.expiry_date ?? null,
    notes: body.notes,
  };

  const result = await clientDocuments.create(input, uploadedBy);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ data: result.data }, { status: 201 });
}
