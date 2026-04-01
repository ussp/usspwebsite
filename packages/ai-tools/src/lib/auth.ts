import { createAdminAuth } from "@ussp-platform/core/auth/admin-config";
import type { AdminSession } from "@ussp-platform/core/auth/admin-config";

export type { AdminSession };

export const { handlers, auth, signIn, signOut } = createAdminAuth({
  signInPage: "/login",
});
