import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateReadinessReport } from "@ussp-platform/core/queries/admin/readiness-report";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const report = await generateReadinessReport(id);
    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate report";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
