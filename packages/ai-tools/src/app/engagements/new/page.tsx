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

export default function NewEngagementPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client_name: "",
    integration_type: "jira",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/engagements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      <main className="ml-60 mt-14 p-6">
        <h1 className="text-2xl font-bold mb-2">New Engagement</h1>
        <p className="text-sm text-dark/50 mb-6">
          An engagement tracks the full AI training lifecycle for a client team: baseline measurement, training delivery, and post-training comparison.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-xl">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">i</div>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">What happens next?</p>
              <p className="opacity-80">After creating the engagement, you&apos;ll add team members with their roles, connect to Jira or Azure DevOps, and start the baseline measurement.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl bg-white rounded-lg border border-light-gray p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Engagement Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Acme Corp - Platform Team Q2 2026"
              required
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Client Name</label>
            <input
              type="text"
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              placeholder="e.g., Acme Corporation"
              required
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Integration</label>
            <select
              value={form.integration_type}
              onChange={(e) => setForm({ ...form, integration_type: e.target.value })}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {INTEGRATION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Engagement"}
          </button>
        </form>
      </main>
    </>
  );
}
