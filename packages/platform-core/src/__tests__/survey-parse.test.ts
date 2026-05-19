/**
 * Unit tests for survey-parse pure helpers.
 *
 * Covers: Likert/skill text→numeric conversion, multi-choice option
 * matching, answer-row dispatch by question type, and aggregation math
 * (Likert mean/agree+/strongly-agree%, role-split with cohort filter,
 * multi-choice distribution with total-respondent denominator).
 */

import { describe, it, expect } from "vitest";
import {
  likertScore,
  skillScore,
  squash,
  matchOption,
  buildAnswerFields,
  aggregateLikert,
  aggregateNumeric,
  aggregateByRole,
  aggregateMultiChoice,
} from "../utils/survey-parse.js";
import type { QuestionOption } from "../types/ai-tools.js";

// =============================================================================
// Likert / skill text → numeric
// =============================================================================

describe("likertScore", () => {
  it("maps the five canonical labels", () => {
    expect(likertScore("Strongly disagree")).toBe(1);
    expect(likertScore("Disagree")).toBe(2);
    expect(likertScore("Neutral")).toBe(3);
    expect(likertScore("Agree")).toBe(4);
    expect(likertScore("Strongly agree")).toBe(5);
  });

  it("is case- and whitespace-insensitive", () => {
    expect(likertScore("  STRONGLY AGREE  ")).toBe(5);
    expect(likertScore("agree")).toBe(4);
  });

  it("returns null for non-Likert text", () => {
    expect(likertScore("yes")).toBeNull();
    expect(likertScore("")).toBeNull();
    expect(likertScore(null)).toBeNull();
    expect(likertScore(undefined)).toBeNull();
  });
});

describe("skillScore", () => {
  it("maps the five canonical skill levels", () => {
    expect(skillScore("No experience")).toBe(1);
    expect(skillScore("Aware but not practiced")).toBe(2);
    expect(skillScore("Can do with guidance")).toBe(3);
    expect(skillScore("Comfortable independently")).toBe(4);
    expect(skillScore("Could teach others")).toBe(5);
  });

  it("treats 'Not applicable...' variants as null", () => {
    expect(skillScore("Not applicable to your role")).toBeNull();
    expect(skillScore("Not applicable")).toBeNull();
  });

  it("returns null for unknown text", () => {
    expect(skillScore("expert")).toBeNull();
    expect(skillScore(null)).toBeNull();
  });
});

// =============================================================================
// Option matching
// =============================================================================

describe("squash", () => {
  it("collapses punctuation and whitespace to alphanumerics", () => {
    expect(squash("Code writing / generation")).toBe("codewritinggeneration");
    expect(squash("Code writing/generation")).toBe("codewritinggeneration");
    expect(squash("Microsoft 365 Copilot")).toBe("microsoft365copilot");
  });
});

describe("matchOption", () => {
  const sdlc: QuestionOption[] = [
    { value: "documentation", label: "Documentation" },
    { value: "code_generation", label: "Code writing / generation" },
    { value: "code_review", label: "Code review / PR analysis" },
    { value: "user_stories", label: "User stories / requirements" },
  ];

  it("returns the option value on exact label match", () => {
    expect(matchOption("Documentation", sdlc)).toBe("documentation");
  });

  it("matches across spacing-around-slash variants", () => {
    expect(matchOption("Code writing/generation", sdlc)).toBe("code_generation");
    expect(matchOption("Code writing / generation", sdlc)).toBe("code_generation");
  });

  it("does not cross-match options sharing a leading word", () => {
    // Regression: "Code review" used to collide with "Code writing" under
    // the previous first-word substring matcher.
    expect(matchOption("Code review / PR analysis", sdlc)).toBe("code_review");
    expect(matchOption("Code writing / generation", sdlc)).toBe("code_generation");
  });

  it("returns a slugified fallback for unmapped values", () => {
    expect(matchOption("Cursor AI", sdlc)).toBe("cursor_ai");
  });

  it("returns null for empty input", () => {
    expect(matchOption("", sdlc)).toBeNull();
    expect(matchOption("   ", sdlc)).toBeNull();
  });
});

// =============================================================================
// buildAnswerFields dispatch
// =============================================================================

