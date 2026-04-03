"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import GuideBanner from "@/components/GuideBanner";

export default function PostTrainingAssessmentPage() {
  const { id: engagementId, teamId } = useParams<{ id: string; teamId: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    period_start: "",
    period_end: "",
    sprint_count: "",
    data_source: "manual",
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
        const data = await res.json();
        router.push(`/engagements/${engagementId}/teams/${teamId}/post-training/metrics?assessmentId=${data.id}`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-2">Post-Training Assessment</h1>
        <p className="text-sm text-dark/50 mb-6">
          Capture team performance <strong>after</strong> AI training is complete.
          This becomes the &ldquo;after&rdquo; snapshot compared against the baseline to measure improvement.
        </p>

        <GuideBanner title="Important: Ramp-up buffer" variant="warning">
          <p>
            Start this measurement <strong>2-4 weeks after training ends</strong>.
            The first weeks after training are a learning curve — measuring too early captures
            adjustment friction, not the actual improvement.
          </p>
          <p className="mt-2 font-medium">
            Timeline: Training ends &rarr; 2-4 week buffer &rarr; Post-training period starts &rarr; 3-6 sprints &rarr; Period ends
          </p>
        </GuideBanner>

        <GuideBanner title="Collect the same data as baseline" variant="info">
          <p className="mb-2">Use the <strong>exact same metrics and survey questions</strong> as the baseline for a fair comparison:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="bg-white/50 rounded p-3">
              <p className="font-semibold text-xs mb-1">Objective Metrics (same as baseline)</p>
              <ul className="text-xs space-y-1 list-disc list-inside opacity-80">
                <li>Sprint velocity, cycle time, predictability</li>
                <li>Throughput, bug escape rate</li>
                <li>DORA: deploy freq, lead time, failure rate, MTTR</li>
              </ul>
              <p className="text-[11px] opacity-60 mt-2">Export from the same Jira/ADO/GitHub source as baseline</p>
            </div>
            <div className="bg-white/50 rounded p-3">
              <p className="font-semibold text-xs mb-1">Survey (same respondents as baseline)</p>
              <ul className="text-xs space-y-1 list-disc list-inside opacity-80">
                <li>SPACE: 5 dimensions (1-5 scale)</li>
                <li>DevEx: 3 dimensions + 3 tension pairs (1-5 scale)</li>
                <li>AI Trust, Adoption, Verification Overhead</li>
              </ul>
              <p className="text-[11px] opacity-60 mt-2">Same team members should complete the survey again</p>
            </div>
          </div>
        </GuideBanner>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-light-gray p-6">
          <h2 className="text-sm font-semibold mb-4">Define the post-training measurement window</h2>

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
              <p className="text-[11px] text-dark/40 mt-1">Start of the first sprint after the ramp-up buffer</p>
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
              <p className="text-[11px] text-dark/40 mt-1">End of the last sprint in the measurement window</p>
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
            <p className="text-[11px] text-dark/40 mt-1">Should match the baseline sprint count for a fair comparison</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">How was data collected?</label>
            <select
              value={form.data_source}
              onChange={(e) => setForm({ ...form, data_source: e.target.value })}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="manual">Manual (exported from Jira/ADO/GitHub and entered here)</option>
              <option value="integration">API Integration (auto-pulled — requires setup)</option>
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
