import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAIToolsDashboard } from "@ussp-platform/core/queries/admin/ai-engagements";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import type { EngagementStatus } from "@ussp-platform/core";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const metrics = await getAIToolsDashboard();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">AI Transformation Monitor</h1>
          <p className="text-sm text-dark/50 mt-1">
            Measure AI training impact on Scrum team productivity
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Active Engagements"
            value={metrics.active_engagements}
            subtext={`${metrics.total_engagements} total`}
          />
          <MetricCard
            label="Teams Assessed"
            value={metrics.total_teams}
          />
          <MetricCard
            label="Avg Improvement"
            value={metrics.avg_improvement_pct !== null ? `+${metrics.avg_improvement_pct}%` : "--"}
            subtext="Across completed engagements"
          />
          <MetricCard
            label="Assessments In Progress"
            value={metrics.assessments_in_progress}
          />
        </div>

        {/* Recent engagements */}
        <div className="bg-white rounded-lg border border-light-gray p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Engagements</h2>
            <Link
              href="/engagements/new"
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
            >
              New Engagement
            </Link>
          </div>

          {metrics.recent_engagements.length === 0 ? (
            <p className="text-sm text-dark/40 py-8 text-center">
              No engagements yet. Create your first engagement to get started.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-gray text-left">
                  <th className="py-2 font-medium text-dark/60">Name</th>
                  <th className="py-2 font-medium text-dark/60">Client</th>
                  <th className="py-2 font-medium text-dark/60">Teams</th>
                  <th className="py-2 font-medium text-dark/60">Status</th>
                  <th className="py-2 font-medium text-dark/60">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recent_engagements.map((eng) => (
                  <tr key={eng.id} className="border-b border-light-gray/50 hover:bg-light-gray/30">
                    <td className="py-3">
                      <Link
                        href={`/engagements/${eng.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {eng.name}
                      </Link>
                    </td>
                    <td className="py-3 text-dark/60">{eng.client_name}</td>
                    <td className="py-3">{eng.team_count}</td>
                    <td className="py-3">
                      <StatusBadge status={eng.status as EngagementStatus} />
                    </td>
                    <td className="py-3">
                      {eng.improvement_pct !== null ? (
                        <span className="text-success font-medium">
                          +{eng.improvement_pct}%
                        </span>
                      ) : (
                        <span className="text-dark/30">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Philosophy callout */}
        <div className="mt-8 bg-near-black text-white rounded-lg p-6">
          <h3 className="font-semibold mb-2">Our Philosophy: Amplify, Not Replace</h3>
          <p className="text-sm text-white/70">
            AI training empowers the same team to deliver more. We measure productivity improvement
            using research-backed frameworks (DORA, SPACE, DevEx) — proving that AI makes every
            role more effective. No one loses their job. Everyone becomes more productive.
          </p>
        </div>
      </main>
    </>
  );
}
