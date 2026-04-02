import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateOnboardingStep } from "@ussp-platform/core/queries/admin/onboarding";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole, OnboardingStepKey, OnboardingStepStatus } from "@ussp-platform/core/types/admin";

const VALID_STEPS: OnboardingStepKey[] = ["i9_everify", "background_check", "orientation_training"];
const VALID_STATUSES: OnboardingStepStatus[] = ["not_started", "in_progress", "completed"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; onboardingId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { onboardingId } = await params;
  const body = await request.json();

  const step = body.step as OnboardingStepKey;
  const stepStatus = body.status as OnboardingStepStatus;

  if (!VALID_STEPS.includes(step)) {
    return NextResponse.json({ error: `Invalid step: ${step}` }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(stepStatus)) {
    return NextResponse.json({ error: `Invalid status: ${stepStatus}` }, { status: 400 });
  }

  const result = await updateOnboardingStep(onboardingId, step, stepStatus);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true, completed: result.completed });
}
