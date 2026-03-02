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
  title: {
    default: "USSP - US Software Professionals Inc. | Since 2003 | Better Things Together",
    template: "%s | USSP",
  },
  description:
    "Since 2003, USSP (US Software Professionals Inc.) has been delivering innovative IT staffing, healthcare staffing, and technology solutions. 20+ years of experience serving Fortune 500 companies, government agencies, and healthcare organizations from Chicago, IL.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "USSP - US Software Professionals Inc.",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "USSP Inc. (US Software Professionals Inc.)",
              url: "https://www.ussp.co",
              foundingDate: "2003-01-23",
              description:
                "Since 2003, USSP has been delivering innovative IT staffing, healthcare staffing, and technology solutions with over 20 years of expertise.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "875 N Michigan Ave, Suite 3100",
                addressLocality: "Chicago",
                addressRegion: "IL",
                postalCode: "60614",
                addressCountry: "US",
              },
              telephone: "+1-312-546-4306",
              faxNumber: "+1-312-253-2026",
              sameAs: [],
              knowsAbout: [
                "IT Staffing",
                "Healthcare Staffing",
                "Software Development",
                "Blockchain Solutions",
                "Data Analytics",
                "Cloud Computing",
                "IoT Solutions",
                "Oracle Data Integrator",
                "Government IT Services",
              ],
            }),
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
