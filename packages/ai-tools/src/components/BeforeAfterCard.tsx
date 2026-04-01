import ImprovementBadge from "./ImprovementBadge";

interface BeforeAfterCardProps {
  label: string;
  baselineValue: number;
  postValue: number;
  improvementPct: number;
  unit: string;
  direction: "higher_better" | "lower_better";
}

function formatValue(value: number, unit: string): string {
  if (unit === "per_week") return `${value}/wk`;
  if (unit === "minutes") {
    if (value >= 1440) return `${(value / 1440).toFixed(1)} days`;
    if (value >= 60) return `${(value / 60).toFixed(1)} hrs`;
    return `${value} min`;
  }
  if (unit === "percentage") return `${value}%`;
  if (unit === "story_points") return `${value} pts`;
  if (unit === "score_1_5") return `${value.toFixed(1)}/5`;
  if (unit === "count") return `${value}`;
  return `${value}`;
}

export default function BeforeAfterCard({
  label,
  baselineValue,
  postValue,
  improvementPct,
  unit,
}: BeforeAfterCardProps) {
  return (
    <div className="bg-white rounded-lg border border-light-gray p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-dark/70">{label}</h4>
        <ImprovementBadge value={improvementPct} size="sm" />
      </div>
      <div className="flex items-end gap-6">
        <div>
          <p className="text-xs text-dark/40 mb-1">Baseline</p>
          <p className="text-lg font-semibold text-dark/60">{formatValue(baselineValue, unit)}</p>
        </div>
        <div className="text-dark/30 text-lg mb-0.5">&rarr;</div>
        <div>
          <p className="text-xs text-dark/40 mb-1">Post-Training</p>
          <p className="text-lg font-semibold">{formatValue(postValue, unit)}</p>
        </div>
      </div>
    </div>
  );
}
