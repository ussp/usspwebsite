import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getQuestionnaire, listResponses } from "@ussp-platform/core/queries/admin/readiness-questionnaire";
import { listAssessmentMembers, getAssessmentTeam } from "@ussp-platform/core/queries/admin/readiness-team";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const questionnaire = await getQuestionnaire(id);
  if (!questionnaire) return NextResponse.json({ responses: [], members: [] });

  const responses = await listResponses(questionnaire.id);
  const team = await getAssessmentTeam(id);
  const members = team ? await listAssessmentMembers(team.id) : [];

  // Merge member info with response status
  const merged = members.map((m: { id: string; name: string; email: string; role: string }) => {
    const response = responses.find((r: { member_id: string }) => r.member_id === m.id);
    return {
      ...m,
      response_status: response?.status || "not_sent",
      response_token: response?.token || null,
      started_at: response?.started_at || null,
      completed_at: response?.completed_at || null,
    };
  });

  const completed = responses.filter((r: { status: string }) => r.status === "completed").length;
  return NextResponse.json({
    members: merged,
    total: members.length,
    completed,
    percentage: members.length ? Math.round((completed / members.length) * 100) : 0,
  });
}
