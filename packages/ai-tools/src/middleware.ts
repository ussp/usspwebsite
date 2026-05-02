import { NextResponse, type NextRequest } from "next/server";
import { getTenantByDomain } from "@ussp-platform/core/queries/admin/tenants";

// Use Node.js runtime — Edge can't reach Supabase via @supabase/supabase-js
// without extra setup, and the tenant table is tiny so the cold-start cost
// is negligible.
export const runtime = "nodejs";

/**
 * Resolve the tenant for an incoming request by its hostname, then forward
 * the matched `site_id` to downstream handlers via an `x-tenant-site-id`
 * request header. Server-side `getSiteId()` reads that header to avoid
 * doing its own DB lookup on every call.
 *
 * Hard-fails (404) on unknown hosts. Defaulting to a fallback tenant on a
 * miss is a data-leak class — better to fail loudly.
 */
export async function middleware(request: NextRequest) {
  // Prefer x-forwarded-host (set by Railway/Fastly edge) over the raw Host
  // header, since proxies rewrite Host but preserve the originating host
  // in x-forwarded-host.
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const cleanHost = host.split(":")[0]?.trim().toLowerCase() ?? "";

  if (!cleanHost) {
    return new NextResponse("Bad Request: missing Host header", {
      status: 400,
    });
  }

  const tenant = await getTenantByDomain(cleanHost);

  if (!tenant) {
    // Host doesn't match any registered tenant. This is normal for:
    //  - Railway's auto-issued *.up.railway.app domain (used by healthchecks
    //    and as a permanent stable URL even when custom domains are added)
    //  - Internal Railway probes (*.railway.internal)
    //  - Initial requests during a custom-domain handoff before DNS verifies
    // Pass through without setting x-tenant-site-id; getSiteId() falls back
    // to process.env.SITE_ID (the owner tenant on this service). This
    // preserves the original service-per-tenant behaviour as the safe default.
    return NextResponse.next();
  }

  // Propagate the resolved site_id to downstream handlers via a request
  // header. getSiteId() reads this on the server side.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-site-id", tenant.site_id);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Run on every request EXCEPT static assets, Next internals, healthcheck,
  // AND the NextAuth callback routes. We exclude `/api/auth/*` deliberately:
  // when middleware mutates request headers (even via NextResponse.next with
  // a cloned Headers object), Next.js strips the Host header from what the
  // downstream handler sees, which breaks Auth.js's URL derivation
  // (callbackUrl ends up as https://localhost:3000/...). Keeping NextAuth
  // off middleware preserves the Host header. Tenant resolution inside
  // NextAuth callbacks still works because getSiteId() falls back to
  // process.env.SITE_ID (ussp on this shared service) — and tenants that
  // need their own AUTH_URL get a dedicated Railway service.
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|healthz|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$).*)",
  ],
};
