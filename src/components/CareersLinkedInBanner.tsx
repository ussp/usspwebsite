"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function CareersLinkedInBanner() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto mb-12">
        <div className="h-16 bg-light-gray animate-pulse rounded-lg" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-lg px-6 py-4">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-[family-name:var(--font-alata)] text-green-800">
              Signed in as {session.user.name || session.user.email}
            </p>
            <p className="text-xs text-green-700/70 font-[family-name:var(--font-montserrat)]">
              You can now apply to any position below
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-xs text-dark/50 hover:text-dark underline font-[family-name:var(--font-montserrat)]"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="bg-white border border-dark/10 rounded-lg p-6 text-center shadow-sm">
        <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] mb-4">
          Sign in with LinkedIn to quickly apply for any position
        </p>
        <button
          onClick={() => signIn("linkedin", { callbackUrl: window.location.href })}
          className="inline-flex items-center gap-3 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-md transition-colors font-[family-name:var(--font-alata)] text-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Sign in with LinkedIn
        </button>
      </div>
    </div>
  );
}
