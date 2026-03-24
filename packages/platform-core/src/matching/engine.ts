import type {
  DimensionScorer,
  DimensionResult,
  MatchResult,
  MatchConfig,
  CandidateMatchData,
  PositionMatchData,
} from "./types.js";
import { DEFAULT_CONFIG } from "./types.js";

// ═══════════════════════════════════════════════════════════════════════
// Matching Engine
// ═══════════════════════════════════════════════════════════════════════
//
// A pluggable matching engine that accepts an array of DimensionScorer
// implementations (Strategy pattern). Each scorer independently evaluates
// one dimension of candidate-position fit, and the engine combines the
// weighted dimension scores into an overall match result.
//
// Usage:
//   import { MatchingEngine } from "./engine.js";
//   import { ruleBasedScorers } from "./strategies/rule-based.js";
//
//   const engine = new MatchingEngine(ruleBasedScorers);
//   const result = engine.scoreCandidate(candidate, position);
// ═══════════════════════════════════════════════════════════════════════

export class MatchingEngine {
  private scorers: DimensionScorer[];
  private config: MatchConfig;

  constructor(
    scorers: DimensionScorer[],
    config: MatchConfig = DEFAULT_CONFIG
  ) {
    this.scorers = scorers;
    this.config = config;
  }

  /** Return the current engine configuration. */
  getConfig(): MatchConfig {
    return this.config;
  }

  /**
   * Score a single candidate against a position.
   *
   * @param candidate    Candidate data extracted from resume / profile.
   * @param position     Position requirements.
   * @param matchType    Context that triggered the match.
   * @returns            A MatchResult with overall score, per-dimension
   *                     breakdown, top match areas, and gap areas.
   */
  scoreCandidate(
    candidate: CandidateMatchData,
    position: PositionMatchData,
    matchType: "applied" | "passive_scan" | "manual_trigger" = "applied"
  ): MatchResult {
    const dimensions: DimensionResult[] = [];

    for (const scorer of this.scorers) {
      const weight = this.config.weights[scorer.name] ?? 0;
      if (weight === 0) continue;

      const raw = scorer.score(candidate, position);
      dimensions.push({
        ...raw,
        weight,
        weightedScore: raw.score * weight,
      });
    }

    // ── Overall score (weighted sum, clamped 0-100) ──────────────────
    const overallScore = Math.round(
      dimensions.reduce((sum, d) => sum + d.weightedScore, 0)
    );

    // ── Top match areas (dimensions scoring >= 70) ───────────────────
    const matchAreas = dimensions
      .filter((d) => d.score >= 70)
      .flatMap((d) =>
        d.matchedItems.length > 0
          ? d.matchedItems.slice(0, 3)
          : [d.dimension + " match"]
      );

    // ── Gap areas (dimensions scoring < 50) ──────────────────────────
    const gapAreas = dimensions
      .filter((d) => d.score < 50)
      .flatMap((d) =>
        d.missingItems.length > 0
          ? d.missingItems.slice(0, 3)
          : [d.dimension + " gap"]
      );

    // ── Confidence (lower when scorers had no data) ──────────────────
    const confidence =
      dimensions.length > 0
        ? Math.round(
            (dimensions.reduce((sum, d) => {
              // "No data" in notes means we guessed — lower confidence
              return sum + (d.notes?.includes("No data") ? 0.5 : 1.0);
            }, 0) /
              dimensions.length) *
              100
          )
        : 0;

    return {
      candidateId: candidate.candidateId,
      positionId: position.positionId,
      resumeId: "", // filled by the caller who owns the resume reference
      overallScore: Math.min(100, Math.max(0, overallScore)),
      confidence: Math.min(100, Math.max(0, confidence)),
      dimensions,
      matchAreas: matchAreas.slice(0, 5),
      gapAreas: gapAreas.slice(0, 5),
      algorithmVersion: this.config.engineVersion,
      matchType,
    };
  }

  /**
   * Score a batch of candidates against the same position.
   *
   * Results are returned in the same order as the input array.
   * For large batches consider calling this rather than repeated
   * single-candidate calls, since the engine may be extended with
   * batch-level optimisations in the future.
   */
  scoreBatch(
    candidates: CandidateMatchData[],
    position: PositionMatchData,
    matchType: "applied" | "passive_scan" | "manual_trigger" = "applied"
  ): MatchResult[] {
    return candidates.map((c) => this.scoreCandidate(c, position, matchType));
  }
}
