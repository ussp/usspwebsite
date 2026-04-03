import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import {
  upsertMetrics,
} from "@ussp-platform/core/queries/admin/ai-assessments";
import {
  fetchIntegrationData,
  computeScrumMetrics,
} from "@ussp-platform/core/integrations/adapter";
import type { IntegrationConfig } from "@ussp-platform/core/integrations/types";

/**
 * POST /api/integrations/jira/sync
 *
 * Fetches sprint data from a Jira Cloud instance, computes Scrum metrics,
 * and saves them to the assessment via upsertMetrics.
 *
 * Body: {
 *   assessmentId: string;
 *   baseUrl: string;       — Jira Cloud URL (e.g. https://myorg.atlassian.net)
 *   email: string;         — Jira user email for API auth
 *   apiToken: string;      — Jira API token
 *   projectKey: string;    — e.g. "PROJ"
 *   boardId: string;       — Scrum board ID
 *   startDate?: string;    — ISO date filter (optional)
 *   endDate?: string;      — ISO date filter (optional)
 * }
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { assessmentId, baseUrl, email, apiToken, projectKey, boardId, startDate, endDate } = body as {
    assessmentId?: string;
    baseUrl?: string;
    email?: string;
    apiToken?: string;
    projectKey?: string;
    boardId?: string;
    startDate?: string;
    endDate?: string;
  };

  if (!assessmentId || !baseUrl || !apiToken || !projectKey || !boardId) {
    return NextResponse.json(
      { error: "Missing required fields: assessmentId, baseUrl, apiToken, projectKey, boardId" },
      { status: 400 }
    );
  }

  // Build integration config
  const config: IntegrationConfig = {
    type: "jira",
    baseUrl: baseUrl.replace(/\/+$/, ""), // strip trailing slashes
    apiToken,
    email: email || undefined,
    projectKey,
    boardId,
  };

  // Fetch sprint + issue data from Jira
  const integrationResult = await fetchIntegrationData(config, startDate, endDate);

  if (!integrationResult.success && integrationResult.sprints.length === 0) {
    return NextResponse.json(
      {
        error: "Failed to fetch Jira data",
        details: integrationResult.errors,
      },
      { status: 502 }
    );
  }

  // Compute Scrum metrics from the normalized data
  const scrumMetrics = computeScrumMetrics(
    assessmentId,
    integrationResult.sprints,
    integrationResult.issues
  );

  if (scrumMetrics.length === 0) {
    return NextResponse.json(
      {
        error: "No completed sprints found in the specified date range",
        details: integrationResult.errors,
      },
      { status: 404 }
    );
  }

  // Persist metrics
  const saveResult = await upsertMetrics(scrumMetrics);
  if (!saveResult.success) {
    return NextResponse.json(
      { error: "Failed to save metrics", details: saveResult.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    sprints_fetched: integrationResult.sprints.length,
    issues_fetched: integrationResult.issues.length,
    metrics_saved: scrumMetrics.length,
    metrics: scrumMetrics,
    warnings: integrationResult.errors.length > 0 ? integrationResult.errors : undefined,
  });
}
