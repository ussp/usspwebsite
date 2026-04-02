import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  updateCertification,
  deleteCertification,
  verifyCertification,
} from "@ussp-platform/core/queries/admin/certifications";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; certId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { certId } = await params;
  const body = await request.json();

  // If verify action, use dedicated function
  if (body.action === "verify") {
    const staffId = user.id as string;
    const result = await verifyCertification(certId, staffId);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  const result = await updateCertification(certId, body);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; certId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { certId } = await params;
  const result = await deleteCertification(certId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
