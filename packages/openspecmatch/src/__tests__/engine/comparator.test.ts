import { describe, it, expect } from "vitest";
import { compareItems } from "../../engine/comparator.js";
import { SOFTWARE_ENGINEER_PROFILE, HEALTHCARE_CLINICAL_PROFILE } from "../../profiles/defaults.js";
import { createDefaultResolver } from "../../taxonomy/index.js";
import type { DemandItem } from "../../specs/demand-spec.js";
import type { CapabilityItem } from "../../specs/capability-spec.js";

const resolver = createDefaultResolver();
const profile = SOFTWARE_ENGINEER_PROFILE;

function makeDemand(overrides: Partial<DemandItem> = {}): DemandItem {
  return {
    id: "di-1",
    category: "technical_skill",
    taxonomyRef: { tree: "technology", path: "languages.python", label: "Python" },
    rawText: "Python",
    level: "advanced",
    criticality: "mandatory",
    ...overrides,
  };
}

function makeCap(overrides: Partial<CapabilityItem> = {}): CapabilityItem {
  return {
    id: "ci-1",
    category: "technical_skill",
    taxonomyRef: { tree: "technology", path: "languages.python", label: "Python" },
    rawText: "Python",
    level: "advanced",
    evidence: [],
    ...overrides,
  };
}

describe("Comparator", () => {
  describe("Taxonomy matching", () => {
    it("scores high for exact taxonomy match", () => {
      const result = compareItems(makeDemand(), makeCap(), profile, resolver);
      expect(result.score).toBeGreaterThan(80);
      expect(result.scoreBreakdown.taxonomyMatch).toBe("exact");
    });

    it("scores partial for sibling match (React vs Angular)", () => {
      const demand = makeDemand({
        taxonomyRef: { tree: "technology", path: "frontend.react", label: "React" },
        rawText: "React",
      });
      const cap = makeCap({
        taxonomyRef: { tree: "technology", path: "frontend.angular", label: "Angular" },
        rawText: "Angular",
      });
      const result = compareItems(demand, cap, profile, resolver);
      expect(result.score).toBeGreaterThan(30);
      expect(result.score).toBeLessThan(70);
      expect(result.scoreBreakdown.taxonomyMatch).toBe("sibling");
    });

    it("scores zero for no taxonomy match", () => {
      const demand = makeDemand({
        taxonomyRef: { tree: "technology", path: "languages.python", label: "Python" },
      });
      const cap = makeCap({
        taxonomyRef: { tree: "certifications", path: "healthcare-certs.rn-license", label: "RN License" },
        rawText: "RN License",
      });
      const result = compareItems(demand, cap, profile, resolver);
      expect(result.score).toBe(0);
      expect(result.scoreBreakdown.taxonomyMatch).toBe("none");
    });

    it("scores partial for parent-child match", () => {
      const demand = makeDemand({
        taxonomyRef: { tree: "technology", path: "cloud.container-orchestration", label: "Container Orchestration" },
        rawText: "Container Orchestration",
      });
      const cap = makeCap({
        taxonomyRef: { tree: "technology", path: "cloud.container-orchestration.kubernetes", label: "Kubernetes" },
        rawText: "Kubernetes",
      });
      const result = compareItems(demand, cap, profile, resolver);
      expect(result.score).toBeGreaterThan(50);
      // Demand is the parent, capability is the child — relationship is from demand's perspective
      expect(["child", "parent"]).toContain(result.scoreBreakdown.taxonomyMatch);
    });
  });

  describe("Level fit", () => {
    it("scores full for exact level match", () => {
      const result = compareItems(
        makeDemand({ level: "advanced" }),
        makeCap({ level: "advanced" }),
        profile, resolver,
      );
      expect(result.scoreBreakdown.levelFit).toBe(100);
    });

    it("scores reduced for one level below", () => {
      const result = compareItems(
        makeDemand({ level: "advanced" }),
        makeCap({ level: "intermediate" }),
        profile, resolver,
      );
      expect(result.scoreBreakdown.levelFit).toBe(70);
    });

    it("scores full for one level above", () => {
      const result = compareItems(
        makeDemand({ level: "intermediate" }),
        makeCap({ level: "advanced" }),
        profile, resolver,
      );
      expect(result.scoreBreakdown.levelFit).toBe(100);
    });

    it("scores low for two levels below", () => {
      const result = compareItems(
        makeDemand({ level: "expert" }),
        makeCap({ level: "intermediate" }),
        profile, resolver,
      );
      expect(result.scoreBreakdown.levelFit).toBe(30);
    });
  });

  describe("Evidence strength", () => {
    it("scores higher with strong evidence", () => {
      const withEvidence = compareItems(
        makeDemand(),
        makeCap({ evidence: [{ type: "experience", description: "Built ML pipelines", durationMonths: 36, source: "resume" }] }),
        profile, resolver,
      );
      const without = compareItems(makeDemand(), makeCap(), profile, resolver);
      expect(withEvidence.scoreBreakdown.evidenceStrength).toBeGreaterThan(without.scoreBreakdown.evidenceStrength);
    });

    it("uses years as evidence fallback", () => {
      const result = compareItems(
        makeDemand(),
        makeCap({ years: 7 }),
        profile, resolver,
      );
      expect(result.scoreBreakdown.evidenceStrength).toBeGreaterThan(50);
    });
  });

  describe("Healthcare mandatory gate", () => {
    it("uses healthcare profile scoring", () => {
      const result = compareItems(
        makeDemand({ criticality: "mandatory" }),
        makeCap(),
        HEALTHCARE_CLINICAL_PROFILE,
        resolver,
      );
      expect(result.score).toBeGreaterThan(0);
    });
  });
});
