"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import type { AdminApplication } from "@ussp-platform/core/types/admin";
import {
  PIPELINE_STAGES,
  TERMINAL_STATUSES,
  STAGE_LABELS,
} from "@ussp-platform/core/types/admin";

const STATUSES = ["all", ...PIPELINE_STAGES, ...TERMINAL_STATUSES];

export function ApplicationsTable({
  applications,
  positions,
}: {
  applications: AdminApplication[];
  positions: { id: string; title: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";
  const currentPosition = searchParams.get("position_id") || "all";

  function setFilter(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/applications?${params.toString()}`);
  }

  function setPositionFilter(positionId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (positionId === "all") {
      params.delete("position_id");
    } else {
      params.set("position_id", positionId);
    }
    router.push(`/applications?${params.toString()}`);
  }

  const columns = [
    { key: "full_name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "job_title", label: "Position", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (row: AdminApplication) => (
        <StatusBadge status={row.status || "new"} />
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

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <select
          value={currentPosition}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-light-gray bg-white text-dark/80"
        >
          <option value="all">All Positions</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
              currentStatus === s
                ? "bg-primary text-white"
                : "bg-white border border-light-gray text-dark/60 hover:bg-light-gray"
            }`}
          >
            {s === "all" ? "All" : (STAGE_LABELS[s as keyof typeof STAGE_LABELS] || s)}
          </button>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={applications}
        keyField="id"
        onRowClick={(row) => router.push(`/applications/${row.id}`)}
        emptyMessage="No applications found"
      />
    </>
  );
}
