import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMatchScoresForPosition } from "@ussp-platform/core/queries/admin/matching";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole, MatchType } from "@ussp-platform/core/types/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const url = new URL(request.url);
  const match_type = url.searchParams.get("match_type") as MatchType | null;
  const is_stale = url.searchParams.get("is_stale");
  const min_score = url.searchParams.get("min_score");

  const scores = await getMatchScoresForPosition(id, {
    match_type: match_type || undefined,
    is_stale: is_stale !== null ? is_stale === "true" : undefined,
    min_score: min_score ? parseInt(min_score) : undefined,
  });
  return NextResponse.json(scores);
}

export async function POST(
  _request: Request,
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

  // TODO: Implement actual scoring once resume extraction is wired up.
  // For now, return a placeholder response.
  return NextResponse.json({
    position_id: id,
    scored: 0,
    skipped: 0,
    message: "Scoring engine ready — wire up resume extraction to enable.",
  });
}
