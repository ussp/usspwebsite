import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStaffUsers, createStaffUser } from "@ussp-platform/core/queries/admin/staff";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const staff = await getStaffUsers();
  return NextResponse.json(staff);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "staff.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const result = await createStaffUser(body);

  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result.user, { status: 201 });
}
