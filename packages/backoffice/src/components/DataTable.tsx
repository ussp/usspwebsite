"use client";

import { useState } from "react";

interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: any) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  keyField: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
}

export default function DataTable({
  columns,
  data,
  keyField,
  onRowClick,
  emptyMessage = "No data found",
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = String(a[sortKey] ?? "");
    const bVal = String(b[sortKey] ?? "");
    return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-light-gray p-12 text-center text-dark/50">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-light-gray overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-light-gray bg-light-gray/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium text-dark/70 ${
                    col.sortable ? "cursor-pointer select-none hover:text-dark" : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortAsc ? "\u2191" : "\u2193"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={String(row[keyField])}
                className={`border-b border-light-gray/50 last:border-0 ${
                  onRowClick
                    ? "cursor-pointer hover:bg-primary/5 transition-colors"
                    : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
