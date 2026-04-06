"use client";

import { useState } from "react";
import CTABanner from "@/components/CTABanner";

interface SprintRow {
  id: number;
  name: string;
  committed: string;
  completed: string;
}

let nextId = 4;

export default function VelocityCalculatorPage() {
  const [sprints, setSprints] = useState<SprintRow[]>([
    { id: 1, name: "Sprint 1", committed: "", completed: "" },
    { id: 2, name: "Sprint 2", committed: "", completed: "" },
    { id: 3, name: "Sprint 3", committed: "", completed: "" },
  ]);
  const [result, setResult] = useState<{
    avgVelocity: number;
    trend: "Improving" | "Stable" | "Declining";
    predictability: number;
    predictabilityLabel: string;
    min: number;
    max: number;
    stdDev: number;
    sprintData: { name: string; committed: number; completed: number }[];
  } | null>(null);

  function addSprint() {
    if (sprints.length >= 20) return;
    setSprints([
      ...sprints,
      { id: nextId++, name: `Sprint ${sprints.length + 1}`, committed: "", completed: "" },
    ]);
  }

  function removeSprint(id: number) {
    if (sprints.length <= 3) return;
    setSprints(sprints.filter((s) => s.id !== id));
  }

  function updateSprint(id: number, field: keyof SprintRow, value: string) {
    setSprints(sprints.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function calculate() {
    const data = sprints
      .filter((s) => s.completed)
      .map((s) => ({
        name: s.name,
        committed: parseFloat(s.committed) || 0,
        completed: parseFloat(s.completed) || 0,
      }));

    if (data.length < 3) return;

    const completedValues = data.map((d) => d.completed);
    const avg = completedValues.reduce((a, b) => a + b, 0) / completedValues.length;
    const min = Math.min(...completedValues);
    const max = Math.max(...completedValues);
    const variance =
      completedValues.reduce((sum, v) => sum + (v - avg) ** 2, 0) / completedValues.length;
    const stdDev = Math.sqrt(variance);

    // Trend via simple linear regression
    const n = completedValues.length;
    const xMean = (n - 1) / 2;
    const yMean = avg;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (i - xMean) * (completedValues[i] - yMean);
      den += (i - xMean) ** 2;
    }
    const slope = den === 0 ? 0 : num / den;
    const trend: "Improving" | "Stable" | "Declining" =
      slope > 0.5 ? "Improving" : slope < -0.5 ? "Declining" : "Stable";

    // Predictability: % of committed that was delivered (average)
    const predictabilities = data
      .filter((d) => d.committed > 0)
      .map((d) => Math.min((d.completed / d.committed) * 100, 100));
    const predictability =
      predictabilities.length > 0
        ? predictabilities.reduce((a, b) => a + b, 0) / predictabilities.length
        : 0;
    const predictabilityLabel =
      predictability >= 85
        ? "Stable"
        : predictability >= 70
          ? "Variable"
          : "Unpredictable";

    setResult({
      avgVelocity: Math.round(avg * 10) / 10,
      trend,
      predictability: Math.round(predictability),
      predictabilityLabel,
      min,
      max,
      stdDev: Math.round(stdDev * 10) / 10,
      sprintData: data,
    });
  }

  const trendColor = {
    Improving: "text-emerald-600",
    Stable: "text-blue-600",
    Declining: "text-red-600",
  };

  const predColor = {
    Stable: "bg-emerald-100 text-emerald-800",
    Variable: "bg-amber-100 text-amber-800",
    Unpredictable: "bg-red-100 text-red-800",
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-dark mb-2">
        Sprint Velocity Calculator
      </h1>
      <p className="text-dark/60 mb-8 max-w-2xl">
        Enter story points across your recent sprints to get average velocity,
        trend direction, and a predictability score.
      </p>

      {/* Input Table */}
      <div className="bg-white rounded-xl border border-light-gray p-5 mb-8">
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-3 text-xs font-medium text-dark/50 px-1">
            <div className="col-span-4">Sprint Name</div>
            <div className="col-span-3">Committed (pts)</div>
            <div className="col-span-3">Completed (pts)</div>
            <div className="col-span-2"></div>
          </div>
          {sprints.map((s) => (
            <div key={s.id} className="grid grid-cols-12 gap-3 items-center">
              <input
                className="col-span-4 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={s.name}
                onChange={(e) => updateSprint(s.id, "name", e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="col-span-3 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={s.committed}
                onChange={(e) => updateSprint(s.id, "committed", e.target.value)}
                placeholder="0"
              />
              <input
                type="number"
                min="0"
                className="col-span-3 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={s.completed}
                onChange={(e) => updateSprint(s.id, "completed", e.target.value)}
                placeholder="0"
              />
              <div className="col-span-2 flex gap-2">
                {sprints.length > 3 && (
                  <button
                    onClick={() => removeSprint(s.id)}
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
          {sprints.length < 20 && (
            <button
              onClick={addSprint}
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              + Add Sprint
            </button>
          )}
          <button
            onClick={calculate}
            className="ml-auto px-5 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors"
          >
            Calculate Velocity
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-light-gray p-5">
              <p className="text-xs text-dark/50 mb-1">Average Velocity</p>
              <p className="text-3xl font-bold">{result.avgVelocity}</p>
              <p className="text-xs text-dark/40">pts/sprint</p>
            </div>
            <div className="bg-white rounded-xl border border-light-gray p-5">
              <p className="text-xs text-dark/50 mb-1">Trend</p>
              <p className={`text-2xl font-bold ${trendColor[result.trend]}`}>
                {result.trend}
              </p>
              <p className="text-xs text-dark/40">direction</p>
            </div>
            <div className="bg-white rounded-xl border border-light-gray p-5">
              <p className="text-xs text-dark/50 mb-1">Predictability</p>
              <p className="text-2xl font-bold">{result.predictability}%</p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${predColor[result.predictabilityLabel as keyof typeof predColor]}`}
              >
                {result.predictabilityLabel}
              </span>
            </div>
            <div className="bg-white rounded-xl border border-light-gray p-5">
              <p className="text-xs text-dark/50 mb-1">Range</p>
              <p className="text-2xl font-bold">
                {result.min}–{result.max}
              </p>
              <p className="text-xs text-dark/40">
                &sigma; {result.stdDev}
              </p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-light-gray p-5">
            <h3 className="text-sm font-semibold mb-4">
              Committed vs Completed
            </h3>
            <div className="space-y-3">
              {result.sprintData.map((d) => {
                const maxVal = Math.max(
                  ...result.sprintData.map((s) =>
                    Math.max(s.committed, s.completed)
                  ),
                  1
                );
                return (
                  <div key={d.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">{d.name}</span>
                      <span className="text-dark/50">
                        {d.completed}/{d.committed} pts
                      </span>
                    </div>
                    <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-gray-300 rounded-full"
                        style={{
                          width: `${(d.committed / maxVal) * 100}%`,
                        }}
                      />
                      <div
                        className="absolute h-full bg-primary rounded-full"
                        style={{
                          width: `${(d.completed / maxVal) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-dark/50">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-primary inline-block" />{" "}
                Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" />{" "}
                Committed
              </span>
            </div>
          </div>
        </div>
      )}

      <CTABanner
        headline="Velocity is just one metric."
        description="Measure 50+ dimensions — DORA, SPACE, DevEx — before and after AI training. See the full picture of your team's transformation."
        ctaText="Try the AI Transformation Monitor"
        ctaHref="/"
      />
    </>
  );
}
