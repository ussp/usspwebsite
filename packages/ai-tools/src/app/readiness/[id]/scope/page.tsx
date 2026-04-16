"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import InfoTip from "@/components/InfoTip";
import { ASSESSMENT_PILLAR_LABELS } from "@ussp-platform/core";
import type { AssessmentPillar } from "@ussp-platform/core";

const ALL_PILLARS = Object.keys(ASSESSMENT_PILLAR_LABELS) as AssessmentPillar[];

const PILLAR_TIPS: Record<string, string> = {
  development: "Include if your teams write or maintain code. Even low-code teams benefit from AI code review.",
  testing: "Include if your teams run manual or automated tests. AI can generate and maintain test suites.",
  documentation: "Include if documentation quality or freshness is a concern. AI excels here.",
  pmo: "Include if you track velocity, sprint health, or produce status reports.",
  ba: "Include if your BAs write stories, acceptance criteria, or do requirements analysis.",
  devops: "Include if you manage CI/CD pipelines, infrastructure, or deployments.",
  data: "Include if your teams work with data pipelines, BI, or data governance.",
  security: "Include if security reviews, vulnerability scans, or compliance checks are part of your workflow.",
  design: "Include if your teams produce UI designs, prototypes, or do user research.",
};

export default function ScopePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [selected, setSelected] = useState<Set<AssessmentPillar>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    fetch(`/api/readiness/${id}/scope`).then((r) => r.json()).then((data: { pillar: AssessmentPillar; in_scope: boolean }[]) => {
      if (Array.isArray(data)) {
        setSelected(new Set(data.filter((d) => d.in_scope).map((d) => d.pillar)));
      }
    });
  }, [id]);

  async function saveScope(pillars: Set<AssessmentPillar>) {
    setSaving(true);
    await fetch(`/api/readiness/${id}/scope`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pillars: ALL_PILLARS.map((p) => ({ pillar: p, in_scope: pillars.has(p) })),
      }),
    });
    setSaving(false);
  }

  function toggle(pillar: AssessmentPillar) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(pillar)) next.delete(pillar);
      else next.add(pillar);
      saveScope(next);
      return next;
    });
  }

  function selectAll() {
    const all = new Set(ALL_PILLARS);
    setSelected(all);
    saveScope(all);
  }

  function clearAll() {
    const empty = new Set<AssessmentPillar>();
    setSelected(empty);
    saveScope(empty);
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <ReadinessSteps assessmentId={id} currentStep={4} status={assessment?.status || "draft"} hasDataPillar={selected.has("data")} />

        <h1 className="text-xl font-bold mb-1">Assessment Scope</h1>
        <p className="text-sm text-dark/50 mb-6">Select which pillars to include in this assessment. You can always adjust later.</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-xs text-primary hover:underline font-medium">Select All</button>
            <span className="text-dark/20">|</span>
            <button onClick={clearAll} className="text-xs text-dark/50 hover:underline font-medium">Clear All</button>
          </div>
          <div className="text-sm text-dark/60 flex items-center gap-2">
            <span className="font-medium text-dark">{selected.size}</span> of {ALL_PILLARS.length} pillars selected
            {saving && <span className="text-xs text-dark/40">Saving...</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_PILLARS.map((pillar) => {
            const info = ASSESSMENT_PILLAR_LABELS[pillar];
            const isSelected = selected.has(pillar);

            return (
              <button
                key={pillar}
                onClick={() => toggle(pillar)}
                className={`text-left rounded-lg border-2 p-4 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-light-gray bg-white hover:border-dark/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold">{info.label}</h3>
                  <div className="flex items-center gap-1">
                    <InfoTip text={PILLAR_TIPS[pillar] || info.description} />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "border-primary bg-primary text-white" : "border-dark/20"
                    }`}>
                      {isSelected && <span className="text-[10px] font-bold">{"\u2713"}</span>}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-dark/60 mb-2">{info.description}</p>
                <p className="text-xs text-dark/40 italic">e.g., {info.examples}</p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(`/readiness/${id}/policy`)}
            className="text-sm text-dark/50 hover:text-dark">
            &larr; Back: AI Policy
          </button>
          <button onClick={() => router.push(`/readiness/${id}/constraints`)}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: Constraints &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
