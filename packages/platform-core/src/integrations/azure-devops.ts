/**
 * Azure DevOps REST API client for fetching iteration and work item data.
 *
 * Connects using PAT tokens to pull sprint/iteration data,
 * work items, and pipeline metrics.
 */

import type {
  IntegrationConfig,
  NormalizedSprint,
  NormalizedIssue,
  ConnectionTestResult,
} from "./types.js";

function getAuthHeaders(config: IntegrationConfig): Record<string, string> {
  return {
    Authorization: `Basic ${Buffer.from(`:${config.apiToken}`).toString("base64")}`,
    "Content-Type": "application/json",
  };
}

function normalizeWorkItemType(adoType: string): NormalizedIssue["type"] {
  const lower = adoType.toLowerCase();
  if (lower === "bug") return "bug";
  if (lower === "user story" || lower === "product backlog item") return "story";
  if (lower === "task") return "task";
  if (lower === "feature" || lower === "epic") return "story";
  return "other";
}

export async function testAzureDevOpsConnection(
  config: IntegrationConfig
): Promise<ConnectionTestResult> {
  try {
    const headers = getAuthHeaders(config);
    const org = config.baseUrl; // e.g., https://dev.azure.com/orgname

    const res = await fetch(
      `${org}/${config.projectKey}/_apis/wit/wiql?api-version=7.0`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: "Select [System.Id] From WorkItems Where [System.TeamProject] = @project ORDER BY [System.Id] DESC",
        }),
      }
    );

    if (!res.ok) {
      return { success: false, message: `Cannot access project: ${res.status} ${res.statusText}` };
    }

    const data = await res.json();
    return {
      success: true,
      message: `Connected to project "${config.projectKey}"`,
      details: {
        projectName: config.projectKey,
        issueCount: data.workItems?.length || 0,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: `Connection failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

export async function fetchAzureDevOpsSprints(
  config: IntegrationConfig,
  startDate?: string,
  endDate?: string
): Promise<{ sprints: NormalizedSprint[]; issues: NormalizedIssue[]; errors: string[] }> {
  const headers = getAuthHeaders(config);
  const org = config.baseUrl;
  const project = config.projectKey;
  const teamId = config.boardId || `${project} Team`;
  const errors: string[] = [];
  const allSprints: NormalizedSprint[] = [];
  const allIssues: NormalizedIssue[] = [];

  try {
    // Fetch iterations (sprints)
    const iterRes = await fetch(
      `${org}/${project}/${teamId}/_apis/work/teamsettings/iterations?api-version=7.0`,
      { headers }
    );

    if (!iterRes.ok) {
      errors.push(`Failed to fetch iterations: ${iterRes.status}`);
      return { sprints: [], issues: [], errors };
    }

    const iterData = await iterRes.json();
    let iterations = (iterData.value || []) as Array<{
      id: string;
      name: string;
      attributes: { startDate?: string; finishDate?: string; timeFrame: string };
      path: string;
    }>;

    // Filter to past iterations within date range
    iterations = iterations.filter((i) => i.attributes.timeFrame === "past");
    if (startDate) {
      iterations = iterations.filter((i) => i.attributes.finishDate && i.attributes.finishDate >= startDate);
    }
    if (endDate) {
      iterations = iterations.filter((i) => i.attributes.startDate && i.attributes.startDate <= endDate);
    }

    for (let idx = 0; idx < iterations.length; idx++) {
      const iter = iterations[idx];

      // Fetch work items for this iteration
      const wiqlRes = await fetch(
        `${org}/${project}/_apis/wit/wiql?api-version=7.0`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: `Select [System.Id] From WorkItems Where [System.IterationPath] = '${iter.path}' AND [System.TeamProject] = '${project}'`,
          }),
        }
      );

      if (!wiqlRes.ok) {
        errors.push(`Failed to fetch work items for ${iter.name}: ${wiqlRes.status}`);
        continue;
      }

      const wiqlData = await wiqlRes.json();
      const workItemIds = (wiqlData.workItems || []).map((wi: { id: number }) => wi.id);

      let committedPoints = 0;
      let completedPoints = 0;
      let itemsCompleted = 0;
      let bugsFound = 0;

      if (workItemIds.length > 0) {
        // Batch fetch work item details
        const batchIds = workItemIds.slice(0, 200).join(",");
        const detailRes = await fetch(
          `${org}/${project}/_apis/wit/workitems?ids=${batchIds}&fields=System.WorkItemType,System.Title,System.AssignedTo,System.State,Microsoft.VSTS.Scheduling.StoryPoints&api-version=7.0`,
          { headers }
        );

        if (detailRes.ok) {
          const detailData = await detailRes.json();
          for (const wi of detailData.value || []) {
            const fields = wi.fields || {};
            const points = Number(fields["Microsoft.VSTS.Scheduling.StoryPoints"]) || 0;
            const type = fields["System.WorkItemType"] || "Task";
            const state = fields["System.State"] || "";
            const isDone = state === "Done" || state === "Closed" || state === "Resolved";

            committedPoints += points;
            if (isDone) {
              completedPoints += points;
              itemsCompleted++;
            }
            if (normalizeWorkItemType(type) === "bug") bugsFound++;

            allIssues.push({
              key: `${wi.id}`,
              type: normalizeWorkItemType(type),
              summary: fields["System.Title"] || "",
              assigneeId: fields["System.AssignedTo"]?.uniqueName || null,
              storyPoints: points,
              cycleTimeDays: null, // ADO cycle time requires revision history
              status: state,
              sprintName: iter.name,
            });
          }
        }
      }

      allSprints.push({
        name: iter.name,
        number: idx + 1,
        startDate: iter.attributes.startDate || "",
        endDate: iter.attributes.finishDate || "",
        state: "closed",
        committedPoints,
        completedPoints,
        itemsCommitted: workItemIds.length,
        itemsCompleted,
        bugsFound,
      });
    }
  } catch (err) {
    errors.push(`Azure DevOps API error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  return { sprints: allSprints, issues: allIssues, errors };
}
