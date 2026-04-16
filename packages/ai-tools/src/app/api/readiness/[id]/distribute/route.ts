import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import {
  getQuestionnaire,
  createResponsesForMembers,
  updateQuestionnaireStatus,
} from "@ussp-platform/core/queries/admin/readiness-questionnaire";
import { getAssessmentTeam, listAssessmentMembers } from "@ussp-platform/core/queries/admin/readiness-team";
import { updateReadinessAssessment } from "@ussp-platform/core/queries/admin/readiness";
import { sendQuestionnaireInvitation } from "@/lib/email";

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
  if (!questionnaire) return NextResponse.json({ error: "Generate questionnaire first" }, { status: 400 });

  const team = await getAssessmentTeam(id);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 400 });

  const members = await listAssessmentMembers(team.id);
  if (!members.length) return NextResponse.json({ error: "No team members" }, { status: 400 });

  // Create response records with tokens
  const responses = await createResponsesForMembers(questionnaire.id, members);

  // Send emails
  const emailResults = [];
  for (const response of responses) {
    const member = members.find((m: { id: string }) => m.id === response.member_id);
    if (!member) continue;

    try {
      await sendQuestionnaireInvitation({
        to: member.email,
        memberName: member.name,
        token: response.token,
        assessmentName: "", // Will be populated by the email function
      });
      emailResults.push({ memberId: member.id, status: "sent" });
    } catch {
      emailResults.push({ memberId: member.id, status: "failed" });
    }
  }

  // Update statuses
  await updateQuestionnaireStatus(questionnaire.id, "sent");
  await updateReadinessAssessment(id, { status: "collecting" });

  return NextResponse.json({ responses: responses.length, emails: emailResults });
}
