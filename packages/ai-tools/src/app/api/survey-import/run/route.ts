import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";
import {
  createImportBatch,
  ensureExternalQuestionnaire,
  importResponses,
  updateImportBatchStatus,
} from "@ussp-platform/core/queries/admin/survey-import";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "ai_assessments.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { assessmentId, source, fileName, columnMap, rows } = body || {};

  if (!assessmentId || !columnMap || !Array.isArray(rows)) {
    return NextResponse.json(
      { error: "assessmentId, columnMap, and rows are required" },
      { status: 400 }
    );
  }

  const batch = await createImportBatch(
    assessmentId,
    source || "csv_import",
    fileName ?? null,
    (user.email as string) || "unknown"
  );

  try {
    await updateImportBatchStatus(batch.id, "processing", {
      total_rows: rows.length,
    });

    const questionIds = (columnMap.questions || []).map(
      (q: { question_id: string }) => q.question_id
    );
    const questionnaire = await ensureExternalQuestionnaire(
      assessmentId,
      questionIds
    );

    const summary = await importResponses(
      batch.id,
      assessmentId,
      questionnaire.id,
      rows,
      columnMap,
      source || "csv_import"
    );

    await updateImportBatchStatus(batch.id, "completed", {
      loaded_rows: summary.loaded,
      skipped_rows: summary.skipped,
      error_rows: summary.errors.length,
      error_log: summary.errors,
    });

    return NextResponse.json({
      batchId: batch.id,
      questionnaireId: questionnaire.id,
      ...summary,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Import failed";
    await updateImportBatchStatus(batch.id, "failed", {
      error_log: [{ row: -1, message: msg }],
    });
    return NextResponse.json({ error: msg, batchId: batch.id }, { status: 500 });
  }
}
