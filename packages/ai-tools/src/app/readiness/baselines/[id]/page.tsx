import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { getReadinessAssessment } from "@ussp-platform/core/queries/admin/readiness";
import { listImportBatches } from "@ussp-platform/core/queries/admin/survey-import";
import {
  getAssessmentAggregateByQuestion,
  getAssessmentAggregateByQuestionAndRole,
  getMultiChoiceDistribution,
  getFreeTextSamples,
  getBaselineSummary,
  type QuestionAggregate,
} from "@ussp-platform/core/queries/admin/baseline-report";

export const dynamic = "force-dynamic";

const MIN_COHORT_SIZE = 8;
const FREE_TEXT_SAMPLES = 5;

const CATEGORY_LABEL: Record<string, string> = {
  attitude: "Attitudes toward AI adoption",
  ai_skill: "AI skill self-rating",
  governance: "Governance awareness",
  tool_usage: "Tool mix and SDLC application",
  constraints: "Constraints on current AI use",
  outcome: "Self-reported outcomes",
  devex: "DevEx / SPACE baseline",
  free_text: "In the team's own words",
};

export default async function BaselineReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const assessment = await getReadinessAssessment(id);
  if (!assessment) notFound();

  const [summary, imports, aggregates] = await Promise.all([
    getBaselineSummary(id),
    listImportBatches(id),
    getAssessmentAggregateByQuestion(id),
  ]);

  // Group aggregates by category
  const byCategory = new Map<string, QuestionAggregate[]>();
  for (const a of aggregates) {
    const key = a.category || "other";
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(a);
  }

  // Identify which questions need extra drill-downs
  const multiChoiceQs = aggregates.filter((a) => a.question_type === "multi_choice");
  const singleChoiceQs = aggregates.filter((a) => a.question_type === "single_choice");
  const freeTextQs = aggregates.filter((a) => a.question_type === "free_text");
  const likertQs = aggregates.filter((a) => a.question_type === "likert");

  // Pre-fetch role splits for top-5 Likert by sample size
  const topLikert = [...likertQs]
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);
  const roleSplits = await Promise.all(
    topLikert.map(async (q) => ({
      qid: q.question_id,
      rows: await getAssessmentAggregateByQuestionAndRole(id, q.question_id, MIN_COHORT_SIZE),
    }))
  );
  const roleSplitMap = new Map(roleSplits.map((r) => [r.qid, r.rows]));

  // Pre-fetch distributions
  const distributions = await Promise.all(
    [...multiChoiceQs, ...singleChoiceQs].map(async (q) => ({
      qid: q.question_id,
      rows: await getMultiChoiceDistribution(id, q.question_id),
    }))
  );
  const distMap = new Map(distributions.map((d) => [d.qid, d.rows]));

  // Pre-fetch free-text samples
  const freeText = await Promise.all(
    freeTextQs.map(async (q) => ({
      qid: q.question_id,
      text: q.question_text,
      samples: await getFreeTextSamples(id, q.question_id, FREE_TEXT_SAMPLES),
    }))
  );

  const latestImport = imports[0];

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">{assessment.name}</h1>
          <p className="text-sm text-dark/50 mt-1">
            Baseline survey report · {summary.total_responses} responses · {summary.total_questions} questions
            {latestImport && (
              <span> · Last imported {new Date(latestImport.created_at).toLocaleDateString()}</span>
            )}
          </p>
        </header>

        {/* Summary card */}
        <section className="bg-white rounded-lg border border-light-gray p-6 mb-6">
          <h2 className="font-medium mb-3">Population</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <Stat label="Total responses" value={summary.total_responses} />
            <Stat label="Questions" value={summary.total_questions} />
            <Stat label="Roles covered" value={summary.role_breakdown.length} />
            <Stat label="Import batches" value={imports.length} />
          </div>
          {summary.role_breakdown.length > 0 && (
            <div className="text-xs text-dark/60">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-dark/40">
                    <th className="pb-1 font-medium">Role</th>
                    <th className="pb-1 font-medium text-right">n</th>
                    <th className="pb-1 font-medium text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-gray">
                  {summary.role_breakdown.map((r) => (
                    <tr key={r.role}>
                      <td className="py-1">{r.role}</td>
                      <td className="py-1 text-right">{r.n}</td>
                      <td className="py-1 text-right">{r.pct.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Findings by category */}
        {Array.from(byCategory.entries()).map(([cat, items]) => (
          <section key={cat} className="bg-white rounded-lg border border-light-gray p-6 mb-6">
            <h2 className="font-medium mb-4">{CATEGORY_LABEL[cat] || cat}</h2>
            <div className="space-y-6">
              {items.map((q) => (
                <QuestionBlock
                  key={q.question_id}
                  q={q}
                  roleSplit={roleSplitMap.get(q.question_id)}
                  distribution={distMap.get(q.question_id)}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Free-text samples — own section */}
        {freeText.some((f) => f.samples.length > 0) && (
          <section className="bg-white rounded-lg border border-light-gray p-6 mb-6">
            <h2 className="font-medium mb-4">{CATEGORY_LABEL.free_text}</h2>
            <div className="space-y-6">
              {freeText
                .filter((f) => f.samples.length > 0)
                .map((f) => (
                  <div key={f.qid}>
                    <p className="text-sm font-medium mb-2">{f.text}</p>
                    <ul className="space-y-2">
                      {f.samples.map((s) => (
                        <li key={s.response_id} className="text-sm text-dark/70 border-l-2 border-primary/30 pl-3 italic">
                          &ldquo;{s.text}&rdquo;
                          {s.role && <span className="not-italic text-xs text-dark/40 ml-2">— {s.role}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </section>
        )}

        {imports.length > 0 && (
          <section className="bg-white rounded-lg border border-light-gray p-6 text-xs text-dark/50">
            <h2 className="font-medium text-sm text-dark mb-3">Import history</h2>
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-1 font-medium">Date</th>
                  <th className="pb-1 font-medium">Source</th>
                  <th className="pb-1 font-medium">File</th>
                  <th className="pb-1 font-medium text-right">Loaded</th>
                  <th className="pb-1 font-medium text-right">Skipped</th>
                  <th className="pb-1 font-medium text-right">Errors</th>
                  <th className="pb-1 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray">
                {imports.map((b) => (
                  <tr key={b.id}>
                    <td className="py-1">{new Date(b.created_at).toLocaleDateString()}</td>
                    <td className="py-1">{b.source}</td>
                    <td className="py-1 font-mono">{b.file_name || "—"}</td>
                    <td className="py-1 text-right">{b.loaded_rows}</td>
                    <td className="py-1 text-right">{b.skipped_rows}</td>
                    <td className="py-1 text-right">{b.error_rows}</td>
                    <td className="py-1">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-dark/50">{label}</div>
    </div>
  );
}

function QuestionBlock({
  q,
  roleSplit,
  distribution,
}: {
  q: QuestionAggregate;
  roleSplit?: Array<{ role: string; n: number; mean: number | null }>;
  distribution?: Array<{ value: string; label: string; count: number; pct: number }>;
}) {
  return (
    <div>
      <div className="flex items-start justify-between mb-2 gap-3">
        <p className="text-sm font-medium flex-1">{q.question_text}</p>
        <span className="text-xs text-dark/40 whitespace-nowrap">n = {q.n}</span>
      </div>

      {(q.question_type === "likert" || q.question_type === "numeric") && q.mean != null && (
        <div className="flex gap-6 text-xs text-dark/60 mb-2">
          <span>Mean: <b>{q.mean.toFixed(2)}</b></span>
          {q.agree_plus_pct != null && (
            <span>Agree+ (≥4): <b>{q.agree_plus_pct.toFixed(0)}%</b></span>
          )}
          {q.strongly_agree_pct != null && (
            <span>Strongly agree (=5): <b>{q.strongly_agree_pct.toFixed(0)}%</b></span>
          )}
        </div>
      )}

      {roleSplit && roleSplit.length > 0 && (
        <div className="ml-3 mt-2 text-xs text-dark/60">
          <p className="font-medium mb-1">By role (n ≥ 8):</p>
          <table className="w-full max-w-md">
            <tbody className="divide-y divide-light-gray">
              {roleSplit.map((r) => (
                <tr key={r.role}>
                  <td className="py-0.5">{r.role}</td>
                  <td className="py-0.5 text-right text-dark/40">n={r.n}</td>
                  <td className="py-0.5 text-right">
                    <b>{r.mean?.toFixed(2)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {distribution && distribution.length > 0 && (
        <div className="ml-3 mt-2 text-xs text-dark/60">
          <table className="w-full max-w-md">
            <tbody className="divide-y divide-light-gray">
              {distribution.map((d) => (
                <tr key={d.value}>
                  <td className="py-0.5">{d.label}</td>
                  <td className="py-0.5 text-right text-dark/40">{d.count}</td>
                  <td className="py-0.5 text-right">
                    <b>{d.pct.toFixed(0)}%</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
