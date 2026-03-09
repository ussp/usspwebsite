import { createAuth } from "@ussp-platform/core/auth/config";

export const { handlers, auth, signIn, signOut } = createAuth({
  errorPage: "/careers",
});
