export const dynamic = "force-dynamic";

import { getCandidates } from "@ussp-platform/core/queries/admin/candidates";
import { getAssignments } from "@ussp-platform/core/queries/admin/assignments";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { BenchList } from "./bench-list";

export const metadata = { title: "Bench" };

export default async function BenchPage() {
  const [allCandidates, allAssignments] = await Promise.all([
    getCandidates({}),
    getAssignments({ status: "active" }),
  ]);

  // Internal employees on bench (available, not on assignment)
  const onBench = allCandidates.filter(
    (c) =>
      c.candidate_type === "internal_employee" &&
      c.current_status === "available"
  );

  // Internal employees on active assignments (with end dates)
  const internalOnAssignment = allCandidates.filter(
    (c) =>
      c.candidate_type === "internal_employee" &&
      c.current_status === "on_assignment"
  );

  // Build assignment info for each candidate
  const assignmentMap = new Map<
    string,
    { role_title: string; end_date: string | null; client_name?: string; end_client_name?: string }
  >();
  for (const a of allAssignments) {
    // Keep the one with the earliest end_date per candidate
    if (!assignmentMap.has(a.candidate_id) || (a.end_date && (!assignmentMap.get(a.candidate_id)!.end_date || a.end_date < assignmentMap.get(a.candidate_id)!.end_date!))) {
      assignmentMap.set(a.candidate_id, {
        role_title: a.role_title,
        end_date: a.end_date,
        client_name: a.client_name,
        end_client_name: a.end_client_name,
      });
    }
  }

  // Enrich candidates with assignment info and sort by end_date (soonest first)
  const comingOff = internalOnAssignment
    .map((c) => ({
      ...c,
      assignment: assignmentMap.get(c.id) || null,
    }))
    .sort((a, b) => {
      const aEnd = a.assignment?.end_date
        ? new Date(a.assignment.end_date).getTime()
        : Infinity;
      const bEnd = b.assignment?.end_date
        ? new Date(b.assignment.end_date).getTime()
        : Infinity;
      return aEnd - bEnd;
    });

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Bench Management</h2>
          <p className="text-sm text-dark/50 mt-1">
            Internal employees needing placement — prioritize finding positions for these resources.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-red-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 text-lg font-bold">
                {onBench.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700">On Bench Now</p>
                <p className="text-xs text-dark/50">Need immediate placement</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-amber-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 text-lg font-bold">
                {comingOff.filter(
                  (c) =>
                    c.assignment?.end_date &&
                    new Date(c.assignment.end_date).getTime() -
                      Date.now() <
                      30 * 24 * 60 * 60 * 1000
                ).length}
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-700">Ending in 30 days</p>
                <p className="text-xs text-dark/50">Start looking for next role</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-blue-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-lg font-bold">
                {comingOff.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700">On Assignment</p>
                <p className="text-xs text-dark/50">Internal employees placed</p>
              </div>
            </div>
          </div>
        </div>

        <BenchList onBench={onBench} comingOff={comingOff} />
      </main>
    </>
  );
}
