import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import GuideBanner from "@/components/GuideBanner";
import { listReadinessAssessments } from "@ussp-platform/core/queries/admin/readiness";
import type { ReadinessAssessment } from "@ussp-platform/core";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  collecting: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default async function ReadinessListPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const assessments = await listReadinessAssessments();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">AI Readiness Assessments</h1>
            <p className="text-sm text-dark/50 mt-1">
              Assess organizational readiness for AI adoption based on the DORA 2025 AI Capabilities Model.
            </p>
          </div>
          <Link
            href="/readiness/new"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            + New Assessment
          </Link>
        </div>

        <GuideBanner title="How it works" variant="info">
          <p>
            Each assessment collects company context, team details, and AI policy information.
            A custom questionnaire is generated and distributed to team members via email.
            Responses are aggregated into a readiness report with tier assignment and blockers.
          </p>
        </GuideBanner>

        {assessments.length === 0 ? (
          <div className="bg-white rounded-lg border border-light-gray p-12 text-center">
            <p className="text-dark/40 mb-4">No assessments yet.</p>
            <Link
              href="/readiness/new"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Create Your First Assessment
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-light-gray overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-light-gray/50 text-dark/60 text-left">
                  <th className="px-4 py-3 font-medium">Assessment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Deadline</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray">
                {assessments.map((a: ReadinessAssessment) => (
                  <tr key={a.id} className="hover:bg-light-gray/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/readiness/${a.id}/company`} className="text-primary hover:underline font-medium">
                        {a.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[a.status] || "bg-gray-100 text-gray-700"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-dark/50">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-dark/50">
                      {a.deadline ? new Date(a.deadline).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/readiness/${a.id}/company`}
                          className="text-xs text-primary hover:underline"
                        >
                          Continue
                        </Link>
                        {a.status === "completed" && (
                          <>
                            <span className="text-dark/20">|</span>
                            <Link
                              href={`/readiness/${a.id}/report`}
                              className="text-xs text-emerald-600 hover:underline"
                            >
                              Report
                            </Link>
                            <span className="text-dark/20">|</span>
                            <Link
                              href={`/readiness/new?reassess=${a.id}`}
                              className="text-xs text-amber-600 hover:underline"
                            >
                              Re-assess
                            </Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
