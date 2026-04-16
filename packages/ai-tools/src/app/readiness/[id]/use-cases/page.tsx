"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import InfoTip from "@/components/InfoTip";
import {
  ASSESSMENT_PILLAR_LABELS,
  USE_CASE_QUADRANT_LABELS,
  INVESTMENT_TIER_LABELS,
  computeQuadrant,
  computeInvestmentTier,
  type AssessmentPillar,
  type UseCaseQuadrant,
  type UseCaseRecord,
} from "@ussp-platform/core";

const QUADRANT_COLORS: Record<UseCaseQuadrant, string> = {
  quick_win: "bg-emerald-100 text-emerald-700",
  strategic_bet: "bg-blue-100 text-blue-700",
  fill_in: "bg-dark/5 text-dark/50",
  avoid: "bg-red-100 text-red-700",
};

interface UseCaseForm {
  title: string;
  description: string;
  pillar: string;
  affected_roles: string;
  impact_score: string;
  effort_score: string;
  timeline_months: string;
  required_tools: string;
  prerequisites: string;
}

const emptyForm: UseCaseForm = {
  title: "", description: "", pillar: "", affected_roles: "",
  impact_score: "", effort_score: "", timeline_months: "",
  required_tools: "", prerequisites: "",
};

export default function UseCasesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [useCases, setUseCases] = useState<UseCaseRecord[]>([]);
  const [scopePillars, setScopePillars] = useState<AssessmentPillar[]>([]);
  const [form, setForm] = useState<UseCaseForm>({ ...emptyForm });
  const [showForm, setShowForm] = useState(false);
  const [filterPillar, setFilterPillar] = useState<string>("");
  const [sortBy, setSortBy] = useState<"impact" | "effort" | "title">("impact");

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    fetch(`/api/readiness/${id}/scope`).then((r) => r.json()).then((data: { pillar: AssessmentPillar; in_scope: boolean }[]) => {
      if (Array.isArray(data)) setScopePillars(data.filter((d) => d.in_scope).map((d) => d.pillar));
    });
    loadUseCases();
  }, [id]);

  async function loadUseCases() {
    const data = await fetch(`/api/readiness/${id}/use-cases`).then((r) => r.json());
    if (Array.isArray(data)) setUseCases(data);
  }

  async function addUseCase() {
    if (!form.title.trim()) return;
    await fetch(`/api/readiness/${id}/use-cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description || undefined,
        pillar: form.pillar || undefined,
        affected_roles: form.affected_roles ? form.affected_roles.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        impact_score: form.impact_score ? Number(form.impact_score) : undefined,
        effort_score: form.effort_score ? Number(form.effort_score) : undefined,
        timeline_months: form.timeline_months ? Number(form.timeline_months) : undefined,
        required_tools: form.required_tools || undefined,
        prerequisites: form.prerequisites || undefined,
      }),
    });
    setForm({ ...emptyForm });
    setShowForm(false);
    loadUseCases();
  }

  async function deleteUseCase(ucId: string) {
    await fetch(`/api/readiness/${id}/use-cases/${ucId}`, { method: "DELETE" });
    loadUseCases();
  }

  // Group use cases by quadrant for the 2x2 matrix
  const quadrantGroups: Record<UseCaseQuadrant, UseCaseRecord[]> = { quick_win: [], strategic_bet: [], fill_in: [], avoid: [] };
  for (const uc of useCases) {
    if (uc.quadrant) quadrantGroups[uc.quadrant].push(uc);
  }

  // Filtered and sorted list
  const filtered = useCases
    .filter((uc) => !filterPillar || uc.pillar === filterPillar)
    .sort((a, b) => {
      if (sortBy === "impact") return (b.impact_score || 0) - (a.impact_score || 0);
      if (sortBy === "effort") return (a.effort_score || 0) - (b.effort_score || 0);
      return a.title.localeCompare(b.title);
    });

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <ReadinessSteps assessmentId={id} currentStep={9} status={assessment?.status || "draft"} hasDataPillar={scopePillars.includes("data")} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold mb-1">Use Cases</h1>
            <p className="text-sm text-dark/50">Prioritize AI use cases using impact vs. effort scoring.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            {showForm ? "Cancel" : "+ Add Use Case"}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-light-gray p-6 mb-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., AI-assisted code review for PRs"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} placeholder="Describe the use case, expected benefits, and how AI would be applied..."
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Pillar</label>
                <select value={form.pillar} onChange={(e) => setForm({ ...form, pillar: e.target.value })}
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select pillar...</option>
                  {scopePillars.map((p) => (
                    <option key={p} value={p}>{ASSESSMENT_PILLAR_LABELS[p].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Affected Roles (comma-separated)
                </label>
                <input type="text" value={form.affected_roles} onChange={(e) => setForm({ ...form, affected_roles: e.target.value })}
                  placeholder="e.g., Developer, Tech Lead"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Impact (1-5) <InfoTip text="1 = Minimal impact on team productivity. 5 = Transformative improvement across the pillar." />
                </label>
                <input type="number" min="1" max="5" value={form.impact_score} onChange={(e) => setForm({ ...form, impact_score: e.target.value })}
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Effort (1-5) <InfoTip text="1 = Easy to implement, minimal change. 5 = Major investment in tooling, training, and process change." />
                </label>
                <input type="number" min="1" max="5" value={form.effort_score} onChange={(e) => setForm({ ...form, effort_score: e.target.value })}
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Timeline (months)</label>
                <input type="number" min="1" value={form.timeline_months} onChange={(e) => setForm({ ...form, timeline_months: e.target.value })}
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Required Tools</label>
                <input type="text" value={form.required_tools} onChange={(e) => setForm({ ...form, required_tools: e.target.value })}
                  placeholder="e.g., GitHub Copilot, ChatGPT"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">Prerequisites</label>
                <input type="text" value={form.prerequisites} onChange={(e) => setForm({ ...form, prerequisites: e.target.value })}
                  placeholder="e.g., Team trained on Copilot, AI policy approved"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={addUseCase}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                Save Use Case
              </button>
            </div>
          </div>
        )}

        {/* 2x2 Matrix */}
        {useCases.length > 0 && (
          <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
            <h3 className="text-sm font-bold mb-4">Impact vs. Effort Matrix</h3>
            <div className="grid grid-cols-2 gap-px bg-dark/10 rounded-lg overflow-hidden" style={{ aspectRatio: "2/1.2" }}>
              {/* High Impact, Low Effort = Quick Win (top-left) */}
              <div className="bg-emerald-50 p-3 flex flex-col">
                <div className="text-[10px] font-bold text-emerald-700 uppercase mb-2">Quick Win</div>
                <div className="flex flex-wrap gap-1 flex-1">
                  {quadrantGroups.quick_win.map((uc) => (
                    <div key={uc.id} className="bg-emerald-200 text-emerald-800 text-[10px] px-2 py-1 rounded-full truncate max-w-[140px]" title={uc.title}>
                      {uc.title}
                    </div>
                  ))}
                </div>
              </div>
              {/* High Impact, High Effort = Strategic Bet (top-right) */}
              <div className="bg-blue-50 p-3 flex flex-col">
                <div className="text-[10px] font-bold text-blue-700 uppercase mb-2">Strategic Bet</div>
                <div className="flex flex-wrap gap-1 flex-1">
                  {quadrantGroups.strategic_bet.map((uc) => (
                    <div key={uc.id} className="bg-blue-200 text-blue-800 text-[10px] px-2 py-1 rounded-full truncate max-w-[140px]" title={uc.title}>
                      {uc.title}
                    </div>
                  ))}
                </div>
              </div>
              {/* Low Impact, Low Effort = Fill-In (bottom-left) */}
              <div className="bg-dark/3 p-3 flex flex-col">
                <div className="text-[10px] font-bold text-dark/40 uppercase mb-2">Fill-In</div>
                <div className="flex flex-wrap gap-1 flex-1">
                  {quadrantGroups.fill_in.map((uc) => (
                    <div key={uc.id} className="bg-dark/10 text-dark/60 text-[10px] px-2 py-1 rounded-full truncate max-w-[140px]" title={uc.title}>
                      {uc.title}
                    </div>
                  ))}
                </div>
              </div>
              {/* Low Impact, High Effort = Avoid (bottom-right) */}
              <div className="bg-red-50 p-3 flex flex-col">
                <div className="text-[10px] font-bold text-red-700 uppercase mb-2">Avoid</div>
                <div className="flex flex-wrap gap-1 flex-1">
                  {quadrantGroups.avoid.map((uc) => (
                    <div key={uc.id} className="bg-red-200 text-red-800 text-[10px] px-2 py-1 rounded-full truncate max-w-[140px]" title={uc.title}>
                      {uc.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-dark/40 mt-1 px-1">
              <span>&larr; Low Effort</span>
              <span>High Effort &rarr;</span>
            </div>
          </div>
        )}

        {/* Filter/Sort Controls */}
        {useCases.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <select value={filterPillar} onChange={(e) => setFilterPillar(e.target.value)}
              className="border border-light-gray rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">All pillars</option>
              {scopePillars.map((p) => (
                <option key={p} value={p}>{ASSESSMENT_PILLAR_LABELS[p].label}</option>
              ))}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border border-light-gray rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="impact">Sort by Impact (high first)</option>
              <option value="effort">Sort by Effort (low first)</option>
              <option value="title">Sort by Title</option>
            </select>
            <span className="text-xs text-dark/40">{filtered.length} use cases</span>
          </div>
        )}

        {/* Use Case List */}
        <div className="space-y-2">
          {filtered.map((uc) => {
            const quad = uc.quadrant ? USE_CASE_QUADRANT_LABELS[uc.quadrant] : null;
            const tier = uc.timeline_months != null ? computeInvestmentTier(uc.timeline_months) : null;
            const pillarInfo = uc.pillar ? ASSESSMENT_PILLAR_LABELS[uc.pillar as AssessmentPillar] : null;

            return (
              <div key={uc.id} className="bg-white rounded-lg border border-light-gray p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold">{uc.title}</h3>
                      {pillarInfo && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{pillarInfo.label}</span>}
                      {quad && <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${QUADRANT_COLORS[uc.quadrant!]}`}>{quad.label}</span>}
                      {tier && <span className="text-[10px] text-dark/40">{INVESTMENT_TIER_LABELS[tier].timeframe}</span>}
                    </div>
                    {uc.description && <p className="text-xs text-dark/60">{uc.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-dark/50">
                      {uc.impact_score != null && <span>Impact: <span className="font-bold text-dark">{uc.impact_score}/5</span></span>}
                      {uc.effort_score != null && <span>Effort: <span className="font-bold text-dark">{uc.effort_score}/5</span></span>}
                      {uc.affected_roles.length > 0 && <span>Roles: {uc.affected_roles.join(", ")}</span>}
                      {uc.required_tools && <span>Tools: {uc.required_tools}</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteUseCase(uc.id)}
                    className="text-xs text-red-500 hover:text-red-700 shrink-0 ml-2">{"\u2715"}</button>
                </div>
              </div>
            );
          })}
        </div>

        {useCases.length === 0 && !showForm && (
          <div className="text-center py-12 text-dark/40">
            <p className="text-sm">No use cases yet. Click &quot;+ Add Use Case&quot; to get started.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(scopePillars.includes("data") ? `/readiness/${id}/data` : `/readiness/${id}/enhancements`)}
            className="text-sm text-dark/50 hover:text-dark">
            &larr; Back: {scopePillars.includes("data") ? "Data Readiness" : "Enhancements"}
          </button>
          <button onClick={() => router.push(`/readiness/${id}/questionnaire`)}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: Questionnaire &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
