"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import type { PositionListItem } from "@ussp-platform/core/types/admin";

export function PositionsTable({
  positions,
}: {
  positions: PositionListItem[];
}) {
  const router = useRouter();

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row: PositionListItem) => (
        <div>
          <span>
            {row.is_hot && (
              <span
                title="High-priority position — urgent hiring need"
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-700 mr-1.5"
              >
                HOT
              </span>
            )}
            {row.title}
          </span>
          {row.active && (
            <span
              title="Position is open and accepting applications"
              className="ml-2 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded"
            >
              ACTIVE
            </span>
          )}
          {row.new_applicant_count > 0 && (
            <div className="mt-1">
              <Link
                href={`/positions/${row.id}`}
                className="text-xs text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Review new applicants &rarr;
              </Link>
            </div>
          )}
        </div>
      ),
    },
    { key: "location", label: "Location", sortable: true },
    { key: "type", label: "Type", sortable: true },
    {
      key: "work_mode",
      label: "Work Mode",
      sortable: true,
      render: (row: PositionListItem) => row.work_mode || "-",
    },
    {
      key: "applicant_count",
      label: "Applicants",
      sortable: true,
      render: (row: PositionListItem) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{row.applicant_count}</span>
          {row.new_applicant_count > 0 && (
            <span
              title="Applications not yet reviewed (still in 'New' status)"
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700"
            >
              {row.new_applicant_count} new
            </span>
          )}
        </div>
      ),
    },
    {
      key: "client_name",
      label: "Client",
      sortable: true,
      render: (row: PositionListItem) => row.client_name || "-",
    },
    {
      key: "active",
      label: "Status",
      render: (row: PositionListItem) => (
        <span
          title={row.active ? "Open for applications" : "No longer accepting applications"}
          className={`inline-block px-2.5 py-1 rounded-full text-xs cursor-default ${
            row.active
              ? "bg-success/10 text-success"
              : "bg-dark/10 text-dark/50"
          }`}
        >
          {row.active ? "Active" : "Closed"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (row: PositionListItem) =>
        new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={positions}
      keyField="id"
      onRowClick={(row) => router.push(`/positions/${row.id}`)}
      emptyMessage="No positions yet. Create one to get started."
    />
  );
}
