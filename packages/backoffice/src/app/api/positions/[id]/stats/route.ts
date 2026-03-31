import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPositionStats } from "@ussp-platform/core/queries/admin/positions";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const stats = await getPositionStats(id);
  return NextResponse.json(stats);
}
