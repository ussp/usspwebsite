// Pure helpers for parsing external survey exports (SurveyMonkey, CSV, etc.)
// No I/O — safe to import from both the loader script and the import API route.

import type {
  QuestionOption,
  QuestionType,
} from "../types/ai-tools.js";

// ── Likert / skill text → numeric maps ───────────────────────────────

export const LIKERT5: Record<string, number> = {
  "strongly disagree": 1,
  disagree: 2,
  neutral: 3,
  agree: 4,
  "strongly agree": 5,
};

export const SKILL5: Record<string, number> = {
  "no experience": 1,
  "aware but not practiced": 2,
  "can do with guidance": 3,
  "comfortable independently": 4,
  "could teach others": 5,
};

export function normText(v: unknown): string {
  if (v == null) return "";
  return String(v).trim().toLowerCase();
}

export function likertScore(v: unknown): number | null {
  return LIKERT5[normText(v)] ?? null;
}

export function skillScore(v: unknown): number | null {
  const n = normText(v);
  if (!n || n.startsWith("not applicable")) return null;
  return SKILL5[n] ?? null;
}

// ── Multi-choice option matching ─────────────────────────────────────

export function squash(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Map a raw cell value to one of the known option `value` codes.
 * Returns the option value on match, or a slugified fallback if no match.
 * Matching strategy:
 *   1. Squash-then-exact (collapses all non-alphanum) — handles spacing/punctuation drift
 *   2. Squash-then-contains — handles export prefixes/suffixes ("Selected: X")
 *   3. Slugified raw — preserves unmapped values without colliding with mapped codes
 */
export function matchOption(raw: string, options: QuestionOption[]): string | null {
  const n = squash(raw);
  if (!n) return null;

  for (const o of options) {
    if (squash(o.label) === n) return o.value;
  }
  for (const o of options) {
    const sq = squash(o.label);
    if (sq.length > 5 && (n.includes(sq) || sq.includes(n))) return o.value;
  }
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// ── Answer-row dispatch by question type ─────────────────────────────

export interface AnswerCellFields {
  score?: number | null;
  text_value?: string | null;
  choice_values?: string[];
  numeric_value?: number | null;
}

/**
 * Convert a single raw cell value into the appropriate response_answers
 * fields based on the question's declared type. Returns null fields when
 * the cell has nothing meaningful to record.
 */
export function buildAnswerFields(
  questionType: QuestionType,
  cell: string | number | null | undefined,
  options?: QuestionOption[],
  multiChoiceDelimiter = ";"
): AnswerCellFields | null {
  if (cell === undefined || cell === null || cell === "") return null;

  switch (questionType) {
    case "likert": {
      const n = typeof cell === "number" ? cell : Number(cell);
      if (Number.isFinite(n)) {
        const rounded = Math.round(n);
        if (rounded >= 1 && rounded <= 5) return { score: rounded };
      }
      // Fallback: text → 1-5
      const score = likertScore(cell);
      return score == null ? null : { score };
    }
    case "numeric": {
      const n = typeof cell === "number" ? cell : Number(cell);
      return Number.isFinite(n) ? { numeric_value: n } : null;
    }
    case "single_choice": {
      const raw = String(cell).trim();
      if (!raw) return null;
      const value = options ? matchOption(raw, options) : raw;
      return { choice_values: value ? [value] : [] };
    }
    case "multi_choice": {
      const raw = String(cell);
      const parts = raw
        .split(multiChoiceDelimiter)
        .map((p) => p.trim())
        .filter(Boolean);
      if (!parts.length) return null;
      const mapped = options
        ? parts.map((p) => matchOption(p, options) ?? p)
        : parts;
      const dedup = Array.from(new Set(mapped));
      return { choice_values: dedup };
    }
    case "free_text":
    default: {
      const text = String(cell).trim();
      if (!text) return null;
      // Skip common no-data sentinels
      if (
        ["unsure", "n/a", "na", "none", "-", ".", "open-ended response"].includes(
          text.toLowerCase()
        )
      ) {
        return null;
      }
      return { text_value: text };
    }
  }
}

// ── Aggregation helpers (pure math) ──────────────────────────────────

export interface LikertAggregateInput {
  score: number | null;
}

export interface LikertAggregate {
  n: number;
  mean: number | null;
  agree_plus_pct: number | null; // % >= 4
  strongly_agree_pct: number | null; // % == 5
}

export function aggregateLikert(answers: LikertAggregateInput[]): LikertAggregate {
  const scores = answers
    .map((a) => a.score)
    .filter((s): s is number => s != null);
  const n = scores.length;
  if (n === 0) {
    return { n: 0, mean: null, agree_plus_pct: null, strongly_agree_pct: null };
  }
  const mean = scores.reduce((a, b) => a + b, 0) / n;
  const agree = (scores.filter((s) => s >= 4).length / n) * 100;
  const strongly = (scores.filter((s) => s === 5).length / n) * 100;
  return { n, mean, agree_plus_pct: agree, strongly_agree_pct: strongly };
}

export interface NumericAggregateInput {
  numeric_value: number | null;
}

export function aggregateNumeric(
  answers: NumericAggregateInput[]
): { n: number; mean: number | null } {
  const vals = answers
    .map((a) => a.numeric_value)
    .filter((v): v is number => v != null);
  const n = vals.length;
  if (n === 0) return { n: 0, mean: null };
  return { n, mean: vals.reduce((a, b) => a + b, 0) / n };
}

export interface RoleSplitAnswer {
  score?: number | null;
  numeric_value?: number | null;
  response_id: string;
}

export interface RoleSplitRow {
  role: string;
  n: number;
  mean: number;
}

/**
 * Split answers by respondent role and compute mean. Cohorts smaller than
 * minCohortSize are excluded. Sorted by mean desc.
 */
export function aggregateByRole(
  answers: RoleSplitAnswer[],
  responseRoles: Map<string, string | null>,
  valueField: "score" | "numeric_value",
  minCohortSize = 8
): RoleSplitRow[] {
  const byRole = new Map<string, number[]>();
  for (const a of answers) {
    const role = responseRoles.get(a.response_id);
    if (!role) continue;
    const v = valueField === "score" ? a.score : a.numeric_value;
    if (v == null) continue;
    if (!byRole.has(role)) byRole.set(role, []);
    byRole.get(role)!.push(v);
  }
  const out: RoleSplitRow[] = [];
  for (const [role, vals] of byRole.entries()) {
    if (vals.length < minCohortSize) continue;
    out.push({
      role,
      n: vals.length,
      mean: vals.reduce((s, v) => s + v, 0) / vals.length,
    });
  }
  return out.sort((a, b) => b.mean - a.mean);
}

export interface MultiChoiceAnswer {
  response_id: string;
  choice_values: string[] | null;
}

export interface DistributionRow {
  value: string;
  label: string;
  count: number;
  pct: number;
}

/**
 * Tally selections across choice_values arrays. Denominator is the supplied
 * `totalRespondents` (matches survey-report convention: % of all respondents,
 * not % of question-answerers).
 */
export function aggregateMultiChoice(
  answers: MultiChoiceAnswer[],
  totalRespondents: number,
  options: QuestionOption[]
): DistributionRow[] {
  const tally = new Map<string, number>();
  for (const a of answers) {
    for (const v of a.choice_values || []) {
      tally.set(v, (tally.get(v) ?? 0) + 1);
    }
  }
  const labelOf = new Map(options.map((o) => [o.value, o.label]));
  const n = totalRespondents || 1;
  return Array.from(tally.entries())
    .map(([value, count]) => ({
      value,
      label: labelOf.get(value) ?? value,
      count,
      pct: (count / n) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}
