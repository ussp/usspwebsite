"use client";

import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import type { StaffUser } from "@ussp-platform/core/types/admin";

export function StaffTable({ staff }: { staff: StaffUser[] }) {
  const router = useRouter();

  const columns = [
    { key: "full_name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row: StaffUser) => (
        <span className="capitalize">{row.role.replace("_", " ")}</span>
      ),
    },
    {
      key: "active",
      label: "Status",
      render: (row: StaffUser) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs ${
            row.active
              ? "bg-success/10 text-success"
              : "bg-dark/10 text-dark/50"
          }`}
        >
          {row.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "last_login_at",
      label: "Last Login",
      render: (row: StaffUser) =>
        row.last_login_at
          ? new Date(row.last_login_at).toLocaleDateString()
          : "Never",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={staff}
      keyField="id"
      onRowClick={() => {
        // Could navigate to edit page
        router.refresh();
      }}
      emptyMessage="No staff users yet"
    />
  );
}
