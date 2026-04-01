/**
 * Integration adapter — normalizes data from different Scrum tools
 * into a unified format and computes metrics for storage.
 *
 * This is the bridge between platform-specific API clients
 * and the ai_metrics table.
 */

import type { CreateMetricInput } from "../types/ai-tools.js";
import type {
  IntegrationConfig,
  NormalizedSprint,
  NormalizedIssue,
  NormalizedDeployment,
  NormalizedPullRequest,
  IntegrationResult,
} from "./types.js";
import { fetchJiraSprints } from "./jira.js";
import { fetchAzureDevOpsSprints } from "./azure-devops.js";
import { fetchGitHubDeployments, fetchGitHubPullRequests } from "./github-metrics.js";

/**
 * Fetch data from the configured integration and normalize it.
 */
export async function fetchIntegrationData(
  config: IntegrationConfig,
  startDate?: string,
  endDate?: string
): Promise<IntegrationResult> {
  const result: IntegrationResult = {
    success: false,
    sprints: [],
    issues: [],
    deployments: [],
    pullRequests: [],
    errors: [],
  };

  if (config.type === "jira") {
    const jiraResult = await fetchJiraSprints(config, startDate, endDate);
    result.sprints = jiraResult.sprints;
    result.issues = jiraResult.issues;
    result.errors = jiraResult.errors;
    result.success = jiraResult.errors.length === 0;
  } else if (config.type === "azure_devops") {
    const adoResult = await fetchAzureDevOpsSprints(config, startDate, endDate);
    result.sprints = adoResult.sprints;
    result.issues = adoResult.issues;
    result.errors = adoResult.errors;
    result.success = adoResult.errors.length === 0;
  } else if (config.type === "github") {
    const [deployResult, prResult] = await Promise.all([
      fetchGitHubDeployments(config, startDate, endDate),
      fetchGitHubPullRequests(config, startDate, endDate),
    ]);
    result.deployments = deployResult.deployments;
    result.pullRequests = prResult.pullRequests;
    result.errors = [...deployResult.errors, ...prResult.errors];
    result.success = result.errors.length === 0;
  } else {
    result.errors.push(`Unsupported integration type: ${config.type}`);
  }

  return result;
}

/**
 * Compute Scrum metrics from normalized sprint data.
 */
export function computeScrumMetrics(
  assessmentId: string,
  sprints: NormalizedSprint[],
  issues: NormalizedIssue[]
): CreateMetricInput[] {
  if (sprints.length === 0) return [];

  const metrics: CreateMetricInput[] = [];

  // Velocity: average completed points per sprint
  const totalCompleted = sprints.reduce((sum, s) => sum + s.completedPoints, 0);
  const velocity = totalCompleted / sprints.length;
  metrics.push({
    assessment_id: assessmentId,
    category: "scrum",
    metric_name: "velocity",
    metric_value: Math.round(velocity * 10) / 10,
    metric_unit: "story_points",
    raw_data: { sprints: sprints.map((s) => ({ name: s.name, points: s.completedPoints })) },
  });

  // Cycle time: median cycle time across all issues with cycle time data
  const cycleTimes = issues
    .map((i) => i.cycleTimeDays)
    .filter((ct): ct is number => ct !== null)
    .sort((a, b) => a - b);

  if (cycleTimes.length > 0) {
    const median = cycleTimes.length % 2 === 0
      ? (cycleTimes[cycleTimes.length / 2 - 1] + cycleTimes[cycleTimes.length / 2]) / 2
      : cycleTimes[Math.floor(cycleTimes.length / 2)];

    metrics.push({
      assessment_id: assessmentId,
      category: "scrum",
      metric_name: "cycle_time_days",
      metric_value: Math.round(median * 10) / 10,
      metric_unit: "count",
    });
  }

  // Predictability: average (completed / committed) ratio
  const predictabilities = sprints
    .filter((s) => s.committedPoints > 0)
    .map((s) => (s.completedPoints / s.committedPoints) * 100);

  if (predictabilities.length > 0) {
    const avgPredictability = predictabilities.reduce((sum, p) => sum + p, 0) / predictabilities.length;
    metrics.push({
      assessment_id: assessmentId,
      category: "scrum",
      metric_name: "predictability",
      metric_value: Math.round(avgPredictability * 10) / 10,
      metric_unit: "percentage",
    });
  }

  // Throughput: average items completed per sprint
  const totalItems = sprints.reduce((sum, s) => sum + s.itemsCompleted, 0);
  const throughput = totalItems / sprints.length;
  metrics.push({
    assessment_id: assessmentId,
    category: "scrum",
    metric_name: "throughput",
    metric_value: Math.round(throughput * 10) / 10,
    metric_unit: "count",
  });

  // Bug escape rate: average bugs per sprint
  const totalBugs = sprints.reduce((sum, s) => sum + s.bugsFound, 0);
  const bugRate = totalBugs / sprints.length;
  metrics.push({
    assessment_id: assessmentId,
    category: "scrum",
    metric_name: "bug_escape_rate",
    metric_value: Math.round(bugRate * 10) / 10,
    metric_unit: "count",
  });

  return metrics;
}

/**
 * Compute DORA metrics from deployment and PR data.
 */
export function computeDoraMetrics(
  assessmentId: string,
  deployments: NormalizedDeployment[],
  pullRequests: NormalizedPullRequest[],
  periodWeeks: number
): CreateMetricInput[] {
  const metrics: CreateMetricInput[] = [];

  if (periodWeeks <= 0) return metrics;

  // Deployment frequency: deployments per week
  const prodDeployments = deployments.filter((d) => d.environment === "production");
  const deployFreq = prodDeployments.length / periodWeeks;
  metrics.push({
    assessment_id: assessmentId,
    category: "dora",
    metric_name: "deployment_frequency",
    metric_value: Math.round(deployFreq * 10) / 10,
    metric_unit: "per_week",
  });

  // Lead time for changes: median time from PR creation to merge (proxy for commit to production)
  const leadTimes = pullRequests
    .filter((pr) => pr.reviewTimeMinutes !== null)
    .map((pr) => pr.reviewTimeMinutes!)
    .sort((a, b) => a - b);

  if (leadTimes.length > 0) {
    const median = leadTimes.length % 2 === 0
      ? (leadTimes[leadTimes.length / 2 - 1] + leadTimes[leadTimes.length / 2]) / 2
      : leadTimes[Math.floor(leadTimes.length / 2)];

    metrics.push({
      assessment_id: assessmentId,
      category: "dora",
      metric_name: "lead_time_minutes",
      metric_value: Math.round(median),
      metric_unit: "minutes",
    });
  }

  // Change failure rate: % of failed deployments
  if (prodDeployments.length > 0) {
    const failedDeploys = prodDeployments.filter((d) => !d.success).length;
    const cfr = (failedDeploys / prodDeployments.length) * 100;
    metrics.push({
      assessment_id: assessmentId,
      category: "dora",
      metric_name: "change_failure_rate",
      metric_value: Math.round(cfr * 10) / 10,
      metric_unit: "percentage",
    });
  }

  // MTTR is not easily computed from GitHub data alone — would need incident tracking integration
  // Placeholder: skip or allow manual entry

  return metrics;
}
