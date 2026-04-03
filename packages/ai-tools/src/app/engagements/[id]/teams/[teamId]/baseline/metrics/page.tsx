"use client";

import { useParams } from "next/navigation";
import MetricsEntryForm from "@/components/MetricsEntryForm";

export default function BaselineMetricsPage() {
  const { id: engagementId, teamId } = useParams<{ id: string; teamId: string }>();

  return (
    <MetricsEntryForm
      engagementId={engagementId}
      teamId={teamId}
      assessmentType="baseline"
    />
  );
}
