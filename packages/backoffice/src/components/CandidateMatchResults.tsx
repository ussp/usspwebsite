"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  id: string;
  candidate_id: string;
  overall_score: number;
  confidence: number;
  dimensions: DimensionResult[];
  match_areas: string[];
  gap_areas: string[];
  match_type: string;
  candidate_name?: string;
  candidate_email?: string;
  candidate_type?: string;
  computed_at: string;
}

interface ScoringResponse {
  scored: number;
  matched: number;
  error?: string;
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

const TYPE_COLORS: Record<string, string> = {
  internal_employee: "bg-blue-50 text-blue-700 border-blue-200",
  external: "bg-gray-50 text-gray-700 border-gray-200",
  vendor: "bg-purple-50 text-purple-700 border-purple-200",
};

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-emerald-500"
      : score >= 40
        ? "bg-amber-400"
        : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <span
        className={`text-sm font-semibold ${
          score >= 70
            ? "text-emerald-600"
            : score >= 40
              ? "text-amber-600"
              : "text-red-500"
        }`}
      >
        {Math.round(score)}%
      </span>
    </div>
  );
}

function DimensionDetail({ dim }: { dim: DimensionResult }) {
  const color =
    dim.score >= 70
      ? "bg-emerald-500"
      : dim.score >= 40
        ? "bg-amber-400"
        : "bg-red-400";
  return (
    <div className="flex items-center gap-3 py-1">
      <div className={`w-3 h-3 rounded-full ${color} shrink-0`} />
      <span className="text-xs text-dark/70 w-28">
        {DIMENSION_LABELS[dim.dimension] || dim.dimension}
      </span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(dim.score, 100)}%` }}
        />
      </div>
      <span className="text-xs text-dark/50 w-8 text-right">
        {Math.round(dim.score)}
      </span>
    </div>
  );
}

export default function CandidateMatchResults({
  positionId,
  autoTrigger = false,
}: {
  positionId: string;
  autoTrigger?: boolean;
}) {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchScore[]>([]);
  const [scoring, setScoring] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [scoringSummary, setScoringSummary] = useState<ScoringResponse | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "internal" | "bench">("all");
  const [sortInternalFirst, setSortInternalFirst] = useState(false);

  // Load existing match scores on mount
  useEffect(() => {
    fetch(`/api/positions/${positionId}/matches`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMatches(data);
        setLoadingExisting(false);
      })
      .catch(() => setLoadingExisting(false));
  }, [positionId]);

  // Auto-trigger scoring if requested (e.g. from dashboard link)
  useEffect(() => {
    if (autoTrigger && !loadingExisting && matches.length === 0) {
      handleScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTrigger, loadingExisting]);

  async function handleScore() {
    setScoring(true);
    setError("");
    setScoringSummary(null);
    try {
      const res = await fetch(`/api/positions/${positionId}/matches`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setScoring(false);
        return;
      }
      setScoringSummary(data);
      // Reload persisted scores
      const scoresRes = await fetch(`/api/positions/${positionId}/matches`);
      const scores = await scoresRes.json();
      if (Array.isArray(scores)) setMatches(scores);
    } catch {
      setError("Failed to run matching. Please try again.");
    }
    setScoring(false);
  }

  return (
    <div id="matching" className="bg-white rounded-lg border border-light-gray p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Candidate Matching
          </h3>
          {scoringSummary && (
            <p className="text-xs text-dark/50 mt-1">
              Scored {scoringSummary.scored} candidates &middot;{" "}
              {scoringSummary.matched} matches found
            </p>
          )}
        </div>
        <button
          onClick={handleScore}
          disabled={scoring}
          className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {scoring ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Scoring...
            </>
          ) : matches.length > 0 ? (
            "Re-score Candidates"
          ) : (
            "Find Matching Candidates"
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
          {error}
          {error.includes("requirements") && (
            <button
              onClick={() =>
                router.push(`/positions/${positionId}/edit`)
              }
              className="ml-2 underline hover:no-underline"
            >
              Edit Position
            </button>
          )}
        </div>
      )}

      {loadingExisting && (
        <p className="text-sm text-dark/40">Loading existing matches...</p>
      )}

      {!loadingExisting && matches.length === 0 && !error && (
        <p className="text-sm text-dark/40">
          No match results yet. Click &ldquo;Find Matching Candidates&rdquo; to
          score all candidates against this position.
        </p>
      )}

      {matches.length > 0 && (
        <div className="space-y-1">
          {/* Filter & Sort Controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              {(["all", "internal", "bench"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === f
                      ? "bg-primary text-white"
                      : "bg-white border border-light-gray text-dark/60 hover:bg-light-gray"
                  }`}
                >
                  {f === "all"
                    ? `All (${matches.length})`
                    : f === "internal"
                      ? `Internal (${matches.filter((m) => m.candidate_type === "internal_employee").length})`
                      : `Bench (${matches.filter((m) => m.candidate_type === "internal_employee").length})`}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-dark/60 cursor-pointer">
              <input
                type="checkbox"
                checked={sortInternalFirst}
                onChange={(e) => setSortInternalFirst(e.target.checked)}
                className="rounded border-gray-300"
              />
              Internal first
            </label>
          </div>

          {/* Header */}
          <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs text-dark/50 font-medium border-b border-light-gray">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Candidate</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-3">Strengths</div>
            <div className="col-span-2">Gaps</div>
          </div>

          {(() => {
            let displayMatches = matches;
            if (filter === "internal" || filter === "bench") {
              displayMatches = matches.filter(
                (m) => m.candidate_type === "internal_employee"
              );
            }
            if (sortInternalFirst) {
              displayMatches = [...displayMatches].sort((a, b) => {
                const aInternal = a.candidate_type === "internal_employee" ? 0 : 1;
                const bInternal = b.candidate_type === "internal_employee" ? 0 : 1;
                if (aInternal !== bInternal) return aInternal - bInternal;
                return b.overall_score - a.overall_score;
              });
            }
            return displayMatches;
          })().map((m, i) => (
            <div key={m.id}>
              {/* Row */}
              <div
                className="grid grid-cols-12 gap-3 px-3 py-3 items-center rounded-lg hover:bg-light-gray/50 cursor-pointer transition-colors"
                onClick={() =>
                  setExpandedRow(expandedRow === m.id ? null : m.id)
                }
              >
                <div className="col-span-1 text-sm text-dark/40 font-medium">
                  {i + 1}
                </div>
                <div className="col-span-3">
                  <div className="text-sm font-medium">
                    {m.candidate_name || "Unknown"}
                  </div>
                  <div className="text-xs text-dark/40">
                    {m.candidate_email}
                  </div>
                </div>
                <div className="col-span-1">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      TYPE_COLORS[m.candidate_type || "external"] ||
                      TYPE_COLORS.external
                    }`}
                  >
                    {m.candidate_type === "internal_employee"
                      ? "Internal"
                      : m.candidate_type === "vendor"
                        ? "Vendor"
                        : "External"}
                  </span>
                </div>
                <div className="col-span-2">
                  <ScoreBar score={m.overall_score} />
                  {m.confidence < 75 && (
                    <span className="text-[9px] text-amber-500">
                      Low data ({m.confidence}% conf)
                    </span>
                  )}
                </div>
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-1">
                    {(m.match_areas || []).slice(0, 3).map((area) => (
                      <span
                        key={area}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {(m.gap_areas || []).slice(0, 2).map((area) => (
                      <span
                        key={area}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {expandedRow === m.id && (
                <div className="px-3 pb-4 ml-8 mr-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-dark/60 uppercase tracking-wide">
                        Dimension Breakdown
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/candidates/${m.candidate_id}`);
                        }}
                        className="text-xs px-3 py-1 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                      >
                        View Candidate
                      </button>
                    </div>
                    {(m.dimensions || []).map((dim) => (
                      <DimensionDetail key={dim.dimension} dim={dim} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
