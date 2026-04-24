import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import { corporateDocuments } from "@ussp-platform/core";
import type {
  StaffRole,
  CorporateDocType,
  CreateCorporateDocumentInput,
} from "@ussp-platform/core";
import { CORPORATE_DOC_TYPES } from "@ussp-platform/core";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "corporate_vault.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const docs = await corporateDocuments.listCurrent();
    return NextResponse.json({ data: docs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  const uploadedBy = (user.id as string) || "";
  if (!hasPermission(role, "corporate_vault.write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!uploadedBy) {
    return NextResponse.json({ error: "Missing staff user id" }, { status: 400 });
  }

  const body = (await request.json()) as Partial<CreateCorporateDocumentInput>;
  if (
    !body.doc_type ||
    !CORPORATE_DOC_TYPES.includes(body.doc_type as CorporateDocType) ||
    !body.display_name ||
    !body.file_name ||
    !body.file_type ||
    typeof body.file_size !== "number" ||
    !body.storage_path
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const input: CreateCorporateDocumentInput = {
    doc_type: body.doc_type as CorporateDocType,
    display_name: body.display_name,
    description: body.description,
    file_name: body.file_name,
    file_type: body.file_type,
    file_size: body.file_size,
    storage_path: body.storage_path,
    issued_date: body.issued_date ?? null,
    expiry_date: body.expiry_date ?? null,
    notes: body.notes,
  };

  // If a current doc exists for this doc_type, flip it to superseded and
  // insert the new one; otherwise plain insert.
  const currentList = await corporateDocuments.listCurrent();
  const prior = currentList.find((d) => d.doc_type === input.doc_type);

  const result = prior
    ? await corporateDocuments.replace(prior.id, input, uploadedBy)
    : await corporateDocuments.create(input, uploadedBy);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ data: result.data }, { status: 201 });
}
