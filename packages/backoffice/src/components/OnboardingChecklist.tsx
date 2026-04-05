"use client";

import Tooltip from "./Tooltip";

interface OnboardingRecord {
  id: string;
  candidate_id: string;
  application_id: string;
  status: "in_progress" | "completed";
  i9_everify: string;
  background_check: string;
  orientation_training: string;
  identity_verification: string;
  address_verification: string;
  started_at: string;
  completed_at: string | null;
}

type StepKey = "i9_everify" | "background_check" | "identity_verification" | "address_verification" | "orientation_training";
type StepStatus = "not_started" | "in_progress" | "completed";

const STEPS: { key: StepKey; label: string; tooltip: string }[] = [
  {
    key: "i9_everify",
    label: "I-9 / E-Verify",
    tooltip: "Employment eligibility verification required by federal law",
  },
  {
    key: "background_check",
    label: "Background Check",
    tooltip: "Criminal, employment history, and credential verification",
  },
  {
    key: "identity_verification",
    label: "Identity Verification (ID)",
    tooltip: "Government-issued photo ID verification",
  },
  {
    key: "address_verification",
    label: "Address Verification (Utility Bill)",
    tooltip: "Proof of address via utility bill or similar document",
  },
  {
    key: "orientation_training",
    label: "Orientation & Training",
    tooltip: "Company policies, client-specific training, and compliance",
  },
];

const STATUS_COLORS: Record<StepStatus, string> = {
  not_started: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const STATUS_LABELS: Record<StepStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

interface OnboardingChecklistProps {
  onboarding: OnboardingRecord;
  onStepChange: (onboardingId: string, step: StepKey, status: StepStatus) => Promise<void>;
}

export default function OnboardingChecklist({ onboarding, onStepChange }: OnboardingChecklistProps) {
  const completedCount = STEPS.filter(
    (s) => (onboarding[s.key] as StepStatus) === "completed"
  ).length;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-dark/50">
          {completedCount}/{STEPS.length}
        </span>
      </div>

      {/* Steps */}
      {STEPS.map((step) => {
        const currentStatus = (onboarding[step.key] as StepStatus) || "not_started";

        return (
          <div
            key={step.key}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-light-gray/30"
          >
            <div className="flex items-center gap-2">
              {currentStatus === "completed" ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : currentStatus === "in_progress" ? (
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
              <Tooltip text={step.tooltip} position="right">
                <span className="text-sm cursor-help">{step.label}</span>
              </Tooltip>
            </div>
            <select
              value={currentStatus}
              onChange={(e) =>
                onStepChange(onboarding.id, step.key, e.target.value as StepStatus)
              }
              className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${STATUS_COLORS[currentStatus]}`}
            >
              <option value="not_started">{STATUS_LABELS.not_started}</option>
              <option value="in_progress">{STATUS_LABELS.in_progress}</option>
              <option value="completed">{STATUS_LABELS.completed}</option>
            </select>
          </div>
        );
      })}

      {/* Overall status */}
      {onboarding.status === "completed" && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Onboarding complete
          {onboarding.completed_at && (
            <span className="text-emerald-600/60">
              &middot; {new Date(onboarding.completed_at).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
