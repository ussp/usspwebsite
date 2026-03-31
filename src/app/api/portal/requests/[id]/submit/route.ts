import { NextResponse } from "next/server";
import { getPortalCandidate } from "@/lib/portal-auth";
import {
  submitDocumentRequest,
  submitReferences,
} from "@ussp-platform/core/queries/portal";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const portalUser = await getPortalCandidate();
  if (!portalUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: requestId } = await params;
  const body = await request.json();
  const candidateId = portalUser.candidate.id;

  // Handle references separately
  if (body.references && Array.isArray(body.references)) {
    const result = await submitReferences(
      requestId,
      candidateId,
      body.references
    );
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  }

  // Handle document/text submissions
  const result = await submitDocumentRequest(requestId, candidateId, {
    submitted_text: body.submitted_text,
    submitted_dl_state: body.submitted_dl_state,
    submitted_path: body.submitted_path,
    submitted_file_name: body.submitted_file_name,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
