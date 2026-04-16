import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import {
  listAssessmentMembers,
  createAssessmentMember,
  createAssessmentMembersBulk,
  deleteAssessmentMember,
  getAssessmentTeam,
} from "@ussp-platform/core/queries/admin/readiness-team";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const team = await getAssessmentTeam(id);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const members = await listAssessmentMembers(team.id);
  return NextResponse.json(members);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const team = await getAssessmentTeam(id);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const body = await request.json();

  // Support bulk creation via array
  if (Array.isArray(body)) {
    const members = await createAssessmentMembersBulk(team.id, body);
    return NextResponse.json(members, { status: 201 });
  }

  const member = await createAssessmentMember(team.id, body);
  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const memberId = url.searchParams.get("memberId");
  if (!memberId) return NextResponse.json({ error: "memberId required" }, { status: 400 });

  await deleteAssessmentMember(memberId);
  return NextResponse.json({ success: true });
}
