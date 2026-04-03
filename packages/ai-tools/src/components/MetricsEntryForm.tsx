"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
  AIAssessment,
  AITeamMember,
  AIMetric,
  MetricCategory,
  MetricDefinition,
  AssessmentType,
} from "@ussp-platform/core";
import {
  METRIC_CATALOG,
  TEAM_MEMBER_ROLE_LABELS,
} from "@ussp-platform/core";
import type { TeamMemberRole } from "@ussp-platform/core";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import GuideBanner from "@/components/GuideBanner";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CATEGORY_ORDER: MetricCategory[] = ["dora", "scrum", "quality", "space", "devex"];

const CATEGORY_LABELS: Record<string, string> = {
  dora: "DORA Metrics",
  scrum: "Scrum Metrics",
  quality: "Quality Metrics",
  space: "SPACE Survey",
  devex: "Developer Experience",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  dora: "DevOps Research & Assessment delivery metrics. These are objective, team-level measures pulled from your CI/CD and incident management tools.",
  scrum: "Sprint delivery metrics averaged over the measurement period. Pull these from your Scrum tool (Jira, ADO, etc.).",
  quality: "Story quality, test coverage, documentation, and planning metrics. Measures the qualitative dimensions of delivery — not just speed, but how good the output is.",
  space: "Satisfaction, Performance, Activity, Communication, Efficiency. Each team member scores every dimension 1-5.",
  devex: "Developer Experience survey including AI-specific tension pairs from the DORA 2025 model. Each member scores 1-5.",
};

/** Metrics relevant for baseline/post_training (exclude readiness category) */
function getMetricsForCategory(category: MetricCategory): MetricDefinition[] {
  return METRIC_CATALOG.filter((m) => m.category === category);
}

