import { NextResponse } from "next/server";
import {
  getResponseByToken,
  getResponseMember,
  getQuestionsForResponse,
  getExistingAnswers,
  saveAnswers,
  completeResponse,
} from "@ussp-platform/core/queries/readiness-response";

// Public endpoint — no auth required (token-based access)

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const response = await getResponseByToken(token);
  if (!response) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });

  const member = await getResponseMember(response.member_id);
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  const questions = await getQuestionsForResponse(response.questionnaire_id, member.role);
  const existingAnswers = await getExistingAnswers(response.id);

  return NextResponse.json({
    response: {
      id: response.id,
      status: response.status,
      started_at: response.started_at,
      completed_at: response.completed_at,
    },
    member: {
      name: member.name,
      role: member.role,
      custom_role_label: member.custom_role_label,
    },
    questions: questions.map((qq) => ({
      id: qq.id,
      question_id: qq.question_id,
      question_text: qq.question?.question_text || "",
      description: qq.question?.description || null,
      category: qq.question?.category || "",
      capability: qq.question?.capability || null,
      is_required: qq.is_required,
      sort_order: qq.sort_order,
    })),
    answers: existingAnswers,
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const response = await getResponseByToken(token);
  if (!response) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });

  if (response.status === "completed") {
    return NextResponse.json({ error: "Already completed" }, { status: 400 });
  }

  const body = await request.json();

  // Save answers (partial or complete)
  if (body.answers) {
    await saveAnswers(response.id, body.answers);
  }

  // Mark complete if requested
  if (body.complete) {
    await completeResponse(response.id);
  }

  return NextResponse.json({ success: true });
}
