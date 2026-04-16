"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import {
  TEAM_MEMBER_ROLE_LABELS,
  TEAM_FUNCTION_LABELS,
  TEAM_METHODOLOGY_LABELS,
  SENIORITY_LABELS,
} from "@ussp-platform/core";
import InfoTip from "@/components/InfoTip";
import type { TeamMemberRole } from "@ussp-platform/core";

interface AssessmentMember {
  id: string;
  name: string;
  email: string;
  role: string;
  custom_role_label: string | null;
  seniority: string | null;
}

export default function TeamSetupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: "", team_function: "", methodology: "", size: 0, objectives: "", pain_points: "", ai_hopes: "",
  });
  const [members, setMembers] = useState<AssessmentMember[]>([]);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "developer" as TeamMemberRole, custom_role_label: "", seniority: "" });
  const [saving, setSaving] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [showCsvImport, setShowCsvImport] = useState(false);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    fetch(`/api/readiness/${id}/team`).then((r) => r.json()).then((data) => {
      if (data) setTeamForm({
        name: data.name || "", team_function: data.team_function || "",
        methodology: data.methodology || "", size: data.size || 0,
        objectives: data.objectives || "", pain_points: data.pain_points || "", ai_hopes: data.ai_hopes || "",
      });
    });
    loadMembers();
  }, [id]);

  async function loadMembers() {
    const res = await fetch(`/api/readiness/${id}/team/members`);
    if (res.ok) setMembers(await res.json());
  }

  async function saveTeam() {
    setSaving(true);
    await fetch(`/api/readiness/${id}/team`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamForm),
    });
    setSaving(false);
  }

  async function addMember() {
    if (!newMember.name || !newMember.email) return;
    await fetch(`/api/readiness/${id}/team/members`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    });
    setNewMember({ name: "", email: "", role: "developer", custom_role_label: "", seniority: "" });
    loadMembers();
  }

  async function removeMember(memberId: string) {
    await fetch(`/api/readiness/${id}/team/members?memberId=${memberId}`, { method: "DELETE" });
    loadMembers();
  }

  async function importCsv() {
    const lines = csvText.trim().split("\n").filter((l) => l.trim());
    const rows = lines.map((line) => {
      const [name, email, role] = line.split(",").map((s) => s.trim());
      return { name, email, role: role || "developer" };
    }).filter((r) => r.name && r.email);

    if (rows.length) {
      await fetch(`/api/readiness/${id}/team/members`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });
      setCsvText("");
      setShowCsvImport(false);
      loadMembers();
    }
  }

  // Role distribution summary
  const roleCounts: Record<string, number> = {};
  members.forEach((m) => {
    const label = TEAM_MEMBER_ROLE_LABELS[m.role as TeamMemberRole] || m.custom_role_label || m.role;
    roleCounts[label] = (roleCounts[label] || 0) + 1;
  });

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-3xl">
        <ReadinessSteps assessmentId={id} currentStep={2} status={assessment?.status || "draft"} />

        <h1 className="text-xl font-bold mb-1">Team Setup</h1>
        <p className="text-sm text-dark/50 mb-6">Define the team being assessed and add team members.</p>

        {/* Team Info */}
        <div className="bg-white rounded-lg border border-light-gray p-6 space-y-4 mb-6">
          <h2 className="text-sm font-semibold uppercase text-dark/40">Team Information<InfoTip text="Describe the team being assessed. This context shapes the questionnaire and report recommendations." /></h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Team Name *</label>
              <input type="text" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Function<InfoTip text="The team's primary function. Determines which workflow-specific questions appear in the questionnaire." /></label>
              <select value={teamForm.team_function} onChange={(e) => setTeamForm({ ...teamForm, team_function: e.target.value })}
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select...</option>
                {Object.entries(TEAM_FUNCTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Methodology<InfoTip text="The team's development methodology. Scrum teams get sprint-specific questions; SAFe teams get ART-level questions." /></label>
              <select value={teamForm.methodology} onChange={(e) => setTeamForm({ ...teamForm, methodology: e.target.value })}
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select...</option>
                {Object.entries(TEAM_METHODOLOGY_LABELS).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team Size</label>
              <input type="number" value={teamForm.size || ""} onChange={(e) => setTeamForm({ ...teamForm, size: parseInt(e.target.value) || 0 })}
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Team Objectives<InfoTip text="What is the team trying to accomplish? Included in the report's context section." /></label>
            <textarea value={teamForm.objectives} onChange={(e) => setTeamForm({ ...teamForm, objectives: e.target.value })}
              rows={2} placeholder="What is the team trying to achieve?"
              className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Pain Points<InfoTip text="Challenges the team faces today. Helps calibrate where AI can make the biggest impact." /></label>
            <textarea value={teamForm.pain_points} onChange={(e) => setTeamForm({ ...teamForm, pain_points: e.target.value })}
              rows={2} placeholder="What challenges does the team face?"
              className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">AI Hopes</label>
            <textarea value={teamForm.ai_hopes} onChange={(e) => setTeamForm({ ...teamForm, ai_hopes: e.target.value })}
              rows={2} placeholder="What does the team hope AI will help with?"
              className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button onClick={saveTeam} disabled={saving}
            className="text-sm text-primary hover:underline disabled:opacity-50">
            {saving ? "Saving..." : "Save Team Info"}
          </button>
        </div>

        {/* Members */}
        <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase text-dark/40">Team Members ({members.length})<InfoTip text="Each member receives a role-specific questionnaire via email. Choose 'Other' for roles not listed — the system will flag it for custom question development." /></h2>
            <button onClick={() => setShowCsvImport(!showCsvImport)} className="text-xs text-primary hover:underline">
              {showCsvImport ? "Hide CSV Import" : "Bulk Import (CSV)"}
            </button>
          </div>

          {/* Role distribution */}
          {members.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(roleCounts).map(([role, count]) => (
                <span key={role} className="bg-light-gray text-dark/60 px-2 py-0.5 rounded text-xs">
                  {count} {role}{count > 1 ? "s" : ""}
                </span>
              ))}
            </div>
          )}

          {/* CSV import */}
          {showCsvImport && (
            <div className="bg-light-gray/50 rounded-lg p-4 mb-4">
              <p className="text-xs text-dark/50 mb-2">Paste CSV: name, email, role (one per line)</p>
              <textarea value={csvText} onChange={(e) => setCsvText(e.target.value)}
                rows={4} placeholder="John Doe, john@example.com, developer&#10;Jane Smith, jane@example.com, business_analyst"
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={importCsv} className="mt-2 bg-primary text-white px-3 py-1 rounded text-xs font-medium">
                Import
              </button>
            </div>
          )}

          {/* Add member form */}
          <div className="grid grid-cols-12 gap-2 mb-4">
            <input type="text" placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="col-span-3 border border-light-gray rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="email" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className="col-span-3 border border-light-gray rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value as TeamMemberRole })}
              className="col-span-2 border border-light-gray rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
              {Object.entries(TEAM_MEMBER_ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {(newMember.role as string) === "other" && (
              <input type="text" placeholder="Custom role" value={newMember.custom_role_label}
                onChange={(e) => setNewMember({ ...newMember, custom_role_label: e.target.value })}
                className="col-span-2 border border-light-gray rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
            )}
            <select value={newMember.seniority} onChange={(e) => setNewMember({ ...newMember, seniority: e.target.value })}
              className={`${newMember.role === "other" ? "col-span-1" : "col-span-2"} border border-light-gray rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30`}>
              <option value="">Seniority</option>
              {Object.entries(SENIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
            </select>
            <button onClick={addMember}
              className="col-span-2 bg-primary text-white rounded text-xs font-medium hover:bg-primary-dark">
              + Add
            </button>
          </div>

          {/* Members list */}
          {members.length > 0 && (
            <div className="divide-y divide-light-gray">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-dark/40">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-light-gray px-2 py-0.5 rounded">
                      {TEAM_MEMBER_ROLE_LABELS[m.role as TeamMemberRole] || m.custom_role_label || m.role}
                    </span>
                    {m.seniority && <span className="text-xs text-dark/40">{SENIORITY_LABELS[m.seniority as keyof typeof SENIORITY_LABELS]}</span>}
                    <button onClick={() => removeMember(m.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => router.push(`/readiness/${id}/company`)} className="text-sm text-dark/50 hover:text-dark">
            &larr; Back
          </button>
          <button onClick={() => { saveTeam().then(() => router.push(`/readiness/${id}/policy`)); }}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: AI Policy &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
