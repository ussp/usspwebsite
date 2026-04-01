"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

const INTEGRATION_TYPES = [
  { value: "jira", label: "Jira Cloud" },
  { value: "azure_devops", label: "Azure DevOps" },
  { value: "github", label: "GitHub" },
  { value: "gitlab", label: "GitLab" },
  { value: "linear", label: "Linear" },
  { value: "manual", label: "Manual Entry" },
];

type EngagementType = "transformation" | "readiness";

export default function NewEngagementPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [engagementType, setEngagementType] = useState<EngagementType | null>(null);
  const [form, setForm] = useState({
    name: "",
    client_name: "",
    integration_type: "manual",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/engagements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Set initial status based on engagement type
          status: engagementType === "readiness" ? "readiness" : "draft",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/engagements/${data.id}`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">New Engagement</h1>
        <p className="text-sm text-dark/50 mb-6">
          Choose the type of engagement, then provide the details.
        </p>

        {/* Step 1: Choose engagement type */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-dark/40 uppercase tracking-wider mb-3">Step 1: What do you want to do?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setEngagementType("transformation")}
              className={`text-left rounded-lg border-2 p-5 transition-all ${
                engagementType === "transformation"
                  ? "border-primary bg-blue-50"
                  : "border-light-gray bg-white hover:border-primary/40"
              }`}
            >
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-sm mb-1">Transformation Monitor</h3>
              <p className="text-xs text-dark/50">
                Measure a Scrum team&apos;s productivity <strong>before and after</strong> AI training.
                Requires baseline sprints, training delivery, and post-training sprints.
              </p>
              <p className="text-[11px] text-dark/30 mt-2">Timeline: 4-8 months</p>
            </button>

            <button
              type="button"
              onClick={() => setEngagementType("readiness")}
              className={`text-left rounded-lg border-2 p-5 transition-all ${
                engagementType === "readiness"
                  ? "border-primary bg-blue-50"
                  : "border-light-gray bg-white hover:border-primary/40"
              }`}
            >
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold text-sm mb-1">Readiness Assessment</h3>
              <p className="text-xs text-dark/50">
                Evaluate if an organization has the <strong>7 AI capabilities</strong> needed for success
                (DORA 2025 model). Identifies blockers before investing in training.
              </p>
              <p className="text-[11px] text-dark/30 mt-2">Timeline: 1-2 weeks</p>
            </button>
          </div>
        </div>

        {/* Step 2: Form (only shows after type is selected) */}
        {engagementType && (
          <>
            {/* Context banner based on type */}
            <div className={`rounded-lg border p-4 mb-6 ${
              engagementType === "transformation"
                ? "bg-blue-50 border-blue-200"
                : "bg-emerald-50 border-emerald-200"
            }`}>
              <div className="flex gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  engagementType === "transformation"
                    ? "bg-blue-200 text-blue-700"
                    : "bg-emerald-200 text-emerald-700"
                }`}>i</div>
                <div className={`text-sm ${engagementType === "transformation" ? "text-blue-900" : "text-emerald-900"}`}>
                  <p className="font-semibold mb-1">
                    {engagementType === "transformation" ? "What happens next?" : "How the readiness assessment works"}
                  </p>
                  <p className="opacity-80">
                    {engagementType === "transformation"
                      ? "After creating, you'll add team members with roles, set up the baseline measurement period, deliver AI training, then measure again to see improvement."
                      : "After creating, you'll add the organization/team, then score each of the 7 DORA AI capabilities (1-5). The tool computes a readiness tier and identifies blockers."
                    }
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold text-dark/40 uppercase tracking-wider mb-3">Step 2: Engagement details</p>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-light-gray p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Engagement Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={engagementType === "transformation"
                    ? "e.g., Acme Corp - Platform Team Q2 2026"
                    : "e.g., Acme Corp - AI Readiness Check"
                  }
                  required
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Client / Organization Name</label>
                <input
                  type="text"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  placeholder="e.g., Acme Corporation"
                  required
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {engagementType === "transformation" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Data Source</label>
                  <select
                    value={form.integration_type}
                    onChange={(e) => setForm({ ...form, integration_type: e.target.value })}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {INTEGRATION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-dark/40 mt-1">Where the team&apos;s sprint data lives. You can change this later.</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Any context about this engagement..."
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving
                  ? "Creating..."
                  : engagementType === "transformation"
                    ? "Create Transformation Engagement"
                    : "Create Readiness Assessment"
                }
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}
