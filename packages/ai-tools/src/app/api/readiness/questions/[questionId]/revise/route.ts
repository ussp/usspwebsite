import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import { reviseQuestion } from "@ussp-platform/core/queries/admin/question-bank";

export async function POST(request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { questionId } = await params;
  const body = await request.json();

  const revised = await reviseQuestion(
    questionId,
    body.question_text,
    body.description,
    user.email as string
  );
  return NextResponse.json(revised, { status: 201 });
}
