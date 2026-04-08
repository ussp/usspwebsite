import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAIToolsDashboard } from "@ussp-platform/core/queries/admin/ai-engagements";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import StepIndicator from "@/components/StepIndicator";
import type { EngagementStatus } from "@ussp-platform/core";
import Link from "next/link";

export const dynamic = "force-dynamic";

const GETTING_STARTED_STEPS = [
  { number: 1, label: "Create an Engagement", description: "Name your project and select the client organization you're training.", active: true },
  { number: 2, label: "Add Teams & Members", description: "Add the Scrum team(s) and assign roles (developer, QA, SM, PO, DevOps)." },
  { number: 3, label: "Run Baseline Assessment", description: "Measure 3-6 sprints of current performance before AI training begins." },
  { number: 4, label: "Generate Training Plans", description: "Get AI tool and training recommendations customized for each role." },
  { number: 5, label: "Deliver AI Training", description: "Train the team with role-specific AI tools (outside this tool)." },
  { number: 6, label: "Run Post-Training Assessment", description: "Measure 3-6 sprints after training + 2-4 week ramp-up buffer." },
  { number: 7, label: "View Transformation Report", description: "Compare before vs after with research-backed benchmarks." },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const metrics = await getAIToolsDashboard();
  const isEmpty = metrics.total_engagements === 0;

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">AI Transformation Monitor</h1>
          <p className="text-sm text-dark/50 mt-1">
            Track and measure Scrum team productivity growth through AI enablement
          </p>
        </div>

        {/* ============ AI TRANSFORMATION LIFECYCLE ============ */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-dark/40 uppercase tracking-wider">AI Transformation Lifecycle</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Link href="/readiness" className="block bg-white rounded-lg border-2 border-light-gray hover:border-primary p-6 transition-colors group relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Assess</span>
            </div>
            <div className="text-2xl mb-2">🔍</div>
            <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">Readiness Assessment</h2>
            <p className="text-sm text-dark/50 mt-2">
              Evaluate whether an organization has the <strong>7 capabilities</strong> needed for AI to succeed
              (DORA 2025 AI Capabilities Model).
            </p>
            <p className="text-xs text-primary font-medium mt-3">Assess readiness &rarr;</p>
          </Link>
          <Link href="/engagements" className="block bg-white rounded-lg border-2 border-light-gray hover:border-primary p-6 transition-colors group relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Transform</span>
            </div>
            <div className="text-2xl mb-2">📈</div>
            <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">Transformation Monitor</h2>
            <p className="text-sm text-dark/50 mt-2">
              Measure Scrum team productivity <strong>before and after</strong> AI training.
              Tracks DORA, Scrum, SPACE, and DevEx metrics to quantify improvement.
            </p>
            <p className="text-xs text-primary font-medium mt-3">
              {metrics.total_engagements > 0 ? `${metrics.active_engagements} active engagement${metrics.active_engagements !== 1 ? "s" : ""}` : "Get started"} &rarr;
            </p>
          </Link>
          <Link href="/governance" className="block bg-white rounded-lg border-2 border-light-gray hover:border-primary p-6 transition-colors group relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Govern</span>
            </div>
            <div className="text-2xl mb-2">🛡️</div>
            <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">GRC & Compliance</h2>
            <p className="text-sm text-dark/50 mt-2">
              Policy compliance, risk tracking, and audit trail. Covers DoIT AI Policy,
              NIST AI RMF, and state-specific regulatory requirements.
            </p>
            <p className="text-xs text-primary font-medium mt-3">View compliance &rarr;</p>
          </Link>
        </div>

        {isEmpty ? (
          /* ============ EMPTY STATE: Getting Started Guide ============ */
          <div>
            <StepIndicator steps={GETTING_STARTED_STEPS} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-light-gray p-5">
                <h3 className="font-semibold text-sm mb-2">What is an Engagement?</h3>
                <p className="text-xs text-dark/50">
                  An engagement is a complete AI training project with a client. It contains one or more Scrum teams,
                  their baseline measurements, training plans, and post-training results.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-light-gray p-5">
                <h3 className="font-semibold text-sm mb-2">What gets measured?</h3>
                <p className="text-xs text-dark/50">
                  DORA metrics (deploy frequency, lead time), Scrum metrics (velocity, cycle time),
                  SPACE survey (satisfaction, efficiency), and DevEx survey (flow state, cognitive load).
                </p>
              </div>
              <div className="bg-white rounded-lg border border-light-gray p-5">
                <h3 className="font-semibold text-sm mb-2">Where does data come from?</h3>
                <p className="text-xs text-dark/50">
                  Objective metrics are pulled automatically from Jira, Azure DevOps, or GitHub.
                  SPACE and DevEx surveys (8 questions) are the only manual input.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ============ ACTIVE STATE: Dashboard with data ============ */
          <div>
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
            </div>
          </div>
        )}
      </main>
    </>
  );
}
