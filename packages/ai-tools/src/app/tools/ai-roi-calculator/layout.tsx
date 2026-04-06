import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI ROI Calculator — Free AI Training ROI Tool | USSP",
  description:
    "Free AI ROI calculator. Estimate projected savings, payback period, and return on investment for AI training and tools. Based on McKinsey and GitHub research. No signup required.",
  openGraph: {
    title: "AI ROI Calculator — Free AI Training ROI Tool | USSP",
    description:
      "Calculate the return on investment for AI training. Input team size, salary, and expected improvement to get projected annual savings and payback period.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
