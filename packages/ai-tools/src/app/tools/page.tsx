import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free DevOps & AI Tools — Online Calculators | USSP",
  description:
    "Free DORA metrics calculator, sprint velocity tracker, AI ROI calculator, and more. No signup required. Measure your team's performance instantly.",
};

const TOOLS = [
  {
    category: "DevOps Metrics",
    items: [
      {
        name: "DORA Metrics Calculator",
        slug: "dora-calculator",
        description:
          "Classify your team as Elite, High, Medium, or Low performer using the four DORA metrics.",
        keywords: "Deploy frequency, Lead time, CFR, MTTR",
      },
      {
        name: "Change Failure Rate Calculator",
        slug: "change-failure-rate",
        description:
          "Calculate your change failure rate percentage and see how you compare to DORA benchmarks.",
        keywords: "CFR, failed deployments, DORA tier",
      },
      {
        name: "Cycle Time Calculator",
        slug: "cycle-time-calculator",
        description:
          "Measure lead time for changes from commit to deploy. Get DORA classification and percentiles.",
        keywords: "Lead time, cycle time, deploy speed",
      },
    ],
  },
  {
    category: "Agile & Scrum",
    items: [
      {
        name: "Sprint Velocity Calculator",
        slug: "velocity-calculator",
        description:
          "Track story points across sprints. Get average velocity, trend analysis, and predictability score.",
        keywords: "Story points, velocity, predictability",
      },
    ],
  },
  {
    category: "AI & Productivity",
    items: [
      {
        name: "AI ROI Calculator",
        slug: "ai-roi-calculator",
        description:
          "Estimate the return on investment for AI training. Calculate projected savings, payback period, and ROI %.",
        keywords: "AI training, ROI, productivity gain",
      },
    ],
  },
];

export default function ToolsDirectoryPage() {
  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-dark mb-3">
          Free DevOps & AI Tools
        </h1>
        <p className="text-dark/60 max-w-2xl mx-auto">
          Instant, no-signup calculators for engineering teams. Measure DORA
          metrics, sprint velocity, AI training ROI, and more.
        </p>
      </div>

      {TOOLS.map((cat) => (
        <div key={cat.category} className="mb-10">
          <h2 className="text-sm font-semibold text-dark/50 uppercase tracking-wide mb-4">
            {cat.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.items.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group block rounded-xl border border-light-gray p-5 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-dark group-hover:text-primary transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-dark/60 mb-3">{tool.description}</p>
                <p className="text-xs text-dark/40">{tool.keywords}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12 text-center text-sm text-dark/40">
        <p>
          More tools coming soon — team health checks, AI readiness assessments,
          developer productivity scores, and more.
        </p>
      </div>
    </>
  );
}
