import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import { scanJiraQuality } from "@ussp-platform/core/integrations/jira-quality-scanner";
import type { IntegrationConfig } from "@ussp-platform/core/integrations/types";

/**
 * POST /api/integrations/jira/quality-scan
 *
 * Scans Jira project for quality metrics — story quality, test coverage,
 * documentation, defects, rework, and planning accuracy.
 *
 * Body: { baseUrl, email, projectKey, boardId, apiToken, sprintCount? }
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { baseUrl, email, projectKey, boardId, apiToken, sprintCount } = body;

  if (!baseUrl || !projectKey || !boardId || !apiToken) {
    return NextResponse.json(
      { error: "Missing required fields: baseUrl, projectKey, boardId, apiToken" },
      { status: 400 }
    );
  }

  const config: IntegrationConfig = { baseUrl, email, projectKey, boardId, apiToken };
  const { data, error } = await scanJiraQuality(config, sprintCount || 3);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}
