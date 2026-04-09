import { createAdminAuth } from "@ussp-platform/core/auth/admin-config";
import type { AdminSession } from "@ussp-platform/core/auth/admin-config";

export type { AdminSession };

export const { handlers, auth, signIn, signOut } = createAdminAuth({
  signInPage: "/login",
  provider: (process.env.AUTH_PROVIDER as "google" | "microsoft") || "google",
  autoProvision: process.env.AUTO_PROVISION === "true",
  allowedDomain: process.env.ALLOWED_DOMAIN,
});
