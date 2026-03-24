import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAssignments, createAssignment } from "@ussp-platform/core/queries/admin/assignments";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole, AssignmentStatus } from "@ussp-platform/core/types/admin";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const candidate_id = url.searchParams.get("candidate_id") || undefined;
  const status = url.searchParams.get("status") as AssignmentStatus | null;
  const end_client_id = url.searchParams.get("end_client_id") || undefined;
  const expiring = url.searchParams.get("expiring_within_days");

  const assignments = await getAssignments({
    candidate_id,
    status: status || undefined,
    end_client_id,
    expiring_within_days: expiring ? parseInt(expiring) : undefined,
  });
  return NextResponse.json(assignments);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const result = await createAssignment(body);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result.assignment, { status: 201 });
}
