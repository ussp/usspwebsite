import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getApplications } from "@ussp-platform/core/queries/admin/applications";
import type { ApplicationStatus } from "@ussp-platform/core/types/admin";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get("status") as ApplicationStatus | null;
  const search = url.searchParams.get("search") || undefined;
  const position_id = url.searchParams.get("position_id") || undefined;

  const applications = await getApplications({
    status: status || undefined,
    search,
    position_id,
  });
  return NextResponse.json(applications);
}
