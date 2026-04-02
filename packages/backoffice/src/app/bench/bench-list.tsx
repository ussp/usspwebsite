"use client";

import { useRouter } from "next/navigation";
import type { AdminCandidate } from "@ussp-platform/core/types/admin";

interface AssignmentInfo {
  role_title: string;
  end_date: string | null;
  client_name?: string;
  end_client_name?: string;
}

interface CandidateWithAssignment extends AdminCandidate {
  assignment: AssignmentInfo | null;
}

function daysUntil(dateStr: string): number {
  return Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

function UrgencyBadge({ days }: { days: number }) {
  if (days < 0) {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">
        Overdue ({Math.abs(days)}d past)
      </span>
    );
  }
  if (days <= 14) {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">
        {days}d left
      </span>
    );
  }
  if (days <= 30) {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
        {days}d left
      </span>
    );
  }
  if (days <= 60) {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-700">
        {days}d left
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600">
      {days}d left
    </span>
  );
}

function WorkPrefBadge({ pref }: { pref: string | null }) {
  if (!pref) return null;
  const labels: Record<string, string> = {
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "On-site",
    open_to_travel: "Travel OK",
  };
  return (
    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600">
      {labels[pref] || pref}
    </span>
  );
}

export function BenchList({
  onBench,
  comingOff,
}: {
  onBench: AdminCandidate[];
  comingOff: CandidateWithAssignment[];
}) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Section 1: On Bench NOW */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <h3 className="font-semibold text-lg">
            On Bench ({onBench.length})
          </h3>
          <span className="text-xs text-dark/40">
            Available now — need immediate placement
          </span>
        </div>

        {onBench.length === 0 ? (
          <div className="bg-white rounded-lg border border-light-gray p-8 text-center">
            <p className="text-dark/40">No internal employees on bench</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-light-gray overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-dark/50 border-b border-light-gray bg-gray-50/50">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Work Pref</th>
                  <th className="px-4 py-3 font-medium">Rate</th>
                  <th className="px-4 py-3 font-medium">On Bench Since</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {onBench.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-light-gray/50 last:border-0 hover:bg-light-gray/30 cursor-pointer transition-colors"
                    onClick={() => router.push(`/candidates/${c.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{c.full_name}</p>
                        <p className="text-xs text-dark/40">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark/70">
                      {c.location || (
                        <span className="text-dark/30">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <WorkPrefBadge pref={c.work_preference} />
                    </td>
                    <td className="px-4 py-3 text-sm text-dark/70">
                      {c.salary_expectation_min || c.salary_expectation_max ? (
                        <span>
                          ${c.salary_expectation_min || "?"}
                          {c.salary_expectation_max
                            ? `-$${c.salary_expectation_max}`
                            : ""}
                          {c.salary_type === "hourly" ? "/hr" : "/yr"}
                        </span>
                      ) : (
                        <span className="text-dark/30">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark/50">
                      {c.updated_at
                        ? new Date(c.updated_at).toLocaleDateString()
                        : new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/positions?matchCandidate=${c.id}`);
                        }}
                        className="px-3 py-1.5 text-xs border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
                      >
                        Find Positions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Coming Off Assignment */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <h3 className="font-semibold text-lg">
            Coming Off Assignment ({comingOff.length})
          </h3>
          <span className="text-xs text-dark/40">
            Assignments ending — plan next placement
          </span>
        </div>

        {comingOff.length === 0 ? (
          <div className="bg-white rounded-lg border border-light-gray p-8 text-center">
            <p className="text-dark/40">
              No internal employees on active assignments
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-light-gray overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-dark/50 border-b border-light-gray bg-gray-50/50">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Current Role</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Ends</th>
                  <th className="px-4 py-3 font-medium">Urgency</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {comingOff.map((c) => {
                  const days = c.assignment?.end_date
                    ? daysUntil(c.assignment.end_date)
                    : null;
                  return (
                    <tr
                      key={c.id}
                      className={`border-b border-light-gray/50 last:border-0 hover:bg-light-gray/30 cursor-pointer transition-colors ${
                        days !== null && days <= 14
                          ? "bg-red-50/30"
                          : days !== null && days <= 30
                            ? "bg-amber-50/30"
                            : ""
                      }`}
                      onClick={() => router.push(`/candidates/${c.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{c.full_name}</p>
                          <p className="text-xs text-dark/40">{c.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-dark/70">
                        {c.assignment?.role_title || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-dark/70">
                        {c.assignment?.end_client_name ||
                          c.assignment?.client_name ||
                          "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-dark/70">
                        {c.location || (
                          <span className="text-dark/30">Not set</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {c.assignment?.end_date
                          ? new Date(
                              c.assignment.end_date
                            ).toLocaleDateString()
                          : <span className="text-dark/30">No end date</span>}
                      </td>
                      <td className="px-4 py-3">
                        {days !== null ? (
                          <UrgencyBadge days={days} />
                        ) : (
                          <span className="text-xs text-dark/30">
                            Ongoing
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {days !== null && days <= 60 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/positions?matchCandidate=${c.id}`
                              );
                            }}
                            className="px-3 py-1.5 text-xs border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
                          >
                            Find Next Role
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
