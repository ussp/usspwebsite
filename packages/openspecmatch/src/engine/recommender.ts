/**
 * Bid/No-Bid Recommender
 *
 * Transforms a SpecMatchResult (typically from an RFP match) into a structured
 * Recommendation with verdict (GO | GO_WITH_REMEDIATION | NO_GO), blockers list,
 * and remediation plan hints.
 *
 * Heuristic verdict rules (see add-rfp-matching-phase2 spec for scenarios):
 *   - passedMandatoryGate && overallScore >= 70           -> GO
 *   - failedMandatory has known remediation              -> GO_WITH_REMEDIATION
 *   - otherwise                                          -> NO_GO
 */

import type { DemandSpec, DemandItem } from "../specs/demand-spec.js";
import type {
  SpecMatchResult,
  Recommendation,
  BlockerItem,
  RemediationPlan,
} from "../specs/match-result.js";

/** Optional remediation lookup — caller can supply per-item remediation paths */
export type RemediationLookup = Record<
  string,
  { description: string; estimatedEffortWeeks?: number; ownerHint?: string }
>;

export interface RecommenderOptions {
  /** Per demand-item remediation paths, keyed by demand item id. */
  remediation?: RemediationLookup;
  /** Score threshold above which a clean-pass recommendation becomes GO. Default 70. */
  goThreshold?: number;
  /** Default heuristic: assume remediation is 'available' if passedMandatoryGate is false AND at least one remediation entry is provided. */
  defaultRemediationWeeks?: number;
}

export function recommend(
  demand: DemandSpec,
  result: SpecMatchResult,
  options: RecommenderOptions = {},
): Recommendation {
  const goThreshold = options.goThreshold ?? 70;
  const lookup = options.remediation ?? {};
  const demandById = new Map(demand.requirements.map((r) => [r.id, r]));

  // Build blockers = failed mandatory + other items scored < 50 that are 'important' or higher
  const blockers: BlockerItem[] = [];
  for (const match of result.itemMatches) {
    const req = demandById.get(match.demandItemId);
    if (!req) continue;

    const isFailed = result.failedMandatory.includes(match.demandItemId);
    const isImportantMiss =
      (req.criticality === "important" || req.criticality === "mandatory") &&
      match.score < 50;

    if (isFailed || isImportantMiss) {
      blockers.push({
        demandItemId: req.id,
        category: req.category,
        rawText: req.rawText,
        criticality: req.criticality,
        score: match.score,
      });
    }
  }

  // Build remediation plans for every blocker that has a lookup entry
  const remediation: RemediationPlan[] = [];
  for (const blocker of blockers) {
    const entry = lookup[blocker.demandItemId];
    if (entry) {
      remediation.push({
        demandItemId: blocker.demandItemId,
        description: entry.description,
        ...(entry.estimatedEffortWeeks !== undefined
          ? { estimatedEffortWeeks: entry.estimatedEffortWeeks }
          : {}),
        ...(entry.ownerHint !== undefined ? { ownerHint: entry.ownerHint } : {}),
      });
    }
  }

  // Verdict rules
  const mandatoryBlockers = blockers.filter(
    (b) => b.criticality === "mandatory",
  );

  let verdict: Recommendation["verdict"];
  let rationale: string;

  if (
    result.passedMandatoryGate &&
    result.overallScore >= goThreshold
  ) {
    verdict = "GO";
    rationale = `Passed mandatory gate with overall score ${result.overallScore} >= ${goThreshold}.`;
  } else if (mandatoryBlockers.length === 0) {
    // No mandatory blockers but lower overall score — degrade to GO_WITH_REMEDIATION
    verdict = "GO_WITH_REMEDIATION";
    rationale = `No mandatory blockers, but overall score ${result.overallScore} is below ${goThreshold}. Address important gaps before pitch.`;
  } else {
    // There are mandatory blockers. GO_WITH_REMEDIATION only if every one has a remediation path.
    const covered = mandatoryBlockers.every((b) =>
      remediation.some((r) => r.demandItemId === b.demandItemId),
    );
    if (covered) {
      verdict = "GO_WITH_REMEDIATION";
      rationale = `Mandatory gate failed on ${mandatoryBlockers.length} item(s), but each has a remediation path.`;
    } else {
      const unremediated = mandatoryBlockers
        .filter(
          (b) => !remediation.some((r) => r.demandItemId === b.demandItemId),
        )
        .map((b) => b.demandItemId);
      verdict = "NO_GO";
      rationale = `Mandatory gate failed with unremediated blockers: ${unremediated.join(", ")}.`;
    }
  }

  return {
    verdict,
    rationale,
    blockers,
    remediation,
  };
}

// Expose helper for building remediation lookups from demand-item `context` strings
// that follow the convention "remediation:<desc>|weeks:<n>|owner:<hint>".
export function remediationFromDemand(
  demand: DemandSpec,
): RemediationLookup {
  const out: RemediationLookup = {};
  for (const req of demand.requirements) {
    if (!req.context) continue;
    const match = /remediation:([^|]+)(?:\|weeks:(\d+))?(?:\|owner:([^|]+))?/.exec(
      req.context,
    );
    if (match) {
      out[req.id] = {
        description: match[1].trim(),
        ...(match[2] ? { estimatedEffortWeeks: Number(match[2]) } : {}),
        ...(match[3] ? { ownerHint: match[3].trim() } : {}),
      };
    }
  }
  return out;
}
