import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import {
  getQuestionnaire,
  getQuestionnaireQuestions,
  removeQuestionFromQuestionnaire,
  reorderQuestionnaireQuestions,
} from "@ussp-platform/core/queries/admin/readiness-questionnaire";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const questionnaire = await getQuestionnaire(id);
  if (!questionnaire) return NextResponse.json(null);

  const questions = await getQuestionnaireQuestions(questionnaire.id);
  return NextResponse.json({ questionnaire, questions });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const questionnaire = await getQuestionnaire(id);
  if (!questionnaire) return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 });

  // Handle reorder
  if (body.action === "reorder" && body.orderedIds) {
    await reorderQuestionnaireQuestions(questionnaire.id, body.orderedIds);
    return NextResponse.json({ success: true });
  }

  // Handle remove question
  if (body.action === "remove" && body.questionId) {
    await removeQuestionFromQuestionnaire(body.questionId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
