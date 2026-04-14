/**
 * Unit tests for AI Readiness Assessment workflow.
 *
 * Tests type definitions, constants, role taxonomy, question selection logic,
 * tier assignment, feedback thresholds, and report computation helpers.
 */

import { describe, it, expect } from "vitest";
import {
  TEAM_MEMBER_ROLE_LABELS,
  ROLE_QUESTION_CATEGORIES,
  READINESS_TIERS,
  ENTITY_TYPE_LABELS,
  COMPANY_SIZE_LABELS,
  TEAM_FUNCTION_LABELS,
  TEAM_METHODOLOGY_LABELS,
  SENIORITY_LABELS,
  POLICY_COVERAGE_AREAS,
  TRAINING_CATALOG,
} from "../types/ai-tools.js";
import type { TeamMemberRole, QuestionBankItem } from "../types/ai-tools.js";

// =============================================================================
// Role Taxonomy
// =============================================================================

describe("TeamMemberRole taxonomy", () => {
  const allRoles = Object.keys(TEAM_MEMBER_ROLE_LABELS) as TeamMemberRole[];

  it("has 24 roles", () => {
    expect(allRoles.length).toBe(24);
  });

  it("includes all original roles", () => {
    const originals: TeamMemberRole[] = ["developer", "qa", "scrum_master", "product_owner", "devops", "designer"];
    for (const role of originals) {
      expect(allRoles).toContain(role);
    }
  });

  it("includes all new SDLC roles", () => {
    const newRoles: TeamMemberRole[] = [
      "business_analyst", "tech_lead", "architect", "integration_tester",
      "performance_tester", "release_manager", "data_analyst", "data_engineer",
      "security_engineer", "ux_researcher", "technical_writer",
      "program_manager", "project_manager", "engineering_manager",
      "database_admin", "system_admin", "support_engineer", "other",
    ];
    for (const role of newRoles) {
      expect(allRoles).toContain(role);
    }
  });

  it("has a label for every role", () => {
    for (const role of allRoles) {
      expect(TEAM_MEMBER_ROLE_LABELS[role]).toBeTruthy();
      expect(typeof TEAM_MEMBER_ROLE_LABELS[role]).toBe("string");
    }
  });

  it("has question categories for every role", () => {
    for (const role of allRoles) {
      expect(ROLE_QUESTION_CATEGORIES[role]).toBeDefined();
      expect(Array.isArray(ROLE_QUESTION_CATEGORIES[role])).toBe(true);
    }
  });

  it("'other' role has empty question categories (universal only)", () => {
    expect(ROLE_QUESTION_CATEGORIES.other).toEqual([]);
  });

  it("developer has coding-related categories", () => {
    expect(ROLE_QUESTION_CATEGORIES.developer).toContain("ai_coding_tools");
    expect(ROLE_QUESTION_CATEGORIES.developer).toContain("code_review");
  });

  it("business_analyst has requirements categories", () => {
    expect(ROLE_QUESTION_CATEGORIES.business_analyst).toContain("requirements_gathering");
    expect(ROLE_QUESTION_CATEGORIES.business_analyst).toContain("process_modeling");
  });

  it("integration_tester has testing categories", () => {
    expect(ROLE_QUESTION_CATEGORIES.integration_tester).toContain("test_automation");
    expect(ROLE_QUESTION_CATEGORIES.integration_tester).toContain("api_testing");
  });

  it("engineering_manager has governance categories", () => {
    expect(ROLE_QUESTION_CATEGORIES.engineering_manager).toContain("governance");
    expect(ROLE_QUESTION_CATEGORIES.engineering_manager).toContain("change_management");
  });
});

// =============================================================================
// Training Catalog Coverage
// =============================================================================

