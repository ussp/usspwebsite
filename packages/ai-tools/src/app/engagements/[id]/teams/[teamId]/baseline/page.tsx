"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import GuideBanner from "@/components/GuideBanner";

export default function BaselineAssessmentPage() {
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
          assessment_type: "baseline",
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
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-2">Baseline Assessment</h1>
        <p className="text-sm text-dark/50 mb-6">
          Capture the team&apos;s current performance <strong>before</strong> AI training begins.
          This becomes the &ldquo;before&rdquo; snapshot that the post-training results are compared against.
        </p>

        <GuideBanner title="What you need to collect" variant="info">
          <p className="mb-2">The baseline assessment requires <strong>two types of data</strong>:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="bg-white/50 rounded p-3">
              <p className="font-semibold text-xs mb-1">1. Objective Metrics (from tools)</p>
              <ul className="text-xs space-y-1 list-disc list-inside opacity-80">
                <li>Sprint velocity (story points/sprint)</li>
                <li>Cycle time (days from start to done)</li>
                <li>Sprint predictability (committed vs delivered)</li>
                <li>Throughput (items completed/sprint)</li>
                <li>Bug escape rate (production bugs/sprint)</li>
                <li>DORA: deploy frequency, lead time, failure rate, MTTR</li>
              </ul>
            </div>
            <div className="bg-white/50 rounded p-3">
              <p className="font-semibold text-xs mb-1">2. Survey Responses (from team members)</p>
              <ul className="text-xs space-y-1 list-disc list-inside opacity-80">
                <li>SPACE: Satisfaction, Performance, Activity, Communication, Efficiency (1-5)</li>
                <li>DevEx: Flow State, Feedback Loops, Cognitive Load (1-5)</li>
                <li>AI Trust, AI Adoption Rate, Verification Overhead (1-5)</li>
                <li>3 Tension pairs: Velocity/Verification, Expertise, Workflow (1-5)</li>
              </ul>
            </div>
          </div>
        </GuideBanner>

        {/* How to get the data */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-sm font-semibold mb-3">How to get objective metrics from your Scrum tool</h2>
          <div className="space-y-4">
            <div className="border border-light-gray rounded-lg p-4">
              <h3 className="text-sm font-semibold text-primary mb-2">From Jira</h3>
              <ol className="text-xs text-dark/60 space-y-1.5 list-decimal list-inside">
                <li>Go to your Scrum board &rarr; <strong>Reports</strong> &rarr; <strong>Velocity Chart</strong></li>
                <li>Note the completed story points for each sprint in the baseline period</li>
                <li>Go to <strong>Reports</strong> &rarr; <strong>Sprint Report</strong> for each sprint</li>
                <li>Note: items committed, items completed, items not completed</li>
                <li>For cycle time: <strong>Reports</strong> &rarr; <strong>Control Chart</strong> &rarr; note the median</li>
                <li>For bugs: filter issues by type=Bug created during the period</li>
              </ol>
              <p className="text-[11px] text-dark/40 mt-2">Tip: You can also export sprint data via Jira &rarr; Board &rarr; Export &rarr; CSV</p>
            </div>

            <div className="border border-light-gray rounded-lg p-4">
              <h3 className="text-sm font-semibold text-primary mb-2">From Azure DevOps</h3>
              <ol className="text-xs text-dark/60 space-y-1.5 list-decimal list-inside">
                <li>Go to <strong>Boards</strong> &rarr; <strong>Sprints</strong> &rarr; select each sprint</li>
                <li>The sprint summary shows planned vs completed work items and story points</li>
                <li>Go to <strong>Analytics views</strong> &rarr; <strong>Velocity</strong> for velocity chart</li>
                <li>For cycle time: <strong>Analytics</strong> &rarr; <strong>Cycle Time</strong> chart</li>
                <li>Export: <strong>Queries</strong> &rarr; create a query &rarr; <strong>Export to CSV</strong></li>
              </ol>
            </div>

            <div className="border border-light-gray rounded-lg p-4">
              <h3 className="text-sm font-semibold text-primary mb-2">From GitHub (DORA metrics)</h3>
              <ol className="text-xs text-dark/60 space-y-1.5 list-decimal list-inside">
                <li><strong>Deploy frequency</strong>: Actions &rarr; count successful workflow runs to production</li>
                <li><strong>Lead time</strong>: Pull Requests &rarr; note average time from open to merge</li>
                <li><strong>Failure rate</strong>: Actions &rarr; count failed deployments / total deployments</li>
                <li><strong>MTTR</strong>: Issues labeled &ldquo;incident&rdquo; &rarr; average time from open to close</li>
              </ol>
              <p className="text-[11px] text-dark/40 mt-2">Tip: Use the <a href="https://dora.dev/quickcheck/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DORA Quick Check</a> to benchmark your team&apos;s DORA metrics</p>
            </div>

            <div className="border border-light-gray rounded-lg p-4">
              <h3 className="text-sm font-semibold text-primary mb-2">Manual Collection</h3>
              <p className="text-xs text-dark/60">
                If you don&apos;t have access to Jira/ADO/GitHub, gather the data manually from sprint reviews,
                retrospectives, or team lead interviews. Record the numbers in a spreadsheet,
                then enter them after creating the assessment.
              </p>
            </div>
          </div>
        </div>

        <GuideBanner title="After creating this assessment" variant="step">
          <p>
            Once created, you&apos;ll enter the actual metric values through the metrics API.
            The assessment stores the measurement window (dates + sprint count).
            The metric values are stored separately so you can update them as you collect data.
          </p>
        </GuideBanner>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-light-gray p-6">
          <h2 className="text-sm font-semibold mb-4">Define the measurement window</h2>

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
              <p className="text-[11px] text-dark/40 mt-1">Start of the first sprint you&apos;re measuring</p>
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
              <p className="text-[11px] text-dark/40 mt-1">End of the last sprint before training starts</p>
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
            <p className="text-[11px] text-dark/40 mt-1">How many sprints fall within this period. Minimum 3 recommended for reliable averages.</p>
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
            <p className="text-[11px] text-dark/40 mt-1">
              Most teams export data from their Scrum tool and enter it manually. API integration pulls data automatically but requires connection setup.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Baseline Assessment"}
          </button>
        </form>
      </main>
    </>
  );
}
