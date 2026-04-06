import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sprint Velocity Calculator — Free Agile Tool | USSP",
  description:
    "Free sprint velocity calculator. Track story points across sprints to get average velocity, trend analysis, and predictability score. No signup required.",
  openGraph: {
    title: "Sprint Velocity Calculator — Free Agile Tool | USSP",
    description:
      "Calculate your Scrum team's average velocity, trend direction, and sprint predictability from story point data.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
