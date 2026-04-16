"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import InfoTip from "@/components/InfoTip";
import {
  ASSESSMENT_PILLAR_LABELS,
  ENHANCEMENT_STATUS_LABELS,
  type AssessmentPillar,
  type EnhancementStatus,
  type AIEnhancementCatalogItem,
  type AssessmentEnhancementStatusRecord,
} from "@ussp-platform/core";

const STATUS_KEYS = Object.keys(ENHANCEMENT_STATUS_LABELS) as EnhancementStatus[];

const STATUS_COLORS: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-dark/5 text-dark/50",
  amber: "bg-amber-100 text-amber-700",
};

export default function EnhancementsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [catalogItems, setCatalogItems] = useState<AIEnhancementCatalogItem[]>([]);
  const [statuses, setStatuses] = useState<AssessmentEnhancementStatusRecord[]>([]);
  const [scopePillars, setScopePillars] = useState<AssessmentPillar[]>([]);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    fetch(`/api/readiness/${id}/scope`).then((r) => r.json()).then((data: { pillar: AssessmentPillar; in_scope: boolean }[]) => {
      if (Array.isArray(data)) {
        const inScope = data.filter((d) => d.in_scope).map((d) => d.pillar);
        setScopePillars(inScope);
        // Fetch catalog items filtered to in-scope pillars
        const params = new URLSearchParams();
        inScope.forEach((p) => params.append("pillar", p));
        fetch(`/api/readiness/catalog?${params.toString()}`).then((r) => r.json()).then((items: AIEnhancementCatalogItem[]) => {
          if (Array.isArray(items)) setCatalogItems(items);
        });
      }
    });
    loadStatuses();
  }, [id]);

  async function loadStatuses() {
    const data = await fetch(`/api/readiness/${id}/enhancements`).then((r) => r.json());
    if (Array.isArray(data)) setStatuses(data);
  }

  function getStatus(itemId: string): AssessmentEnhancementStatusRecord | undefined {
    return statuses.find((s) => s.catalog_item_id === itemId);
  }

  async function updateStatus(itemId: string, status: EnhancementStatus) {
    await fetch(`/api/readiness/${id}/enhancements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ catalog_item_id: itemId, status }),
    });
    loadStatuses();
  }

  async function updateField(itemId: string, field: string, value: string) {
    await fetch(`/api/readiness/${id}/enhancements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ catalog_item_id: itemId, [field]: value }),
    });
    loadStatuses();
  }

  // Group by pillar
  const byPillar: Record<string, AIEnhancementCatalogItem[]> = {};
  for (const item of catalogItems) {
    if (!byPillar[item.pillar]) byPillar[item.pillar] = [];
    byPillar[item.pillar].push(item);
  }

  // Coverage stats
  const totalItems = catalogItems.length;
  const evaluatedItems = statuses.filter((s) => s.status !== "not_evaluated").length;
  const coveragePct = totalItems > 0 ? Math.round((evaluatedItems / totalItems) * 100) : 0;

  // Count by status
  const statusCounts: Record<EnhancementStatus, number> = { in_use: 0, opportunity: 0, blocked: 0, not_applicable: 0, not_evaluated: 0 };
  for (const s of statuses) statusCounts[s.status]++;
  // Items without status are not_evaluated
  statusCounts.not_evaluated += (totalItems - statuses.length);

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <ReadinessSteps assessmentId={id} currentStep={7} status={assessment?.status || "draft"} hasDataPillar={scopePillars.includes("data")} />

        <h1 className="text-xl font-bold mb-1">AI Enhancements</h1>
        <p className="text-sm text-dark/50 mb-6">Evaluate each AI enhancement opportunity against your constraints and current tools.</p>

        {/* Overall Coverage Banner */}
        <div className="bg-white rounded-lg border border-light-gray p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Coverage</span>
            <span className="text-sm text-dark/50">Evaluated {evaluatedItems} of {totalItems} ({coveragePct}%)</span>
          </div>
          <div className="w-full h-2 bg-light-gray rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${coveragePct}%` }} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {STATUS_KEYS.map((key) => {
            const info = ENHANCEMENT_STATUS_LABELS[key];
            return (
              <div key={key} className={`rounded-lg p-3 text-center ${STATUS_COLORS[info.color] || "bg-dark/5"}`}>
                <div className="text-2xl font-bold">{statusCounts[key]}</div>
                <div className="text-xs font-medium mt-0.5">{info.label}</div>
              </div>
            );
          })}
        </div>

        {/* Items by Pillar */}
        <div className="space-y-6">
          {Object.entries(byPillar).map(([pillar, items]) => {
            const pillarInfo = ASSESSMENT_PILLAR_LABELS[pillar as AssessmentPillar];
            const pillarStatuses = items.map((i) => getStatus(i.id));
            const pillarEvaluated = pillarStatuses.filter((s) => s && s.status !== "not_evaluated").length;

            return (
              <div key={pillar}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold">{pillarInfo?.label || pillar}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dark/40">{pillarEvaluated}/{items.length} evaluated</span>
                    <div className="w-24 h-1.5 bg-light-gray rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${items.length > 0 ? (pillarEvaluated / items.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {items.map((item) => {
                    const current = getStatus(item.id);
                    const currentStatus: EnhancementStatus = current?.status || "not_evaluated";

                    return (
                      <div key={item.id} className="bg-white rounded-lg border border-light-gray p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium">{item.name}</h3>
                            {item.description && <p className="text-xs text-dark/50 mt-0.5">{item.description}</p>}
                            {item.example_tools && <p className="text-xs text-dark/40 mt-0.5 italic">Tools: {item.example_tools}</p>}
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <select value={currentStatus} onChange={(e) => updateStatus(item.id, e.target.value as EnhancementStatus)}
                              className="border border-light-gray rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                              {STATUS_KEYS.map((s) => (
                                <option key={s} value={s}>{ENHANCEMENT_STATUS_LABELS[s].label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Conditional fields based on status */}
                        {currentStatus === "in_use" && (
                          <div className="mt-3 flex items-center gap-2">
                            <label className="text-xs text-dark/50">Tool used:</label>
                            <input type="text" placeholder="e.g., GitHub Copilot" defaultValue={current?.tool_used || ""}
                              onBlur={(e) => updateField(item.id, "tool_used", e.target.value)}
                              className="flex-1 border border-light-gray rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                        )}
                        {currentStatus === "blocked" && (
                          <div className="mt-3 flex items-center gap-2">
                            <label className="text-xs text-dark/50">Blocking constraint:</label>
                            <input type="text" placeholder="What constraint blocks this?" defaultValue={current?.notes || ""}
                              onBlur={(e) => updateField(item.id, "notes", e.target.value)}
                              className="flex-1 border border-light-gray rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                        )}
                        <div className="mt-2">
                          <input type="text" placeholder="Notes (optional)" defaultValue={current?.notes || ""}
                            onBlur={(e) => updateField(item.id, "notes", e.target.value)}
                            className="w-full border border-light-gray rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {catalogItems.length === 0 && (
          <div className="text-center py-12 text-dark/40">
            <p className="text-sm">No catalog items found for your in-scope pillars. Make sure you have selected pillars in the Scope step.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(`/readiness/${id}/sdlc`)}
            className="text-sm text-dark/50 hover:text-dark">
            &larr; Back: SDLC Analysis
          </button>
          <button onClick={() => router.push(scopePillars.includes("data") ? `/readiness/${id}/data` : `/readiness/${id}/use-cases`)}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: {scopePillars.includes("data") ? "Data Readiness" : "Use Cases"} &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
