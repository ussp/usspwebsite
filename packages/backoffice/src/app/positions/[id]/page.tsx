"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import type {
  AdminPosition,
  AdminApplication,
  ApplicationStatus,
} from "@ussp-platform/core/types/admin";

function getPriorityBadge(appCount: number) {
  if (appCount >= 5)
    return { label: "Hot", className: "bg-red-100 text-red-700 border border-red-200", icon: "\uD83D\uDD25" };
  if (appCount >= 3)
    return { label: "High Interest", className: "bg-orange-100 text-orange-700 border border-orange-200", icon: "\u26A1" };
  if (appCount >= 1)
    return { label: "Active", className: "bg-blue-100 text-blue-700 border border-blue-200", icon: "\uD83D\uDCCB" };
  return null;
}

const STATUSES: Array<"all" | ApplicationStatus> = [
  "all",
  "new",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
  "withdrawn",
];

export default function PositionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [position, setPosition] = useState<AdminPosition | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>(
    "all"
  );

  useEffect(() => {
    Promise.all([
      fetch(`/api/positions/${params.id}`).then((r) => r.json()),
      fetch(`/api/applications?position_id=${params.id}`).then((r) => r.json()),
    ])
      .then(([posData, appsData]) => {
        setPosition(posData);
        setApplications(Array.isArray(appsData) ? appsData : []);
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
              {(() => {
                const badge = getPriorityBadge(applications.length);
                return badge ? (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
                    {badge.icon} {badge.label}
                  </span>
                ) : null;
              })()}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-dark/60">
              <span>{position.location}</span>
              <span>&middot;</span>
              <span>{position.type}</span>
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
                {position.client_name && (
                  <span>Client: {position.client_name}</span>
                )}
                {position.end_client_name && (
                  <span>End Client: {position.end_client_name}</span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => router.push(`/positions/${params.id}/edit`)}
            className="px-4 py-2 text-sm rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
          >
            Edit Position
          </button>
        </div>

        {/* Job Description */}
        {position.description && (
          <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
            <h3 className="text-lg font-bold mb-3">Job Description</h3>
            <div className="text-sm text-dark/70 whitespace-pre-wrap leading-relaxed">
              {position.description}
            </div>
          </div>
        )}

        {/* Applicants Section */}
        <div className="bg-white rounded-lg border border-light-gray p-6">
          <h3 className="text-lg font-bold mb-4">
            Applicants ({applications.length})
          </h3>

          {/* Status Filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs rounded-full capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-primary text-white"
                    : "bg-white border border-light-gray text-dark/60 hover:bg-light-gray"
                }`}
              >
                {s}
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
      </main>
    </>
  );
}
