import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  providers: [
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID!,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET!,
    }),
  ],
  pages: {
    error: "/careers",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture as string | undefined;
        token.linkedinSub = profile.sub as string | undefined;
        token.givenName = profile.given_name as string | undefined;
        token.familyName = profile.family_name as string | undefined;
        token.locale = profile.locale as string | undefined;
        token.linkedinEmailVerified = profile.email_verified as boolean | undefined;
      }
      return token;
    },
    session({ session, token }) {
      if (token.name) session.user.name = token.name;
      if (token.email) session.user.email = token.email;
      if (token.picture) session.user.image = token.picture;
      session.user.linkedinSub = token.linkedinSub as string | undefined;
      session.user.givenName = token.givenName as string | undefined;
      session.user.familyName = token.familyName as string | undefined;
      session.user.locale = token.locale as string | undefined;
      session.user.linkedinEmailVerified = token.linkedinEmailVerified as boolean | undefined;
      return session;
    },
  },
});
