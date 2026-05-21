// Server component — resolves the active tenant per request by reading the
// request's host header directly. We bypass `getSiteId()` here because it
// reads `next/headers` via a synchronous shim that silently fails in
// Next.js 16 (which made the headers API async-only) and falls back to
// `process.env.SITE_ID` — meaning every tenant would see USSP branding.
//
// Same trick used by the multi-tenant auth factory in `createMultiTenantAdminAuth`.
// Once `getSiteId()` is migrated to async, this can use that instead.
import { headers } from "next/headers";
import { getTenantByDomain } from "@ussp-platform/core/queries/admin/tenants";
import LoginForm from "./LoginForm";

// Login is per-request (different tenant per host), so don't pre-render.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const h = await headers();
  const host =
    h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const cleanHost = host.split(":")[0]?.trim().toLowerCase() ?? "";

  const tenant = cleanHost ? await getTenantByDomain(cleanHost) : null;

  return (
    <LoginForm
      tenantName={tenant?.short_name || tenant?.name || "USSP"}
      tagline={tenant?.tagline ?? null}
      primaryColor={tenant?.primary_color ?? null}
      isOwner={tenant?.is_owner ?? false}
    />
  );
}
