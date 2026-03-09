"use client";

import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import type { AdminArticle } from "@ussp-platform/core/types/admin";

const statusColors: Record<string, string> = {
  draft: "bg-warning/10 text-warning",
  published: "bg-success/10 text-success",
  archived: "bg-dark/10 text-dark/50",
};

const typeColors: Record<string, string> = {
  case_study: "bg-primary/10 text-primary",
  blog_post: "bg-purple-100 text-purple-700",
};

const typeLabels: Record<string, string> = {
  case_study: "Case Study",
  blog_post: "Blog Post",
};

export function ArticlesTable({ articles }: { articles: AdminArticle[] }) {
  const router = useRouter();

  const columns = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "content_type",
      label: "Type",
      render: (row: AdminArticle) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs ${
            typeColors[row.content_type] || ""
          }`}
        >
          {typeLabels[row.content_type] || row.content_type}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: AdminArticle) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs ${
            statusColors[row.status] || ""
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    { key: "author", label: "Author", sortable: true },
    {
      key: "published_at",
      label: "Published",
      sortable: true,
      render: (row: AdminArticle) =>
        row.published_at
          ? new Date(row.published_at).toLocaleDateString()
          : "—",
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (row: AdminArticle) =>
        new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={articles}
      keyField="id"
      onRowClick={(row) => router.push(`/articles/${row.id}/edit`)}
      emptyMessage="No articles yet. Create one to get started."
    />
  );
}
