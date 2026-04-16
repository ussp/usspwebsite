import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import { getQuestionnaire, listResponses } from "@ussp-platform/core/queries/admin/readiness-questionnaire";
import { listAssessmentMembers, getAssessmentTeam } from "@ussp-platform/core/queries/admin/readiness-team";
import { sendQuestionnaireReminder } from "@/lib/email";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const questionnaire = await getQuestionnaire(id);
  if (!questionnaire) return NextResponse.json({ error: "No questionnaire" }, { status: 400 });

  const responses = await listResponses(questionnaire.id);
  const incomplete = responses.filter((r: { status: string }) => r.status !== "completed");

  const team = await getAssessmentTeam(id);
  const members = team ? await listAssessmentMembers(team.id) : [];

  let sent = 0;
  for (const response of incomplete) {
    const member = members.find((m: { id: string }) => m.id === response.member_id);
    if (!member) continue;

    try {
      await sendQuestionnaireReminder({
        to: member.email,
        memberName: member.name,
        token: response.token,
      });
      sent++;
    } catch {
      // Continue with other members
    }
  }

  return NextResponse.json({ reminders_sent: sent, incomplete_count: incomplete.length });
}
