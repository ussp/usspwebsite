"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import ApplicantFlowChart from "@/components/ApplicantFlowChart";
import ActivityFeed from "@/components/ActivityFeed";
import CandidateMatchResults from "@/components/CandidateMatchResults";
import PositionRequirementsCard from "@/components/PositionRequirementsCard";
import type {
  AdminPosition,
  AdminApplication,
  ApplicationStatus,
  PositionStats,
} from "@ussp-platform/core/types/admin";
import {
  PIPELINE_STAGES,
  TERMINAL_STATUSES,
  STAGE_LABELS,
} from "@ussp-platform/core/types/admin";

interface AuditEntry {
  id: string;
  action: string;
  entity_type: string;
  details: Record<string, unknown>;
  created_at: string;
  staff_user?: { full_name: string; email?: string } | null;
}

const STATUSES: Array<"all" | ApplicationStatus> = [
  "all",
  ...PIPELINE_STAGES,
  ...TERMINAL_STATUSES,
];

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

export default function PositionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const autoMatch = searchParams.get("findCandidates") === "true";
  const [position, setPosition] = useState<AdminPosition | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [stats, setStats] = useState<PositionStats | null>(null);
  const [activity, setActivity] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");

  useEffect(() => {
    Promise.all([
      fetch(`/api/positions/${params.id}`).then((r) => r.json()),
      fetch(`/api/applications?position_id=${params.id}`).then((r) => r.json()),
      fetch(`/api/positions/${params.id}/stats`).then((r) => r.json()),
      fetch(`/api/positions/${params.id}/activity`).then((r) => r.json()),
    ])
      .then(([posData, appsData, statsData, activityData]) => {
        setPosition(posData);
        setApplications(Array.isArray(appsData) ? appsData : []);
        setStats(statsData);
        setActivity(Array.isArray(activityData) ? activityData : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load position data");
        setLoading(false);
      });
  }, [params.id]);

  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  const columns = [
    { key: "full_name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "phone",
      label: "Phone",
      render: (row: AdminApplication) => row.phone || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row: AdminApplication) => (
        <StatusBadge status={row.status || "new"} />
      ),
    },
    {
      key: "resume_name",
      label: "Resume",
      render: (row: AdminApplication) =>
        row.resume_name ? (
          <span className="text-primary text-xs" title={row.resume_name}>
            Uploaded
          </span>
        ) : (
          <span className="text-dark/40 text-xs">None</span>
        ),
    },
    {
      key: "created_at",
      label: "Applied",
      sortable: true,
      render: (row: AdminApplication) =>
        new Date(row.created_at).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-dark/50">Loading...</p>
        </main>
      </>
    );
  }

  if (error || !position) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-danger">{error || "Position not found"}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        {/* Position Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <button
              onClick={() => router.push("/positions")}
              className="text-sm text-dark/50 hover:text-primary transition-colors mb-2 inline-block"
            >
              &larr; Back to Positions
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{position.title}</h2>
              {position.is_hot && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                  HOT
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                {position.type}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-dark/60">
              <span>{position.location}</span>
              {position.work_mode && (
                <>
                  <span>&middot;</span>
                  <span>{position.work_mode}</span>
                </>
              )}
              <span>&middot;</span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                  position.active
                    ? "bg-success/10 text-success"
                    : "bg-dark/10 text-dark/50"
                }`}
              >
                {position.active ? "Active" : "Closed"}
              </span>
            </div>
            {(position.client_name || position.end_client_name) && (
              <div className="flex items-center gap-3 mt-1 text-sm text-dark/50">
                {position.client_name && <span>Client: {position.client_name}</span>}
                {position.end_client_name && <span>End Client: {position.end_client_name}</span>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/positions/${params.id}/edit`)}
              className="px-4 py-2 text-sm rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                await fetch(`/api/positions/${params.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ toggleActive: true }),
                });
                setPosition((prev) =>
                  prev ? { ...prev, active: !prev.active } : prev
                );
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                position.active
                  ? "border border-red-200 text-red-600 hover:bg-red-50"
                  : "border border-green-200 text-green-600 hover:bg-green-50"
              }`}
            >
              {position.active ? "Close" : "Reopen"}
            </button>
          </div>
        </div>

        {/* Overview Section - Stats + Flow Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Stats Sidebar */}
          <div className="space-y-3">
            {[
              { label: "Total Applicants", value: stats?.totalApplicants ?? 0, color: "text-dark" },
              { label: "New Applicants", value: stats?.newApplicants ?? 0, color: "text-blue-600" },
              { label: "Rejected", value: stats?.rejectedCount ?? 0, color: "text-red-600" },
              { label: "In Progress", value: stats?.inProgressCount ?? 0, color: "text-amber-600" },
              { label: "Hires", value: stats?.hiredCount ?? 0, color: "text-emerald-600" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-lg border border-light-gray p-4 flex items-center gap-3"
              >
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-sm text-dark/60">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Applicant Flow Summary */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-light-gray p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Applicant Flow Summary</h3>
              <span className="text-xs text-dark/40">Last 8 weeks</span>
            </div>
            {stats?.applicantFlow ? (
              <ApplicantFlowChart data={stats.applicantFlow} />
            ) : (
              <p className="text-sm text-dark/40">No data</p>
            )}
          </div>
        </div>

        {/* Bottom Section - Candidates + Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Candidates */}
          <div className="xl:col-span-2 space-y-6">
            {/* Recently Active Candidates */}
            {stats && stats.recentCandidates.length > 0 && (
              <div className="bg-white rounded-lg border border-light-gray p-5">
                <h3 className="font-semibold mb-4 uppercase text-xs tracking-wide text-dark/50">
                  Recently Active Candidates
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-dark/50 border-b border-light-gray">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Stage</th>
                      <th className="pb-2 font-medium">Last Action</th>
                      <th className="pb-2 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentCandidates.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-light-gray/50 last:border-0"
                      >
                        <td className="py-3 text-sm font-medium">{c.full_name}</td>
                        <td className="py-3">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="py-3 text-sm text-dark/50">
                          {timeAgo(c.status_updated_at || c.created_at)}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => router.push(`/applications/${c.id}`)}
                            className="px-3 py-1 text-xs border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Position Requirements for Matching */}
            <PositionRequirementsCard positionId={params.id as string} />

            {/* Candidate Matching */}
            <CandidateMatchResults
              positionId={params.id as string}
              autoTrigger={autoMatch}
            />

            {/* Full Applicants Table */}
            <div className="bg-white rounded-lg border border-light-gray p-5">
              <h3 className="font-semibold mb-4">
                All Applicants ({applications.length})
              </h3>

              {/* Status Filter Tabs */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                      statusFilter === s
                        ? "bg-primary text-white"
                        : "bg-white border border-light-gray text-dark/60 hover:bg-light-gray"
                    }`}
                  >
                    {s === "all" ? "All" : (STAGE_LABELS[s] || s)}
                    {s !== "all" && (
                      <span className="ml-1 opacity-60">
                        ({applications.filter((a) => a.status === s).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <DataTable
                columns={columns}
                data={filteredApplications}
                keyField="id"
                onRowClick={(row) => router.push(`/applications/${row.id}`)}
                emptyMessage="No applications for this position yet."
              />
            </div>
          </div>

          {/* Right: Activity Feed */}
          <div className="bg-white rounded-lg border border-light-gray p-5 h-fit">
            <h3 className="font-semibold mb-4 uppercase text-xs tracking-wide text-dark/50">
              Activity
            </h3>
            <ActivityFeed entries={activity} />
          </div>
        </div>
      </main>
    </>
  );
}
