import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DORA Metrics Calculator — Free Online Tool | USSP",
  description:
    "Free DORA metrics calculator. Enter your deploy frequency, lead time, change failure rate, and MTTR to instantly see if you're Elite, High, Medium, or Low. No signup required.",
  openGraph: {
    title: "DORA Metrics Calculator — Free Online Tool | USSP",
    description:
      "Classify your team as Elite, High, Medium, or Low using the four DORA metrics from the Accelerate State of DevOps report.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
