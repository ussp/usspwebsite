"use client";

import Link from "next/link";

interface ReadinessStepsProps {
  assessmentId: string;
  currentStep: number;
  status: string;
  hasDataPillar?: boolean;
}

const STEPS = [
  { number: 1, label: "Company", path: "company" },
  { number: 2, label: "Team", path: "team" },
  { number: 3, label: "Policy", path: "policy" },
  { number: 4, label: "Scope", path: "scope" },
  { number: 5, label: "Constraints", path: "constraints" },
  { number: 6, label: "SDLC", path: "sdlc" },
  { number: 7, label: "Enhancements", path: "enhancements" },
  { number: 8, label: "Data", path: "data", conditional: true },
  { number: 9, label: "Use Cases", path: "use-cases" },
  { number: 10, label: "Questionnaire", path: "questionnaire" },
  { number: 11, label: "Distribute", path: "distribute" },
  { number: 12, label: "Risks", path: "risks" },
  { number: 13, label: "Report", path: "report" },
  { number: 14, label: "Pilot", path: "pilot" },
];

export default function ReadinessSteps({ assessmentId, currentStep, status, hasDataPillar = true }: ReadinessStepsProps) {
  const visibleSteps = STEPS.filter((s) => !s.conditional || hasDataPillar);
  const completedUpTo = status === "completed" ? 14 : status === "collecting" ? 10 : 0;

  return (
    <div className="bg-white rounded-lg border border-light-gray p-4 mb-6 overflow-x-auto">
      <div className="flex items-center gap-0.5 min-w-max">
        {visibleSteps.map((step, i) => {
          const isCompleted = step.number <= completedUpTo;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="flex items-center">
              <Link
                href={`/readiness/${assessmentId}/${step.path}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  isCurrent
                    ? "bg-primary text-white"
                    : isCompleted
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-light-gray text-dark/40 hover:text-dark/60"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">
                  {isCompleted && !isCurrent ? "\u2713" : step.number}
                </span>
                {step.label}
              </Link>
              {i < visibleSteps.length - 1 && (
                <div className={`w-4 h-px mx-0.5 ${isCompleted ? "bg-emerald-300" : "bg-light-gray"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
