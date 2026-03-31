export const dynamic = "force-dynamic";

import { getDashboardMetrics } from "@ussp-platform/core/queries/admin/dashboard";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import MetricCard from "@/components/MetricCard";
import Link from "next/link";
import type { ApplicationStatus } from "@ussp-platform/core/types/admin";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  screening: "bg-purple-100 text-purple-800",
  interview: "bg-yellow-100 text-yellow-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-600",
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
  const metrics = await getDashboardMetrics();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            label="In Interview"
            value={metrics.applicationsByStatus.interview}
            subtext={`${metrics.applicationsByStatus.offer} with offers`}
          />
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
                    href={`/positions/${pos.id}`}
                    className="block p-3 rounded-lg border border-light-gray hover:border-primary/30 hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
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
                    <span className="text-sm capitalize w-24 text-dark/70">
                      {status}
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
