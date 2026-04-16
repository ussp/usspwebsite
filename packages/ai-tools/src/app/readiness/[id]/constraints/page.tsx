"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import InfoTip from "@/components/InfoTip";
import {
  CONSTRAINT_CATEGORY_LABELS,
  type ConstraintCategory,
  type ConstraintSeverity,
  type AssessmentConstraintRecord,
  type ApprovedToolRecord,
} from "@ussp-platform/core";

const ALL_CATEGORIES = Object.keys(CONSTRAINT_CATEGORY_LABELS) as ConstraintCategory[];

interface ConstraintForm {
  description: string;
  severity: ConstraintSeverity;
  source: string;
  notes: string;
}

interface ToolForm {
  tool_name: string;
  vendor: string;
  capabilities: string;
  restrictions: string;
}

const emptyConstraint: ConstraintForm = { description: "", severity: "soft", source: "", notes: "" };
const emptyTool: ToolForm = { tool_name: "", vendor: "", capabilities: "", restrictions: "" };

export default function ConstraintsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string; entity_type?: string } | null>(null);
  const [constraints, setConstraints] = useState<AssessmentConstraintRecord[]>([]);
  const [tools, setTools] = useState<ApprovedToolRecord[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["ai_tools"]));
  const [forms, setForms] = useState<Record<string, ConstraintForm>>(
    Object.fromEntries(ALL_CATEGORIES.map((c) => [c, { ...emptyConstraint }]))
  );
  const [toolForm, setToolForm] = useState<ToolForm>({ ...emptyTool });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    loadConstraints();
    loadTools();
  }, [id]);

  async function loadConstraints() {
    const data = await fetch(`/api/readiness/${id}/constraints`).then((r) => r.json());
    if (Array.isArray(data)) setConstraints(data);
  }

  async function loadTools() {
    const data = await fetch(`/api/readiness/${id}/constraints/tools`).then((r) => r.json());
    if (Array.isArray(data)) setTools(data);
  }

  function toggleSection(cat: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  async function addConstraint(category: ConstraintCategory) {
    const form = forms[category];
    if (!form.description.trim()) return;
    await fetch(`/api/readiness/${id}/constraints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, category }),
    });
    setForms((prev) => ({ ...prev, [category]: { ...emptyConstraint } }));
    loadConstraints();
  }

  async function deleteConstraint(constraintId: string) {
    await fetch(`/api/readiness/${id}/constraints/${constraintId}`, { method: "DELETE" });
    loadConstraints();
  }

  async function addTool() {
    if (!toolForm.tool_name.trim()) return;
    await fetch(`/api/readiness/${id}/constraints/tools`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolForm),
    });
    setToolForm({ ...emptyTool });
    loadTools();
  }

  async function deleteTool(toolId: string) {
    await fetch(`/api/readiness/${id}/constraints/tools/${toolId}`, { method: "DELETE" });
    loadTools();
  }

  async function seedConstraints() {
    setSeeding(true);
    await fetch(`/api/readiness/${id}/constraints/seed`, { method: "POST" });
    await loadConstraints();
    setSeeding(false);
  }

  const hardCount = constraints.filter((c) => c.severity === "hard").length;
  const softCount = constraints.filter((c) => c.severity === "soft").length;

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <ReadinessSteps assessmentId={id} currentStep={5} status={assessment?.status || "draft"} />

        <h1 className="text-xl font-bold mb-1">Constraints</h1>
        <p className="text-sm text-dark/50 mb-4">Document organizational constraints that affect AI adoption. Fewer constraints = more AI opportunities.</p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-sm">
            <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-medium">{hardCount} hard</span>
            <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 font-medium">{softCount} soft</span>
            <span className="text-dark/40">constraints</span>
          </div>
          <button onClick={seedConstraints} disabled={seeding}
            className="text-xs bg-dark/5 hover:bg-dark/10 text-dark/70 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
            {seeding ? "Seeding..." : "Pre-populate from Entity Type"}
            <InfoTip text="Adds common constraints based on the organization's entity type (e.g., state agency, regulated entity). You can edit or remove them afterward." />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-800 mb-6">
          Fewer constraints = more AI opportunities. Only record real, confirmed constraints. Soft constraints can often be worked around.
        </div>

        <div className="space-y-3">
          {ALL_CATEGORIES.map((category) => {
            const info = CONSTRAINT_CATEGORY_LABELS[category];
            const catConstraints = constraints.filter((c) => c.category === category);
            const isExpanded = expanded.has(category);
            const form = forms[category];

            return (
              <div key={category} className="bg-white rounded-lg border border-light-gray">
                <button onClick={() => toggleSection(category)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-light-gray/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg transition-transform ${isExpanded ? "rotate-90" : ""}`}>{"\u25B6"}</span>
                    <div>
                      <span className="text-sm font-bold">{info.label}</span>
                      <InfoTip text={`${info.description}. Examples: ${info.examples.join(", ")}`} />
                      <span className="ml-2 text-xs text-dark/40">({catConstraints.length})</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-light-gray pt-3 space-y-3">
                    {catConstraints.map((c) => (
                      <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-light-gray/30">
                        <div className="flex-1">
                          <p className="text-sm">{c.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              c.severity === "hard" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                            }`}>{c.severity}</span>
                            {c.source && <span className="text-xs text-dark/40">Source: {c.source}</span>}
                          </div>
                          {c.notes && <p className="text-xs text-dark/50 mt-1">{c.notes}</p>}
                        </div>
                        <button onClick={() => deleteConstraint(c.id)}
                          className="text-xs text-red-500 hover:text-red-700 shrink-0">{"\u2715"}</button>
                      </div>
                    ))}

                    {/* Approved Tools sub-section within ai_tools */}
                    {category === "ai_tools" && (
                      <div className="mt-4 border-t border-light-gray pt-4">
                        <h4 className="text-xs font-bold uppercase text-dark/50 mb-3">Approved AI Tools</h4>
                        {tools.map((t) => (
                          <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{t.tool_name} {t.vendor && <span className="text-dark/40 font-normal">by {t.vendor}</span>}</p>
                              {t.capabilities && <p className="text-xs text-dark/60 mt-0.5">Capabilities: {t.capabilities}</p>}
                              {t.restrictions && <p className="text-xs text-red-600 mt-0.5">Restrictions: {t.restrictions}</p>}
                            </div>
                            <button onClick={() => deleteTool(t.id)}
                              className="text-xs text-red-500 hover:text-red-700 shrink-0">{"\u2715"}</button>
                          </div>
                        ))}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <input type="text" placeholder="Tool name *" value={toolForm.tool_name}
                            onChange={(e) => setToolForm({ ...toolForm, tool_name: e.target.value })}
                            className="border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          <input type="text" placeholder="Vendor" value={toolForm.vendor}
                            onChange={(e) => setToolForm({ ...toolForm, vendor: e.target.value })}
                            className="border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          <input type="text" placeholder="Capabilities" value={toolForm.capabilities}
                            onChange={(e) => setToolForm({ ...toolForm, capabilities: e.target.value })}
                            className="border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          <input type="text" placeholder="Restrictions" value={toolForm.restrictions}
                            onChange={(e) => setToolForm({ ...toolForm, restrictions: e.target.value })}
                            className="border border-light-gray rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <button onClick={addTool}
                          className="mt-2 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                          + Add Approved Tool
                        </button>
                      </div>
                    )}

                    {/* Add constraint form */}
                    <div className="border-t border-light-gray pt-3 mt-3">
                      <textarea placeholder="Describe the constraint..." value={form.description}
                        onChange={(e) => setForms((prev) => ({ ...prev, [category]: { ...prev[category], description: e.target.value } }))}
                        rows={2}
                        className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-2" />
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setForms((prev) => ({ ...prev, [category]: { ...prev[category], severity: "hard" } }))}
                            className={`text-xs px-2 py-1 rounded ${form.severity === "hard" ? "bg-red-100 text-red-700 font-bold" : "bg-dark/5 text-dark/40"}`}>
                            Hard
                          </button>
                          <button onClick={() => setForms((prev) => ({ ...prev, [category]: { ...prev[category], severity: "soft" } }))}
                            className={`text-xs px-2 py-1 rounded ${form.severity === "soft" ? "bg-amber-100 text-amber-700 font-bold" : "bg-dark/5 text-dark/40"}`}>
                            Soft
                          </button>
                          <InfoTip text="Hard constraints are non-negotiable (e.g., legal requirements). Soft constraints can potentially be relaxed or worked around." />
                        </div>
                        <input type="text" placeholder="Source (optional)" value={form.source}
                          onChange={(e) => setForms((prev) => ({ ...prev, [category]: { ...prev[category], source: e.target.value } }))}
                          className="flex-1 border border-light-gray rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        <button onClick={() => addConstraint(category)}
                          className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors">
                          + Add
                        </button>
                      </div>
                      <input type="text" placeholder="Notes (optional)" value={form.notes}
                        onChange={(e) => setForms((prev) => ({ ...prev, [category]: { ...prev[category], notes: e.target.value } }))}
                        className="w-full mt-2 border border-light-gray rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(`/readiness/${id}/scope`)}
            className="text-sm text-dark/50 hover:text-dark">
            &larr; Back: Scope
          </button>
          <button onClick={() => router.push(`/readiness/${id}/sdlc`)}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: SDLC Analysis &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
