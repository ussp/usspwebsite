import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getQuestionnaire, listResponses } from "@ussp-platform/core/queries/admin/readiness-questionnaire";
import { getAssessmentTeam, listAssessmentMembers } from "@ussp-platform/core/queries/admin/readiness-team";
import { saveAnswers, completeResponse } from "@ussp-platform/core/queries/readiness-response";
import { parseWorkbook } from "@/lib/workbook";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: assessmentId } = await params;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Cap at 5 MB — workbook with questions + answers shouldn't exceed this
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File exceeds 5 MB limit" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let parsed;
  try {
    parsed = parseWorkbook(buffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to parse workbook";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (parsed.assessment_id !== assessmentId) {
    return NextResponse.json(
      { error: `Workbook is for a different assessment (${parsed.assessment_id}), not ${assessmentId}` },
      { status: 400 }
    );
  }

  const questionnaire = await getQuestionnaire(assessmentId);
  if (!questionnaire) return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 });
  if (questionnaire.id !== parsed.questionnaire_id) {
    return NextResponse.json({ error: "Workbook questionnaire_id does not match current questionnaire" }, { status: 400 });
  }

  const responses = await listResponses(questionnaire.id);

  let responseId = parsed.response_id;

  if (!responseId) {
    // Template mode — match by email
    if (!parsed.email) {
      return NextResponse.json(
        { error: "Workbook has no response_id and no email in the Email: cell. Fill in your email and re-upload." },
        { status: 400 }
      );
    }
    const team = await getAssessmentTeam(assessmentId);
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    const members = await listAssessmentMembers(team.id);

    const match = members.filter(
      (m) => m.email.trim().toLowerCase() === parsed.email!.trim().toLowerCase()
    );
    if (match.length === 0) {
      return NextResponse.json({ error: `No team member found with email ${parsed.email}` }, { status: 400 });
    }
    if (match.length > 1) {
      return NextResponse.json({ error: `Multiple members match email ${parsed.email}; contact admin` }, { status: 400 });
    }

    const r = responses.find((x) => x.member_id === match[0].id);
    if (!r) {
      return NextResponse.json({ error: `Member ${parsed.email} has no response record — run distribute first` }, { status: 400 });
    }
    responseId = r.id;
  } else {
    // Per-respondent mode — validate response_id belongs to this questionnaire
    const valid = responses.some((r) => r.id === responseId);
    if (!valid) {
      return NextResponse.json({ error: "response_id in workbook is not part of this questionnaire" }, { status: 400 });
    }
  }

  try {
    await saveAnswers(
      responseId,
      parsed.answers.map((a) => ({
        question_id: a.question_id,
        ...(a.score !== null ? { score: a.score } : {}),
        ...(a.comment ? { comment: a.comment } : {}),
        ...(a.flag ? { flag: a.flag } : {}),
      }))
    );

    await completeResponse(responseId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save answers";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    response_id: responseId,
    answers_imported: parsed.answers.length,
    warnings: parsed.warnings,
  });
}
