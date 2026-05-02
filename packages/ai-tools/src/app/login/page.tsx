// Server component — resolves the active tenant per request via the
// host-based middleware (see packages/ai-tools/src/middleware.ts) and passes
// branding to the client form. The tenant is determined by the incoming
// Host header, NOT by any build-time env var, so a single deploy serves
// every tenant's login screen with the right brand.
import { getSiteId } from "@ussp-platform/core/config";
import { getTenantBySiteId } from "@ussp-platform/core/queries/admin/tenants";
import LoginForm from "./LoginForm";

// Login is per-request (different tenant per host), so don't pre-render.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const siteId = getSiteId();
  const tenant = await getTenantBySiteId(siteId);

  return (
    <LoginForm
      tenantName={tenant?.short_name || tenant?.name || siteId.toUpperCase()}
      tagline={tenant?.tagline ?? null}
      primaryColor={tenant?.primary_color ?? null}
      isOwner={tenant?.is_owner ?? false}
    />
  );
}
