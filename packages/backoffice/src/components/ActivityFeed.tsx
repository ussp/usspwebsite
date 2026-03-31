"use client";

import { STAGE_LABELS } from "@ussp-platform/core/types/admin";
import type { ApplicationStatus } from "@ussp-platform/core/types/admin";

interface AuditEntry {
  id: string;
  action: string;
  entity_type: string;
  details: Record<string, unknown>;
  created_at: string;
  staff_user?: { full_name: string; email?: string } | null;
}

interface ActivityFeedProps {
  entries: AuditEntry[];
}

function formatAction(entry: AuditEntry): string {
  const who = entry.staff_user?.full_name || "Staff";

  switch (entry.action) {
    case "update_status": {
      const newStatus = entry.details?.new_status as ApplicationStatus;
      const label = STAGE_LABELS[newStatus] || newStatus;
      return `${who} moved candidate to ${label}`;
    }
    case "assign":
      return `${who} assigned the application`;
    case "create":
      if (entry.entity_type === "position") return `${who} created this job`;
      return `${who} created ${entry.entity_type}`;
    case "update":
      if (entry.entity_type === "position") {
        const fields = entry.details?.fields as string[] | undefined;
        if (fields?.length) return `${who} edited ${fields.length} field(s)`;
        return `${who} edited this job`;
      }
      return `${who} updated ${entry.entity_type}`;
    case "toggle_active":
      return `${who} ${entry.details?.active ? "reopened" : "closed"} this job`;
    default:
      return `${who} ${entry.action.replace(/_/g, " ")}`;
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function ActivityFeed({ entries }: ActivityFeedProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-dark/40">No activity yet</p>;
  }

  return (
    <div className="space-y-0">
      {entries.map((entry, i) => (
        <div key={entry.id} className="flex gap-3 py-2.5">
          {/* Timeline dot + line */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-primary/40 mt-1.5" />
            {i < entries.length - 1 && (
              <div className="w-px flex-1 bg-light-gray mt-1" />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-dark/70 leading-snug">
              {formatAction(entry)}
            </p>
            <p className="text-[11px] text-dark/40 mt-0.5">
              {timeAgo(entry.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
