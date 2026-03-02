import type { Metadata } from "next";
import { Alata, Montserrat, League_Spartan } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alata",
});

const montserrat = Montserrat({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const spartan = League_Spartan({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-spartan",
});

export const metadata: Metadata = {
  title: "USSP - Better Things Together",
  description:
    "USSP is dedicated to revolutionizing the staffing industry by integrating cutting-edge technology with exceptional talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${alata.variable} ${montserrat.variable} ${spartan.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