function unitLabel(unit: string): string {
  switch (unit) {
    case "per_week": return "/ week";
    case "minutes": return "min";
    case "percentage": return "%";
    case "story_points": return "SP";
    case "count": return "";
    case "items_per_sprint": return "/ sprint";
    case "score_1_5": return "(1-5)";
    case "hours": return "hrs";
    case "days": return "days";
    default: return unit;
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface MetricsEntryFormProps {
  engagementId: string;
  teamId: string;
  assessmentType: AssessmentType;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MetricsEntryForm({
  engagementId,
  teamId,
  assessmentType,
}: MetricsEntryFormProps) {
  const router = useRouter();

  // Data loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<AIAssessment | null>(null);
  const [members, setMembers] = useState<AITeamMember[]>([]);
  const [existingMetrics, setExistingMetrics] = useState<AIMetric[]>([]);

  // Active category tab
  const [activeTab, setActiveTab] = useState<MetricCategory>("dora");

  // Form values — keyed by `{category}:{metric_name}` for team metrics
  //   or `{category}:{metric_name}:{member_id}` for member metrics
  const [values, setValues] = useState<Record<string, string>>({});

  // Submit state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch assessment, members, and existing metrics
  // ---------------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch assessments for the team
      const assessRes = await fetch(`/api/assessments?team_id=${teamId}`);
      if (!assessRes.ok) throw new Error("Failed to fetch assessments");
      const assessments: AIAssessment[] = await assessRes.json();

      // Find the matching assessment by type
      const match = assessments.find((a) => a.assessment_type === assessmentType);
      if (!match) {
        setError(
          `No ${assessmentType === "post_training" ? "post-training" : "baseline"} assessment found for this team. ` +
          `Please create the assessment first.`
        );
        setLoading(false);
        return;
      }
      setAssessment(match);

      // Fetch team members and existing metrics in parallel
      const [membersRes, metricsRes] = await Promise.all([
        fetch(`/api/teams/${teamId}/members`),
        fetch(`/api/assessments/${match.id}/metrics`),
      ]);

      if (membersRes.ok) {
        const membersData: AITeamMember[] = await membersRes.json();
        setMembers(membersData);
      }

      if (metricsRes.ok) {
        const metricsData: AIMetric[] = await metricsRes.json();
        setExistingMetrics(metricsData);

        // Populate form values from existing metrics
        const populated: Record<string, string> = {};
        for (const m of metricsData) {
          const key = m.member_id
            ? `${m.category}:${m.metric_name}:${m.member_id}`
            : `${m.category}:${m.metric_name}`;
          populated[key] = String(m.metric_value);
        }
        setValues(populated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [teamId, assessmentType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------------------------------------------------------------------------
  // Value helpers
  // ---------------------------------------------------------------------------

  function getValue(category: MetricCategory, name: string, memberId?: string): string {
    const key = memberId ? `${category}:${name}:${memberId}` : `${category}:${name}`;
    return values[key] ?? "";
  }

  function setValue(category: MetricCategory, name: string, value: string, memberId?: string) {
    const key = memberId ? `${category}:${name}:${memberId}` : `${category}:${name}`;
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear success state when editing
    if (saved) setSaved(false);
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit() {
    if (!assessment) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      // Build metrics array from form values
      const metrics: Array<{
        category: MetricCategory;
        metric_name: string;
        metric_value: number;
        metric_unit: string;
        member_id?: string;
      }> = [];

      for (const [key, val] of Object.entries(values)) {
        if (val === "" || val === undefined) continue;
        const numVal = parseFloat(val);
        if (isNaN(numVal)) continue;

        const parts = key.split(":");
        const category = parts[0] as MetricCategory;
        const metric_name = parts[1];
        const member_id = parts[2] || undefined;

        const def = METRIC_CATALOG.find(
          (m) => m.category === category && m.name === metric_name
        );
        if (!def) continue;

        metrics.push({
          category,
          metric_name,
          metric_value: numVal,
          metric_unit: def.unit,
          ...(member_id ? { member_id } : {}),
        });
      }

      if (metrics.length === 0) {
        setSaveError("Please enter at least one metric value before saving.");
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/assessments/${assessment.id}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save metrics");
      }

      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save metrics");
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Count filled metrics per category
  // ---------------------------------------------------------------------------

  function filledCount(category: MetricCategory): number {
    let count = 0;
    for (const key of Object.keys(values)) {
      if (key.startsWith(`${category}:`) && values[key] !== "") count++;
    }
    return count;
  }

  function totalCount(category: MetricCategory): number {
    const defs = getMetricsForCategory(category);
    const teamDefs = defs.filter((d) => d.level === "team");
    const memberDefs = defs.filter((d) => d.level === "member");
    return teamDefs.length + memberDefs.length * Math.max(members.length, 1);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const isPostTraining = assessmentType === "post_training";
  const pageTitle = isPostTraining ? "Post-Training Metrics" : "Baseline Metrics";
  const parentPath = isPostTraining ? "post-training" : "baseline";

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-light-gray rounded w-64" />
            <div className="h-4 bg-light-gray rounded w-96" />
            <div className="h-64 bg-light-gray rounded" />
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6 max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-red-800 text-sm">
            <p className="font-semibold mb-1">Error</p>
            <p>{error}</p>
            <button
              onClick={() => router.push(`/engagements/${engagementId}/teams/${teamId}/${parentPath}`)}
              className="mt-3 text-primary hover:underline text-sm"
            >
              Go back to {isPostTraining ? "post-training" : "baseline"} assessment
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            <p className="text-sm text-dark/50 mt-1">
              Enter the {isPostTraining ? "post-training" : "baseline"} metric values for this assessment.
              {assessment && (
                <span className="ml-1 text-dark/30">
                  Period: {new Date(assessment.period_start).toLocaleDateString()} &ndash;{" "}
                  {new Date(assessment.period_end).toLocaleDateString()}
                  {assessment.sprint_count && ` (${assessment.sprint_count} sprints)`}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => router.push(`/engagements/${engagementId}`)}
            className="text-sm text-dark/40 hover:text-dark transition-colors"
          >
            Back to engagement
          </button>
        </div>

        {/* Guide banner */}
        {existingMetrics.length > 0 ? (
          <GuideBanner title="Existing data loaded" variant="tip">
            <p>
              This assessment already has <strong>{existingMetrics.length}</strong> metric values saved.
              You can update any values and save again &mdash; existing entries will be overwritten.
            </p>
          </GuideBanner>
        ) : (
          <GuideBanner title={isPostTraining ? "Enter post-training data" : "Enter baseline data"} variant="info">
            <p>
              Fill in the metrics across all four categories. Team-level metrics (DORA, Scrum) require one value each.
              Member-level metrics (SPACE, DevEx) need a score from each team member.
              {members.length === 0 && (
                <strong className="block mt-1 text-amber-700">
                  No team members found. Add members to the team first for SPACE and DevEx surveys.
                </strong>
              )}
            </p>
          </GuideBanner>
        )}

        {/* Category tabs */}
        <div className="flex gap-1 mb-6 border-b border-light-gray">
          {CATEGORY_ORDER.map((cat) => {
            const filled = filledCount(cat);
            const total = totalCount(cat);
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-dark/40 hover:text-dark/70"
                }`}
              >
                {CATEGORY_LABELS[cat]}
                <span className={`ml-1.5 text-xs ${filled === total && total > 0 ? "text-emerald-600" : "text-dark/30"}`}>
                  {filled}/{total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active category content */}
        <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{CATEGORY_LABELS[activeTab]}</h2>
            <p className="text-sm text-dark/50 mt-1">{CATEGORY_DESCRIPTIONS[activeTab]}</p>
          </div>

          {/* Team-level metrics (DORA, Scrum) */}
          {(activeTab === "dora" || activeTab === "scrum") && (
            <TeamMetricsSection
              category={activeTab}
              metrics={getMetricsForCategory(activeTab)}
              getValue={getValue}
              setValue={setValue}
            />
          )}

          {/* Member-level metrics (SPACE, DevEx) */}
          {(activeTab === "space" || activeTab === "devex") && (
            <MemberMetricsGrid
              category={activeTab}
              metrics={getMetricsForCategory(activeTab)}
              members={members}
              getValue={getValue}
              setValue={setValue}
            />
          )}
        </div>

        {/* Save section */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Metrics"}
          </button>

          {saved && (
            <span className="text-sm text-emerald-600 font-medium">
              Metrics saved successfully.
            </span>
          )}

          {saveError && (
            <span className="text-sm text-red-600">
              {saveError}
            </span>
          )}
        </div>
      </main>
    </>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

/** Team-level metric inputs (simple number fields in a grid) */
function TeamMetricsSection({
  category,
  metrics,
  getValue,
  setValue,
}: {
  category: MetricCategory;
  metrics: MetricDefinition[];
  getValue: (cat: MetricCategory, name: string) => string;
  setValue: (cat: MetricCategory, name: string, value: string) => void;
}) {
  // Only team-level metrics
  const teamMetrics = metrics.filter((m) => m.level === "team");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teamMetrics.map((m) => (
        <div key={m.name} className="border border-light-gray rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">{m.label}</label>
            <span className="text-xs text-dark/30 font-mono">{unitLabel(m.unit)}</span>
          </div>
          <p className="text-xs text-dark/40 mb-2">{m.description}</p>
          <input
            type="number"
            step="any"
            min="0"
            value={getValue(category, m.name)}
            onChange={(e) => setValue(category, m.name, e.target.value)}
            placeholder={placeholderForMetric(m)}
            className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex items-center gap-1 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${m.direction === "higher_better" ? "bg-emerald-400" : "bg-amber-400"}`} />
            <span className="text-[11px] text-dark/30">
              {m.direction === "higher_better" ? "Higher is better" : "Lower is better"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Member-level metrics grid: rows = members, columns = metrics */
function MemberMetricsGrid({
  category,
  metrics,
  members,
  getValue,
  setValue,
}: {
  category: MetricCategory;
  metrics: MetricDefinition[];
  members: AITeamMember[];
  getValue: (cat: MetricCategory, name: string, memberId?: string) => string;
  setValue: (cat: MetricCategory, name: string, value: string, memberId?: string) => void;
}) {
  const memberMetrics = metrics.filter((m) => m.level === "member");

  if (members.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 text-amber-800 text-sm">
        <p className="font-semibold mb-1">No team members found</p>
        <p>
          Member-level metrics require team members to be added first.
          Go to the team page and add members before entering SPACE/DevEx scores.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Metric descriptions above the grid */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {memberMetrics.map((m) => (
          <div key={m.name} className="text-xs text-dark/50 flex items-start gap-1.5">
            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.direction === "higher_better" ? "bg-emerald-400" : "bg-amber-400"}`} />
            <span>
              <strong className="text-dark/70">{m.label}</strong>: {m.description}
              {m.direction === "lower_better" && " (lower = better)"}
            </span>
          </div>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-light-gray">
            <th className="text-left py-2 pr-4 font-medium text-dark/60 whitespace-nowrap sticky left-0 bg-white">
              Team Member
            </th>
            {memberMetrics.map((m) => (
              <th
                key={m.name}
                className="text-center py-2 px-2 font-medium text-dark/60 whitespace-nowrap"
                title={m.description}
              >
                <span className="block text-xs">{m.label}</span>
                <span className="block text-[10px] text-dark/30 font-normal">{unitLabel(m.unit)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-light-gray/50 hover:bg-light-gray/30">
              <td className="py-2 pr-4 whitespace-nowrap sticky left-0 bg-white">
                <div className="font-medium text-sm">{member.display_name}</div>
                <div className="text-xs text-dark/40">
                  {TEAM_MEMBER_ROLE_LABELS[member.role as TeamMemberRole] || member.role}
                </div>
              </td>
              {memberMetrics.map((m) => (
                <td key={m.name} className="py-2 px-1 text-center">
                  <input
                    type="number"
                    step={m.unit === "percentage" ? "1" : "0.1"}
                    min={m.unit === "score_1_5" ? "1" : "0"}
                    max={m.unit === "score_1_5" ? "5" : undefined}
                    value={getValue(category, m.name, member.id)}
                    onChange={(e) => setValue(category, m.name, e.target.value, member.id)}
                    placeholder="-"
                    className="w-16 px-2 py-1.5 text-center border border-light-gray rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Quick fill helpers */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-dark/30">Quick fill:</span>
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => {
              for (const member of members) {
                for (const m of memberMetrics) {
                  if (m.unit === "score_1_5" && getValue(category, m.name, member.id) === "") {
                    setValue(category, m.name, String(score), member.id);
                  }
                }
              }
            }}
            className="text-xs px-2 py-1 rounded border border-light-gray hover:border-primary hover:text-primary transition-colors"
            title={`Fill all empty score fields with ${score}`}
          >
            All empty &rarr; {score}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Generate a reasonable placeholder based on metric type */
function placeholderForMetric(m: MetricDefinition): string {
  switch (m.name) {
    case "deployment_frequency": return "e.g., 3.5";
    case "lead_time_minutes": return "e.g., 120";
    case "change_failure_rate": return "e.g., 15";
    case "mttr_minutes": return "e.g., 45";
    case "velocity": return "e.g., 34";
    case "cycle_time_days": return "e.g., 2.5";
    case "predictability": return "e.g., 85";
    case "throughput": return "e.g., 12";
    case "bug_escape_rate": return "e.g., 2";
    default: return "0";
  }
}
