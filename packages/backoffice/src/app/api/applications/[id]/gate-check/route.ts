import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getApplicationById } from "@ussp-platform/core/queries/admin/applications";
import { checkPipelineGates } from "@ussp-platform/core/queries/admin/pipeline-gates";
import { PIPELINE_STAGES } from "@ussp-platform/core/types/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const app = await getApplicationById(id);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check gates for the next stage
  const currentIndex = PIPELINE_STAGES.indexOf(app.status);
  if (currentIndex < 0 || currentIndex >= PIPELINE_STAGES.length - 1) {
    return NextResponse.json({ gates: [] });
  }

  const nextStatus = PIPELINE_STAGES[currentIndex + 1];
  const gates = await checkPipelineGates(id, app.status, nextStatus);

  return NextResponse.json({ gates, nextStatus });
}
