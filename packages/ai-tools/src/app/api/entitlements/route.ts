import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getEnabledToolKeys,
  getTenantByDomain,
} from "@ussp-platform/core/queries/admin/tenants";

// Tool entitlements per tenant. Reads host header directly to resolve tenant
// (see /api/tenant route for the same workaround rationale — `getSiteId()`
// is broken in Next.js 16).
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "")
    .split(":")[0]
    ?.trim()
    .toLowerCase() ?? "";

  const tenant = host ? await getTenantByDomain(host) : null;
  const siteId = tenant?.site_id ?? process.env.SITE_ID ?? "ussp";

  const enabledTools = await getEnabledToolKeys(siteId);
  return NextResponse.json({ siteId, enabledTools });
}
