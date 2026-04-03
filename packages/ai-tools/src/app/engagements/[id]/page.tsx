"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import StatusBadge from "@/components/StatusBadge";
import EngagementTimeline from "@/components/EngagementTimeline";
import type { EngagementDetail, EngagementStatus, TeamMemberRole } from "@ussp-platform/core";
import { TEAM_MEMBER_ROLE_LABELS } from "@ussp-platform/core";

export default function EngagementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [engagement, setEngagement] = useState<EngagementDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/engagements/${id}`)
      .then((r) => r.json())
      .then(setEngagement)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-dark/40">Loading...</p>
        </main>
      </>
    );
  }

  if (!engagement) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-danger">Engagement not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{engagement.name}</h1>
            <p className="text-sm text-dark/50 mt-1">
              Client: {engagement.client_name}
              {engagement.lead_name && <> &middot; Lead: {engagement.lead_name}</>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/engagements/${id}/settings`}
              className="px-3 py-1.5 text-xs rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
            >
              Integration Settings
            </Link>
            <StatusBadge status={engagement.status as EngagementStatus} />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <EngagementTimeline currentStatus={engagement.status as EngagementStatus} />
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Teams</h2>
          <Link
            href={`/engagements/${id}/teams/new`}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            Add Team
          </Link>
        </div>

        {engagement.teams.length === 0 ? (
          <div className="bg-white rounded-lg border border-light-gray p-8 text-center">
            <p className="text-sm text-dark/40">
              No teams yet. Add a team to begin the assessment process.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engagement.teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg border border-light-gray p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{team.name}</h3>
                  <span className="text-xs text-dark/40">{team.team_size} members</span>
                </div>

                {/* Members */}
                {team.members.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {team.members.map((m) => (
                      <span
                        key={m.id}
                        className="inline-block px-2 py-0.5 rounded text-xs bg-light-gray text-dark/60"
                      >
                        {m.display_name} ({TEAM_MEMBER_ROLE_LABELS[m.role as TeamMemberRole] || m.role})
                      </span>
                    ))}
                  </div>
                )}

                {/* Assessment status */}
                <div className="flex items-center gap-4 text-xs text-dark/50 mb-4">
                  <span>
                    Baseline: {team.baseline ? (
                      <span className="text-success font-medium">
                        {(team.baseline as unknown as Record<string, unknown>).status === "completed" ? "Complete" : "In Progress"}
                      </span>
                    ) : (
                      <span className="text-dark/30">Not started</span>
                    )}
                  </span>
                  <span>
                    Post: {team.post_training ? (
                      <span className="text-success font-medium">
                        {(team.post_training as unknown as Record<string, unknown>).status === "completed" ? "Complete" : "In Progress"}
                      </span>
                    ) : (
                      <span className="text-dark/30">Not started</span>
                    )}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/engagements/${id}/teams/${team.id}/baseline`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
                  >
                    Baseline
                  </Link>
                  <Link
                    href={`/engagements/${id}/teams/${team.id}/survey?type=baseline`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
                  >
                    Survey
                  </Link>
                  <Link
                    href={`/engagements/${id}/teams/${team.id}/training-plan`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
                  >
                    Training Plan
                  </Link>
                  <Link
                    href={`/engagements/${id}/teams/${team.id}/post-training`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
                  >
                    Post-Training
                  </Link>
                  <Link
                    href={`/engagements/${id}/teams/${team.id}/report`}
                    className="px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
