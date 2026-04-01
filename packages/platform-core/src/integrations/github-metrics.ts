/**
 * GitHub REST API client for fetching DORA-relevant metrics.
 *
 * Pulls deployment data, PRs, and CI/CD run data to compute:
 * - Deployment frequency
 * - Lead time for changes
 * - Change failure rate
 * - MTTR (from incident-labeled issues)
 */

import type {
  IntegrationConfig,
  NormalizedDeployment,
  NormalizedPullRequest,
  ConnectionTestResult,
} from "./types.js";

function getAuthHeaders(config: IntegrationConfig): Record<string, string> {
  return {
    Authorization: `Bearer ${config.apiToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function testGitHubConnection(
  config: IntegrationConfig
): Promise<ConnectionTestResult> {
  try {
    const headers = getAuthHeaders(config);
    const owner = config.repositoryOwner;
    const repo = config.repositoryName;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!res.ok) {
      return { success: false, message: `Cannot access repo: ${res.status} ${res.statusText}` };
    }

    const data = await res.json();
    return {
      success: true,
      message: `Connected to ${data.full_name}`,
      details: { projectName: data.full_name },
    };
  } catch (err) {
    return {
      success: false,
      message: `Connection failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

export async function fetchGitHubDeployments(
  config: IntegrationConfig,
  startDate?: string,
  endDate?: string
): Promise<{ deployments: NormalizedDeployment[]; errors: string[] }> {
  const headers = getAuthHeaders(config);
  const owner = config.repositoryOwner;
  const repo = config.repositoryName;
  const errors: string[] = [];
  const deployments: NormalizedDeployment[] = [];

  try {
    // Fetch deployments
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/deployments?per_page=100`,
      { headers }
    );

    if (!res.ok) {
      errors.push(`Failed to fetch deployments: ${res.status}`);
      return { deployments: [], errors };
    }

    const data = await res.json();
    for (const dep of data) {
      const createdAt = dep.created_at as string;
      if (startDate && createdAt < startDate) continue;
      if (endDate && createdAt > endDate) continue;

      // Fetch deployment status to check success/failure
      const statusRes = await fetch(dep.statuses_url, { headers });
      const statuses = statusRes.ok ? await statusRes.json() : [];
      const latestStatus = statuses[0];
      const success = latestStatus?.state === "success";

      deployments.push({
        id: `${dep.id}`,
        createdAt,
        environment: dep.environment || "production",
        success,
        commitSha: dep.sha,
      });
    }
  } catch (err) {
    errors.push(`GitHub API error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  return { deployments, errors };
}

export async function fetchGitHubPullRequests(
  config: IntegrationConfig,
  startDate?: string,
  endDate?: string
): Promise<{ pullRequests: NormalizedPullRequest[]; errors: string[] }> {
  const headers = getAuthHeaders(config);
  const owner = config.repositoryOwner;
  const repo = config.repositoryName;
  const errors: string[] = [];
  const pullRequests: NormalizedPullRequest[] = [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=100`,
      { headers }
    );

    if (!res.ok) {
      errors.push(`Failed to fetch PRs: ${res.status}`);
      return { pullRequests: [], errors };
    }

    const data = await res.json();
    for (const pr of data) {
      if (!pr.merged_at) continue; // Only count merged PRs

      const createdAt = pr.created_at as string;
      if (startDate && createdAt < startDate) continue;
      if (endDate && createdAt > endDate) continue;

      const created = new Date(pr.created_at).getTime();
      const merged = new Date(pr.merged_at).getTime();
      const reviewTimeMinutes = Math.round((merged - created) / (1000 * 60));

      pullRequests.push({
        id: `${pr.number}`,
        title: pr.title,
        createdAt: pr.created_at,
        mergedAt: pr.merged_at,
        authorId: pr.user?.login || "unknown",
        reviewTimeMinutes,
      });
    }
  } catch (err) {
    errors.push(`GitHub API error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  return { pullRequests, errors };
}
