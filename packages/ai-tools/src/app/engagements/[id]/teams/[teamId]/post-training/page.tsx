"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function PostTrainingAssessmentPage() {
  const { id: engagementId, teamId } = useParams<{ id: string; teamId: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    period_start: "",
    period_end: "",
    sprint_count: "",
    data_source: "integration",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: teamId,
          assessment_type: "post_training",
          period_start: form.period_start,
          period_end: form.period_end,
          sprint_count: form.sprint_count ? parseInt(form.sprint_count) : null,
          data_source: form.data_source,
        }),
      });

      if (res.ok) {
        router.push(`/engagements/${engagementId}`);
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
        <h1 className="text-2xl font-bold mb-2">Post-Training Assessment</h1>
        <p className="text-sm text-dark/50 mb-6">
          Set the measurement window for post-training data collection. This captures team
          performance AFTER AI training, excluding a 2-4 week ramp-up buffer.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
          <strong>Tip:</strong> Start the measurement period 2-4 weeks after training ends to
          allow the team to internalize new tools and practices.
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl bg-white rounded-lg border border-light-gray p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Period Start</label>
              <input
                type="date"
                value={form.period_start}
                onChange={(e) => setForm({ ...form, period_start: e.target.value })}
                required
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Period End</label>
              <input
                type="date"
                value={form.period_end}
                onChange={(e) => setForm({ ...form, period_end: e.target.value })}
                required
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Sprints Observed</label>
            <input
              type="number"
              value={form.sprint_count}
              onChange={(e) => setForm({ ...form, sprint_count: e.target.value })}
              placeholder="e.g., 4"
              min="1"
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Data Source</label>
            <select
              value={form.data_source}
              onChange={(e) => setForm({ ...form, data_source: e.target.value })}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="integration">From Integration (Jira/ADO/GitHub)</option>
              <option value="manual">Manual Entry</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Post-Training Assessment"}
          </button>
        </form>
      </main>
    </>
  );
}
