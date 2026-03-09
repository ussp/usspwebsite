import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDashboardMetrics } from "@ussp-platform/core/queries/admin/dashboard";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const metrics = await getDashboardMetrics();
  return NextResponse.json(metrics);
}
