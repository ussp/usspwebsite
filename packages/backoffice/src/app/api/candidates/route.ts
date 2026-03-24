import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCandidates, createCandidate } from "@ussp-platform/core/queries/admin/candidates";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole, CandidateType, CandidateStatus } from "@ussp-platform/core/types/admin";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const candidate_type = url.searchParams.get("candidate_type") as CandidateType | null;
  const current_status = url.searchParams.get("current_status") as CandidateStatus | null;
  const search = url.searchParams.get("search") || undefined;

  const candidates = await getCandidates({
    candidate_type: candidate_type || undefined,
    current_status: current_status || undefined,
    search,
  });
  return NextResponse.json(candidates);
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
  const result = await createCandidate(body);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result.candidate, { status: 201 });
}
