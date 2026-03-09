"use client";

import { useSession, signOut } from "next-auth/react";

export default function AdminTopbar() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-60 right-0 z-20 h-14 bg-white border-b border-light-gray flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            <div className="text-right">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-dark/50">
                {(session.user as Record<string, unknown>).role as string || "staff"}
              </p>
            </div>
            {session.user.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-dark/60 hover:text-danger transition-colors"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
