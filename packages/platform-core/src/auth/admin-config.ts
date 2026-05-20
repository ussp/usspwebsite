import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id";
import type { NextAuthConfig, NextAuthResult } from "next-auth";
import { getServiceClient } from "../supabase/server.js";
import { getSiteId } from "../config.js";
import type { StaffRole } from "../types/admin.js";

const SUPER_ADMINS = [
  "vinay@lagisetty.com",
  "swapan@lagisetty.com",
  "arjun@lagisetty.com",
];

export interface CreateAdminAuthOptions {
  provider?: "google" | "microsoft";  // default: "google"
  // Google
  googleClientId?: string;
  googleClientSecret?: string;
  // Microsoft / Azure AD
  microsoftClientId?: string;
  microsoftClientSecret?: string;
  microsoftTenantId?: string;
  // Auto-provisioning
  autoProvision?: boolean;
  defaultRole?: StaffRole;
  allowedDomain?: string;
  signInPage?: string;
}

export interface AdminSession {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    staffUserId: string;
    role: StaffRole;
    siteId: string;
  };
}

/**
 * Build the NextAuth config object from options. Extracted so both the
 * single-tenant (createAdminAuth) and multi-tenant (createMultiTenantAdminAuth)
 * entry points can share provider + callback wiring.
 *
 * Returns a plain config (no NextAuth() wrap) so callers can compose it —
 * e.g. multi-tenant wraps it in a lazy factory and overlays redirectProxyUrl.
 */
