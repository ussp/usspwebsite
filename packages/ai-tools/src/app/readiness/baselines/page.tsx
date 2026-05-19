import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { listReadinessAssessments } from "@ussp-platform/core/queries/admin/readiness";
import { listImportBatches } from "@ussp-platform/core/queries/admin/survey-import";
import type { ReadinessAssessment, SurveyImport } from "@ussp-platform/core/types/ai-tools";

export const dynamic = "force-dynamic";

interface AssessmentWithImports {
  assessment: ReadinessAssessment;
  imports: SurveyImport[];
}

export default async function BaselinesListPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const assessments = await listReadinessAssessments();
  const withImports: AssessmentWithImports[] = await Promise.all(
    assessments.map(async (a) => ({
      assessment: a,
      imports: await listImportBatches(a.id),
    }))
  );
  const visible = withImports.filter((x) => x.imports.length > 0);

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Baseline Surveys</h1>
            <p className="text-sm text-dark/50 mt-1">
              Externally-collected survey data loaded into the readiness platform. Aggregates render
              role-segmented results (cohorts of 8+) and free-text samples.
            </p>
          </div>
          <Link
            href="/readiness/import"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            + Import Survey
          </Link>
        </div>

        {visible.length === 0 ? (
          <div className="bg-white rounded-lg border border-light-gray p-12 text-center">
            <p className="text-dark/40 mb-4">No imported surveys yet.</p>
            <Link
              href="/readiness/import"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Import a Survey
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-light-gray overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-light-gray/50 text-dark/60 text-left">
                  <th className="px-4 py-3 font-medium">Assessment</th>
                  <th className="px-4 py-3 font-medium">Imports</th>
                  <th className="px-4 py-3 font-medium">Responses loaded</th>
                  <th className="px-4 py-3 font-medium">Last imported</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray">
                {visible.map(({ assessment, imports }) => {
                  const totalLoaded = imports.reduce((s, i) => s + i.loaded_rows, 0);
                  const latest = imports[0]; // already ordered desc
                  return (
                    <tr key={assessment.id} className="hover:bg-light-gray/30">
                      <td className="px-4 py-3 font-medium">{assessment.name}</td>
                      <td className="px-4 py-3 text-dark/60">{imports.length}</td>
                      <td className="px-4 py-3 text-dark/60">{totalLoaded}</td>
                      <td className="px-4 py-3 text-dark/60">
                        {new Date(latest.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/readiness/baselines/${assessment.id}`}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          View report →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
