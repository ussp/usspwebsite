import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getReadinessAssessment } from "@ussp-platform/core/queries/admin/readiness";
import { getAssessmentCompany } from "@ussp-platform/core/queries/admin/readiness-company";
import { getAssessmentTeam, listAssessmentMembers } from "@ussp-platform/core/queries/admin/readiness-team";
import {
  getQuestionnaire,
  getQuestionnaireQuestions,
  listResponses,
} from "@ussp-platform/core/queries/admin/readiness-questionnaire";
import { buildWorkbook } from "@/lib/workbook";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const url = new URL(req.url);
  const responseId = url.searchParams.get("responseId");

  const assessment = await getReadinessAssessment(id);
  if (!assessment) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  const [company, team] = await Promise.all([
    getAssessmentCompany(id),
    getAssessmentTeam(id),
  ]);

  const questionnaire = await getQuestionnaire(id);
  if (!questionnaire) return NextResponse.json({ error: "No questionnaire generated yet" }, { status: 404 });

  const allQuestions = await getQuestionnaireQuestions(questionnaire.id);

  let response: { id: string; token: string } | null = null;
  let member: { name: string; email: string; role: string } | null = null;
  let filenameSuffix = "template";
  let questions = allQuestions;

  if (responseId) {
    const responses = await listResponses(questionnaire.id);
    const r = responses.find((x) => x.id === responseId);
    if (!r) return NextResponse.json({ error: "Response not found" }, { status: 404 });

    const members = team ? await listAssessmentMembers(team.id) : [];
    const m = members.find((x) => x.id === r.member_id);
    if (!m) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    response = { id: r.id, token: r.token };
    member = { name: m.name, email: m.email, role: m.role };

    // Filter by member's role — same rule the web form uses
    questions = allQuestions.filter((qq) => {
      const roles = qq.target_roles as string[];
      return roles.length === 0 || roles.includes(m.role);
    });

    filenameSuffix = m.email.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  }

  const buffer = buildWorkbook({
    assessment: { id: assessment.id, name: assessment.name },
    company: company ? { name: company.name } : null,
    team: team ? { name: team.name } : null,
    member,
    response,
    questionnaire: { id: questionnaire.id },
    questions: questions.map((qq) => ({
      sort_order: qq.sort_order,
      target_roles: qq.target_roles as string[],
      question_id: qq.question_id,
      question: {
        question_text: qq.question.question_text,
        description: qq.question.description,
        category: qq.question.category,
        anonymous_aggregate: qq.question.anonymous_aggregate,
      },
    })),
  });

  const body = new Uint8Array(buffer);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="questionnaire-${filenameSuffix}.xlsx"`,
      "Content-Length": String(body.byteLength),
    },
  });
}
