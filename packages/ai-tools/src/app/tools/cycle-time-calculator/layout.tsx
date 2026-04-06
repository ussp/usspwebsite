import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cycle Time Calculator — Free Lead Time Tool | USSP",
  description:
    "Free cycle time calculator. Measure your lead time for changes from commit to deploy. Get DORA classification, percentiles, and distribution analysis. No signup required.",
  openGraph: {
    title: "Cycle Time Calculator — Free Lead Time Tool | USSP",
    description:
      "Calculate lead time for changes with DORA classification. Input start and deploy dates to get median, average, P90, and distribution breakdown.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
