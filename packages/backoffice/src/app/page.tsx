export const dynamic = "force-dynamic";

import { getDashboardMetrics } from "@ussp-platform/core/queries/admin/dashboard";
import { getCandidates } from "@ussp-platform/core/queries/admin/candidates";
import { getAssignments } from "@ussp-platform/core/queries/admin/assignments";
import { getMatchScoresForPosition } from "@ussp-platform/core/queries/admin/matching";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import MetricCard from "@/components/MetricCard";
import Link from "next/link";
import type { ApplicationStatus } from "@ussp-platform/core/types/admin";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  phone_screen: "bg-purple-100 text-purple-800",
  interview_zoom: "bg-indigo-100 text-indigo-800",
  client_submission: "bg-orange-100 text-orange-800",
  interview_in_person: "bg-violet-100 text-violet-800",
  employment_verification: "bg-cyan-100 text-cyan-800",
  references: "bg-teal-100 text-teal-800",
  clearances: "bg-sky-100 text-sky-800",
  offer_pending: "bg-amber-100 text-amber-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  phone_screen: "Phone Screen",
  interview_zoom: "Zoom Interview",
  client_submission: "Client Submission",
  interview_in_person: "Client/In-Person",
  employment_verification: "Verification",
  references: "References",
  clearances: "Clearances",
  offer_pending: "Offer Pending",
  hired: "Hired",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default async function DashboardPage() {
  const [metrics, allCandidates, activeAssignments] = await Promise.all([
    getDashboardMetrics(),
    getCandidates({}),
    getAssignments({ status: "active" }),
  ]);

  // Bench stats
  const benchCandidates = allCandidates.filter(
    (c) =>
      c.candidate_type === "internal_employee" &&
      c.current_status === "available"
  );
  const endingSoon = activeAssignments.filter((a) => {
    if (!a.end_date) return false;
    const days = Math.ceil(
      (new Date(a.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days <= 30 && days >= 0;
  });

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard
            label="Active Positions"
            value={metrics.activePositions}
            subtext={`${metrics.totalPositions} total`}
          />
          <MetricCard
            label="New Applications"
            value={metrics.newApplications}
            subtext={`${metrics.totalApplications} total`}
          />
          <MetricCard
            label="Recent Contacts"
            value={metrics.recentContacts}
            subtext={`Last 7 days of ${metrics.totalContacts}`}
          />
          <MetricCard
            label="In Progress"
            value={
              metrics.applicationsByStatus.phone_screen +
              metrics.applicationsByStatus.interview_zoom +
              (metrics.applicationsByStatus.client_submission || 0) +
              metrics.applicationsByStatus.interview_in_person +
              metrics.applicationsByStatus.employment_verification +
              metrics.applicationsByStatus.references +
              metrics.applicationsByStatus.clearances +
              metrics.applicationsByStatus.offer_pending
            }
            subtext={`${metrics.applicationsByStatus.offer_pending} with offers`}
          />
          <Link href="/bench" className="block">
            <div className={`bg-white rounded-lg border p-5 hover:border-primary/30 transition-colors ${benchCandidates.length > 0 ? "border-red-200" : "border-light-gray"}`}>
              <p className="text-sm text-dark/60 mb-1">Bench</p>
              <p className={`text-3xl font-bold ${benchCandidates.length > 0 ? "text-red-600" : "text-dark"}`}>
                {benchCandidates.length}
              </p>
              <p className="text-xs text-dark/40 mt-1">
                {endingSoon.length > 0
                  ? `${endingSoon.length} ending in 30d`
                  : "No assignments ending soon"}
              </p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Hot Positions */}
          <div className="bg-white rounded-lg border border-light-gray p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Hot Positions</h3>
              <Link
                href="/positions"
                className="text-xs text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
            {metrics.hotPositions.length === 0 ? (
              <p className="text-sm text-dark/40">No positions yet</p>
            ) : (
              <div className="space-y-3">
                {metrics.hotPositions.map((pos) => (
                  <Link
                    key={pos.id}
                    href={
                      pos.applicationCount === 0 && pos.active
                        ? `/positions/${pos.id}?findCandidates=true`
                        : `/positions/${pos.id}`
                    }
                    className="block p-3 rounded-lg border border-light-gray hover:border-primary/30 hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {pos.is_hot && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-700 mr-1.5" title="Hot Position">
                              HOT
                            </span>
                          )}
                          {pos.title}
                        </p>
                        <p className="text-xs text-dark/50 mt-0.5">
                          {pos.location} · {pos.type}
                          {pos.work_mode ? ` · ${pos.work_mode}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {pos.applicationCount}
                        </span>
                        <span className="text-xs text-dark/40">apps</span>
                      </div>
                    </div>
                    {pos.applicationCount > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {(
                          Object.entries(pos.statusBreakdown) as [
                            ApplicationStatus,
                            number,
                          ][]
                        )
                          .filter(([, count]) => count > 0)
                          .map(([status, count]) => (
                            <span
                              key={status}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[status]}`}
                            >
                              {count} {status}
                            </span>
                          ))}
                      </div>
                    )}
                    {pos.applicationCount === 0 && pos.active && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Find matching candidates
                      </span>
                    )}
                    {!pos.active && (
                      <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600">
                        Closed
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg border border-light-gray p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Applications</h3>
              <Link
                href="/applications"
                className="text-xs text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
            {metrics.recentApplications.length === 0 ? (
              <p className="text-sm text-dark/40">No applications yet</p>
            ) : (
              <div className="space-y-2">
                {metrics.recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/applications/${app.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-light-gray hover:border-primary/30 hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {app.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {app.full_name}
                      </p>
                      <p className="text-xs text-dark/50 truncate">
                        {app.job_title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={app.status} />
                      <span className="text-[10px] text-dark/40 w-12 text-right">
                        {timeAgo(app.created_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Application Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-light-gray p-5">
            <h3 className="font-semibold mb-4">Application Pipeline</h3>
            <div className="space-y-3">
              {Object.entries(metrics.applicationsByStatus).map(
                ([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-sm w-28 text-dark/70 truncate" title={STATUS_LABELS[status] || status}>
                      {STATUS_LABELS[status] || status}
                    </span>
                    <div className="flex-1 bg-light-gray rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{
                          width:
                            metrics.totalApplications > 0
                              ? `${(count / metrics.totalApplications) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {count}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
