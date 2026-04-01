import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import { generateTransformationReport } from "@ussp-platform/core/queries/admin/ai-reports";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_reports.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { teamId } = await params;
  const report = await generateTransformationReport(teamId);
  if (!report) {
    return NextResponse.json(
      { error: "Report not available. Both baseline and post-training assessments are required." },
      { status: 404 }
    );
  }
  return NextResponse.json(report);
}
