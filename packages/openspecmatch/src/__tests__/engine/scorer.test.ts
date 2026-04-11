import { describe, it, expect } from "vitest";
import { OpenSpecMatchEngine } from "../../engine/index.js";
import type { PositionInput } from "../../extractors/position-extractor.js";
import type { ResumeInput } from "../../extractors/resume-extractor.js";

const engine = new OpenSpecMatchEngine();

const basePosition: PositionInput = {
  id: "pos-test",
  title: "Test Position",
  requiredSkills: ["Python", "PostgreSQL"],
  preferredSkills: ["Docker"],
  educationLevel: "Bachelor's",
  minExperienceYears: 5,
};

const strongResume: ResumeInput = {
  id: "res-strong",
  name: "Strong Candidate",
  text: "Senior Engineer with 10 years experience. Python (8 years), PostgreSQL (6 years), Docker (4 years). B.S. Computer Science. Led team of 5.",
};

const weakResume: ResumeInput = {
  id: "res-weak",
  name: "Weak Candidate",
  text: "Junior developer. HTML, CSS. 1 year of experience.",
};

describe("Scorer (end-to-end)", () => {
  describe("Mandatory gate", () => {
    it("passes gate with software-engineer profile (gate OFF)", () => {
      const result = engine.matchResume(basePosition, weakResume, "software-engineer");
      expect(result.passedMandatoryGate).toBe(true); // Gate is OFF for software-engineer
    });

    it("fails gate with healthcare profile when certs missing", () => {
      const healthPos: PositionInput = {
        id: "pos-health",
        title: "Registered Nurse",
        requiredSkills: [],
        requiredCertifications: ["RN License", "BLS"],
      };
      const result = engine.matchResume(healthPos, strongResume, "healthcare-clinical");
      expect(result.passedMandatoryGate).toBe(false);
      expect(result.overallScore).toBe(0);
      expect(result.failedMandatory.length).toBeGreaterThan(0);
    });
  });

  describe("Category weights", () => {
    it("technical skills have the highest impact on software-engineer profile", () => {
      const techResume: ResumeInput = {
        id: "res-tech",
        name: "Tech Only",
        text: "Python (8 years), PostgreSQL (6 years), Docker (4 years). No degree.",
      };
      const eduResume: ResumeInput = {
        id: "res-edu",
        name: "Education Only",
        text: "Ph.D. Computer Science from MIT. B.S. Computer Science. No professional experience.",
      };
      const techResult = engine.matchResume(basePosition, techResume);
      const eduResult = engine.matchResume(basePosition, eduResume);
      // Tech skills should produce higher score than education alone
      expect(techResult.overallScore).toBeGreaterThan(eduResult.overallScore);
    });
  });

  describe("Score ordering", () => {
    it("strong candidate scores higher than weak candidate", () => {
      const strong = engine.matchResume(basePosition, strongResume);
      const weak = engine.matchResume(basePosition, weakResume);
      expect(strong.overallScore).toBeGreaterThan(weak.overallScore);
    });

    it("batch results are sorted descending", () => {
      const results = engine.matchResumes(basePosition, [weakResume, strongResume]);
      expect(results[0].overallScore).toBeGreaterThanOrEqual(results[1].overallScore);
    });
  });

  describe("Confidence calculation", () => {
    it("higher confidence with more data", () => {
      const strong = engine.matchResume(basePosition, strongResume);
      const weak = engine.matchResume(basePosition, weakResume);
      expect(strong.confidence).toBeGreaterThanOrEqual(weak.confidence);
    });

    it("confidence is between 10 and 100", () => {
      const result = engine.matchResume(basePosition, strongResume);
      expect(result.confidence).toBeGreaterThanOrEqual(10);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe("Location scoring integration", () => {
    it("same city boosts score vs different state", () => {
      const localPos: PositionInput = {
        ...basePosition,
        location: { city: "Chicago", state: "IL", workMode: "onsite" },
      };
      const localResume: ResumeInput = {
        id: "res-local",
        name: "Local",
        text: "Senior Engineer. Chicago, IL. Python (8 years), PostgreSQL (6 years). B.S. Computer Science.",
      };
      const remoteResume: ResumeInput = {
        id: "res-remote",
        name: "Remote",
        text: "Senior Engineer. Seattle, WA. Python (8 years), PostgreSQL (6 years). B.S. Computer Science.",
      };
      const local = engine.matchResume(localPos, localResume);
      const remote = engine.matchResume(localPos, remoteResume);
      expect(local.overallScore).toBeGreaterThanOrEqual(remote.overallScore);
    });
  });

  describe("Empty inputs", () => {
    it("handles position with no requirements", () => {
      const emptyPos: PositionInput = { id: "empty", title: "Empty" };
      const result = engine.matchResume(emptyPos, strongResume);
      expect(typeof result.overallScore).toBe("number");
      expect(result.itemMatches).toHaveLength(0);
    });

    it("handles empty batch", () => {
      const demand = engine.extractPosition(basePosition);
      const results = engine.matchBatch(demand, []);
      expect(results).toHaveLength(0);
    });
  });
});