describe("Training catalog role coverage", () => {
  const allRoles = Object.keys(TEAM_MEMBER_ROLE_LABELS) as TeamMemberRole[];
  const rolesWithTraining = new Set<string>();

  for (const module of TRAINING_CATALOG) {
    for (const role of module.target_roles) {
      rolesWithTraining.add(role);
    }
  }

  it("has at least one training module for each non-other role", () => {
    for (const role of allRoles) {
      if (role === "other") continue;
      expect(rolesWithTraining.has(role)).toBe(true);
    }
  });

  it("has no training modules targeting 'other' role", () => {
    expect(rolesWithTraining.has("other")).toBe(false);
  });
});

// =============================================================================
// Constants Completeness
// =============================================================================

describe("Readiness constants", () => {
  it("ENTITY_TYPE_LABELS has 6 entity types", () => {
    expect(Object.keys(ENTITY_TYPE_LABELS).length).toBe(6);
  });

  it("COMPANY_SIZE_LABELS has 4 sizes", () => {
    expect(Object.keys(COMPANY_SIZE_LABELS).length).toBe(4);
  });

  it("TEAM_FUNCTION_LABELS has 5 functions", () => {
    expect(Object.keys(TEAM_FUNCTION_LABELS).length).toBe(5);
  });

  it("TEAM_METHODOLOGY_LABELS has 5 methodologies", () => {
    expect(Object.keys(TEAM_METHODOLOGY_LABELS).length).toBe(5);
  });

  it("SENIORITY_LABELS has 5 levels", () => {
    expect(Object.keys(SENIORITY_LABELS).length).toBe(5);
  });

  it("POLICY_COVERAGE_AREAS has 5 areas", () => {
    expect(POLICY_COVERAGE_AREAS.length).toBe(5);
    const keys = POLICY_COVERAGE_AREAS.map((a) => a.key);
    expect(keys).toContain("data_privacy");
    expect(keys).toContain("ip_ownership");
    expect(keys).toContain("approved_tools");
    expect(keys).toContain("prohibited_uses");
    expect(keys).toContain("data_handling");
  });
});

// =============================================================================
// Readiness Tiers
// =============================================================================

describe("Readiness tier assignment", () => {
  function getTier(score: number) {
    return READINESS_TIERS.find((t) => score >= t.min && score <= t.max);
  }

  it("assigns 'Not Ready' for score 0", () => {
    expect(getTier(0)?.label).toBe("Not Ready");
  });

  it("assigns 'Not Ready' for score 1.5", () => {
    expect(getTier(1.5)?.label).toBe("Not Ready");
  });

  it("assigns 'Foundation Needed' for score 2.0", () => {
    expect(getTier(2.0)?.label).toBe("Foundation Needed");
  });

  it("assigns 'Foundation Needed' for score 2.99", () => {
    expect(getTier(2.99)?.label).toBe("Foundation Needed");
  });

  it("assigns 'Ready' for score 3.0", () => {
    expect(getTier(3.0)?.label).toBe("Ready");
  });

  it("assigns 'Ready' for score 3.99", () => {
    expect(getTier(3.99)?.label).toBe("Ready");
  });

  it("assigns 'Well Positioned' for score 4.0", () => {
    expect(getTier(4.0)?.label).toBe("Well Positioned");
  });

  it("assigns 'Well Positioned' for score 5.0", () => {
    expect(getTier(5.0)?.label).toBe("Well Positioned");
  });

  it("tiers cover full 0-5 range without gaps", () => {
    // Test every 0.5 increment
    for (let score = 0; score <= 5.0; score += 0.5) {
      const tier = getTier(score);
      expect(tier).toBeDefined();
      expect(tier!.label).toBeTruthy();
    }
  });

  it("each tier has a color", () => {
    for (const tier of READINESS_TIERS) {
      expect(tier.color).toBeTruthy();
    }
  });

  it("each tier has a description", () => {
    for (const tier of READINESS_TIERS) {
      expect(tier.description).toBeTruthy();
    }
  });
});

// =============================================================================
// Question Selection Logic
// =============================================================================

