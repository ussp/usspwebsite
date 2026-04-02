import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getOnboardingsForCandidate,
  createOnboarding,
} from "@ussp-platform/core/queries/admin/onboarding";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const onboardings = await getOnboardingsForCandidate(id);
  return NextResponse.json(onboardings);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  if (!body.application_id) {
    return NextResponse.json({ error: "application_id is required" }, { status: 400 });
  }

  const result = await createOnboarding(id, body.application_id);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result.onboarding, { status: 201 });
}
