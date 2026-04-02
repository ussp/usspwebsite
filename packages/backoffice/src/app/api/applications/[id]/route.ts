import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getApplicationById,
  updateApplicationStatus,
  assignApplication,
} from "@ussp-platform/core/queries/admin/applications";
import { checkPipelineGates } from "@ussp-platform/core/queries/admin/pipeline-gates";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole, ApplicationStatus } from "@ussp-platform/core/types/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const application = await getApplicationById(id);
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(application);
}

export async function PATCH(
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
  const staffUserId = user.staffUserId as string;

  if (body.status) {
    const targetStatus = body.status as ApplicationStatus;

    // Run pipeline gate checks (unless forceOverride is set)
    if (!body.forceOverride) {
      const app = await getApplicationById(id);
      if (app) {
        const gates = await checkPipelineGates(id, app.status, targetStatus);
        const failedGates = gates.filter((g) => !g.passed);
        if (failedGates.length > 0) {
          return NextResponse.json(
            { blocked: true, gates: failedGates },
            { status: 422 }
          );
        }
      }
    }

    const result = await updateApplicationStatus(id, targetStatus, staffUserId);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (body.assigned_to !== undefined) {
    const result = await assignApplication(id, body.assigned_to, staffUserId);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
