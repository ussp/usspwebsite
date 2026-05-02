import type { SiteConfig } from "./types/site.js";

/**
 * Read a request-scoped header from Next.js' `next/headers` API.
 * Returns null when called outside any request context (build steps, seed
 * scripts, dev shells, tests with no request mock) — every caller MUST
 * handle the null path, since the API throws inside Next when no request
 * is in flight.
 *
 * We `try` the dynamic require and the call separately because either can
 * fail: require fails when Next isn't installed (rare but possible during
 * isolated platform-core tests), and `headers()` fails when no request is
 * active.
 *
 * Platform-core is compiled to CommonJS (no package.json → default "type":
 * "commonjs"), so `require` is a built-in. We type-shim it locally to keep
 * TS strict mode happy without pulling in @types/node-specific globals.
 */
function tryReadRequestHeader(name: string): string | null {
  try {
    const req = (globalThis as { require?: NodeJS.Require }).require
      ?? eval("require");
    const mod = (req as NodeJS.Require)("next/headers") as {
      headers: () => { get: (k: string) => string | null };
    };
    return mod.headers().get(name);
  } catch {
    return null;
  }
}

/**
 * Resolve the active tenant's `site_id` for the current execution context.
 *
 * Resolution order (first match wins):
 *  1. `x-tenant-site-id` header — set by ai-tools middleware after a host
 *     lookup against `tenants.domain`. The fast path: zero DB hits per call.
 *  2. `process.env.SITE_ID` — preserves legacy behaviour for non-request
 *     contexts (build, seed scripts, migrations) and for services still
 *     deployed in service-per-tenant mode (e.g., backoffice).
 *
 * Throws when neither source resolves — same contract as the original
 * implementation, so the 308 existing call sites that didn't `try/catch`
 * before don't need to start now.
 *
 * NOTE intentionally synchronous: the DB lookup that translates `host` into
 * `site_id` lives in the middleware (which is async-friendly), not here.
 * Keeping this sync preserves every caller's signature unchanged.
 */
export function getSiteId(): string {
  const fromHeader = tryReadRequestHeader("x-tenant-site-id");
  if (fromHeader) return fromHeader;

  const fromEnv = process.env.SITE_ID;
  if (fromEnv) {
    // In production, if a request IS in flight (Host header present) but
    // the middleware-set header is missing, that means tenant resolution
    // silently fell through to the env var. Log so the regression is
    // visible in monitoring without taking down the request.
    if (process.env.NODE_ENV === "production") {
      const host = tryReadRequestHeader("x-forwarded-host") || tryReadRequestHeader("host");
      if (host) {
        console.warn(
          `[platform-core] x-tenant-site-id missing for request host=${host}; ` +
            `falling back to SITE_ID env var (${fromEnv}). Check middleware coverage.`
        );
      }
    }
    return fromEnv;
  }

  throw new Error(
    "SITE_ID could not be resolved. Either the request must include an " +
      "x-tenant-site-id header (set by ai-tools middleware after host→tenant " +
      "lookup), or the SITE_ID environment variable must be set."
  );
}

/**
 * Build a `SiteConfig` for the current request/context.
 *
 * No module-level cache — that pattern was safe under service-per-tenant
 * deployment, but in the host-based-resolution model the same process serves
 * multiple tenants. A module cache would be a data-leak source, where the
 * first request fills the cache and every subsequent request sees the same
 * tenant.
 *
 * For per-call cost: this function does up to two header reads and an env
 * lookup — all O(1) and cheap. If you find yourself calling it in a hot
 * loop, hoist the result to a local const.
 */
export function getSiteConfig(): SiteConfig {
  const siteId = getSiteId();

  // Site domain prefers the request's host (so logs/links reflect the actual
  // tenant the user is hitting), then env, then dev fallback.
  const requestHost =
    tryReadRequestHeader("x-forwarded-host") || tryReadRequestHeader("host");

  return {
    siteId,
    siteName: process.env.SITE_NAME || siteId.toUpperCase(),
    siteDomain: requestHost || process.env.SITE_DOMAIN || "localhost:3000",
  };
}
