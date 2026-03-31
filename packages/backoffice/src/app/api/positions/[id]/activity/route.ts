import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPositionActivityFeed } from "@ussp-platform/core/queries/admin/audit";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const activity = await getPositionActivityFeed(id);
  return NextResponse.json(activity);
}
