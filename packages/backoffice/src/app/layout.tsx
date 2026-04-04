import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const dynamic = "force-dynamic";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
