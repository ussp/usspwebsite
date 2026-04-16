import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import {
  loadPhaseTemplate,
} from "@ussp-platform/core/queries/admin/readiness-sdlc";
import {
  getScopePillars,
} from "@ussp-platform/core/queries/admin/readiness-scope";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const pillars = await getScopePillars(id);
  const inScopePillars = pillars
    .filter((p: { in_scope: boolean }) => p.in_scope)
    .map((p: { pillar: string }) => p.pillar);

  const phases = await loadPhaseTemplate(id, body.methodology, inScopePillars);
  return NextResponse.json(phases, { status: 201 });
}