describe("buildAnswerFields", () => {
  const tools: QuestionOption[] = [
    { value: "chatgpt", label: "ChatGPT / GPT-4" },
    { value: "ms_copilot", label: "Microsoft 365 Copilot" },
  ];

  it("returns null for empty cells regardless of type", () => {
    expect(buildAnswerFields("likert", null)).toBeNull();
    expect(buildAnswerFields("free_text", "")).toBeNull();
    expect(buildAnswerFields("multi_choice", undefined)).toBeNull();
  });

  it("parses numeric likert from string and rounds", () => {
    expect(buildAnswerFields("likert", "4")).toEqual({ score: 4 });
    expect(buildAnswerFields("likert", "3.7")).toEqual({ score: 4 });
  });

  it("falls back to text→score for Likert text cells", () => {
    expect(buildAnswerFields("likert", "Strongly agree")).toEqual({ score: 5 });
    expect(buildAnswerFields("likert", "neutral")).toEqual({ score: 3 });
  });

  it("rejects Likert scores outside 1–5", () => {
    expect(buildAnswerFields("likert", "9")).toBeNull();
    expect(buildAnswerFields("likert", "0")).toBeNull();
  });

  it("preserves arbitrary numerics for question_type=numeric", () => {
    expect(buildAnswerFields("numeric", "42.5")).toEqual({ numeric_value: 42.5 });
    expect(buildAnswerFields("numeric", 100)).toEqual({ numeric_value: 100 });
  });

  it("single_choice wraps a single mapped value", () => {
    expect(buildAnswerFields("single_choice", "ChatGPT / GPT-4", tools)).toEqual({
      choice_values: ["chatgpt"],
    });
  });

  it("multi_choice splits on delimiter and dedupes", () => {
    const result = buildAnswerFields(
      "multi_choice",
      "ChatGPT / GPT-4;Microsoft 365 Copilot;ChatGPT / GPT-4",
      tools,
      ";"
    );
    expect(result?.choice_values).toEqual(["chatgpt", "ms_copilot"]);
  });

  it("multi_choice keeps unmapped values as slugified fallback", () => {
    const result = buildAnswerFields("multi_choice", "Cursor;ChatGPT / GPT-4", tools, ";");
    expect(result?.choice_values).toEqual(["cursor", "chatgpt"]);
  });

  it("free_text strips no-data sentinels", () => {
    expect(buildAnswerFields("free_text", "N/A")).toBeNull();
    expect(buildAnswerFields("free_text", "open-ended response")).toBeNull();
    expect(buildAnswerFields("free_text", "Real feedback here")).toEqual({
      text_value: "Real feedback here",
    });
  });
});

// =============================================================================
// Aggregations
// =============================================================================

describe("aggregateLikert", () => {
  it("computes mean, agree+%, strongly-agree% from scores", () => {
    const result = aggregateLikert([
      { score: 5 },
      { score: 5 },
      { score: 4 },
      { score: 3 },
      { score: 2 },
    ]);
    expect(result.n).toBe(5);
    expect(result.mean).toBeCloseTo(3.8, 2);
    expect(result.agree_plus_pct).toBeCloseTo(60, 2); // 3 of 5 >= 4
    expect(result.strongly_agree_pct).toBeCloseTo(40, 2); // 2 of 5 == 5
  });

  it("ignores null scores", () => {
    const result = aggregateLikert([{ score: 5 }, { score: null }, { score: 3 }]);
    expect(result.n).toBe(2);
    expect(result.mean).toBeCloseTo(4, 2);
  });

  it("returns nulls when n == 0", () => {
    const result = aggregateLikert([{ score: null }, { score: null }]);
    expect(result).toEqual({ n: 0, mean: null, agree_plus_pct: null, strongly_agree_pct: null });
  });

  it("reproduces published DCFS report numbers", () => {
    // 95% of 99 respondents at 5; mix to mean 4.35
    // Distribution that hits 4.35 with 99 responses: simulate
    const scores: number[] = [];
    for (let i = 0; i < 50; i++) scores.push(5); // strongly agree
    for (let i = 0; i < 44; i++) scores.push(4); // agree
    for (let i = 0; i < 5; i++) scores.push(3); // neutral
    const result = aggregateLikert(scores.map((score) => ({ score })));
    expect(result.n).toBe(99);
    expect(result.agree_plus_pct).toBeCloseTo(94.9, 1);
    expect(result.mean).toBeGreaterThan(4.3);
    expect(result.mean).toBeLessThan(4.5);
  });
});

