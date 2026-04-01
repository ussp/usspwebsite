/**
 * Unit tests for the integration adapter — data normalization
 * from different Scrum tool formats into unified metrics.
 */

import { describe, it, expect } from "vitest";
import { computeScrumMetrics, computeDoraMetrics } from "../../integrations/adapter.js";
import type { NormalizedSprint, NormalizedIssue, NormalizedDeployment, NormalizedPullRequest } from "../../integrations/types.js";

describe("computeScrumMetrics", () => {
  const sprints: NormalizedSprint[] = [
    { name: "Sprint 1", number: 1, startDate: "2026-01-06", endDate: "2026-01-17", state: "closed", committedPoints: 40, completedPoints: 35, itemsCommitted: 12, itemsCompleted: 10, bugsFound: 2 },
    { name: "Sprint 2", number: 2, startDate: "2026-01-20", endDate: "2026-01-31", state: "closed", committedPoints: 45, completedPoints: 42, itemsCommitted: 14, itemsCompleted: 13, bugsFound: 1 },
    { name: "Sprint 3", number: 3, startDate: "2026-02-03", endDate: "2026-02-14", state: "closed", committedPoints: 42, completedPoints: 40, itemsCommitted: 13, itemsCompleted: 12, bugsFound: 3 },
  ];

  const issues: NormalizedIssue[] = [
    { key: "PROJ-1", type: "story", summary: "Feature A", assigneeId: "u1", storyPoints: 5, cycleTimeDays: 3.5, status: "Done", sprintName: "Sprint 1" },
    { key: "PROJ-2", type: "bug", summary: "Bug fix", assigneeId: "u2", storyPoints: 2, cycleTimeDays: 1.2, status: "Done", sprintName: "Sprint 1" },
    { key: "PROJ-3", type: "story", summary: "Feature B", assigneeId: "u1", storyPoints: 8, cycleTimeDays: 5.0, status: "Done", sprintName: "Sprint 2" },
    { key: "PROJ-4", type: "task", summary: "Config update", assigneeId: "u3", storyPoints: 1, cycleTimeDays: 0.5, status: "Done", sprintName: "Sprint 3" },
  ];

  it("computes velocity as average completed points", () => {
    const metrics = computeScrumMetrics("assessment-1", sprints, issues);
    const velocity = metrics.find((m) => m.metric_name === "velocity");

    expect(velocity).toBeDefined();
    // (35 + 42 + 40) / 3 = 39
    expect(velocity!.metric_value).toBeCloseTo(39, 0);
    expect(velocity!.metric_unit).toBe("story_points");
    expect(velocity!.category).toBe("scrum");
  });

  it("computes cycle time as median", () => {
    const metrics = computeScrumMetrics("assessment-1", sprints, issues);
    const cycleTime = metrics.find((m) => m.metric_name === "cycle_time_days");

    expect(cycleTime).toBeDefined();
    // Sorted cycle times: [0.5, 1.2, 3.5, 5.0] → median = (1.2 + 3.5) / 2 = 2.35
    expect(cycleTime!.metric_value).toBeCloseTo(2.4, 0);
  });

  it("computes predictability as avg commitment ratio", () => {
    const metrics = computeScrumMetrics("assessment-1", sprints, issues);
    const predictability = metrics.find((m) => m.metric_name === "predictability");

    expect(predictability).toBeDefined();
    // (35/40 + 42/45 + 40/42) / 3 = (0.875 + 0.933 + 0.952) / 3 ≈ 0.92 → 92%
    expect(predictability!.metric_value).toBeGreaterThan(85);
    expect(predictability!.metric_value).toBeLessThan(100);
    expect(predictability!.metric_unit).toBe("percentage");
  });

  it("computes throughput as avg items per sprint", () => {
    const metrics = computeScrumMetrics("assessment-1", sprints, issues);
    const throughput = metrics.find((m) => m.metric_name === "throughput");

    expect(throughput).toBeDefined();
    // (10 + 13 + 12) / 3 ≈ 11.7
    expect(throughput!.metric_value).toBeCloseTo(11.7, 0);
  });

  it("computes bug escape rate as avg bugs per sprint", () => {
    const metrics = computeScrumMetrics("assessment-1", sprints, issues);
    const bugRate = metrics.find((m) => m.metric_name === "bug_escape_rate");

    expect(bugRate).toBeDefined();
    // (2 + 1 + 3) / 3 = 2
    expect(bugRate!.metric_value).toBeCloseTo(2, 0);
  });

  it("returns empty array for no sprints", () => {
    const metrics = computeScrumMetrics("assessment-1", [], []);
    expect(metrics).toEqual([]);
  });
});

describe("computeDoraMetrics", () => {
  const deployments: NormalizedDeployment[] = [
    { id: "d1", createdAt: "2026-01-10", environment: "production", success: true, commitSha: "abc" },
    { id: "d2", createdAt: "2026-01-15", environment: "production", success: true, commitSha: "def" },
    { id: "d3", createdAt: "2026-01-20", environment: "production", success: false, commitSha: "ghi" },
    { id: "d4", createdAt: "2026-01-25", environment: "staging", success: true, commitSha: "jkl" },
  ];

  const pullRequests: NormalizedPullRequest[] = [
    { id: "1", title: "Feature A", createdAt: "2026-01-09T10:00:00Z", mergedAt: "2026-01-10T14:00:00Z", authorId: "u1", reviewTimeMinutes: 240 },
    { id: "2", title: "Feature B", createdAt: "2026-01-14T08:00:00Z", mergedAt: "2026-01-15T09:00:00Z", authorId: "u2", reviewTimeMinutes: 1500 },
    { id: "3", title: "Bug fix", createdAt: "2026-01-19T12:00:00Z", mergedAt: "2026-01-19T14:00:00Z", authorId: "u1", reviewTimeMinutes: 120 },
  ];

  it("computes deployment frequency per week", () => {
    const metrics = computeDoraMetrics("assessment-1", deployments, pullRequests, 4);
    const df = metrics.find((m) => m.metric_name === "deployment_frequency");

    expect(df).toBeDefined();
    // 3 production deploys / 4 weeks = 0.75
    expect(df!.metric_value).toBeCloseTo(0.8, 0);
    expect(df!.metric_unit).toBe("per_week");
  });

  it("computes lead time as median PR review time", () => {
    const metrics = computeDoraMetrics("assessment-1", deployments, pullRequests, 4);
    const lt = metrics.find((m) => m.metric_name === "lead_time_minutes");

    expect(lt).toBeDefined();
    // Sorted: [120, 240, 1500] → median = 240
    expect(lt!.metric_value).toBe(240);
    expect(lt!.metric_unit).toBe("minutes");
  });

  it("computes change failure rate", () => {
    const metrics = computeDoraMetrics("assessment-1", deployments, pullRequests, 4);
    const cfr = metrics.find((m) => m.metric_name === "change_failure_rate");

    expect(cfr).toBeDefined();
    // 1 failed / 3 production = 33.3%
    expect(cfr!.metric_value).toBeCloseTo(33.3, 0);
    expect(cfr!.metric_unit).toBe("percentage");
  });

  it("returns empty array when period is 0 weeks", () => {
    const metrics = computeDoraMetrics("assessment-1", deployments, pullRequests, 0);
    expect(metrics).toEqual([]);
  });
});