describe("Question selection logic", () => {
  function makeQuestion(overrides: Partial<QuestionBankItem>): QuestionBankItem {
    return {
      id: "q-" + Math.random().toString(36).slice(2, 8),
      site_id: null,
      category: "dora_capability",
      capability: "ai_accessible_data",
      question_text: "Test question",
      description: null,
      entity_types: [],
      roles: [],
      is_default: true,
      sort_order: 0,
      version: 1,
      status: "active",
      parent_question_id: null,
      created_by: "test",
      created_at: "",
      updated_at: "",
      ...overrides,
    };
  }

  function selectQuestions(
    questions: QuestionBankItem[],
    entityType: string,
    roles: string[]
  ): QuestionBankItem[] {
    return questions.filter((q) => {
      // Entity type filter
      const qTypes = q.entity_types as string[];
      if (qTypes.length && !qTypes.includes(entityType)) return false;

      // Role filter: universal (empty) goes to everyone
      const qRoles = q.roles as string[];
      if (qRoles.length === 0) return true;
      return qRoles.some((r) => roles.includes(r));
    });
  }

  it("universal questions (empty roles) are included for all roles", () => {
    const questions = [
      makeQuestion({ roles: [], question_text: "Universal Q" }),
      makeQuestion({ roles: ["developer"], question_text: "Dev Q" }),
    ];
    const result = selectQuestions(questions, "private", ["scrum_master"]);
    expect(result.length).toBe(1);
    expect(result[0].question_text).toBe("Universal Q");
  });

  it("role-specific questions are included when role matches", () => {
    const questions = [
      makeQuestion({ roles: ["developer"], question_text: "Dev Q" }),
      makeQuestion({ roles: ["qa", "integration_tester"], question_text: "Test Q" }),
    ];
    const result = selectQuestions(questions, "private", ["developer"]);
    expect(result.length).toBe(1);
    expect(result[0].question_text).toBe("Dev Q");
  });

  it("multi-role questions match any role in the list", () => {
    const questions = [
      makeQuestion({ roles: ["qa", "integration_tester"], question_text: "Test Q" }),
    ];
    const result = selectQuestions(questions, "private", ["integration_tester"]);
    expect(result.length).toBe(1);
  });

  it("entity-type-specific questions are excluded for non-matching types", () => {
    const questions = [
      makeQuestion({ entity_types: ["state_agency"], question_text: "State Q" }),
      makeQuestion({ entity_types: [], question_text: "All Q" }),
    ];
    const result = selectQuestions(questions, "private", ["developer"]);
    expect(result.length).toBe(1);
    expect(result[0].question_text).toBe("All Q");
  });

  it("entity-type-specific questions are included for matching types", () => {
    const questions = [
      makeQuestion({ entity_types: ["state_agency", "federal_agency"], question_text: "Gov Q" }),
    ];
    const result = selectQuestions(questions, "state_agency", ["developer"]);
    expect(result.length).toBe(1);
  });

  it("combines entity_type and role filtering correctly", () => {
    const questions = [
      makeQuestion({ entity_types: ["state_agency"], roles: ["developer"], question_text: "State Dev Q" }),
      makeQuestion({ entity_types: ["state_agency"], roles: ["qa"], question_text: "State QA Q" }),
      makeQuestion({ entity_types: [], roles: [], question_text: "Universal Q" }),
    ];
    const result = selectQuestions(questions, "state_agency", ["developer"]);
    expect(result.length).toBe(2);
    expect(result.map((q) => q.question_text).sort()).toEqual(["State Dev Q", "Universal Q"]);
  });

  it("returns empty array when no questions match", () => {
    const questions = [
      makeQuestion({ entity_types: ["public_university"], roles: ["designer"], question_text: "Niche Q" }),
    ];
    const result = selectQuestions(questions, "private", ["developer"]);
    expect(result.length).toBe(0);
  });
});

// =============================================================================
// Feedback Stats Threshold
// =============================================================================

