import { NextResponse } from "next/server";
import { getPortalCandidate } from "@/lib/portal-auth";
import { getPortalAssignments } from "@ussp-platform/core/queries/portal";

export async function GET() {
  const portalUser = await getPortalCandidate();
  if (!portalUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const assignments = await getPortalAssignments(portalUser.candidate.id);

  return NextResponse.json(assignments, {
    headers: { "Cache-Control": "no-store" },
  });
}
