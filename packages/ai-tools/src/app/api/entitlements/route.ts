import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEnabledToolKeys } from "@ussp-platform/core/queries/admin/tenants";
import { getSiteId } from "@ussp-platform/core/config";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const siteId = getSiteId();
  const enabledTools = await getEnabledToolKeys(siteId);

  return NextResponse.json({ siteId, enabledTools });
}
