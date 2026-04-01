import type { EngagementStatus } from "@ussp-platform/core";

interface TimelinePhase {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface EngagementTimelineProps {
  currentStatus: EngagementStatus;
}

const PHASE_ORDER: { key: EngagementStatus; label: string }[] = [
  { key: "draft", label: "Setup" },
  { key: "readiness", label: "Readiness" },
  { key: "baseline", label: "Baseline" },
  { key: "training", label: "Training" },
  { key: "post_assessment", label: "Post-Assessment" },
  { key: "completed", label: "Complete" },
];

function getPhases(currentStatus: EngagementStatus): TimelinePhase[] {
  const currentIndex = PHASE_ORDER.findIndex((p) => p.key === currentStatus);

  return PHASE_ORDER.map((phase, i) => ({
    label: phase.label,
    status: i < currentIndex ? "completed" : i === currentIndex ? "current" : "upcoming",
  }));
}

export default function EngagementTimeline({ currentStatus }: EngagementTimelineProps) {
  if (currentStatus === "archived") {
    return (
      <div className="bg-gray-100 text-gray-500 text-sm px-4 py-2 rounded-lg">
        Archived
      </div>
    );
  }

  const phases = getPhases(currentStatus);

  return (
    <div className="flex items-center gap-2">
      {phases.map((phase, i) => (
        <div key={i} className="flex items-center">
          {/* Circle */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
              phase.status === "completed"
                ? "bg-success text-white"
                : phase.status === "current"
                  ? "bg-primary text-white"
                  : "bg-light-gray text-dark/40"
            }`}
          >
            {phase.status === "completed" ? "\u2713" : i + 1}
          </div>
          {/* Label */}
          <span
            className={`ml-1.5 text-xs ${
              phase.status === "current"
                ? "font-semibold text-primary"
                : phase.status === "completed"
                  ? "text-dark/60"
                  : "text-dark/30"
            }`}
          >
            {phase.label}
          </span>
          {/* Connector */}
          {i < phases.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-2 ${
                phase.status === "completed" ? "bg-success" : "bg-light-gray"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
