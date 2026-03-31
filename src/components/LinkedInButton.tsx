"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LinkedInButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-12 bg-light-gray animate-pulse rounded-md" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3">
        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-green-800 font-[family-name:var(--font-montserrat)]">
          Signed in as {session.user.name || session.user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="ml-auto text-xs text-dark/50 hover:text-dark underline font-[family-name:var(--font-montserrat)]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("linkedin", { callbackUrl: window.location.href })}
      className="flex items-center gap-3 w-full px-4 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-md transition-colors font-[family-name:var(--font-alata)] text-sm"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
      Sign in with LinkedIn (optional)
    </button>
  );
}
