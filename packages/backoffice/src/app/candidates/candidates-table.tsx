"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/DataTable";
import type { AdminCandidate, CandidateType, CandidateStatus } from "@ussp-platform/core/types/admin";

const TYPE_COLORS: Record<CandidateType, string> = {
  internal_employee: "bg-blue-100 text-blue-700",
  external: "bg-gray-100 text-gray-700",
  vendor: "bg-purple-100 text-purple-700",
};

const TYPE_LABELS: Record<CandidateType, string> = {
  internal_employee: "Internal",
  external: "External",
  vendor: "Vendor",
};

const STATUS_COLORS: Record<CandidateStatus, string> = {
  available: "bg-success/10 text-success",
  employed: "bg-blue-100 text-blue-700",
  on_assignment: "bg-amber-100 text-amber-700",
  not_looking: "bg-dark/10 text-dark/50",
  blacklisted: "bg-red-100 text-red-700",
};

const STATUSES: Array<"all" | "bench" | CandidateStatus> = [
  "all", "bench", "available", "employed", "on_assignment", "not_looking",
];

export function CandidatesTable({ candidates }: { candidates: AdminCandidate[] }) {
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
    router.push(`/candidates?${params.toString()}`);
  }

  const filtered = currentStatus === "all"
    ? candidates
    : currentStatus === "bench"
      ? candidates.filter(
          (c) =>
            c.candidate_type === "internal_employee" &&
            c.current_status === "available"
        )
      : candidates.filter((c) => c.current_status === currentStatus);

  const columns = [
    { key: "full_name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "candidate_type",
      label: "Type",
      render: (row: AdminCandidate) => (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${TYPE_COLORS[row.candidate_type]}`}>
          {TYPE_LABELS[row.candidate_type]}
        </span>
      ),
    },
    {
      key: "current_status",
      label: "Status",
      render: (row: AdminCandidate) => (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[row.current_status]}`}>
          {row.current_status.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row: AdminCandidate) => row.phone || "-",
    },
    {
      key: "source",
      label: "Source",
      render: (row: AdminCandidate) => (
        <span className="capitalize text-dark/60">{row.source}</span>
      ),
    },
    {
      key: "created_at",
      label: "Added",
      sortable: true,
      render: (row: AdminCandidate) =>
        new Date(row.created_at).toLocaleDateString(),
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
            {s === "all" ? "All" : s === "bench" ? "Bench" : s.replace("_", " ")}
          </button>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        onRowClick={(row) => router.push(`/candidates/${row.id}`)}
        emptyMessage="No candidates found."
      />
    </>
  );
}
