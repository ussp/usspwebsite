import { NextResponse } from "next/server";
import { getPortalCandidate } from "@/lib/portal-auth";
import { getPortalApplications } from "@ussp-platform/core/queries/portal";
import { STAGE_LABELS } from "@ussp-platform/core/types/admin";
import type { ApplicationStatus } from "@ussp-platform/core/types/admin";

export async function GET() {
  const portalUser = await getPortalCandidate();
  if (!portalUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apps = await getPortalApplications(portalUser.candidate.id);

  // Return with friendly stage labels
  const result = apps.map((app) => ({
    ...app,
    status_label:
      STAGE_LABELS[app.status as ApplicationStatus] || app.status,
  }));

  return NextResponse.json(result);
}