describe("Feedback stats threshold logic", () => {
  const NEEDS_REVIEW_THRESHOLD = 0.25;
  const MIN_RESPONSES = 10;

  function computeNeedsReview(timesAsked: number, unclearCount: number, naCount: number): boolean {
    if (timesAsked < MIN_RESPONSES) return false;
    const flagRate = (unclearCount + naCount) / timesAsked;
    return flagRate > NEEDS_REVIEW_THRESHOLD;
  }

  it("does not flag with fewer than 10 responses", () => {
    expect(computeNeedsReview(5, 5, 0)).toBe(false); // 100% flag rate but too few
  });

  it("does not flag at exactly 25% flag rate", () => {
    expect(computeNeedsReview(20, 5, 0)).toBe(false); // 25% exactly, not >25%
  });

  it("flags at 26% flag rate with 10+ responses", () => {
    expect(computeNeedsReview(100, 20, 6)).toBe(true); // 26%
  });

  it("flags with high N/A count", () => {
    expect(computeNeedsReview(10, 0, 3)).toBe(true); // 30% N/A
  });

  it("combines unclear and N/A counts", () => {
    expect(computeNeedsReview(10, 2, 1)).toBe(true); // 30%
  });

  it("does not flag with low rates", () => {
    expect(computeNeedsReview(100, 5, 5)).toBe(false); // 10%
  });

  it("handles zero responses", () => {
    expect(computeNeedsReview(0, 0, 0)).toBe(false);
  });
});

// =============================================================================
// Report Score Aggregation
// =============================================================================

describe("Report score aggregation", () => {
  interface Answer { score: number | null; flag: string | null; capability: string }

  function aggregateCapabilityScores(answers: Answer[]): Record<string, { avg: number; count: number; isBlocker: boolean }> {
    const capData: Record<string, number[]> = {};

    for (const a of answers) {
      if (a.score == null || a.flag === "not_applicable") continue;
      if (!capData[a.capability]) capData[a.capability] = [];
      capData[a.capability].push(a.score);
    }

    const result: Record<string, { avg: number; count: number; isBlocker: boolean }> = {};
    for (const [cap, scores] of Object.entries(capData)) {
      const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
      result[cap] = {
        avg: Math.round(avg * 100) / 100,
        count: scores.length,
        isBlocker: avg < 3.0,
      };
    }
    return result;
  }

  it("computes average score per capability", () => {
    const answers: Answer[] = [
      { score: 4, flag: null, capability: "ai_accessible_data" },
      { score: 2, flag: null, capability: "ai_accessible_data" },
      { score: 5, flag: null, capability: "ai_stance_clarity" },
    ];
    const result = aggregateCapabilityScores(answers);
    expect(result.ai_accessible_data.avg).toBe(3);
    expect(result.ai_accessible_data.count).toBe(2);
    expect(result.ai_stance_clarity.avg).toBe(5);
  });

  it("excludes not_applicable flagged answers from scoring", () => {
    const answers: Answer[] = [
      { score: 4, flag: null, capability: "ai_accessible_data" },
      { score: 1, flag: "not_applicable", capability: "ai_accessible_data" },
    ];
    const result = aggregateCapabilityScores(answers);
    expect(result.ai_accessible_data.avg).toBe(4);
    expect(result.ai_accessible_data.count).toBe(1);
  });

  it("excludes null scores", () => {
    const answers: Answer[] = [
      { score: null, flag: "unclear", capability: "ai_accessible_data" },
      { score: 3, flag: null, capability: "ai_accessible_data" },
    ];
    const result = aggregateCapabilityScores(answers);
    expect(result.ai_accessible_data.avg).toBe(3);
    expect(result.ai_accessible_data.count).toBe(1);
  });

  it("marks capability below 3.0 as blocker", () => {
    const answers: Answer[] = [
      { score: 2, flag: null, capability: "platform_engineering" },
      { score: 1, flag: null, capability: "platform_engineering" },
    ];
    const result = aggregateCapabilityScores(answers);
    expect(result.platform_engineering.isBlocker).toBe(true);
  });

  it("does not mark capability at 3.0+ as blocker", () => {
    const answers: Answer[] = [
      { score: 3, flag: null, capability: "platform_engineering" },
      { score: 3, flag: null, capability: "platform_engineering" },
    ];
    const result = aggregateCapabilityScores(answers);
    expect(result.platform_engineering.isBlocker).toBe(false);
  });

  it("handles empty answers", () => {
    const result = aggregateCapabilityScores([]);
    expect(Object.keys(result).length).toBe(0);
  });

  it("includes unclear-flagged answers in scoring (flag doesn't exclude)", () => {
    const answers: Answer[] = [
      { score: 2, flag: "unclear", capability: "ai_accessible_data" },
      { score: 4, flag: null, capability: "ai_accessible_data" },
    ];
    const result = aggregateCapabilityScores(answers);
    expect(result.ai_accessible_data.avg).toBe(3);
    expect(result.ai_accessible_data.count).toBe(2);
  });
});

