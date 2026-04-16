"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import InfoTip from "@/components/InfoTip";
import {
  ASSESSMENT_PILLAR_LABELS,
  IMPROVEMENT_TYPE_LABELS,
  type WorkflowPhaseRecord,
  type AIOpportunityRecord,
  type ImprovementType,
} from "@ussp-platform/core";

const TEMPLATES = [
  { key: "scrum", label: "Scrum" },
  { key: "safe", label: "SAFe" },
  { key: "kanban", label: "Kanban" },
];

const IMPROVEMENT_TYPES = Object.keys(IMPROVEMENT_TYPE_LABELS) as ImprovementType[];

interface OpportunityForm {
  description: string;
  approved_tool: string;
  improvement_pct: string;
  improvement_type: ImprovementType | "";
  is_current_strength: boolean;
}

const emptyOpp: OpportunityForm = { description: "", approved_tool: "", improvement_pct: "", improvement_type: "", is_current_strength: false };

export default function SDLCPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [phases, setPhases] = useState<WorkflowPhaseRecord[]>([]);
  const [opportunities, setOpportunities] = useState<AIOpportunityRecord[]>([]);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [phaseEdits, setPhaseEdits] = useState<Record<string, Partial<WorkflowPhaseRecord>>>({});
  const [oppForms, setOppForms] = useState<Record<string, OpportunityForm>>({});
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    loadPhases();
    loadOpportunities();
  }, [id]);

  async function loadPhases() {
    const data = await fetch(`/api/readiness/${id}/sdlc/phases`).then((r) => r.json());
    if (Array.isArray(data)) setPhases(data);
  }

  async function loadOpportunities() {
    const data = await fetch(`/api/readiness/${id}/sdlc/opportunities`).then((r) => r.json());
    if (Array.isArray(data)) setOpportunities(data);
  }

  async function loadTemplate(template: string) {
    setLoadingTemplate(true);
    await fetch(`/api/readiness/${id}/sdlc/phases/template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template }),
    });
    await loadPhases();
    setLoadingTemplate(false);
  }

  function togglePhase(phaseId: string) {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  }

  async function savePhase(phaseId: string) {
    const edits = phaseEdits[phaseId];
    if (!edits) return;
    await fetch(`/api/readiness/${id}/sdlc/phases/${phaseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edits),
    });
    setEditingPhase(null);
    loadPhases();
  }

  async function deletePhase(phaseId: string) {
    await fetch(`/api/readiness/${id}/sdlc/phases/${phaseId}`, { method: "DELETE" });
    loadPhases();
    loadOpportunities();
  }

  async function addOpportunity(phaseId: string) {
    const form = oppForms[phaseId];
    if (!form || !form.description.trim()) return;
    await fetch(`/api/readiness/${id}/sdlc/opportunities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phase_id: phaseId,
        description: form.description,
        approved_tool: form.approved_tool || undefined,
        improvement_pct: form.improvement_pct ? Number(form.improvement_pct) : undefined,
        improvement_type: form.improvement_type || undefined,
        is_current_strength: form.is_current_strength,
      }),
    });
    setOppForms((prev) => ({ ...prev, [phaseId]: { ...emptyOpp } }));
    loadOpportunities();
  }

  async function deleteOpportunity(oppId: string) {
    await fetch(`/api/readiness/${id}/sdlc/opportunities/${oppId}`, { method: "DELETE" });
    loadOpportunities();
  }

  async function toggleStrength(opp: AIOpportunityRecord) {
    await fetch(`/api/readiness/${id}/sdlc/opportunities/${opp.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_current_strength: !opp.is_current_strength }),
    });
    loadOpportunities();
  }

  const totalImprovement = opportunities.reduce((sum, o) => sum + (o.improvement_pct || 0), 0);
  const avgImprovement = opportunities.length > 0 ? Math.round(totalImprovement / opportunities.length) : 0;

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <ReadinessSteps assessmentId={id} currentStep={6} status={assessment?.status || "draft"} />

        <h1 className="text-xl font-bold mb-1">SDLC Analysis</h1>
        <p className="text-sm text-dark/50 mb-6">Map your current workflow phases and identify AI augmentation opportunities.</p>

        {/* Template Loader */}
        <div className="bg-white rounded-lg border border-light-gray p-4 mb-6 flex items-center gap-4">
          <span className="text-sm font-medium">Load Template:</span>
          {TEMPLATES.map((t) => (
            <button key={t.key} onClick={() => loadTemplate(t.key)} disabled={loadingTemplate}
              className="text-xs bg-dark/5 hover:bg-dark/10 text-dark/70 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              {t.label}
            </button>
          ))}
          <InfoTip text="Loading a template pre-populates phases based on your methodology. Existing phases will be preserved." />
          {loadingTemplate && <span className="text-xs text-dark/40">Loading...</span>}
        </div>

        {/* Phase List */}
        <div className="space-y-3">
          {phases.map((phase) => {
            const isExpanded = expandedPhases.has(phase.id);
            const isEditing = editingPhase === phase.id;
            const phaseOpps = opportunities.filter((o) => o.phase_id === phase.id);
            const pillarLabel = phase.pillar && ASSESSMENT_PILLAR_LABELS[phase.pillar as keyof typeof ASSESSMENT_PILLAR_LABELS]
              ? ASSESSMENT_PILLAR_LABELS[phase.pillar as keyof typeof ASSESSMENT_PILLAR_LABELS].label
              : phase.pillar;
            const oppForm = oppForms[phase.id] || { ...emptyOpp };

            return (
              <div key={phase.id} className="bg-white rounded-lg border border-light-gray">
                <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => togglePhase(phase.id)}>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm transition-transform ${isExpanded ? "rotate-90" : ""}`}>{"\u25B6"}</span>
                    <div>
                      <span className="text-sm font-bold">{phase.name}</span>
                      {pillarLabel && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{pillarLabel}</span>}
                      <span className="ml-2 text-xs text-dark/40">{phaseOpps.length} opportunities</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => { setEditingPhase(phase.id); setPhaseEdits((prev) => ({ ...prev, [phase.id]: { ...phase } })); }}
                      className="text-xs text-primary hover:underline">Edit</button>
                    <button onClick={() => deletePhase(phase.id)}
                      className="text-xs text-red-500 hover:text-red-700">{"\u2715"}</button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-light-gray pt-3">
                    {/* Phase Details */}
                    {isEditing ? (
                      <div className="space-y-2 mb-4 p-3 bg-light-gray/30 rounded-lg">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium mb-1">Name</label>
                            <input type="text" value={phaseEdits[phase.id]?.name || ""} onChange={(e) =>
                              setPhaseEdits((prev) => ({ ...prev, [phase.id]: { ...prev[phase.id], name: e.target.value } }))}
                              className="w-full border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Time Spent (hours/sprint)</label>
                            <input type="number" value={phaseEdits[phase.id]?.time_spent_hours ?? ""} onChange={(e) =>
                              setPhaseEdits((prev) => ({ ...prev, [phase.id]: { ...prev[phase.id], time_spent_hours: Number(e.target.value) || null } }))}
                              className="w-full border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Description</label>
                          <textarea value={phaseEdits[phase.id]?.description || ""} onChange={(e) =>
                            setPhaseEdits((prev) => ({ ...prev, [phase.id]: { ...prev[phase.id], description: e.target.value } }))}
                            rows={2} className="w-full border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium mb-1">Roles Involved (comma-separated)</label>
                            <input type="text" value={(phaseEdits[phase.id]?.roles_involved || []).join(", ")} onChange={(e) =>
                              setPhaseEdits((prev) => ({ ...prev, [phase.id]: { ...prev[phase.id], roles_involved: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } }))}
                              className="w-full border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Current Tools (comma-separated)</label>
                            <input type="text" value={(phaseEdits[phase.id]?.current_tools || []).join(", ")} onChange={(e) =>
                              setPhaseEdits((prev) => ({ ...prev, [phase.id]: { ...prev[phase.id], current_tools: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } }))}
                              className="w-full border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Pain Points</label>
                          <textarea value={phaseEdits[phase.id]?.pain_points || ""} onChange={(e) =>
                            setPhaseEdits((prev) => ({ ...prev, [phase.id]: { ...prev[phase.id], pain_points: e.target.value } }))}
                            rows={2} className="w-full border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => savePhase(phase.id)}
                            className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors">Save</button>
                          <button onClick={() => setEditingPhase(null)}
                            className="text-xs text-dark/50 hover:text-dark">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 text-sm">
                        {phase.description && <p className="text-dark/60 mb-2">{phase.description}</p>}
                        <div className="flex flex-wrap gap-4 text-xs text-dark/50">
                          {phase.roles_involved.length > 0 && <span>Roles: {phase.roles_involved.join(", ")}</span>}
                          {phase.current_tools.length > 0 && <span>Tools: {phase.current_tools.join(", ")}</span>}
                          {phase.time_spent_hours != null && <span>Time: {phase.time_spent_hours}h/sprint</span>}
                        </div>
                        {phase.pain_points && <p className="text-xs text-red-600 mt-1">Pain points: {phase.pain_points}</p>}
                      </div>
                    )}

                    {/* AI Augmentation Opportunities */}
                    <div className="border-t border-light-gray pt-3">
                      <h4 className="text-xs font-bold uppercase text-dark/50 mb-3">AI Augmentation Opportunities</h4>
                      {phaseOpps.map((opp) => (
                        <div key={opp.id} className={`flex items-start gap-3 p-3 rounded-lg mb-2 ${opp.is_current_strength ? "bg-emerald-50" : "bg-light-gray/30"}`}>
                          <div className="flex-1">
                            <p className="text-sm">{opp.description}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              {opp.approved_tool && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{opp.approved_tool}</span>}
                              {opp.improvement_pct != null && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">+{opp.improvement_pct}%</span>}
                              {opp.improvement_type && <span className="text-[10px] text-dark/40">{IMPROVEMENT_TYPE_LABELS[opp.improvement_type]}</span>}
                              {opp.is_current_strength && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Current Strength</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => toggleStrength(opp)} title={opp.is_current_strength ? "Unmark as strength" : "Mark as current strength"}
                              className={`text-xs px-1.5 py-0.5 rounded ${opp.is_current_strength ? "text-emerald-700" : "text-dark/30 hover:text-emerald-600"}`}>
                              {"\u2605"}
                            </button>
                            <button onClick={() => deleteOpportunity(opp.id)}
                              className="text-xs text-red-500 hover:text-red-700">{"\u2715"}</button>
                          </div>
                        </div>
                      ))}

                      {/* Add opportunity form */}
                      <div className="mt-3 space-y-2 p-3 bg-light-gray/20 rounded-lg">
                        <textarea placeholder="Describe the AI augmentation opportunity..." value={oppForm.description}
                          onChange={(e) => setOppForms((prev) => ({ ...prev, [phase.id]: { ...(prev[phase.id] || emptyOpp), description: e.target.value } }))}
                          rows={2} className="w-full border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        <div className="flex items-center gap-2">
                          <input type="text" placeholder="AI Tool" value={oppForm.approved_tool}
                            onChange={(e) => setOppForms((prev) => ({ ...prev, [phase.id]: { ...(prev[phase.id] || emptyOpp), approved_tool: e.target.value } }))}
                            className="flex-1 border border-light-gray rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          <input type="number" placeholder="Improvement %" value={oppForm.improvement_pct}
                            onChange={(e) => setOppForms((prev) => ({ ...prev, [phase.id]: { ...(prev[phase.id] || emptyOpp), improvement_pct: e.target.value } }))}
                            className="w-24 border border-light-gray rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          <select value={oppForm.improvement_type}
                            onChange={(e) => setOppForms((prev) => ({ ...prev, [phase.id]: { ...(prev[phase.id] || emptyOpp), improvement_type: e.target.value as ImprovementType | "" } }))}
                            className="border border-light-gray rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                            <option value="">Type...</option>
                            {IMPROVEMENT_TYPES.map((t) => <option key={t} value={t}>{IMPROVEMENT_TYPE_LABELS[t]}</option>)}
                          </select>
                          <label className="flex items-center gap-1 text-xs text-dark/60">
                            <input type="checkbox" checked={oppForm.is_current_strength}
                              onChange={(e) => setOppForms((prev) => ({ ...prev, [phase.id]: { ...(prev[phase.id] || emptyOpp), is_current_strength: e.target.checked } }))} />
                            Strength
                          </label>
                          <button onClick={() => addOpportunity(phase.id)}
                            className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors shrink-0">
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {phases.length === 0 && (
          <div className="text-center py-12 text-dark/40">
            <p className="text-sm">No workflow phases yet. Load a template above or phases will be auto-created from your scope.</p>
          </div>
        )}

        {/* Improvement Summary */}
        {opportunities.length > 0 && (
          <div className="bg-white rounded-lg border border-light-gray p-4 mt-6">
            <h3 className="text-sm font-bold mb-2">Improvement Summary</h3>
            <div className="flex items-center gap-6 text-sm">
              <div><span className="font-bold text-emerald-600">{opportunities.length}</span> <span className="text-dark/50">opportunities identified</span></div>
              <div><span className="font-bold text-emerald-600">{avgImprovement}%</span> <span className="text-dark/50">average projected improvement</span></div>
              <div><span className="font-bold text-emerald-600">{opportunities.filter((o) => o.is_current_strength).length}</span> <span className="text-dark/50">current strengths</span></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(`/readiness/${id}/constraints`)}
            className="text-sm text-dark/50 hover:text-dark">
            &larr; Back: Constraints
          </button>
          <button onClick={() => router.push(`/readiness/${id}/enhancements`)}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: Enhancements &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
