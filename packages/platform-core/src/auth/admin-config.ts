import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id";
import type { NextAuthResult } from "next-auth";
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

export function createAdminAuth(
  options: CreateAdminAuthOptions = {}
): NextAuthResult {
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

  return NextAuth({
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
  });
}
