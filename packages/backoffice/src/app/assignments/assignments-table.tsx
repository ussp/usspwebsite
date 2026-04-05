"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/DataTable";
import PartnerRequirementsTooltip from "@/components/PartnerRequirementsTooltip";
import type { AdminAssignment, AssignmentStatus } from "@ussp-platform/core/types/admin";

const STATUS_COLORS: Record<AssignmentStatus, string> = {
  active: "bg-success/10 text-success",
  completed: "bg-blue-100 text-blue-700",
  terminated: "bg-red-100 text-red-700",
  on_hold: "bg-amber-100 text-amber-700",
};

const STATUSES: Array<"all" | AssignmentStatus> = [
  "all", "active", "completed", "terminated", "on_hold",
];

function isExpiringSoon(endDate: string | null): boolean {
  if (!endDate) return false;
  const end = new Date(endDate);
  const now = new Date();
  const diffDays = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
}

export function AssignmentsTable({ assignments }: { assignments: AdminAssignment[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  function setFilter(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/assignments?${params.toString()}`);
  }

  const filtered = currentStatus === "all"
    ? assignments
    : assignments.filter(a => a.status === currentStatus);

  const columns = [
    {
      key: "candidate_name",
      label: "Candidate",
      sortable: true,
      render: (row: AdminAssignment) => row.candidate_name || "-",
    },
    { key: "role_title", label: "Role", sortable: true },
    {
      key: "client_name",
      label: "Client",
      sortable: true,
      render: (row: AdminAssignment) => (
        <span className="inline-flex items-center">
          {row.client_name || "-"}
          {row.client_name && (
            <PartnerRequirementsTooltip clientName={row.client_name} type="invoicing" />
          )}
        </span>
      ),
    },
    {
      key: "end_client_name",
      label: "End Client",
      sortable: true,
      render: (row: AdminAssignment) => row.end_client_name || "-",
    },
    {
      key: "start_date",
      label: "Start",
      sortable: true,
      render: (row: AdminAssignment) =>
        new Date(row.start_date).toLocaleDateString(),
    },
    {
      key: "end_date",
      label: "End",
      sortable: true,
      render: (row: AdminAssignment) => {
        if (!row.end_date) return <span className="text-dark/40">Open-ended</span>;
        const expiring = isExpiringSoon(row.end_date);
        return (
          <span className={expiring ? "text-amber-600 font-medium" : ""}>
            {new Date(row.end_date).toLocaleDateString()}
            {expiring && " \u26A0"}
          </span>
        );
      },
    },
    {
      key: "bill_rate",
      label: "Bill Rate",
      render: (row: AdminAssignment) => row.bill_rate || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row: AdminAssignment) => (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[row.status]}`}>
          {row.status.replace("_", " ")}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-full capitalize transition-colors ${
              currentStatus === s
                ? "bg-primary text-white"
                : "bg-white border border-light-gray text-dark/60 hover:bg-light-gray"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        onRowClick={(row) => router.push(`/assignments/${row.id}`)}
        emptyMessage="No assignments found."
      />
    </>
  );
}
