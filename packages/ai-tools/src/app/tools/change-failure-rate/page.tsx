"use client";

import { useState } from "react";
import CTABanner from "@/components/CTABanner";

type Tier = "Elite" | "High" | "Medium" | "Low";

const TIER_COLORS: Record<Tier, string> = {
  Elite: "bg-emerald-100 text-emerald-800 border-emerald-300",
  High: "bg-blue-100 text-blue-800 border-blue-300",
  Medium: "bg-amber-100 text-amber-800 border-amber-300",
  Low: "bg-red-100 text-red-800 border-red-300",
};

function classifyCFR(pct: number): Tier {
  if (pct <= 15) return "Elite";
  if (pct <= 30) return "High";
  if (pct <= 45) return "Medium";
  return "Low";
}

const RANGES: { tier: Tier; range: string; description: string }[] = [
  { tier: "Elite", range: "0–15%", description: "Top-performing teams. Strong testing, code review, and deployment practices." },
  { tier: "High", range: "16–30%", description: "Solid practices with room for improvement in pre-deployment testing." },
  { tier: "Medium", range: "31–45%", description: "Moderate failure rates. Consider improving CI/CD pipelines and test coverage." },
  { tier: "Low", range: "46–100%", description: "High failure rate. Prioritize automated testing, feature flags, and smaller deployments." },
];

export default function ChangeFailureRatePage() {
  const [totalDeploys, setTotalDeploys] = useState("");
  const [failedDeploys, setFailedDeploys] = useState("");
  const [timePeriod, setTimePeriod] = useState("month");
  const [result, setResult] = useState<{
    cfr: number;
    tier: Tier;
    deploysPerDay: number;
  } | null>(null);

  function calculate() {
    const total = parseInt(totalDeploys) || 0;
    const failed = parseInt(failedDeploys) || 0;
    if (total === 0) return;

    const cfr = (failed / total) * 100;
    const days = timePeriod === "week" ? 7 : timePeriod === "month" ? 30 : timePeriod === "quarter" ? 90 : 365;
    const deploysPerDay = Math.round((total / days) * 10) / 10;

    setResult({
      cfr: Math.round(cfr * 10) / 10,
      tier: classifyCFR(cfr),
      deploysPerDay,
    });
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-dark mb-2">
        Change Failure Rate Calculator
      </h1>
      <p className="text-dark/60 mb-8 max-w-2xl">
        Calculate your change failure rate (CFR) — one of the four DORA metrics
        — and see how your team compares to industry benchmarks.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Time Period
            </label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Total Deployments
            </label>
            <input
              type="number"
              min="0"
              value={totalDeploys}
              onChange={(e) => setTotalDeploys(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Failed Deployments
            </label>
            <input
              type="number"
              min="0"
              value={failedDeploys}
              onChange={(e) => setFailedDeploys(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-dark/40 mt-1">
              Count deployments that resulted in degraded service, rollbacks, or
              hotfixes.
            </p>
          </div>

          <button
            onClick={calculate}
            disabled={!totalDeploys}
            className="w-full px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-40"
          >
            Calculate CFR
          </button>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-4">
              <div
                className={`rounded-xl border-2 p-6 text-center ${TIER_COLORS[result.tier]}`}
              >
                <p className="text-sm font-medium opacity-60 mb-1">
                  Change Failure Rate
                </p>
                <p className="text-5xl font-bold">{result.cfr}%</p>
                <p className="text-lg font-semibold mt-1">{result.tier} Performer</p>
              </div>

              <div className="rounded-lg border border-light-gray p-4 text-sm">
                <p className="text-dark/60">
                  Deploy frequency:{" "}
                  <span className="font-medium text-dark">
                    {result.deploysPerDay} deploys/day
                  </span>
                </p>
              </div>

              {/* Benchmark Table */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">DORA Benchmarks</h3>
                {RANGES.map((r) => (
                  <div
                    key={r.tier}
                    className={`rounded-lg border p-3 ${
                      r.tier === result.tier
                        ? TIER_COLORS[r.tier] + " border-2"
                        : "border-light-gray"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">{r.tier}</span>
                      <span className="text-xs font-medium">{r.range}</span>
                    </div>
                    <p className="text-xs text-dark/60">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-dark/30 text-sm">
              Enter deployment data and click Calculate to see your CFR tier.
            </div>
          )}
        </div>
      </div>

      <CTABanner
        headline="AI-assisted code review can cut your failure rate."
        description="Measure the real impact of AI tools on your change failure rate with before-and-after tracking across multiple sprints."
        ctaText="Learn about AI Transformation Monitor"
        ctaHref="/"
      />
    </>
  );
}
