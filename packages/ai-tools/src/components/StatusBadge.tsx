import {
  ENGAGEMENT_STATUS_LABELS,
  ENGAGEMENT_STATUS_COLORS,
} from "@ussp-platform/core";
import type { EngagementStatus } from "@ussp-platform/core";

interface StatusBadgeProps {
  status: EngagementStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = ENGAGEMENT_STATUS_LABELS[status] || status;
  const color = ENGAGEMENT_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
