import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      linkedinSub?: string;
      givenName?: string;
      familyName?: string;
      locale?: string;
      linkedinEmailVerified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    linkedinSub?: string;
    givenName?: string;
    familyName?: string;
    locale?: string;
    linkedinEmailVerified?: boolean;
  }
}
