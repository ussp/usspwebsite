"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

type QuestionType = "likert" | "single_choice" | "multi_choice" | "numeric" | "free_text";
type ResponseSource = "surveymonkey" | "csv_import" | "manual";
type Demographic = "ignore" | "external_id" | "role" | "email";

interface AssessmentLite {
  id: string;
  name: string;
  status: string;
}

interface QuestionLite {
  id: string;
  question_text: string;
  category: string;
  question_type?: QuestionType;
}

interface ColumnMapping {
  column: string;
  role: "question" | Demographic;
  question_id?: string;
  question_type?: QuestionType;
  value_delimiter?: string;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "likert", label: "Likert 1–5" },
  { value: "single_choice", label: "Single choice" },
  { value: "multi_choice", label: "Multi-select" },
  { value: "numeric", label: "Numeric" },
  { value: "free_text", label: "Free text" },
];

export default function SurveyImportPage() {
  const router = useRouter();

  // Step state
  const [assessments, setAssessments] = useState<AssessmentLite[]>([]);
  const [questions, setQuestions] = useState<QuestionLite[]>([]);
  const [assessmentId, setAssessmentId] = useState("");
  const [source, setSource] = useState<ResponseSource>("surveymonkey");

  const [fileName, setFileName] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string | number | null>[]>([]);
  const [mappings, setMappings] = useState<Record<string, ColumnMapping>>({});

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ loaded: number; skipped: number; errors: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const [aRes, qRes] = await Promise.all([
        fetch("/api/readiness"),
        fetch("/api/readiness/questions?status=active"),
      ]);
      if (aRes.ok) setAssessments(await aRes.json());
      if (qRes.ok) setQuestions(await qRes.json());
    })();
  }, []);

  async function onFile(file: File) {
    setFileName(file.name);
    setError("");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const firstSheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, string | number | null>>(firstSheet, {
      defval: null,
      raw: false,
    });
    if (!json.length) {
      setError("Workbook is empty");
      return;
    }
    const cols = Object.keys(json[0]);
    setColumns(cols);
    setRows(json);
    // Default every column to "ignore"
    const initial: Record<string, ColumnMapping> = {};
    for (const c of cols) initial[c] = { column: c, role: "ignore" };
    setMappings(initial);
  }

  function updateMapping(col: string, patch: Partial<ColumnMapping>) {
    setMappings((m) => ({ ...m, [col]: { ...m[col], ...patch } }));
  }

  async function submit() {
    if (!assessmentId) { setError("Pick an assessment"); return; }
    if (!rows.length) { setError("Upload a file first"); return; }

    setSubmitting(true);
    setError("");

    const mappedQuestions: Array<{
      column: string;
      question_id: string;
      question_type: QuestionType;
      value_delimiter?: string;
    }> = [];
    let external_id_col: string | undefined;
    let role_col: string | undefined;
    let email_col: string | undefined;

    for (const col of columns) {
      const m = mappings[col];
      if (m.role === "question" && m.question_id && m.question_type) {
        mappedQuestions.push({
          column: col,
          question_id: m.question_id,
          question_type: m.question_type,
          ...(m.question_type === "multi_choice" && m.value_delimiter
            ? { value_delimiter: m.value_delimiter }
            : {}),
        });
      } else if (m.role === "external_id") external_id_col = col;
      else if (m.role === "role") role_col = col;
      else if (m.role === "email") email_col = col;
    }

    if (!mappedQuestions.length) {
      setError("Map at least one column to a question");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/survey-import/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          source,
          fileName,
          columnMap: {
            external_id_col,
            role_col,
            email_col,
            questions: mappedQuestions,
          },
          rows,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setResult({
        loaded: data.loaded,
        skipped: data.skipped,
        errors: (data.errors || []).length ?? data.error_rows ?? 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-2">Import External Survey</h1>
        <p className="text-sm text-dark/50 mb-6">
          Upload an xlsx/csv export from SurveyMonkey, Forms, or a similar tool. Map each column to a
          question in the bank or a demographic field, then commit. Anonymous responses are supported —
          email matching is best-effort against existing assessment members.
        </p>

        {result ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
            <h2 className="font-medium text-emerald-900 mb-2">Import complete</h2>
            <ul className="text-sm text-emerald-900 space-y-1">
              <li>Loaded: <b>{result.loaded}</b></li>
              <li>Skipped (duplicate external_id): <b>{result.skipped}</b></li>
              <li>Errors: <b>{result.errors}</b></li>
            </ul>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => router.push(`/readiness/baselines/${assessmentId}`)}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"
              >
                View report
              </button>
              <button
                onClick={() => { setResult(null); setRows([]); setColumns([]); setFileName(""); }}
                className="text-sm text-dark/60 hover:text-dark"
              >
                Import another
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Assessment + source */}
            <section className="bg-white rounded-lg border border-light-gray p-6">
              <h2 className="font-medium mb-4">1. Target assessment</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Assessment</label>
                  <select
                    value={assessmentId}
                    onChange={(e) => setAssessmentId(e.target.value)}
                    className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">— Select —</option>
                    {assessments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as ResponseSource)}
                    className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="surveymonkey">SurveyMonkey</option>
                    <option value="csv_import">CSV / other</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Step 2: Upload */}
            <section className="bg-white rounded-lg border border-light-gray p-6">
              <h2 className="font-medium mb-4">2. Upload file</h2>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
                className="text-sm"
              />
              {fileName && (
                <p className="text-xs text-dark/50 mt-2">
                  Parsed <b>{rows.length}</b> rows from <b>{fileName}</b> · {columns.length} columns
                </p>
              )}
            </section>

            {/* Step 3: Map columns */}
            {columns.length > 0 && (
              <section className="bg-white rounded-lg border border-light-gray p-6">
                <h2 className="font-medium mb-4">3. Map columns</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-light-gray/50 text-dark/60 text-left">
                      <tr>
                        <th className="px-3 py-2 font-medium">Column</th>
                        <th className="px-3 py-2 font-medium">Sample</th>
                        <th className="px-3 py-2 font-medium">Map to</th>
                        <th className="px-3 py-2 font-medium">Question / Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-gray">
                      {columns.map((col) => {
                        const m = mappings[col];
                        const sample = rows.find((r) => r[col] != null)?.[col] ?? "";
                        return (
                          <tr key={col}>
                            <td className="px-3 py-2 font-mono text-xs">{col}</td>
                            <td className="px-3 py-2 text-xs text-dark/60 max-w-xs truncate" title={String(sample)}>
                              {String(sample).slice(0, 60)}
                            </td>
                            <td className="px-3 py-2">
                              <select
                                value={m.role}
                                onChange={(e) => updateMapping(col, { role: e.target.value as ColumnMapping["role"] })}
                                className="border border-light-gray rounded px-2 py-1 text-xs"
                              >
                                <option value="ignore">Ignore</option>
                                <option value="question">Question</option>
                                <option value="external_id">External ID</option>
                                <option value="role">Role</option>
                                <option value="email">Email</option>
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              {m.role === "question" && (
                                <div className="flex gap-2">
                                  <select
                                    value={m.question_id || ""}
                                    onChange={(e) => updateMapping(col, { question_id: e.target.value })}
                                    className="border border-light-gray rounded px-2 py-1 text-xs flex-1 max-w-xs"
                                  >
                                    <option value="">— Question —</option>
                                    {questions.map((q) => (
                                      <option key={q.id} value={q.id}>
                                        {q.question_text.slice(0, 70)}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    value={m.question_type || "likert"}
                                    onChange={(e) => updateMapping(col, { question_type: e.target.value as QuestionType })}
                                    className="border border-light-gray rounded px-2 py-1 text-xs"
                                  >
                                    {QUESTION_TYPES.map((t) => (
                                      <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                  </select>
                                  {m.question_type === "multi_choice" && (
                                    <input
                                      type="text"
                                      placeholder="delim"
                                      value={m.value_delimiter || ";"}
                                      onChange={(e) => updateMapping(col, { value_delimiter: e.target.value })}
                                      className="border border-light-gray rounded px-2 py-1 text-xs w-16"
                                    />
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            {columns.length > 0 && (
              <button
                onClick={submit}
                disabled={submitting || !assessmentId}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                {submitting ? "Importing…" : "Import"}
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
}
