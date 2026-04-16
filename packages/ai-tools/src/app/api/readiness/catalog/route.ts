import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  listCatalogItems,
} from "@ussp-platform/core/queries/admin/enhancement-catalog";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const pillar = url.searchParams.get("pillar") || undefined;
  const status = url.searchParams.get("status") || undefined;

  const items = await listCatalogItems(pillar, status);
  return NextResponse.json(items);
}
