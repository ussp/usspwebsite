export const dynamic = "force-dynamic";

import { getDashboardMetrics } from "@ussp-platform/core/queries/admin/dashboard";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import MetricCard from "@/components/MetricCard";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
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
