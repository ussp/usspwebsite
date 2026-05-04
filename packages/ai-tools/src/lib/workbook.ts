import * as XLSX from "xlsx";

// Offline-distribution workbook for questionnaires.
// Single-sheet layout so the parser is trivial:
//   Rows 1-8  human-readable header + instructions
//   Row 9    blank
//   Row 10   __METADATA__ marker
//   Rows 11-13  metadata key/value pairs
//   Row 14   blank
//   Row 15   __QUESTIONS__ marker (column headers on row 16)
//   Row 16+  question rows
//
// Respondent edits Score / Comment / N/A columns only; everything else is
// read-only context. question_id column is how import pairs rows to
// question_bank entries — preserved even if the respondent reorders rows.

export interface BuildWorkbookInput {
  assessment: { id: string; name: string };
  company: { name: string } | null;
  team: { name: string } | null;
  member: { name: string; email: string; role: string } | null;
  response: { id: string; token: string } | null;
  questionnaire: { id: string };
  questions: {
    sort_order: number;
    target_roles: string[];
    question_id: string;
    question: {
      question_text: string;
      description: string | null;
      category: string;
      anonymous_aggregate: boolean;
    };
  }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  dora_capability: "DORA Capability",
  ai_policy: "AI Policy",
  role_specific: "Role-Specific",
  workflow: "Workflow",
  workflow_pain_points: "Workflow Pain Points",
  ai_aspirations: "AI Aspirations",
  ai_sentiment: "AI Sentiment (Anonymous)",
};

export function buildWorkbook(input: BuildWorkbookInput): Buffer {
  const { assessment, company, team, member, response, questionnaire, questions } = input;

  const isTemplate = !response || !member;

  const rows: (string | number | null)[][] = [];

  rows.push(["USSP AI Readiness Assessment — Offline Response Template"]);
  rows.push([`Assessment: ${assessment.name}`]);
  rows.push([`Company: ${company?.name ?? ""}`]);
  rows.push([`Team: ${team?.name ?? ""}`]);
  rows.push([
    isTemplate
      ? "Respondent: TEMPLATE — fill in your name and email below, then complete questions"
      : `Respondent: ${member.name}`,
  ]);
  rows.push([`Email: ${member?.email ?? ""}`]);
  rows.push([
    "Instructions: For each question, enter a Score (1-5). Add an optional Comment. Mark N/A if the question doesn't apply. Do NOT edit the Sort, Category, Question, Description, or question_id columns.",
  ]);
  rows.push([
    "Anonymity: Answers to 'AI Sentiment (Anonymous)' questions are aggregated only — individual responses are never shown in reports.",
  ]);
  rows.push([]);
  rows.push(["__METADATA__"]);
  rows.push(["assessment_id", assessment.id]);
  rows.push(["questionnaire_id", questionnaire.id]);
  rows.push(["response_id", response?.id ?? ""]);
  rows.push([]);
  rows.push(["__QUESTIONS__"]);
  rows.push([
    "Sort",
    "Category",
    "Question",
    "Description",
    "Score (1-5)",
    "Comment",
    "N/A",
    "question_id",
  ]);

  for (const qq of questions) {
    const isUniversal = qq.target_roles.length === 0;
    const rolesNote = isUniversal ? "(Universal)" : `(Roles: ${qq.target_roles.join(", ")})`;
    const category = CATEGORY_LABELS[qq.question.category] || qq.question.category;
    const categoryLabel = qq.question.anonymous_aggregate
      ? `${category} — ANONYMOUS`
      : `${category} ${rolesNote}`.trim();

    rows.push([
      qq.sort_order,
      categoryLabel,
      qq.question.question_text,
      qq.question.description ?? "",
      "",
      "",
      "",
      qq.question_id,
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [
    { wch: 6 },
    { wch: 28 },
    { wch: 60 },
    { wch: 50 },
    { wch: 12 },
    { wch: 40 },
    { wch: 6 },
    { wch: 40 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Questionnaire");

  const out = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return Buffer.from(out);
}

export interface ParsedWorkbook {
  assessment_id: string;
  questionnaire_id: string;
  response_id: string | null;
  email: string | null;
  answers: {
    question_id: string;
    score: number | null;
    comment: string | null;
    flag: "not_applicable" | null;
  }[];
  warnings: string[];
}

export function parseWorkbook(buffer: Buffer): ParsedWorkbook {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheetName = wb.SheetNames.find((n) => n === "Questionnaire") ?? wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error("Workbook has no readable sheet");

  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, {
    header: 1,
    defval: "",
  });

  const warnings: string[] = [];

  let email: string | null = null;
  for (const r of rows.slice(0, 10)) {
    const first = String(r[0] ?? "");
    if (first.toLowerCase().startsWith("email:")) {
      const val = first.slice("email:".length).trim();
      if (val) email = val;
      break;
    }
  }

  const metaStart = rows.findIndex((r) => String(r[0] ?? "").trim() === "__METADATA__");
  const questionsStart = rows.findIndex((r) => String(r[0] ?? "").trim() === "__QUESTIONS__");

  if (metaStart < 0) throw new Error("Workbook missing __METADATA__ marker — is this a USSP questionnaire export?");
  if (questionsStart < 0) throw new Error("Workbook missing __QUESTIONS__ marker — is this a USSP questionnaire export?");

  const metaRows = rows.slice(metaStart + 1, questionsStart);
  const metaMap: Record<string, string> = {};
  for (const r of metaRows) {
    const key = String(r[0] ?? "").trim();
    const value = String(r[1] ?? "").trim();
    if (key) metaMap[key] = value;
  }

  const assessment_id = metaMap["assessment_id"];
  const questionnaire_id = metaMap["questionnaire_id"];
  const response_id = metaMap["response_id"] || null;

  if (!assessment_id || !questionnaire_id) {
    throw new Error("Workbook metadata missing assessment_id or questionnaire_id");
  }

  // Questions header is on questionsStart + 1, data on questionsStart + 2 onward
  const dataRows = rows.slice(questionsStart + 2);
  const answers: ParsedWorkbook["answers"] = [];

  for (const r of dataRows) {
    const question_id = String(r[7] ?? "").trim();
    if (!question_id) continue;

    const scoreRaw = r[4];
    const commentRaw = r[5];
    const flagRaw = String(r[6] ?? "").trim().toLowerCase();

    let score: number | null = null;
    if (scoreRaw !== "" && scoreRaw !== null && scoreRaw !== undefined) {
      const n = typeof scoreRaw === "number" ? scoreRaw : parseInt(String(scoreRaw), 10);
      if (!Number.isNaN(n) && n >= 1 && n <= 5) {
        score = n;
      } else {
        warnings.push(`Invalid score "${scoreRaw}" for question ${question_id}; expected 1-5`);
      }
    }

    const comment = commentRaw ? String(commentRaw).trim() : null;
    const flag: "not_applicable" | null = ["y", "yes", "na", "n/a", "x", "true", "1"].includes(flagRaw)
      ? "not_applicable"
      : null;

    if (score === null && !comment && !flag) continue;

    answers.push({
      question_id,
      score,
      comment: comment || null,
      flag,
    });
  }

  return { assessment_id, questionnaire_id, response_id, email, answers, warnings };
}
