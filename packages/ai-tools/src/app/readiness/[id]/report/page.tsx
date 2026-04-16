"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import { TEAM_MEMBER_ROLE_LABELS, POLICY_COVERAGE_AREAS } from "@ussp-platform/core";
import InfoTip from "@/components/InfoTip";
import type { TeamMemberRole } from "@ussp-platform/core";

interface CapabilityScore {
  capability: string;
  label: string;
  avg_score: number;
  response_count: number;
  is_blocker: boolean;
  by_role: Record<string, { avg: number; count: number }>;
}

interface ReportData {
  assessment: { id: string; name: string; status: string };
  company: { name: string; entity_type: string; state: string } | null;
  team: { name: string; objectives: string; pain_points: string } | null;
  policy: { has_policy: boolean; coverage: Record<string, boolean> } | null;
  overall_score: number;
  tier: { label: string; color: string; description: string };
  capability_scores: CapabilityScore[];
  response_rate: { total: number; completed: number; percentage: number };
  regulatory_gaps: string[];
  prior_comparison: {
    prior_overall_score: number;
    overall_delta: number;
    capability_deltas: { capability: string; current: number; prior: number; delta: number }[];
  } | null;
}

const TIER_COLORS: Record<string, string> = {
  red: "bg-red-100 text-red-800 border-red-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const GAP_LABELS: Record<string, string> = {
  no_policy: "No AI Usage Policy",
  data_privacy: "Data Privacy & Confidentiality",
  ip_ownership: "Code Ownership & IP",
  approved_tools: "Approved AI Tools List",
  prohibited_uses: "Prohibited Uses",
  data_handling: "Data Handling & Storage",
};

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/readiness/${id}/report`)
      .then((r) => r.json())
      .then((data) => { setReport(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6"><p className="text-dark/40">Loading report...</p></main>
    </>
  );

  if (!report) return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6"><p className="text-red-600">Failed to load report.</p></main>
    </>
  );

  const blockers = report.capability_scores.filter((c) => c.is_blocker);

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl print:ml-0 print:mt-0">
        <div className="print:hidden">
          <ReadinessSteps assessmentId={id} currentStep={13} status={report.assessment.status} />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Readiness Report</h1>
            <p className="text-sm text-dark/50">{report.assessment.name}</p>
            {report.company && <p className="text-sm text-dark/40">{report.company.name}</p>}
          </div>
          <button onClick={() => window.print()} className="print:hidden text-sm text-primary hover:underline">
            Print / PDF
          </button>
        </div>

        {/* Tier badge */}
        <div className={`rounded-lg border p-6 mb-6 ${TIER_COLORS[report.tier.color] || TIER_COLORS.blue}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{report.tier.label}</p>
              <p className="text-sm opacity-70">{report.tier.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{report.overall_score.toFixed(1)}</p>
              <p className="text-xs opacity-60">out of 5.0</p>
            </div>
          </div>
          {report.prior_comparison && (
            <div className="mt-3 pt-3 border-t border-current/10">
              <p className="text-sm">
                vs. prior assessment: {report.prior_comparison.prior_overall_score.toFixed(1)}
                <span className={`ml-2 font-bold ${report.prior_comparison.overall_delta > 0 ? "text-emerald-700" : report.prior_comparison.overall_delta < 0 ? "text-red-700" : ""}`}>
                  {report.prior_comparison.overall_delta > 0 ? "\u2191" : report.prior_comparison.overall_delta < 0 ? "\u2193" : "="} {Math.abs(report.prior_comparison.overall_delta).toFixed(1)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Response rate */}
        <div className="bg-white rounded-lg border border-light-gray p-4 mb-6">
          <p className="text-sm">
            <strong>{report.response_rate.completed}</strong> of {report.response_rate.total} responses ({report.response_rate.percentage}%)
          </p>
        </div>

        {/* Capability scores */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-sm font-semibold uppercase text-dark/40 mb-4">Capability Scores<InfoTip text="Each capability is scored 1-5 by aggregating responses. Capabilities below 3.0 are flagged as blockers that should be addressed before AI training." /></h2>
          <div className="space-y-3">
            {report.capability_scores.map((cs) => {
              const delta = report.prior_comparison?.capability_deltas.find((d) => d.capability === cs.capability);
              return (
                <div key={cs.capability} className="flex items-center gap-4">
                  <div className="w-48 text-sm truncate">{cs.label}</div>
                  <div className="flex-1">
                    <div className="w-full bg-light-gray rounded-full h-4 relative">
                      <div
                        className={`h-4 rounded-full ${cs.is_blocker ? "bg-red-400" : cs.avg_score >= 4 ? "bg-emerald-400" : "bg-blue-400"}`}
                        style={{ width: `${(cs.avg_score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium">{cs.avg_score.toFixed(1)}</div>
                  {cs.is_blocker && <span className="text-xs text-red-600 font-medium">BLOCKER</span>}
                  {delta && delta.delta !== 0 && (
                    <span className={`text-xs font-medium ${delta.delta > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {delta.delta > 0 ? "\u2191" : "\u2193"}{Math.abs(delta.delta).toFixed(1)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Blockers */}
        {blockers.length > 0 && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-5 mb-6">
            <h2 className="text-sm font-semibold text-red-800 mb-3">Blockers ({blockers.length})</h2>
            <div className="space-y-2">
              {blockers.map((b) => (
                <div key={b.capability} className="flex items-center justify-between">
                  <span className="text-sm text-red-700">{b.label}</span>
                  <span className="text-sm font-medium text-red-800">{b.avg_score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regulatory gaps */}
        {report.regulatory_gaps.length > 0 && (
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-5 mb-6">
            <h2 className="text-sm font-semibold text-amber-800 mb-3">Policy Gaps</h2>
            <ul className="space-y-1">
              {report.regulatory_gaps.map((gap) => (
                <li key={gap} className="text-sm text-amber-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {GAP_LABELS[gap] || gap}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Role-based perception */}
        {report.capability_scores.some((cs) => Object.keys(cs.by_role).length > 1) && (
          <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
            <h2 className="text-sm font-semibold uppercase text-dark/40 mb-4">Role-Based Perception<InfoTip text="Shows how different roles perceive the same capability. Large gaps (e.g., developers rate 4.2, managers rate 2.5) indicate misalignment to address." /></h2>
            <div className="space-y-4">
              {report.capability_scores
                .filter((cs) => Object.keys(cs.by_role).length > 1)
                .slice(0, 5)
                .map((cs) => (
                  <div key={cs.capability}>
                    <p className="text-sm font-medium mb-2">{cs.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(cs.by_role).map(([role, data]) => (
                        <span key={role} className="text-xs bg-light-gray px-2 py-1 rounded">
                          {TEAM_MEMBER_ROLE_LABELS[role as TeamMemberRole] || role}: <strong>{data.avg.toFixed(1)}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 print:hidden">
          <button onClick={() => router.push(`/readiness/${id}/distribute`)} className="text-sm text-dark/50 hover:text-dark">
            &larr; Back to Tracking
          </button>
          <button onClick={() => router.push(`/readiness/${id}/pilot`)}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: Pilot Planning &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
