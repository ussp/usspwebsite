"use client";

import { SessionProvider } from "next-auth/react";

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
