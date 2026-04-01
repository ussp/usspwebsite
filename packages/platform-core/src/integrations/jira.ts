/**
 * Jira Cloud REST API client for fetching sprint and issue data.
 *
 * Connects to Jira Cloud using API tokens to pull:
 * - Sprint data (velocity, commitment, completion)
 * - Issue details (story points, cycle time, assignees)
 * - Board configuration
 */

import type {
  IntegrationConfig,
  NormalizedSprint,
  NormalizedIssue,
  ConnectionTestResult,
} from "./types.js";

interface JiraSprint {
  id: number;
  name: string;
  state: string;
  startDate?: string;
  endDate?: string;
  completeDate?: string;
}

interface JiraIssue {
  key: string;
  fields: {
    issuetype: { name: string };
    summary: string;
    assignee: { accountId: string } | null;
    status: { name: string; statusCategory: { key: string } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  changelog?: {
    histories: {
      created: string;
      items: { field: string; fromString: string; toString: string }[];
    }[];
  };
}

function getAuthHeaders(config: IntegrationConfig): Record<string, string> {
  return {
    Authorization: `Basic ${Buffer.from(`user@example.com:${config.apiToken}`).toString("base64")}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function normalizeIssueType(jiraType: string): NormalizedIssue["type"] {
  const lower = jiraType.toLowerCase();
  if (lower.includes("bug")) return "bug";
  if (lower.includes("story") || lower.includes("user story")) return "story";
  if (lower.includes("spike") || lower.includes("research")) return "spike";
  if (lower.includes("task") || lower.includes("sub-task")) return "task";
  return "other";
}

function computeCycleTimeDays(issue: JiraIssue): number | null {
  if (!issue.changelog?.histories) return null;

  let inProgressDate: Date | null = null;
  let doneDate: Date | null = null;

  for (const history of issue.changelog.histories) {
    for (const item of history.items) {
      if (item.field === "status") {
        if (item.toString.toLowerCase().includes("in progress") && !inProgressDate) {
          inProgressDate = new Date(history.created);
        }
        if (item.toString.toLowerCase() === "done" || item.toString.toLowerCase() === "closed") {
          doneDate = new Date(history.created);
        }
      }
    }
  }

  if (inProgressDate && doneDate) {
    return Math.round((doneDate.getTime() - inProgressDate.getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
  }
  return null;
}

function getStoryPoints(issue: JiraIssue): number {
  // Common Jira story point field names
  const pointFields = ["story_points", "customfield_10016", "customfield_10028"];
  for (const field of pointFields) {
    if (issue.fields[field] !== undefined && issue.fields[field] !== null) {
      return Number(issue.fields[field]) || 0;
    }
  }
  return 0;
}

export async function testJiraConnection(
  config: IntegrationConfig
): Promise<ConnectionTestResult> {
  try {
    const headers = getAuthHeaders(config);

    // Test board access
    const boardRes = await fetch(
      `${config.baseUrl}/rest/agile/1.0/board/${config.boardId}`,
      { headers }
    );
    if (!boardRes.ok) {
      return { success: false, message: `Cannot access board: ${boardRes.status} ${boardRes.statusText}` };
    }
    const board = await boardRes.json();

    // Count sprints
    const sprintRes = await fetch(
      `${config.baseUrl}/rest/agile/1.0/board/${config.boardId}/sprint?state=closed&maxResults=1`,
      { headers }
    );
    const sprintData = sprintRes.ok ? await sprintRes.json() : { total: 0 };

    return {
      success: true,
      message: `Connected to board "${board.name}"`,
      details: {
        boardName: board.name,
        projectName: config.projectKey,
        sprintCount: sprintData.total || 0,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: `Connection failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

export async function fetchJiraSprints(
  config: IntegrationConfig,
  startDate?: string,
  endDate?: string
): Promise<{ sprints: NormalizedSprint[]; issues: NormalizedIssue[]; errors: string[] }> {
  const headers = getAuthHeaders(config);
  const errors: string[] = [];
  const allSprints: NormalizedSprint[] = [];
  const allIssues: NormalizedIssue[] = [];

  try {
    // Fetch closed sprints
    const sprintRes = await fetch(
      `${config.baseUrl}/rest/agile/1.0/board/${config.boardId}/sprint?state=closed&maxResults=50`,
      { headers }
    );
    if (!sprintRes.ok) {
      errors.push(`Failed to fetch sprints: ${sprintRes.status}`);
      return { sprints: [], issues: [], errors };
    }

    const sprintData = await sprintRes.json();
    let sprints = (sprintData.values || []) as JiraSprint[];

    // Filter by date range if provided
    if (startDate) {
      sprints = sprints.filter((s) => s.endDate && s.endDate >= startDate);
    }
    if (endDate) {
      sprints = sprints.filter((s) => s.startDate && s.startDate <= endDate);
    }

    // Fetch issues for each sprint
    for (let i = 0; i < sprints.length; i++) {
      const sprint = sprints[i];
      const issuesRes = await fetch(
        `${config.baseUrl}/rest/agile/1.0/sprint/${sprint.id}/issue?maxResults=200&expand=changelog&fields=issuetype,summary,assignee,status,story_points,customfield_10016,customfield_10028`,
        { headers }
      );

      if (!issuesRes.ok) {
        errors.push(`Failed to fetch issues for sprint ${sprint.name}: ${issuesRes.status}`);
        continue;
      }

      const issuesData = await issuesRes.json();
      const issues = (issuesData.issues || []) as JiraIssue[];

      let committedPoints = 0;
      let completedPoints = 0;
      let itemsCommitted = issues.length;
      let itemsCompleted = 0;
      let bugsFound = 0;

      for (const issue of issues) {
        const points = getStoryPoints(issue);
        committedPoints += points;

        const isDone = issue.fields.status.statusCategory.key === "done";
        if (isDone) {
          completedPoints += points;
          itemsCompleted++;
        }

        if (normalizeIssueType(issue.fields.issuetype.name) === "bug") {
          bugsFound++;
        }

        allIssues.push({
          key: issue.key,
          type: normalizeIssueType(issue.fields.issuetype.name),
          summary: issue.fields.summary,
          assigneeId: issue.fields.assignee?.accountId || null,
          storyPoints: points,
          cycleTimeDays: computeCycleTimeDays(issue),
          status: issue.fields.status.name,
          sprintName: sprint.name,
        });
      }

      allSprints.push({
        name: sprint.name,
        number: i + 1,
        startDate: sprint.startDate || "",
        endDate: sprint.endDate || sprint.completeDate || "",
        state: sprint.state === "closed" ? "closed" : sprint.state === "active" ? "active" : "future",
        committedPoints,
        completedPoints,
        itemsCommitted,
        itemsCompleted,
        bugsFound,
      });
    }
  } catch (err) {
    errors.push(`Jira API error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  return { sprints: allSprints, issues: allIssues, errors };
}
