import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "USSP Back Office",
    template: "%s | USSP Back Office",
  },
  description: "Internal administration portal for USSP",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-light-gray text-dark antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
