"use client";

import { useState } from "react";
import CTABanner from "@/components/CTABanner";

export default function AIROICalculatorPage() {
  const [teamSize, setTeamSize] = useState("8");
  const [avgSalary, setAvgSalary] = useState("120000");
  const [improvement, setImprovement] = useState(25);
  const [toolCost, setToolCost] = useState("40");
  const [trainingCost, setTrainingCost] = useState("15000");
  const [result, setResult] = useState<{
    annualGain: number;
    annualToolCost: number;
    totalInvestment: number;
    netBenefit: number;
    roiPct: number;
    paybackMonths: number;
  } | null>(null);

  function calculate() {
    const ts = parseInt(teamSize) || 0;
    const sal = parseFloat(avgSalary) || 0;
    const imp = improvement / 100;
    const tc = parseFloat(toolCost) || 0;
    const train = parseFloat(trainingCost) || 0;

    const annualGain = ts * sal * imp;
    const annualToolCost = ts * tc * 12;
    const totalInvestment = annualToolCost + train;
    const netBenefit = annualGain - totalInvestment;
    const roiPct = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;

    const monthlyGain = annualGain / 12;
    const monthlyToolCost = ts * tc;
    const monthlyNet = monthlyGain - monthlyToolCost;
    const paybackMonths = monthlyNet > 0 ? Math.ceil(train / monthlyNet) : 999;

    setResult({
      annualGain,
      annualToolCost,
      totalInvestment,
      netBenefit,
      roiPct: Math.round(roiPct),
      paybackMonths: Math.min(paybackMonths, 99),
    });
  }

  function fmt(n: number): string {
    return "$" + Math.round(n).toLocaleString();
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-dark mb-2">AI ROI Calculator</h1>
      <p className="text-dark/60 mb-8 max-w-2xl">
        Estimate the return on investment for AI training and tools for your
        engineering team. Based on research from McKinsey, GitHub, and
        Harvard/BCG showing 20-55% productivity improvement.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Team Size</label>
            <input
              type="number"
              min="1"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Average Annual Salary per Person ($)
            </label>
            <input
              type="number"
              min="0"
              value={avgSalary}
              onChange={(e) => setAvgSalary(e.target.value)}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Expected Productivity Improvement: {improvement}%
            </label>
            <input
              type="range"
              min="10"
              max="55"
              value={improvement}
              onChange={(e) => setImprovement(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-dark/40 mt-1">
              <span>10% (conservative)</span>
              <span>55% (aggressive)</span>
            </div>
            <p className="text-xs text-dark/50 mt-2 bg-blue-50 rounded-lg p-2">
              Research benchmarks: GitHub Copilot study shows ~55% faster task
              completion; McKinsey reports 20-45% productivity gains; Harvard/BCG
              found 25-40% improvement for consultants using AI.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              AI Tool Cost per Person / Month ($)
            </label>
            <input
              type="number"
              min="0"
              value={toolCost}
              onChange={(e) => setToolCost(e.target.value)}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              One-Time Training Cost (total, $)
            </label>
            <input
              type="number"
              min="0"
              value={trainingCost}
              onChange={(e) => setTrainingCost(e.target.value)}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors"
          >
            Calculate ROI
          </button>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-4">
              {/* Big ROI Number */}
              <div
                className={`rounded-xl border-2 p-6 text-center ${
                  result.roiPct >= 100
                    ? "bg-emerald-50 border-emerald-300"
                    : result.roiPct >= 0
                      ? "bg-blue-50 border-blue-300"
                      : "bg-red-50 border-red-300"
                }`}
              >
                <p className="text-sm font-medium opacity-60 mb-1">
                  Annual ROI
                </p>
                <p className="text-5xl font-bold">{result.roiPct}%</p>
                <p className="text-sm opacity-60 mt-1">
                  Payback in {result.paybackMonths}{" "}
                  {result.paybackMonths === 1 ? "month" : "months"}
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center rounded-lg border border-light-gray p-4">
                  <span className="text-sm text-dark/70">
                    Annual Productivity Gain
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    +{fmt(result.annualGain)}
                  </span>
                </div>
                <div className="flex justify-between items-center rounded-lg border border-light-gray p-4">
                  <span className="text-sm text-dark/70">
                    Annual AI Tool Cost
                  </span>
                  <span className="text-sm font-bold text-red-500">
                    -{fmt(result.annualToolCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center rounded-lg border border-light-gray p-4">
                  <span className="text-sm text-dark/70">Training Cost</span>
                  <span className="text-sm font-bold text-red-500">
                    -{fmt(parseFloat(trainingCost) || 0)}
                  </span>
                </div>
                <div
                  className={`flex justify-between items-center rounded-lg border-2 p-4 ${
                    result.netBenefit >= 0
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <span className="text-sm font-semibold">
                    Net Annual Benefit
                  </span>
                  <span
                    className={`text-lg font-bold ${result.netBenefit >= 0 ? "text-emerald-700" : "text-red-700"}`}
                  >
                    {fmt(result.netBenefit)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-dark/30 text-sm">
              Adjust the inputs and click Calculate to see your projected ROI.
            </div>
          )}
        </div>
      </div>

      <CTABanner
        headline="Estimates are good. Measured data is better."
        description="Track real before-and-after ROI across your team with audit-ready reports. The AI Transformation Monitor provides continuous measurement — not just projections."
        ctaText="Try the AI Transformation Monitor"
        ctaHref="/"
      />
    </>
  );
}
