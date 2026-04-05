import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { CandidateOnboarding, OnboardingStepKey, OnboardingStepStatus } from "../../types/admin.js";

const ONBOARDING_COLUMNS =
  "id, site_id, candidate_id, application_id, status, i9_everify, background_check, orientation_training, identity_verification, address_verification, started_at, completed_at, created_at, updated_at";

const STEP_KEYS: OnboardingStepKey[] = ["i9_everify", "background_check", "orientation_training", "identity_verification", "address_verification"];

export async function getOnboardingsForCandidate(
  candidateId: string
): Promise<CandidateOnboarding[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidate_onboardings")
    .select(ONBOARDING_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getOnboardingByApplicationId(
  applicationId: string
): Promise<CandidateOnboarding | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidate_onboardings")
    .select(ONBOARDING_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("application_id", applicationId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function createOnboarding(
  candidateId: string,
  applicationId: string
): Promise<{ success: boolean; onboarding?: CandidateOnboarding; error?: string }> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidate_onboardings")
    .insert({
      site_id: getSiteId(),
      candidate_id: candidateId,
      application_id: applicationId,
      identity_verification: "not_started",
      address_verification: "not_started",
    })
    .select(ONBOARDING_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, onboarding: data };
}

export async function updateOnboardingStep(
  onboardingId: string,
  step: OnboardingStepKey,
  stepStatus: OnboardingStepStatus
): Promise<{ success: boolean; completed?: boolean; error?: string }> {
  const supabase = getServiceClient();

  // Update the step
  const updates: Record<string, unknown> = {
    [step]: stepStatus,
    updated_at: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from("candidate_onboardings")
    .update(updates)
    .eq("site_id", getSiteId())
    .eq("id", onboardingId);

  if (updateError) return { success: false, error: updateError.message };

  // Check if all steps are now completed
  const { data: record } = await supabase
    .from("candidate_onboardings")
    .select(ONBOARDING_COLUMNS)
    .eq("id", onboardingId)
    .single();

  if (record) {
    const allCompleted = STEP_KEYS.every(
      (k) => (record as Record<string, unknown>)[k] === "completed"
    );

    if (allCompleted && record.status !== "completed") {
      await supabase
        .from("candidate_onboardings")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", onboardingId);
      return { success: true, completed: true };
    }

    // If a step was changed away from completed, revert overall status
    if (!allCompleted && record.status === "completed") {
      await supabase
        .from("candidate_onboardings")
        .update({
          status: "in_progress",
          completed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", onboardingId);
    }
  }

  return { success: true, completed: false };
}
