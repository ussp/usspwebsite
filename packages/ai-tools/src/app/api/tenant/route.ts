import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getTenantByDomain,
  getTenantBySiteId,
} from "@ussp-platform/core/queries/admin/tenants";

// Tenant branding for the sidebar. Resolves the active tenant per request by
// reading the host header directly — `getSiteId()` is silently broken in
// Next.js 16 (sync header API removed) and falls back to env var (`ussp`),
// causing every tenant to see USSP branding. Once getSiteId is migrated to
// async, this can use it instead.
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "")
    .split(":")[0]
    ?.trim()
    .toLowerCase() ?? "";

  // Resolve tenant: prefer host lookup; fall back to env-var site_id for
  // requests where the host doesn't map to any tenant (e.g. Railway internal
  // probes, direct *.up.railway.app hits during a domain handoff).
  const tenant = (host ? await getTenantByDomain(host) : null)
    ?? await getTenantBySiteId(process.env.SITE_ID || "ussp");

  if (!tenant) {
    return NextResponse.json({
      site_id: process.env.SITE_ID || "ussp",
      name: process.env.SITE_NAME || "USSP",
      short_name: process.env.SITE_NAME || "USSP",
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
