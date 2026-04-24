import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import { corporateDocuments } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "corporate_vault.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const doc = await corporateDocuments.getById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await corporateDocuments.getDownloadUrl(doc.storage_path);
  if (result.error || !result.signedUrl) {
    return NextResponse.json({ error: result.error || "Failed to generate URL" }, { status: 500 });
  }

  const staffEmail = (user.email as string) || "unknown";
  console.log(`[corporate-vault] download by ${staffEmail}: doc ${id} (${doc.doc_type})`);

  return NextResponse.redirect(result.signedUrl, 307);
}
