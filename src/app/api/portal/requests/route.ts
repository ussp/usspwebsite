import { NextResponse } from "next/server";
import { getPortalCandidate } from "@/lib/portal-auth";
import { getPortalDocumentRequests } from "@ussp-platform/core/queries/portal";

export async function GET() {
  const portalUser = await getPortalCandidate();
  if (!portalUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await getPortalDocumentRequests(portalUser.candidate.id);

  // Strip encrypted text — candidates don't need to see their own encrypted submissions
  const sanitized = requests.map((r) => ({
    ...r,
    submitted_text_encrypted: undefined,
  }));

  return NextResponse.json(sanitized, {
    headers: { "Cache-Control": "no-store" },
  });
}
