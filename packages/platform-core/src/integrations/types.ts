/**
 * Unified integration types for Scrum tool data normalization.
 *
 * All platform-specific clients (Jira, Azure DevOps, GitHub, etc.)
 * normalize their data into these shared types via the adapter.
 */

export interface IntegrationConfig {
  type: "jira" | "azure_devops" | "github" | "gitlab" | "linear";
  baseUrl: string;
  apiToken: string;
  projectKey?: string;
  boardId?: string;
  repositoryOwner?: string;
  repositoryName?: string;
}

export interface NormalizedSprint {
  name: string;
  number: number;
  startDate: string;
  endDate: string;
  state: "active" | "closed" | "future";
  committedPoints: number;
  completedPoints: number;
  itemsCommitted: number;
  itemsCompleted: number;
  bugsFound: number;
}

export interface NormalizedIssue {
  key: string;
  type: "story" | "bug" | "task" | "spike" | "other";
  summary: string;
  assigneeId: string | null;
  storyPoints: number;
  cycleTimeDays: number | null;
  status: string;
  sprintName: string;
}

export interface NormalizedDeployment {
  id: string;
  createdAt: string;
  environment: string;
  success: boolean;
  commitSha: string;
}

export interface NormalizedPullRequest {
  id: string;
  title: string;
  createdAt: string;
  mergedAt: string | null;
  authorId: string;
  reviewTimeMinutes: number | null;
}

export interface IntegrationResult {
  success: boolean;
  sprints: NormalizedSprint[];
  issues: NormalizedIssue[];
  deployments: NormalizedDeployment[];
  pullRequests: NormalizedPullRequest[];
  errors: string[];
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    projectName?: string;
    boardName?: string;
    sprintCount?: number;
    issueCount?: number;
  };
}
