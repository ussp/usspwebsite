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

function classifyLeadTime(hours: number): Tier {
  if (hours < 1) return "Elite";
  if (hours < 168) return "High"; // < 1 week
  if (hours < 720) return "Medium"; // < 1 month
  return "Low";
}

function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours < 24) return `${Math.round(hours * 10) / 10} hours`;
  if (hours < 168) return `${Math.round((hours / 24) * 10) / 10} days`;
  return `${Math.round((hours / 168) * 10) / 10} weeks`;
}

interface ChangeRow {
  id: number;
  startDate: string;
  deployDate: string;
}

let nextId = 4;

export default function CycleTimeCalculatorPage() {
  const [changes, setChanges] = useState<ChangeRow[]>([
    { id: 1, startDate: "", deployDate: "" },
    { id: 2, startDate: "", deployDate: "" },
    { id: 3, startDate: "", deployDate: "" },
  ]);
  const [result, setResult] = useState<{
    avgHours: number;
    medianHours: number;
    p90Hours: number;
    minHours: number;
    maxHours: number;
    tier: Tier;
    cycleTimes: number[];
  } | null>(null);

  function addChange() {
    if (changes.length >= 20) return;
    setChanges([
      ...changes,
      { id: nextId++, startDate: "", deployDate: "" },
    ]);
  }

  function removeChange(id: number) {
    if (changes.length <= 3) return;
    setChanges(changes.filter((c) => c.id !== id));
  }

  function updateChange(id: number, field: "startDate" | "deployDate", value: string) {
    setChanges(changes.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function calculate() {
    const valid = changes.filter((c) => c.startDate && c.deployDate);
    if (valid.length < 2) return;

    const cycleTimes = valid
      .map((c) => {
        const start = new Date(c.startDate).getTime();
        const deploy = new Date(c.deployDate).getTime();
        return (deploy - start) / (1000 * 60 * 60); // hours
      })
      .filter((h) => h > 0)
      .sort((a, b) => a - b);

    if (cycleTimes.length < 2) return;

    const avg = cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length;
    const median =
      cycleTimes.length % 2 === 0
        ? (cycleTimes[cycleTimes.length / 2 - 1] + cycleTimes[cycleTimes.length / 2]) / 2
        : cycleTimes[Math.floor(cycleTimes.length / 2)];
    const p90Index = Math.ceil(cycleTimes.length * 0.9) - 1;
    const p90 = cycleTimes[Math.min(p90Index, cycleTimes.length - 1)];

    setResult({
      avgHours: avg,
      medianHours: median,
      p90Hours: p90,
      minHours: cycleTimes[0],
      maxHours: cycleTimes[cycleTimes.length - 1],
      tier: classifyLeadTime(median),
      cycleTimes,
    });
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-dark mb-2">
        Cycle Time Calculator
      </h1>
      <p className="text-dark/60 mb-8 max-w-2xl">
        Measure your lead time for changes — from first commit to production
        deploy. Get DORA classification and percentile breakdowns.
      </p>

      {/* Input Table */}
      <div className="bg-white rounded-xl border border-light-gray p-5 mb-8">
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-3 text-xs font-medium text-dark/50 px-1">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Start Date (commit/PR opened)</div>
            <div className="col-span-4">Deploy Date (merged to prod)</div>
            <div className="col-span-3"></div>
          </div>
          {changes.map((c, i) => (
            <div key={c.id} className="grid grid-cols-12 gap-3 items-center">
              <span className="col-span-1 text-sm text-dark/40">{i + 1}</span>
              <input
                type="datetime-local"
                className="col-span-4 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={c.startDate}
                onChange={(e) => updateChange(c.id, "startDate", e.target.value)}
              />
              <input
                type="datetime-local"
                className="col-span-4 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={c.deployDate}
                onChange={(e) => updateChange(c.id, "deployDate", e.target.value)}
              />
              <div className="col-span-3">
                {changes.length > 3 && (
                  <button
                    onClick={() => removeChange(c.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          {changes.length < 20 && (
            <button
              onClick={addChange}
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              + Add Change
            </button>
          )}
          <button
            onClick={calculate}
            className="ml-auto px-5 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors"
          >
            Calculate Cycle Time
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`rounded-xl border-2 p-5 text-center ${TIER_COLORS[result.tier]}`}
            >
              <p className="text-xs font-medium opacity-60 mb-1">DORA Tier</p>
              <p className="text-2xl font-bold">{result.tier}</p>
            </div>
            <div className="bg-white rounded-xl border border-light-gray p-5 text-center">
              <p className="text-xs text-dark/50 mb-1">Median</p>
              <p className="text-xl font-bold">
                {formatDuration(result.medianHours)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-light-gray p-5 text-center">
              <p className="text-xs text-dark/50 mb-1">Average</p>
              <p className="text-xl font-bold">
                {formatDuration(result.avgHours)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-light-gray p-5 text-center">
              <p className="text-xs text-dark/50 mb-1">P90</p>
              <p className="text-xl font-bold">
                {formatDuration(result.p90Hours)}
              </p>
            </div>
          </div>

          {/* Distribution Bar */}
          <div className="bg-white rounded-xl border border-light-gray p-5">
            <h3 className="text-sm font-semibold mb-3">
              Cycle Time Distribution
            </h3>
            <div className="space-y-2">
              {result.cycleTimes.map((h, i) => {
                const maxH = result.maxHours || 1;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-dark/40 w-6 text-right">
                      {i + 1}
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          classifyLeadTime(h) === "Elite"
                            ? "bg-emerald-400"
                            : classifyLeadTime(h) === "High"
                              ? "bg-blue-400"
                              : classifyLeadTime(h) === "Medium"
                                ? "bg-amber-400"
                                : "bg-red-400"
                        }`}
                        style={{ width: `${Math.max((h / maxH) * 100, 3)}%` }}
                      />
                    </div>
                    <span className="text-xs text-dark/60 w-24 text-right">
                      {formatDuration(h)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-dark/40 mt-3">
              <span>Fastest: {formatDuration(result.minHours)}</span>
              <span>Slowest: {formatDuration(result.maxHours)}</span>
            </div>
          </div>

          {/* DORA Benchmark Reference */}
          <div className="bg-white rounded-xl border border-light-gray p-5">
            <h3 className="text-sm font-semibold mb-2">
              DORA Lead Time Benchmarks
            </h3>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(
                [
                  { tier: "Elite" as Tier, range: "<1 hour" },
                  { tier: "High" as Tier, range: "<1 week" },
                  { tier: "Medium" as Tier, range: "<1 month" },
                  { tier: "Low" as Tier, range: "1-6 months" },
                ] as const
              ).map((b) => (
                <div
                  key={b.tier}
                  className={`rounded-lg border p-2 text-center ${
                    b.tier === result.tier
                      ? TIER_COLORS[b.tier] + " border-2"
                      : "border-light-gray"
                  }`}
                >
                  <p className="font-semibold">{b.tier}</p>
                  <p className="opacity-70">{b.range}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CTABanner
        headline="Track cycle time improvement before and after AI adoption."
        description="See how AI-assisted development reduces lead time for changes. Measure the real impact with continuous before-and-after tracking."
        ctaText="Learn about AI Transformation Monitor"
        ctaHref="/"
      />
    </>
  );
}
