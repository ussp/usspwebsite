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

const DEPLOY_OPTIONS = [
  { label: "Multiple times per day", value: "multiple_daily", tier: "Elite" as Tier },
  { label: "Once per day", value: "daily", tier: "Elite" as Tier },
  { label: "A few times per week", value: "weekly", tier: "High" as Tier },
  { label: "Once per week", value: "once_weekly", tier: "High" as Tier },
  { label: "A few times per month", value: "monthly", tier: "Medium" as Tier },
  { label: "Once per month", value: "once_monthly", tier: "Medium" as Tier },
  { label: "Less than once per month", value: "rarely", tier: "Low" as Tier },
];

function classifyLeadTime(minutes: number): Tier {
  if (minutes < 60) return "Elite";
  if (minutes < 10080) return "High"; // < 1 week
  if (minutes < 43200) return "Medium"; // < 1 month
  return "Low";
}

function classifyCFR(pct: number): Tier {
  if (pct <= 15) return "Elite";
  if (pct <= 30) return "High";
  if (pct <= 45) return "Medium";
  return "Low";
}

function classifyMTTR(minutes: number): Tier {
  if (minutes < 60) return "Elite";
  if (minutes < 1440) return "High"; // < 1 day
  if (minutes < 10080) return "Medium"; // < 1 week
  return "Low";
}

function overallTier(tiers: Tier[]): Tier {
  const scores: Record<Tier, number> = { Elite: 4, High: 3, Medium: 2, Low: 1 };
  const avg = tiers.reduce((sum, t) => sum + scores[t], 0) / tiers.length;
  if (avg >= 3.5) return "Elite";
  if (avg >= 2.5) return "High";
  if (avg >= 1.5) return "Medium";
  return "Low";
}

const BENCHMARKS: { metric: string; Elite: string; High: string; Medium: string; Low: string }[] = [
  { metric: "Deploy Frequency", Elite: "Multiple/day", High: "Daily-Weekly", Medium: "Weekly-Monthly", Low: "Monthly+" },
  { metric: "Lead Time", Elite: "<1 hour", High: "<1 week", Medium: "<1 month", Low: "1-6 months" },
  { metric: "Change Failure Rate", Elite: "0-15%", High: "16-30%", Medium: "31-45%", Low: "46-100%" },
  { metric: "Mean Time to Recovery", Elite: "<1 hour", High: "<1 day", Medium: "<1 week", Low: "1 week+" },
];

export default function DORACalculatorPage() {
  const [deployFreq, setDeployFreq] = useState("");
  const [leadTimeValue, setLeadTimeValue] = useState("");
  const [leadTimeUnit, setLeadTimeUnit] = useState("hours");
  const [cfr, setCfr] = useState("");
  const [mttrValue, setMttrValue] = useState("");
  const [mttrUnit, setMttrUnit] = useState("hours");
  const [result, setResult] = useState<{
    tiers: { metric: string; tier: Tier; value: string }[];
    overall: Tier;
  } | null>(null);

  function calculate() {
    const deployOption = DEPLOY_OPTIONS.find((o) => o.value === deployFreq);
    if (!deployOption || !leadTimeValue || !cfr || !mttrValue) return;

    const ltMultipliers: Record<string, number> = {
      minutes: 1, hours: 60, days: 1440, weeks: 10080, months: 43200,
    };
    const mttrMultipliers: Record<string, number> = {
      minutes: 1, hours: 60, days: 1440,
    };

    const ltMinutes = parseFloat(leadTimeValue) * (ltMultipliers[leadTimeUnit] || 1);
    const mttrMinutes = parseFloat(mttrValue) * (mttrMultipliers[mttrUnit] || 1);
    const cfrPct = parseFloat(cfr);

    const tiers = [
      { metric: "Deployment Frequency", tier: deployOption.tier, value: deployOption.label },
      { metric: "Lead Time for Changes", tier: classifyLeadTime(ltMinutes), value: `${leadTimeValue} ${leadTimeUnit}` },
      { metric: "Change Failure Rate", tier: classifyCFR(cfrPct), value: `${cfrPct}%` },
      { metric: "Mean Time to Recovery", tier: classifyMTTR(mttrMinutes), value: `${mttrValue} ${mttrUnit}` },
    ];

    setResult({
      tiers,
      overall: overallTier(tiers.map((t) => t.tier)),
    });
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-dark mb-2">
        DORA Metrics Calculator
      </h1>
      <p className="text-dark/60 mb-8 max-w-2xl">
        Enter your team&apos;s four key metrics to see how you rank against the
        DORA performance benchmarks from the Accelerate State of DevOps report.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Deployment Frequency
            </label>
            <select
              value={deployFreq}
              onChange={(e) => setDeployFreq(e.target.value)}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select frequency...</option>
              {DEPLOY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Lead Time for Changes
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={leadTimeValue}
                onChange={(e) => setLeadTimeValue(e.target.value)}
                placeholder="e.g. 4"
                className="flex-1 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <select
                value={leadTimeUnit}
                onChange={(e) => setLeadTimeUnit(e.target.value)}
                className="px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Change Failure Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={cfr}
              onChange={(e) => setCfr(e.target.value)}
              placeholder="e.g. 12"
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mean Time to Recovery (MTTR)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={mttrValue}
                onChange={(e) => setMttrValue(e.target.value)}
                placeholder="e.g. 30"
                className="flex-1 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <select
                value={mttrUnit}
                onChange={(e) => setMttrUnit(e.target.value)}
                className="px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!deployFreq || !leadTimeValue || !cfr || !mttrValue}
            className="w-full px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-40"
          >
            Calculate DORA Tier
          </button>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-4">
              <div
                className={`rounded-xl border-2 p-6 text-center ${TIER_COLORS[result.overall]}`}
              >
                <p className="text-sm font-medium opacity-70 mb-1">
                  Overall DORA Performance
                </p>
                <p className="text-4xl font-bold">{result.overall}</p>
              </div>

              <div className="space-y-2">
                {result.tiers.map((t) => (
                  <div
                    key={t.metric}
                    className="flex items-center justify-between rounded-lg border border-light-gray p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{t.metric}</p>
                      <p className="text-xs text-dark/50">{t.value}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${TIER_COLORS[t.tier]}`}
                    >
                      {t.tier}
                    </span>
                  </div>
                ))}
              </div>

              {/* Benchmark Table */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">
                  DORA Benchmark Thresholds
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-light-gray">
                        <th className="text-left py-2 pr-2 font-medium text-dark/60">Metric</th>
                        {(["Elite", "High", "Medium", "Low"] as const).map((t) => (
                          <th key={t} className="text-left py-2 px-2 font-medium text-dark/60">
                            {t}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {BENCHMARKS.map((b) => (
                        <tr key={b.metric} className="border-b border-light-gray/50">
                          <td className="py-2 pr-2 font-medium">{b.metric}</td>
                          {(["Elite", "High", "Medium", "Low"] as const).map((t) => (
                            <td key={t} className="py-2 px-2 text-dark/60">
                              {b[t]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-dark/30 text-sm">
              Enter your metrics and click Calculate to see your DORA tier.
            </div>
          )}
        </div>
      </div>

      <CTABanner
        headline={
          result
            ? `You're a ${result.overall} performer. AI training can move you up.`
            : "See how AI training transforms DORA metrics."
        }
        description="Research shows teams improve 20-45% on DORA metrics after structured AI training. Track your real before-and-after improvement with data-driven measurement."
        ctaText="Learn about AI Transformation Monitor"
        ctaHref="/"
        secondaryText="See methodology"
        secondaryHref="/methodology"
      />
    </>
  );
}
