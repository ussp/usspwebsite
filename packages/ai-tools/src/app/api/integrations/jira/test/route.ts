import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import { testJiraConnection } from "@ussp-platform/core/integrations/jira";
import type { IntegrationConfig } from "@ussp-platform/core/integrations/types";

/**
 * POST /api/integrations/jira/test
 *
 * Tests connectivity to a Jira Cloud instance.
 *
 * Body: { baseUrl, email, apiToken, projectKey, boardId }
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_engagements.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { baseUrl, email, apiToken, projectKey, boardId } = body as {
    baseUrl?: string;
    email?: string;
    apiToken?: string;
    projectKey?: string;
    boardId?: string;
  };

  if (!baseUrl || !apiToken || !boardId) {
    return NextResponse.json(
      { error: "Missing required fields: baseUrl, apiToken, boardId" },
      { status: 400 }
    );
  }

  const config: IntegrationConfig = {
    type: "jira",
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiToken,
    email: email || undefined,
    projectKey: projectKey || "",
    boardId,
  };

  const result = await testJiraConnection(config);
  return NextResponse.json(result);
}
