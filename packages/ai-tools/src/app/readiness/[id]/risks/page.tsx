"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import InfoTip from "@/components/InfoTip";
import {
  RISK_CATEGORY_LABELS,
  computeRiskScore,
  getRiskColor,
  type RiskCategory,
  type RiskRecord,
} from "@ussp-platform/core";

const RISK_CATEGORIES = Object.keys(RISK_CATEGORY_LABELS) as RiskCategory[];

const RISK_COLOR_CLASSES: Record<string, string> = {
  red: "bg-red-100 text-red-700 border-red-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const RISK_BADGE_CLASSES: Record<string, string> = {
  red: "bg-red-500 text-white",
  amber: "bg-amber-500 text-white",
  green: "bg-emerald-500 text-white",
};

interface RiskForm {
  description: string;
  category: RiskCategory;
  likelihood: string;
  impact_score: string;
  mitigation: string;
  owner: string;
}

const emptyForm: RiskForm = { description: "", category: "technical", likelihood: "", impact_score: "", mitigation: "", owner: "" };

export default function RisksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [risks, setRisks] = useState<RiskRecord[]>([]);
  const [form, setForm] = useState<RiskForm>({ ...emptyForm });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<RiskForm>({ ...emptyForm });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    loadRisks();
  }, [id]);

  async function loadRisks() {
    const data = await fetch(`/api/readiness/${id}/risks`).then((r) => r.json());
    if (Array.isArray(data)) setRisks(data.sort((a: RiskRecord, b: RiskRecord) => (b.risk_score || 0) - (a.risk_score || 0)));
  }

  async function addRisk() {
    if (!form.description.trim()) return;
    await fetch(`/api/readiness/${id}/risks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: form.description,
        category: form.category,
        likelihood: form.likelihood ? Number(form.likelihood) : undefined,
        impact_score: form.impact_score ? Number(form.impact_score) : undefined,
        mitigation: form.mitigation || undefined,
        owner: form.owner || undefined,
      }),
    });
    setForm({ ...emptyForm });
    setShowForm(false);
    loadRisks();
  }

  async function updateRisk(riskId: string) {
    await fetch(`/api/readiness/${id}/risks/${riskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: editForm.description,
        category: editForm.category,
        likelihood: editForm.likelihood ? Number(editForm.likelihood) : undefined,
        impact_score: editForm.impact_score ? Number(editForm.impact_score) : undefined,
        mitigation: editForm.mitigation || undefined,
        owner: editForm.owner || undefined,
      }),
    });
    setEditingId(null);
    loadRisks();
  }

  async function deleteRisk(riskId: string) {
    await fetch(`/api/readiness/${id}/risks/${riskId}`, { method: "DELETE" });
    loadRisks();
  }

  async function seedRisks() {
    setSeeding(true);
    await fetch(`/api/readiness/${id}/risks/seed`, { method: "POST" });
    await loadRisks();
    setSeeding(false);
  }

  function startEdit(risk: RiskRecord) {
    setEditingId(risk.id);
    setEditForm({
      description: risk.description,
      category: risk.category,
      likelihood: risk.likelihood?.toString() || "",
      impact_score: risk.impact_score?.toString() || "",
      mitigation: risk.mitigation || "",
      owner: risk.owner || "",
    });
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <ReadinessSteps assessmentId={id} currentStep={12} status={assessment?.status || "draft"} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold mb-1">Risk Register</h1>
            <p className="text-sm text-dark/50">Identify and score risks associated with AI adoption.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={seedRisks} disabled={seeding}
              className="text-xs bg-dark/5 hover:bg-dark/10 text-dark/70 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              {seeding ? "Seeding..." : "Pre-populate Risks"}
              <InfoTip text="Adds common risks based on the organization's entity type. You can edit or remove them afterward." />
            </button>
            <button onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              {showForm ? "Cancel" : "+ Add Risk"}
            </button>
          </div>
        </div>

        {/* Add Risk Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-light-gray p-6 mb-6 space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Risk Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2} placeholder="Describe the risk..."
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as RiskCategory })}
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {RISK_CATEGORIES.map((c) => <option key={c} value={c}>{RISK_CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Likelihood (1-5)
                  <InfoTip text="1 = Rare, unlikely to occur. 2 = Unlikely. 3 = Possible. 4 = Likely. 5 = Almost certain to occur." />
                </label>
                <input type="number" min="1" max="5" value={form.likelihood}
                  onChange={(e) => setForm({ ...form, likelihood: e.target.value })}
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Impact (1-5)
                  <InfoTip text="1 = Negligible impact. 2 = Minor delays. 3 = Moderate disruption. 4 = Major setback. 5 = Catastrophic, project failure." />
                </label>
                <input type="number" min="1" max="5" value={form.impact_score}
                  onChange={(e) => setForm({ ...form, impact_score: e.target.value })}
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Owner</label>
                <input type="text" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  placeholder="e.g., CTO, Security Lead"
                  className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Mitigation Strategy</label>
              <textarea value={form.mitigation} onChange={(e) => setForm({ ...form, mitigation: e.target.value })}
                rows={2} placeholder="How will this risk be mitigated?"
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex justify-end">
              <button onClick={addRisk}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                Save Risk
              </button>
            </div>
          </div>
        )}

        {/* Risk List */}
        <div className="space-y-2">
          {risks.map((risk) => {
            const score = risk.risk_score ?? computeRiskScore(risk.likelihood || 0, risk.impact_score || 0);
            const color = getRiskColor(score);
            const isEditing = editingId === risk.id;

            if (isEditing) {
              return (
                <div key={risk.id} className="bg-white rounded-lg border border-light-gray p-4 space-y-3">
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2} className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <div className="grid grid-cols-4 gap-2">
                    <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value as RiskCategory })}
                      className="border border-light-gray rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                      {RISK_CATEGORIES.map((c) => <option key={c} value={c}>{RISK_CATEGORY_LABELS[c]}</option>)}
                    </select>
                    <input type="number" min="1" max="5" placeholder="Likelihood" value={editForm.likelihood}
                      onChange={(e) => setEditForm({ ...editForm, likelihood: e.target.value })}
                      className="border border-light-gray rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <input type="number" min="1" max="5" placeholder="Impact" value={editForm.impact_score}
                      onChange={(e) => setEditForm({ ...editForm, impact_score: e.target.value })}
                      className="border border-light-gray rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <input type="text" placeholder="Owner" value={editForm.owner}
                      onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                      className="border border-light-gray rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <textarea value={editForm.mitigation} onChange={(e) => setEditForm({ ...editForm, mitigation: e.target.value })}
                    rows={2} placeholder="Mitigation..."
                    className="w-full border border-light-gray rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <div className="flex gap-2">
                    <button onClick={() => updateRisk(risk.id)}
                      className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark">Save</button>
                    <button onClick={() => setEditingId(null)}
                      className="text-xs text-dark/50 hover:text-dark">Cancel</button>
                  </div>
                </div>
              );
            }

            return (
              <div key={risk.id} className={`rounded-lg border p-4 ${RISK_COLOR_CLASSES[color]}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${RISK_BADGE_CLASSES[color]}`}>{score}</span>
                      <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-white/50">{RISK_CATEGORY_LABELS[risk.category]}</span>
                      {risk.is_preseeded && <span className="text-[10px] text-dark/30">pre-seeded</span>}
                    </div>
                    <p className="text-sm mt-1">{risk.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs opacity-70">
                      <span>Likelihood: {risk.likelihood || "---"}/5</span>
                      <span>Impact: {risk.impact_score || "---"}/5</span>
                      {risk.owner && <span>Owner: {risk.owner}</span>}
                    </div>
                    {risk.mitigation && <p className="text-xs mt-1.5 opacity-80"><span className="font-medium">Mitigation:</span> {risk.mitigation}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button onClick={() => startEdit(risk)}
                      className="text-xs hover:underline opacity-70">Edit</button>
                    <button onClick={() => deleteRisk(risk.id)}
                      className="text-xs text-red-700 hover:text-red-900 opacity-70">{"\u2715"}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {risks.length === 0 && !showForm && (
          <div className="text-center py-12 text-dark/40">
            <p className="text-sm">No risks documented yet. Click &quot;Pre-populate Risks&quot; or &quot;+ Add Risk&quot; to get started.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(`/readiness/${id}/distribute`)}
            className="text-sm text-dark/50 hover:text-dark">
            &larr; Back: Distribute
          </button>
          <button onClick={() => router.push(`/readiness/${id}/report`)}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: Report &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
