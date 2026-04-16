"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import InfoTip from "@/components/InfoTip";
import { DATA_READINESS_DIMENSIONS } from "@ussp-platform/core";

type DimensionKey = typeof DATA_READINESS_DIMENSIONS[number]["key"];

export default function DataReadinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [evidenceNotes, setEvidenceNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    fetch(`/api/readiness/${id}/data`).then((r) => r.json()).then((data) => {
      if (data) {
        const s: Record<string, number> = {};
        for (const dim of DATA_READINESS_DIMENSIONS) {
          if (data[dim.key] != null) s[dim.key] = data[dim.key];
        }
        setScores(s);
        setEvidenceNotes(data.evidence_notes || {});
      }
    });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/readiness/${id}/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...scores, evidence_notes: evidenceNotes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const scoredDims = DATA_READINESS_DIMENSIONS.filter((d) => scores[d.key] != null);
  const avgScore = scoredDims.length > 0
    ? (scoredDims.reduce((sum, d) => sum + (scores[d.key] || 0), 0) / scoredDims.length).toFixed(1)
    : "---";

  function getBarColor(score: number): string {
    if (score >= 4) return "bg-emerald-500";
    if (score >= 3) return "bg-blue-500";
    if (score >= 2) return "bg-amber-500";
    return "bg-red-500";
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-3xl">
        <ReadinessSteps assessmentId={id} currentStep={8} status={assessment?.status || "draft"} />

        <h1 className="text-xl font-bold mb-1">Data Readiness</h1>
        <p className="text-sm text-dark/50 mb-6">Assess your organization&apos;s data maturity across five key dimensions.</p>

        {/* Overall Score */}
        <div className="bg-white rounded-lg border border-light-gray p-6 mb-6 text-center">
          <div className="text-4xl font-bold text-primary">{avgScore}</div>
          <div className="text-sm text-dark/50 mt-1">Overall Data Readiness Score (out of 5)</div>
        </div>

        {/* Score Visualization */}
        <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
          <h3 className="text-sm font-bold mb-4">Score Summary</h3>
          <div className="space-y-3">
            {DATA_READINESS_DIMENSIONS.map((dim) => {
              const score = scores[dim.key] ?? 0;
              return (
                <div key={dim.key} className="flex items-center gap-3">
                  <span className="text-xs text-dark/60 w-32 shrink-0">{dim.label}</span>
                  <div className="flex-1 h-5 bg-light-gray rounded-full overflow-hidden relative">
                    <div className={`h-full rounded-full transition-all ${getBarColor(score)}`} style={{ width: `${(score / 5) * 100}%` }} />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-dark/70">{score > 0 ? score : "---"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="space-y-4">
          {DATA_READINESS_DIMENSIONS.map((dim) => (
            <div key={dim.key} className="bg-white rounded-lg border border-light-gray p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold">
                  {dim.label}
                  <InfoTip text={`1 = ${dim.rubric_low}\n5 = ${dim.rubric_high}`} />
                </label>
                <span className="text-lg font-bold text-primary">{scores[dim.key] ?? "---"}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-dark/40 w-12 shrink-0">1 (Low)</span>
                <div className="flex-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button key={val} onClick={() => setScores((prev) => ({ ...prev, [dim.key]: val }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                        scores[dim.key] === val
                          ? val >= 4 ? "bg-emerald-500 text-white" : val >= 3 ? "bg-blue-500 text-white" : val >= 2 ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                          : "bg-light-gray text-dark/40 hover:bg-dark/10"
                      }`}>
                      {val}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-dark/40 w-14 shrink-0 text-right">5 (High)</span>
              </div>
              <div className="flex gap-4 text-[10px] text-dark/40 mb-3">
                <div className="flex-1"><span className="font-medium">Low (1):</span> {dim.rubric_low}</div>
                <div className="flex-1 text-right"><span className="font-medium">High (5):</span> {dim.rubric_high}</div>
              </div>
              <textarea placeholder="Evidence notes (optional) — describe current state, tools, gaps..."
                value={evidenceNotes[dim.key] || ""}
                onChange={(e) => setEvidenceNotes((prev) => ({ ...prev, [dim.key]: e.target.value }))}
                rows={2}
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push(`/readiness/${id}/enhancements`)}
              className="text-sm text-dark/50 hover:text-dark">
              &larr; Back: Enhancements
            </button>
            <button onClick={handleSave} disabled={saving}
              className="text-sm text-dark/50 hover:text-dark disabled:opacity-50">
              {saving ? "Saving..." : saved ? "Saved \u2713" : "Save Draft"}
            </button>
          </div>
          <button onClick={() => { handleSave().then(() => router.push(`/readiness/${id}/use-cases`)); }}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: Use Cases &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
