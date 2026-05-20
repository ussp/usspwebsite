import { createMultiTenantAdminAuth } from "@ussp-platform/core/auth/admin-config";
import type { AdminSession } from "@ussp-platform/core/auth/admin-config";

export type { AdminSession };

// Multi-tenant variant: derives redirect_uri from the request's host per
// request, so OAuth callbacks land back on whichever tenant domain
// (tools.ussp.co / app.tranzin.com / app.krasanconsulting.com) initiated
// sign-in. See createMultiTenantAdminAuth JSDoc for the upstream Auth.js
// bug this works around.
export const { handlers, auth, signIn, signOut } = createMultiTenantAdminAuth({
  signInPage: "/login",
  provider: (process.env.AUTH_PROVIDER as "google" | "microsoft") || "google",
  autoProvision: process.env.AUTO_PROVISION === "true",
  allowedDomain: process.env.ALLOWED_DOMAIN,
});