function buildAdminAuthConfig(options: CreateAdminAuthOptions): NextAuthConfig {
  const providerType = options.provider || process.env.AUTH_PROVIDER || "google";
  const microsoftTenant = options.microsoftTenantId || process.env.AUTH_MICROSOFT_TENANT;

  const providers = providerType === "microsoft"
    ? [
        MicrosoftEntraId({
          clientId: options.microsoftClientId || process.env.AUTH_MICROSOFT_ID!,
          clientSecret: options.microsoftClientSecret || process.env.AUTH_MICROSOFT_SECRET!,
          ...(microsoftTenant
            ? { issuer: `https://login.microsoftonline.com/${microsoftTenant}/v2.0` }
            : {}),
        }),
      ]
    : [
        Google({
          clientId: options.googleClientId || process.env.GOOGLE_CLIENT_ID!,
          clientSecret:
            options.googleClientSecret || process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ];

  return {
    trustHost: true,
    debug: process.env.NODE_ENV === "development",
    providers,
    pages: {
      signIn: options.signInPage || "/login",
      error: "/login",
    },
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
      async signIn({ user, profile }) {
        if (!user.email) return false;

        const siteId = getSiteId();
        const supabase = getServiceClient();

        // Check if user exists in staff_users
        const { data: staffUser } = await supabase
          .from("staff_users")
          .select("id, active, google_sub")
          .eq("site_id", siteId)
          .eq("email", user.email)
          .single();

        if (staffUser) {
          if (!staffUser.active) return false;

          // Update last_login_at and provider sub
          await supabase
            .from("staff_users")
            .update({
              last_login_at: new Date().toISOString(),
              google_sub: providerType === "google" ? (profile?.sub || null) : staffUser.google_sub,
              avatar_url: user.image || null,
            })
            .eq("id", staffUser.id);

          return true;
        }

        // Auto-create superadmins
        if (SUPER_ADMINS.includes(user.email)) {
          await supabase.from("staff_users").insert({
            site_id: siteId,
            email: user.email,
            full_name: user.name || user.email,
            role: "admin",
            avatar_url: user.image || null,
            google_sub: profile?.sub || null,
            last_login_at: new Date().toISOString(),
          });
          return true;
        }

        // Auto-provision if enabled
        const autoProvision = options.autoProvision ?? (process.env.AUTO_PROVISION === "true");
        if (autoProvision) {
          // Check allowed domain if set
          const allowedDomain = options.allowedDomain || process.env.ALLOWED_DOMAIN;
          if (allowedDomain && !user.email.endsWith(`@${allowedDomain}`)) {
            return false;
          }

          const defaultRole = options.defaultRole || (process.env.DEFAULT_ROLE as StaffRole) || "viewer";
          await supabase.from("staff_users").insert({
            site_id: siteId,
            email: user.email,
            full_name: user.name || user.email,
            role: defaultRole,
            avatar_url: user.image || null,
            google_sub: providerType === "google" ? (profile?.sub || null) : null,
            last_login_at: new Date().toISOString(),
          });
          return true;
        }

        // Not registered — deny access
        return false;
      },

      async jwt({ token, user }) {
        if (user?.email) {
          const siteId = getSiteId();
          const supabase = getServiceClient();

          const { data: staffUser } = await supabase
            .from("staff_users")
            .select("id, role")
            .eq("site_id", siteId)
            .eq("email", user.email)
            .single();

          if (staffUser) {
            (token as Record<string, unknown>).staffUserId = staffUser.id;
            (token as Record<string, unknown>).role = staffUser.role as StaffRole;
            (token as Record<string, unknown>).siteId = siteId;
          }
        }
        return token;
      },

      async session({ session, token }) {
        const t = token as Record<string, unknown>;
        if (t.staffUserId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const user = session.user as any;
          user.staffUserId = t.staffUserId;
          user.role = t.role;
          user.siteId = t.siteId;
        }
        return session;
      },
    },
  };
}

export function createAdminAuth(
  options: CreateAdminAuthOptions = {}
): NextAuthResult {
  return NextAuth(buildAdminAuthConfig(options));
}

/**
 * Multi-tenant variant of createAdminAuth. Reads the request's actual host
 * per-request and sets `redirectProxyUrl` so OAuth callbacks land back on
 * whichever tenant domain initiated the sign-in.
 *
 * Why this exists: Auth.js v5 `trustHost: true` is silently broken in
 * next-auth@5.0.0-beta.30 + next@16.1.6 — the OAuth `redirect_uri` sent
 * to Google defaults to `https://localhost:3000/...` regardless of
 * X-Forwarded-Host. Upstream fix is open (PR #13323) but unmerged.
 * The lazy-factory pattern below is the community-blessed workaround
 * (Auth.js discussion #9785).
 *
 * Use this for services that serve multiple custom domains from a single
 * deployment (e.g. ai-tools serving tools.ussp.co + app.tranzin.com +
 * app.krasanconsulting.com). For single-domain services, stick with
 * createAdminAuth — it's simpler and has fewer moving parts.
 *
 * Caveats:
 *  - Every Google OAuth client must whitelist each tenant's redirect URI:
 *    `https://<tenant-domain>/api/auth/callback/google`
 *  - All tenants share the same AUTH_SECRET (already the case here)
 *  - `headers()` is awaited because Next.js 16 made it async-only
 */
export function createMultiTenantAdminAuth(
  options: CreateAdminAuthOptions = {}
): NextAuthResult {
  return NextAuth(async () => {
    const baseConfig = buildAdminAuthConfig(options);

    // Try to derive the actual request host from Next.js headers. During
    // build/startup there's no request context — fall through without a
    // proxy URL and let Auth.js's normal (broken) URL derivation take over.
    // That's fine because build-time invocations don't initiate OAuth.
    try {
      const req = (globalThis as { require?: NodeJS.Require }).require
        ?? eval("require");
      const mod = (req as NodeJS.Require)("next/headers") as {
        headers: () => Promise<{ get: (k: string) => string | null }>;
      };
      const h = await mod.headers();
      const proto = h.get("x-forwarded-proto") ?? "https";
      const host = h.get("x-forwarded-host") ?? h.get("host");
      if (host) {
        return {
          ...baseConfig,
          redirectProxyUrl: `${proto}://${host}/api/auth`,
        };
      }
    } catch {
      // No request context — skip the override.
    }

    return baseConfig;
  });
}
