"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import InfoTip from "@/components/InfoTip";
import {
  USE_CASE_QUADRANT_LABELS,
  type UseCaseRecord,
  type PilotRecord,
} from "@ussp-platform/core";

interface PilotForm {
  use_case_id: string;
  title: string;
  scope_description: string;
  success_criteria: string;
  timeline: string;
  team_roles: string;
  tools_needed: string;
  estimated_cost: string;
  go_nogo_criteria: string;
}

const emptyForm: PilotForm = {
  use_case_id: "", title: "", scope_description: "", success_criteria: "",
  timeline: "", team_roles: "", tools_needed: "", estimated_cost: "", go_nogo_criteria: "",
};

export default function PilotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [quickWins, setQuickWins] = useState<UseCaseRecord[]>([]);
  const [pilots, setPilots] = useState<PilotRecord[]>([]);
  const [form, setForm] = useState<PilotForm>({ ...emptyForm });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    fetch(`/api/readiness/${id}/use-cases`).then((r) => r.json()).then((data: UseCaseRecord[]) => {
      if (Array.isArray(data)) setQuickWins(data.filter((uc) => uc.quadrant === "quick_win"));
    });
    loadPilots();
  }, [id]);

  async function loadPilots() {
    const data = await fetch(`/api/readiness/${id}/pilots`).then((r) => r.json());
    if (Array.isArray(data)) setPilots(data);
  }

  function selectQuickWin(uc: UseCaseRecord) {
    setForm({
      ...emptyForm,
      use_case_id: uc.id,
      title: uc.title,
      tools_needed: uc.required_tools || "",
      team_roles: uc.affected_roles.join(", "),
    });
    setShowForm(true);
  }

  async function savePilot() {
    if (!form.title.trim()) return;
    await fetch(`/api/readiness/${id}/pilots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        use_case_id: form.use_case_id || undefined,
        title: form.title,
        scope_description: form.scope_description || undefined,
        success_criteria: form.success_criteria || undefined,
        timeline: form.timeline || undefined,
        team_roles: form.team_roles ? form.team_roles.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        tools_needed: form.tools_needed || undefined,
        estimated_cost: form.estimated_cost || undefined,
        go_nogo_criteria: form.go_nogo_criteria || undefined,
      }),
    });
    setForm({ ...emptyForm });
    setShowForm(false);
    loadPilots();
  }

  async function deletePilot(pilotId: string) {
    await fetch(`/api/readiness/${id}/pilots/${pilotId}`, { method: "DELETE" });
    loadPilots();
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <ReadinessSteps assessmentId={id} currentStep={14} status={assessment?.status || "draft"} />

        <h1 className="text-xl font-bold mb-1">Pilot Planning</h1>
        <p className="text-sm text-dark/50 mb-6">Define pilot projects to validate AI adoption. Start with Quick Win use cases.</p>

        {/* Quick Win Use Cases */}
        {quickWins.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-3">Quick Win Use Cases <InfoTip text="These are high-impact, low-effort use cases ideal for pilot programs. Click one to pre-fill the pilot form." /></h2>
            <div className="grid grid-cols-2 gap-3">
              {quickWins.map((uc) => {
                const alreadyPiloted = pilots.some((p) => p.use_case_id === uc.id);
                return (
                  <button key={uc.id} onClick={() => !alreadyPiloted && selectQuickWin(uc)}
                    disabled={alreadyPiloted}
                    className={`text-left rounded-lg border p-3 transition-colors ${
                      alreadyPiloted
                        ? "border-emerald-300 bg-emerald-50 opacity-60"
                        : "border-light-gray bg-white hover:border-primary hover:bg-primary/5"
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Quick Win</span>
                      {alreadyPiloted && <span className="text-[10px] text-emerald-600">Pilot created</span>}
                    </div>
                    <h3 className="text-sm font-medium">{uc.title}</h3>
                    {uc.description && <p className="text-xs text-dark/50 mt-0.5 line-clamp-2">{uc.description}</p>}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-dark/40">
                      {uc.impact_score != null && <span>Impact: {uc.impact_score}/5</span>}
                      {uc.effort_score != null && <span>Effort: {uc.effort_score}/5</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Pilot Button */}
        {!showForm && (
          <button onClick={() => { setForm({ ...emptyForm }); setShowForm(true); }}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors mb-6">
            + Create Pilot from Scratch
          </button>
        )}

        {/* Pilot Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-light-gray p-6 mb-6 space-y-3">
            <h3 className="text-sm font-bold">
              {form.use_case_id ? "Pilot from Use Case" : "New Pilot"}
            </h3>
            <div>
              <label className="block text-xs font-medium mb-1">Pilot Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Scope Description <InfoTip text="What exactly will the pilot cover? Which teams, which workflows, what boundaries?" /></label>
              <textarea value={form.scope_description} onChange={(e) => setForm({ ...form, scope_description: e.target.value })}
                rows={3} placeholder="Define the boundaries of this pilot..."
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Success Criteria <InfoTip text="How will you measure if the pilot succeeded? Be specific and measurable." /></label>
                <textarea value={form.success_criteria} onChange={(e) => setForm({ ...form, success_criteria: e.target.value })}
                  rows={2} placeholder="e.g., 20% reduction in code review time"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Go/No-Go Criteria <InfoTip text="What conditions must be met before the pilot starts? What would cause it to be stopped?" /></label>
                <textarea value={form.go_nogo_criteria} onChange={(e) => setForm({ ...form, go_nogo_criteria: e.target.value })}
                  rows={2} placeholder="e.g., All team members completed AI training"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Timeline</label>
                <input type="text" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  placeholder="e.g., 4 weeks, 2 sprints"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Estimated Cost</label>
                <input type="text" value={form.estimated_cost} onChange={(e) => setForm({ ...form, estimated_cost: e.target.value })}
                  placeholder="e.g., $500/month for Copilot licenses"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Team Roles (comma-separated)</label>
                <input type="text" value={form.team_roles} onChange={(e) => setForm({ ...form, team_roles: e.target.value })}
                  placeholder="e.g., 2 Developers, 1 Tech Lead, 1 QA"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Tools Needed</label>
                <input type="text" value={form.tools_needed} onChange={(e) => setForm({ ...form, tools_needed: e.target.value })}
                  placeholder="e.g., GitHub Copilot Business"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowForm(false); setForm({ ...emptyForm }); }}
                className="text-sm text-dark/50 hover:text-dark px-4 py-2">Cancel</button>
              <button onClick={savePilot}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                Save Pilot
              </button>
            </div>
          </div>
        )}

        {/* Existing Pilots */}
        <div className="space-y-3">
          {pilots.map((pilot) => (
            <div key={pilot.id} className="bg-white rounded-lg border border-light-gray p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-bold">{pilot.title}</h3>
                  {pilot.scope_description && <p className="text-xs text-dark/60 mt-1">{pilot.scope_description}</p>}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs">
                    {pilot.success_criteria && (
                      <div><span className="font-medium text-dark/50">Success Criteria:</span> <span className="text-dark/70">{pilot.success_criteria}</span></div>
                    )}
                    {pilot.go_nogo_criteria && (
                      <div><span className="font-medium text-dark/50">Go/No-Go:</span> <span className="text-dark/70">{pilot.go_nogo_criteria}</span></div>
                    )}
                    {pilot.timeline && (
                      <div><span className="font-medium text-dark/50">Timeline:</span> <span className="text-dark/70">{pilot.timeline}</span></div>
                    )}
                    {pilot.estimated_cost && (
                      <div><span className="font-medium text-dark/50">Cost:</span> <span className="text-dark/70">{pilot.estimated_cost}</span></div>
                    )}
                    {pilot.team_roles.length > 0 && (
                      <div><span className="font-medium text-dark/50">Team:</span> <span className="text-dark/70">{pilot.team_roles.join(", ")}</span></div>
                    )}
                    {pilot.tools_needed && (
                      <div><span className="font-medium text-dark/50">Tools:</span> <span className="text-dark/70">{pilot.tools_needed}</span></div>
                    )}
                  </div>
                </div>
                <button onClick={() => deletePilot(pilot.id)}
                  className="text-xs text-red-500 hover:text-red-700 shrink-0 ml-2">{"\u2715"}</button>
              </div>
            </div>
          ))}
        </div>

        {pilots.length === 0 && !showForm && quickWins.length === 0 && (
          <div className="text-center py-12 text-dark/40">
            <p className="text-sm">No pilots or quick win use cases yet. Complete the Use Cases step first, or create a pilot from scratch.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(`/readiness/${id}/report`)}
            className="text-sm text-dark/50 hover:text-dark">
            &larr; Back: Report
          </button>
          <button onClick={() => router.push(`/readiness`)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            Finish Assessment
          </button>
        </div>
      </main>
    </>
  );
}