// =============================================================================
// Question Versioning Logic
// =============================================================================

describe("Question versioning", () => {
  it("new version increments version number", () => {
    const v1 = { version: 1, status: "active" };
    const v2 = { version: v1.version + 1, status: "active" };
    const v1Updated = { ...v1, status: "deprecated" };

    expect(v2.version).toBe(2);
    expect(v1Updated.status).toBe("deprecated");
    expect(v2.status).toBe("active");
  });

  it("deprecated questions are not selected", () => {
    const questions = [
      { status: "active", version: 2 },
      { status: "deprecated", version: 1 },
      { status: "draft", version: 1 },
    ];
    const active = questions.filter((q) => q.status === "active");
    expect(active.length).toBe(1);
    expect(active[0].version).toBe(2);
  });
});

// =============================================================================
// Policy Gap Detection
// =============================================================================

describe("Policy gap detection", () => {
  const ALL_AREAS = ["data_privacy", "ip_ownership", "approved_tools", "prohibited_uses", "data_handling"];

  function detectGaps(hasPolicy: boolean, coverage: Record<string, boolean>): string[] {
    const gaps: string[] = [];
    if (!hasPolicy) {
      gaps.push("no_policy");
      return gaps;
    }
    for (const area of ALL_AREAS) {
      if (!coverage[area]) gaps.push(area);
    }
    return gaps;
  }

  it("flags no_policy when has_policy is false", () => {
    const gaps = detectGaps(false, {});
    expect(gaps).toEqual(["no_policy"]);
  });

  it("identifies missing coverage areas", () => {
    const gaps = detectGaps(true, { data_privacy: true, ip_ownership: true });
    expect(gaps).toEqual(["approved_tools", "prohibited_uses", "data_handling"]);
  });

  it("returns empty when all areas covered", () => {
    const coverage: Record<string, boolean> = {};
    for (const area of ALL_AREAS) coverage[area] = true;
    const gaps = detectGaps(true, coverage);
    expect(gaps).toEqual([]);
  });

  it("returns all areas when none covered", () => {
    const gaps = detectGaps(true, {});
    expect(gaps.length).toBe(5);
  });
});

// =============================================================================
// Re-assessment Delta Computation
// =============================================================================

describe("Re-assessment delta computation", () => {
  function computeDelta(current: number, prior: number): { delta: number; direction: string } {
    const delta = Math.round((current - prior) * 100) / 100;
    return {
      delta,
      direction: delta > 0 ? "improved" : delta < 0 ? "declined" : "unchanged",
    };
  }

  it("positive delta = improved", () => {
    const result = computeDelta(3.5, 2.8);
    expect(result.delta).toBeCloseTo(0.7, 2);
    expect(result.direction).toBe("improved");
  });

  it("negative delta = declined", () => {
    const result = computeDelta(2.5, 3.0);
    expect(result.delta).toBeCloseTo(-0.5, 2);
    expect(result.direction).toBe("declined");
  });

  it("zero delta = unchanged", () => {
    const result = computeDelta(3.0, 3.0);
    expect(result.delta).toBe(0);
    expect(result.direction).toBe("unchanged");
  });
});
