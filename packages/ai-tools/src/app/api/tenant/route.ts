import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTenantBySiteId } from "@ussp-platform/core/queries/admin/tenants";
import { getSiteId } from "@ussp-platform/core/config";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const siteId = getSiteId();
  const tenant = await getTenantBySiteId(siteId);

  if (!tenant) {
    // Fallback for tenants not yet registered in the table
    return NextResponse.json({
      site_id: siteId,
      name: process.env.SITE_NAME || siteId.toUpperCase(),
      short_name: process.env.SITE_NAME || siteId.toUpperCase(),
      logo_url: null,
      primary_color: "#2563EB",
      tagline: null,
      is_owner: true,
    });
  }

  return NextResponse.json({
    site_id: tenant.site_id,
    name: tenant.name,
    short_name: tenant.short_name,
    logo_url: tenant.logo_url,
    primary_color: tenant.primary_color,
    tagline: tenant.tagline,
    is_owner: tenant.is_owner,
  });
}