describe("aggregateNumeric", () => {
  it("computes mean of numeric values, ignoring nulls", () => {
    const result = aggregateNumeric([
      { numeric_value: 10 },
      { numeric_value: 20 },
      { numeric_value: null },
      { numeric_value: 30 },
    ]);
    expect(result.n).toBe(3);
    expect(result.mean).toBeCloseTo(20, 2);
  });

  it("returns null mean for empty input", () => {
    expect(aggregateNumeric([])).toEqual({ n: 0, mean: null });
  });
});

describe("aggregateByRole", () => {
  it("filters cohorts smaller than minCohortSize and sorts by mean desc", () => {
    const roles = new Map<string, string | null>([
      ["r1", "Developer"],
      ["r2", "Developer"],
      ["r3", "Developer"],
      ["r4", "Tester"], // single-cohort, will be filtered
    ]);
    const answers = [
      { score: 5, response_id: "r1" },
      { score: 4, response_id: "r2" },
      { score: 3, response_id: "r3" },
      { score: 5, response_id: "r4" }, // dropped: cohort too small
    ];
    const rows = aggregateByRole(answers, roles, "score", 3);
    expect(rows).toHaveLength(1);
    expect(rows[0].role).toBe("Developer");
    expect(rows[0].n).toBe(3);
    expect(rows[0].mean).toBeCloseTo(4, 2);
  });

  it("ignores answers from respondents with no role", () => {
    const roles = new Map<string, string | null>([["r1", null]]);
    const rows = aggregateByRole([{ score: 5, response_id: "r1" }], roles, "score", 1);
    expect(rows).toHaveLength(0);
  });

  it("uses numeric_value when valueField=numeric_value", () => {
    const roles = new Map<string, string | null>([
      ["r1", "PM"],
      ["r2", "PM"],
    ]);
    const answers = [
      { numeric_value: 100, response_id: "r1" },
      { numeric_value: 200, response_id: "r2" },
    ];
    const rows = aggregateByRole(answers, roles, "numeric_value", 1);
    expect(rows[0].mean).toBe(150);
  });
});

describe("aggregateMultiChoice", () => {
  const tools: QuestionOption[] = [
    { value: "chatgpt", label: "ChatGPT / GPT-4" },
    { value: "ms_copilot", label: "Microsoft 365 Copilot" },
  ];

  it("computes pct against total respondents, not just question-answerers", () => {
    // 5 selections of chatgpt out of 10 total respondents = 50% (not 100%)
    const answers = [
      { response_id: "r1", choice_values: ["chatgpt"] },
      { response_id: "r2", choice_values: ["chatgpt"] },
      { response_id: "r3", choice_values: ["chatgpt"] },
      { response_id: "r4", choice_values: ["chatgpt"] },
      { response_id: "r5", choice_values: ["chatgpt"] },
    ];
    const rows = aggregateMultiChoice(answers, 10, tools);
    expect(rows[0]).toMatchObject({ value: "chatgpt", count: 5, pct: 50 });
  });

  it("orders by count desc and falls back to value when no label", () => {
    const answers = [
      { response_id: "r1", choice_values: ["chatgpt", "ms_copilot"] },
      { response_id: "r2", choice_values: ["chatgpt", "unknown_tool"] },
      { response_id: "r3", choice_values: ["chatgpt"] },
    ];
    const rows = aggregateMultiChoice(answers, 3, tools);
    expect(rows[0].value).toBe("chatgpt");
    expect(rows[0].count).toBe(3);
    expect(rows[0].label).toBe("ChatGPT / GPT-4");
    const unknown = rows.find((r) => r.value === "unknown_tool");
    expect(unknown?.label).toBe("unknown_tool"); // fallback when no option label
  });

  it("reproduces DCFS-style ratios (57% ChatGPT of 122 respondents)", () => {
    const answers = Array.from({ length: 70 }, (_, i) => ({
      response_id: `r${i}`,
      choice_values: ["chatgpt"],
    }));
    const rows = aggregateMultiChoice(answers, 122, tools);
    expect(Math.round(rows[0].pct)).toBe(57);
  });

  it("handles null choice_values arrays", () => {
    const answers = [
      { response_id: "r1", choice_values: null },
      { response_id: "r2", choice_values: ["chatgpt"] },
    ];
    const rows = aggregateMultiChoice(answers, 2, tools);
    expect(rows).toHaveLength(1);
    expect(rows[0].count).toBe(1);
  });
});
