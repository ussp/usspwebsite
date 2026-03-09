import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateStaffUser, deactivateStaffUser } from "@ussp-platform/core/queries/admin/staff";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "staff.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const result = await updateStaffUser(id, body);

  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result.user);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "staff.delete")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const result = await deactivateStaffUser(id);

  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
