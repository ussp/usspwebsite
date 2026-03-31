"use client";

import { useEffect, useState } from "react";

interface DimensionResult {
  dimension: string;
  score: number;
  weight: number;
  weightedScore: number;
  matchedItems: string[];
  missingItems: string[];
  notes: string | null;
}

interface MatchScore {
  overall_score: number;
  confidence: number;
  dimensions: DimensionResult[];
  match_areas: string[];
  gap_areas: string[];
}

const DIMENSION_LABELS: Record<string, string> = {
  skills: "Skills",
  experience_level: "Experience",
  location: "Location",
  education: "Education",
  certifications: "Certifications",
  resume_recency: "Resume Recency",
  availability: "Availability",
  rate_compatibility: "Rate",
};

function ScoreDot({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-emerald-500"
      : score >= 40
        ? "bg-amber-400"
        : "bg-red-400";
  return <div className={`w-4 h-4 rounded-full ${color}`} />;
}

interface MatchingQualificationsProps {
  positionId: string | null;
  candidateId?: string;
}

export default function MatchingQualifications({
  positionId,
}: MatchingQualificationsProps) {
  const [match, setMatch] = useState<MatchScore | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!positionId) return;
    setLoading(true);
    fetch(`/api/positions/${positionId}/matches`)
      .then((r) => r.json())
      .then((data) => {
        // The endpoint returns an array of match scores
        // For now, we show the first one if available
        if (Array.isArray(data) && data.length > 0) {
          setMatch(data[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [positionId]);

  if (!positionId) return null;
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-light-gray p-5">
        <h3 className="font-semibold mb-3">Matching Qualifications</h3>
        <p className="text-xs text-dark/40">Loading...</p>
      </div>
    );
  }
  if (!match) return null;

  return (
    <div className="bg-white rounded-lg border border-light-gray p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Matching Qualifications</h3>
        <span className="text-lg font-bold text-primary">
          {Math.round(match.overall_score)}%
        </span>
      </div>

      {/* Dimension scores */}
      <div className="space-y-2 mb-4">
        {match.dimensions?.map((dim) => (
          <div key={dim.dimension} className="flex items-center gap-2">
            <ScoreDot score={dim.score} />
            <span className="text-sm text-dark/70 flex-1">
              {DIMENSION_LABELS[dim.dimension] || dim.dimension}
            </span>
            <span className="text-xs text-dark/40">{Math.round(dim.score)}%</span>
          </div>
        ))}
      </div>

      {/* Match & Gap areas */}
      {match.match_areas?.length > 0 && (
        <div className="mb-2">
          <p className="text-[10px] uppercase tracking-wide text-dark/40 mb-1">Strengths</p>
          <div className="flex flex-wrap gap-1">
            {match.match_areas.map((area) => (
              <span
                key={area}
                className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
      {match.gap_areas?.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wide text-dark/40 mb-1">Gaps</p>
          <div className="flex flex-wrap gap-1">
            {match.gap_areas.map((area) => (
              <span
                key={area}
                className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
