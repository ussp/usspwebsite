"use client";

import { useState } from "react";
import DataTable from "@/components/DataTable";
import type { ContactSubmission } from "@ussp-platform/core/types/database";

export function ContactsTable({
  contacts,
}: {
  contacts: ContactSubmission[];
}) {
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone" },
    {
      key: "message",
      label: "Message",
      render: (row: ContactSubmission) => (
        <span className="truncate block max-w-xs">
          {row.message.slice(0, 80)}
          {row.message.length > 80 ? "..." : ""}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (row: ContactSubmission) =>
        new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={contacts}
        keyField="id"
        onRowClick={(row) => setSelected(row as ContactSubmission)}
        emptyMessage="No contact submissions yet"
      />
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">{selected.name}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-dark/40 hover:text-dark"
              >
                &times;
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-dark/50">Email:</span> {selected.email}
              </p>
              {selected.phone && (
                <p>
                  <span className="text-dark/50">Phone:</span> {selected.phone}
                </p>
              )}
              <p>
                <span className="text-dark/50">Date:</span>{" "}
                {new Date(selected.created_at).toLocaleString()}
              </p>
              <div className="mt-4 p-3 bg-light-gray rounded-lg whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
