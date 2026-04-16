import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import {
  listReadinessAssessments,
  createReadinessAssessment,
} from "@ussp-platform/core/queries/admin/readiness";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const assessments = await listReadinessAssessments();
  return NextResponse.json(assessments);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const assessment = await createReadinessAssessment(body, user.email as string);
  return NextResponse.json(assessment, { status: 201 });
}
