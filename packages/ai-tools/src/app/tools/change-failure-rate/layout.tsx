import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Failure Rate Calculator — Free DORA Tool | USSP",
  description:
    "Free change failure rate calculator. Calculate your CFR percentage and DORA performance tier from deployment data. No signup required.",
  openGraph: {
    title: "Change Failure Rate Calculator — Free DORA Tool | USSP",
    description:
      "Calculate your change failure rate and see how you compare to DORA benchmarks. Input total and failed deployments to get your CFR tier.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
