import { describe, it, expect } from "vitest";
import { recommend } from "../../engine/recommender.js";
import { OpenSpecMatchEngine } from "../../engine/index.js";
import type { DemandSpec } from "../../specs/demand-spec.js";
import type { CapabilitySpec } from "../../specs/capability-spec.js";
import type { SpecMatchResult } from "../../specs/match-result.js";
import { AIS140_DEMAND } from "../fixtures/fleettronix/ais140-demand.js";
import { USSPPL_FLEETRONIX_CAPABILITY } from "../fixtures/fleettronix/ussppl-fleetronix-capability.js";

describe("recommend() verdict rules", () => {
  const mkDemand = (): DemandSpec => ({
    id: "d",
    domain: "rfp",
    title: "Test",
    source: {
      type: "rfp_document",
      id: "d",
      extractedAt: new Date().toISOString(),
      extractorVersion: "test",
    },
    requirements: [
      {
        id: "r1",
        category: "compliance",
        taxonomyRef: null,
        rawText: "Mandatory cert",
        level: "advanced",
        criticality: "mandatory",
      },
    ],
    context: {},
  });

  const mkResult = (overrides: Partial<SpecMatchResult>): SpecMatchResult => ({
    demandId: "d",
    capabilityIds: ["c"],
    overallScore: 80,
    confidence: 80,
    engineVersion: "0.2.0",
    profileId: "government-rfp",
    computedAt: new Date().toISOString(),
    itemMatches: [
      {
        demandItemId: "r1",
        capabilityItemId: "ci-1",
        score: 90,
        scoreBreakdown: {
          taxonomyMatch: "exact",
          levelFit: 100,
          evidenceStrength: 80,
          recency: 80,
        },
        explanation: "match",
      },
    ],
    strengths: [],
    gaps: [],
    unknowns: [],
    categoryScores: {},
    passedMandatoryGate: true,
    failedMandatory: [],
    ...overrides,
  });

  it("returns GO when gate passes and score >= 70", () => {
    const rec = recommend(mkDemand(), mkResult({}));
    expect(rec.verdict).toBe("GO");
  });

  it("returns GO_WITH_REMEDIATION when gate passes but overall < 70", () => {
    const rec = recommend(mkDemand(), mkResult({ overallScore: 55 }));
    expect(rec.verdict).toBe("GO_WITH_REMEDIATION");
  });

  it("returns GO_WITH_REMEDIATION when mandatory fails but remediation supplied for all", () => {
    const rec = recommend(
      mkDemand(),
      mkResult({
        overallScore: 0,
        passedMandatoryGate: false,
        failedMandatory: ["r1"],
        itemMatches: [
          {
            demandItemId: "r1",
            capabilityItemId: null,
            score: 0,
            scoreBreakdown: {
              taxonomyMatch: "none",
              levelFit: 0,
              evidenceStrength: 0,
              recency: 0,
            },
            explanation: "missing",
          },
        ],
      }),
      {
        remediation: {
          r1: { description: "Get the cert", estimatedEffortWeeks: 8 },
        },
      },
    );
    expect(rec.verdict).toBe("GO_WITH_REMEDIATION");
    expect(rec.remediation).toHaveLength(1);
    expect(rec.remediation[0].estimatedEffortWeeks).toBe(8);
  });

  it("returns NO_GO when mandatory fails with no remediation path", () => {
    const rec = recommend(
      mkDemand(),
      mkResult({
        overallScore: 0,
        passedMandatoryGate: false,
        failedMandatory: ["r1"],
        itemMatches: [
          {
            demandItemId: "r1",
            capabilityItemId: null,
            score: 0,
            scoreBreakdown: {
              taxonomyMatch: "none",
              levelFit: 0,
              evidenceStrength: 0,
              recency: 0,
            },
            explanation: "missing",
          },
        ],
      }),
    );
    expect(rec.verdict).toBe("NO_GO");
  });

  it("collects blockers (mandatory fails + important misses)", () => {
    const demand: DemandSpec = {
      ...mkDemand(),
      requirements: [
        ...mkDemand().requirements,
        {
          id: "r2",
          category: "infrastructure",
          taxonomyRef: null,
          rawText: "Important infra",
          level: "advanced",
          criticality: "important",
        },
      ],
    };
    const rec = recommend(
      demand,
      mkResult({
        overallScore: 0,
        passedMandatoryGate: false,
        failedMandatory: ["r1"],
        itemMatches: [
          {
            demandItemId: "r1",
            capabilityItemId: null,
            score: 0,
            scoreBreakdown: {
              taxonomyMatch: "none",
              levelFit: 0,
              evidenceStrength: 0,
              recency: 0,
            },
            explanation: "missing",
          },
          {
            demandItemId: "r2",
            capabilityItemId: "ci-x",
            score: 40,
            scoreBreakdown: {
              taxonomyMatch: "related",
              levelFit: 60,
              evidenceStrength: 40,
              recency: 60,
            },
            explanation: "partial",
          },
        ],
      }),
    );
    expect(rec.blockers.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Fleettronix fixture acceptance (spec scenario §8.5)", () => {
  const engine = new OpenSpecMatchEngine();

  it("returns GO_WITH_REMEDIATION with blockers including TAC/NIC/VAHAN/ERSS/CERT-IN when remediation is supplied", () => {
    const consortium = engine.combineCapabilities([USSPPL_FLEETRONIX_CAPABILITY], {
      combinedId: "consortium-test",
      combinedName: "Test Consortium",
    });

    const remediation = {
      "cmp-001": { description: "Engage ARAI for AIS 140 TAC", estimatedEffortWeeks: 12 },
      "cmp-003": { description: "CERT-IN audit", estimatedEffortWeeks: 10 },
      "cmp-004": { description: "SSL setup", estimatedEffortWeeks: 1 },
      "cmp-005": { description: "SoI map", estimatedEffortWeeks: 4 },
      "cmp-002": { description: "COP testing", estimatedEffortWeeks: 4 },
      "inf-001": { description: "NIC Cloud migration", estimatedEffortWeeks: 8 },
      "inf-002": { description: "VAHAN integration", estimatedEffortWeeks: 6 },
      "inf-003": { description: "ERSS integration", estimatedEffortWeeks: 4 },
      "inf-004": { description: "AIS 140 feature mapping", estimatedEffortWeeks: 4 },
      "inf-005": { description: "In product; document", estimatedEffortWeeks: 2 },
      "inf-006": { description: "Extend panic to ERSS+Control Tower", estimatedEffortWeeks: 2 },
      "inf-011": { description: "SMS gateway", estimatedEffortWeeks: 2 },
      "inf-016": { description: "Retention policy", estimatedEffortWeeks: 1 },
      "inf-018": { description: "MoRTH Data Sharing API", estimatedEffortWeeks: 3 },
      "man-001": { description: "AP helpdesk", estimatedEffortWeeks: 6 },
      "man-003": { description: "MC staffing", estimatedEffortWeeks: 8 },
      "man-005": { description: "PIU coordination", estimatedEffortWeeks: 2 },
      "man-007": { description: "O&M squad", estimatedEffortWeeks: 2 },
      "fin-003": { description: "PBG line", estimatedEffortWeeks: 3 },
      "fin-004": { description: "EMD", estimatedEffortWeeks: 2 },
      "geo-001": { description: "AP branch in 60 days", estimatedEffortWeeks: 8 },
    };

    const result = engine.matchRFP(AIS140_DEMAND, consortium, {
      profileId: "government-rfp",
      recommender: { remediation, goThreshold: 70 },
    });

    expect(result.recommendation).toBeDefined();
    const rec = result.recommendation!;
    expect(rec.verdict).toBe("GO_WITH_REMEDIATION");

    // Spec acceptance: minimum blockers include TAC, NIC, VAHAN, ERSS, CERT-IN
    const blockerIds = rec.blockers.map((b) => b.demandItemId);
    expect(blockerIds).toContain("cmp-001"); // TAC
    expect(blockerIds).toContain("cmp-003"); // CERT-IN
    expect(blockerIds).toContain("inf-001"); // NIC Cloud
    expect(blockerIds).toContain("inf-002"); // VAHAN
    expect(blockerIds).toContain("inf-003"); // ERSS

    // Spec: >= 5 blockers identified
    expect(rec.blockers.length).toBeGreaterThanOrEqual(5);
  });
});
