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
    // No tenant claims this host. Don't fall back — return 404 so a
    // misconfigured DNS entry can't silently leak data from the wrong
    // tenant.
    if (process.env.NODE_ENV !== "production") {
      return new NextResponse(
        `No tenant registered for host "${cleanHost}". Add a row to the ` +
          `tenants table with domain="${cleanHost}" via the admin UI ` +
          `(/admin/tenants) and try again.`,
        { status: 404, headers: { "content-type": "text/plain" } }
      );
    }
    return new NextResponse("Not Found", { status: 404 });
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
  // Run on every request EXCEPT static asset routes and Next internals.
  // We deliberately include `/api/auth/*` so NextAuth callbacks are tagged
  // with the correct tenant before they look up the user in staff_users.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$).*)",
  ],
};
