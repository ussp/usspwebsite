import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  listCatalogVersions,
} from "@ussp-platform/core/queries/admin/enhancement-catalog";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const versions = await listCatalogVersions();
  return NextResponse.json(versions);
}
