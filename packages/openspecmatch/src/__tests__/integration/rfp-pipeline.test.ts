import { describe, it, expect } from "vitest";
import { OpenSpecMatchEngine } from "../../engine/index.js";
import type { RFPInput } from "../../extractors/rfp-extractor.js";
import type { CompanyInput } from "../../extractors/company-extractor.js";
import { AIS140_DEMAND } from "../fixtures/fleettronix/ais140-demand.js";
import { USSPPL_FLEETRONIX_CAPABILITY } from "../fixtures/fleettronix/ussppl-fleetronix-capability.js";

/**
 * Phase 2 end-to-end integration tests (§9.3-9.5, rule-based path).
 *
 * LLM-based extractor tests are NOT included here — they require live LLM
 * credentials and live PDF ingestion. Those should live in a separate suite
 * gated on env vars.
 */

describe("Phase 2 RFP pipeline — rule-based integration", () => {
  const engine = new OpenSpecMatchEngine();

  it("RFPExtractor produces a DemandSpec with rfp domain and rfp_document source", () => {
    const input: RFPInput = {
      id: "rfp-test",
      title: "Test RFP",
      requirements: [
        {
          id: "r1",
          category: "compliance",
          rawText: "AIS 140 Type Approval Certificate",
          criticality: "mandatory",
        },
        {
          id: "r2",
          category: "infrastructure",
          rawText: "NIC Cloud hosting",
          criticality: "mandatory",
        },
      ],
      industry: "government-transport",
      location: { state: "AP", country: "IN", workMode: "onsite" },
      metadata: { scheme: "Nirbhaya" },
    };

    const demand = engine.extractRFP(input);
    expect(demand.domain).toBe("rfp");
    expect(demand.source.type).toBe("rfp_document");
    expect(demand.requirements).toHaveLength(2);
    // Taxonomy resolved (NIC Cloud is in infrastructure tree)
    expect(demand.requirements[1].taxonomyRef).not.toBeNull();
  });

  it("CompanyExtractor produces a CapabilitySpec with company domain and company_profile source", () => {
    const input: CompanyInput = {
      id: "co-test",
      name: "TestCo",
      capabilities: [
        {
          category: "infrastructure",
          rawText: "Fleetronix Control Tower",
          level: "expert",
          evidence: [
            { description: "Deployed for Fortune 500", source: "deck", durationMonths: 36 },
          ],
        },
      ],
      location: { city: "Hyderabad", state: "TG", country: "IN" },
    };
    const cap = engine.extractCompany(input);
    expect(cap.domain).toBe("company");
    expect(cap.source.type).toBe("company_profile");
    expect(cap.capabilities[0].evidence[0].source).toBe("deck");
  });

  it("Combinator + matchRFP + recommender yields GO_WITH_REMEDIATION for Fleettronix fixture", () => {
    // Spec scenario §9.5 acceptance
    const consortium = engine.combineCapabilities([USSPPL_FLEETRONIX_CAPABILITY], {
      combinedId: "consortium-e2e",
      combinedName: "E2E Consortium",
    });

    const remediation = {
      "cmp-001": { description: "Engage ARAI", estimatedEffortWeeks: 12 },
      "cmp-002": { description: "COP", estimatedEffortWeeks: 4 },
      "cmp-003": { description: "CERT-IN", estimatedEffortWeeks: 10 },
      "cmp-004": { description: "SSL", estimatedEffortWeeks: 1 },
      "cmp-005": { description: "SoI map", estimatedEffortWeeks: 4 },
      "inf-001": { description: "NIC Cloud", estimatedEffortWeeks: 8 },
      "inf-002": { description: "VAHAN", estimatedEffortWeeks: 6 },
      "inf-003": { description: "ERSS", estimatedEffortWeeks: 4 },
      "inf-004": { description: "AIS 140 map", estimatedEffortWeeks: 4 },
      "inf-005": { description: "Documented mapping", estimatedEffortWeeks: 2 },
      "inf-006": { description: "Dual routing", estimatedEffortWeeks: 2 },
      "inf-011": { description: "SMS gateway", estimatedEffortWeeks: 2 },
      "inf-016": { description: "Retention policy", estimatedEffortWeeks: 1 },
      "inf-018": { description: "Data Sharing API", estimatedEffortWeeks: 3 },
      "man-001": { description: "Helpdesk", estimatedEffortWeeks: 6 },
      "man-003": { description: "MC staffing", estimatedEffortWeeks: 8 },
      "man-005": { description: "PIU coord", estimatedEffortWeeks: 2 },
      "man-007": { description: "O&M squad", estimatedEffortWeeks: 2 },
      "fin-003": { description: "PBG", estimatedEffortWeeks: 3 },
      "fin-004": { description: "EMD", estimatedEffortWeeks: 2 },
      "geo-001": { description: "AP presence", estimatedEffortWeeks: 8 },
    };

    const result = engine.matchRFP(AIS140_DEMAND, consortium, {
      profileId: "government-rfp",
      recommender: { remediation },
    });

    expect(result.recommendation).toBeDefined();
    expect(result.recommendation!.verdict).toBe("GO_WITH_REMEDIATION");

    // At minimum, TAC + NIC + VAHAN + ERSS + CERT-IN appear as blockers (spec §9.5)
    const blockerIds = result.recommendation!.blockers.map((b) => b.demandItemId);
    for (const expected of ["cmp-001", "cmp-003", "inf-001", "inf-002", "inf-003"]) {
      expect(blockerIds).toContain(expected);
    }
  });

  it("matchRFP attaches recommendation with non-empty blockers and remediation", () => {
    const consortium = engine.combineCapabilities([USSPPL_FLEETRONIX_CAPABILITY], {
      combinedId: "consortium",
      combinedName: "Test",
    });
    const result = engine.matchRFP(AIS140_DEMAND, consortium, {
      profileId: "government-rfp",
      recommender: {
        remediation: {
          "cmp-001": { description: "TAC", estimatedEffortWeeks: 12 },
        },
      },
    });
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation!.blockers.length).toBeGreaterThan(0);
    // With only one remediation supplied, verdict should be NO_GO (most mandatories unremediated)
    expect(result.recommendation!.verdict).toBe("NO_GO");
  });

  it("Default profile and engine do not require LLM config for rule-based pipeline", () => {
    // No llm config — should still complete
    const newEngine = new OpenSpecMatchEngine();
    expect(newEngine.hasLLM).toBe(false);
    expect(() => newEngine.extractRFP({ id: "x", title: "x", requirements: [] })).not.toThrow();
    expect(() => newEngine.extractCompany({ id: "y", name: "y", capabilities: [] })).not.toThrow();
  });
});
