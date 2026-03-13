"use client";

import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import type { AdminPosition } from "@ussp-platform/core/types/admin";

export function PositionsTable({
  positions,
}: {
  positions: AdminPosition[];
}) {
  const router = useRouter();

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "location", label: "Location", sortable: true },
    { key: "type", label: "Type", sortable: true },
    {
      key: "work_mode",
      label: "Work Mode",
      sortable: true,
      render: (row: AdminPosition) => row.work_mode || "-",
    },
    {
      key: "client_name",
      label: "Client",
      sortable: true,
      render: (row: AdminPosition) => row.client_name || "-",
    },
    {
      key: "end_client_name",
      label: "End Client",
      sortable: true,
      render: (row: AdminPosition) => row.end_client_name || "-",
    },
    {
      key: "active",
      label: "Status",
      render: (row: AdminPosition) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs ${
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
      render: (row: AdminPosition) =>
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
