import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import { corporateDocuments } from "@ussp-platform/core";
import type { StaffRole, CorporateDocType } from "@ussp-platform/core";
import { CORPORATE_DOC_TYPES } from "@ussp-platform/core";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "corporate_vault.write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    docType?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  };

  if (!body.docType || !CORPORATE_DOC_TYPES.includes(body.docType as CorporateDocType)) {
    return NextResponse.json({ error: "Invalid docType" }, { status: 400 });
  }
  if (!body.fileName || !body.fileType || typeof body.fileSize !== "number") {
    return NextResponse.json({ error: "Missing file info" }, { status: 400 });
  }

  const validation = corporateDocuments.validateUpload(body.fileType, body.fileSize);
  if (validation) return NextResponse.json({ error: validation }, { status: 400 });

  const result = await corporateDocuments.getUploadUrl(
    body.docType as CorporateDocType,
    body.fileName
  );
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({
    signedUrl: result.signedUrl,
    token: result.token,
    path: result.path,
  });
}
