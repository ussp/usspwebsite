import { describe, it, expect } from "vitest";
import { OpenSpecMatchEngine } from "../../engine/index.js";
import type { PositionInput } from "../../extractors/position-extractor.js";
import type { ResumeInput } from "../../extractors/resume-extractor.js";

// ── Test data ────────────────────────────────────────────────────

const seniorPythonPosition: PositionInput = {
  id: "pos-001",
  title: "Senior Python Developer",
  requiredSkills: ["Python", "PostgreSQL", "REST API", "Docker"],
  preferredSkills: ["Kubernetes", "AWS", "Terraform"],
  requiredCertifications: ["AWS Solutions Architect"],
  educationLevel: "Bachelor's",
  educationField: "Computer Science",
  minExperienceYears: 5,
  industry: "fintech",
  location: { city: "Chicago", state: "IL", workMode: "hybrid" },
  compensation: { min: 60, max: 85, currency: "USD", type: "hourly" },
};

const frontendLeadPosition: PositionInput = {
  id: "pos-002",
  title: "Frontend Lead",
  requiredSkills: ["React", "TypeScript", "CSS"],
  preferredSkills: ["Next.js", "GraphQL", "Tailwind"],
  educationLevel: "Bachelor's",
  minExperienceYears: 7,
  location: { workMode: "remote" },
};

const strongPythonResume: ResumeInput = {
  id: "res-001",
  name: "Jane Smith",
  text: `
JANE SMITH
Senior Software Engineer | Chicago, IL
10 years of professional experience

SKILLS
- Python (8 years) — FastAPI, Django, Flask, pandas, SQLAlchemy
- PostgreSQL (6 years) — Query optimization, replication, pgbouncer
- REST API design and microservices architecture
- Docker & Kubernetes (4 years) — Production orchestration
- AWS (5 years) — EC2, S3, Lambda, RDS, ECS
- Terraform (2 years) — Infrastructure as code
- Git, CI/CD, Linux

EXPERIENCE
Senior Python Developer | FinTech Corp | 2020 - Present
- Built real-time payment processing pipeline handling 2M transactions/day
- Designed RESTful APIs serving 50+ microservices
- Managed Kubernetes clusters on AWS ECS

Backend Developer | DataCo | 2016 - 2020
- Developed ETL pipelines with Python and PostgreSQL
- Built automated testing framework reducing bugs by 40%

EDUCATION
B.S. Computer Science | University of Illinois | 2016

CERTIFICATIONS
AWS Solutions Architect Associate (SAA-C03) | 2024
  `,
};

const juniorReactResume: ResumeInput = {
  id: "res-002",
  name: "Alex Johnson",
  text: `
ALEX JOHNSON
Frontend Developer | Remote

SKILLS
- React (2 years)
- TypeScript (1 year)
- HTML, CSS, JavaScript
- Next.js — building server-rendered apps
- Tailwind CSS
- Git

EXPERIENCE
Junior Frontend Developer | StartupXYZ | 2024 - Present
- Built responsive web apps with React and TypeScript
- Implemented component library using Tailwind CSS

Intern | WebAgency | 2023 - 2024
- Assisted senior developers with React components
- Created landing pages with HTML/CSS

EDUCATION
Coding Bootcamp | General Assembly | 2023
  `,
};

const nurseResume: ResumeInput = {
  id: "res-003",
  name: "Maria Garcia",
  text: `
MARIA GARCIA, RN, BSN
Registered Nurse | Chicago, IL
8 years of professional experience

CERTIFICATIONS
- Registered Nurse License (Illinois)
- BLS (Basic Life Support) — current
- ACLS (Advanced Cardiac Life Support) — current
- PALS (Pediatric Advanced Life Support) — 2023

EDUCATION
Bachelor of Science in Nursing (BSN) | Loyola University | 2016

EXPERIENCE
ICU Registered Nurse | Northwestern Memorial Hospital | 2019 - Present
- Critical care for 6-bed ICU unit
- Proficient in Epic EHR system
- Mentored 12 new nursing staff

Staff Nurse | Rush Medical Center | 2016 - 2019
- Medical-surgical unit, 8:1 patient ratio
- Trained on Cerner EHR platform
  `,
};

// ── Tests ────────────────────────────────────────────────────────

describe("Resume-to-Position Matching (Integration)", () => {
  const engine = new OpenSpecMatchEngine();

  describe("Strong match: Python dev → Python position", () => {
    it("scores high with good confidence", () => {
      const result = engine.matchResume(seniorPythonPosition, strongPythonResume);

      expect(result.overallScore).toBeGreaterThan(50);
      expect(result.confidence).toBeGreaterThan(50);
      expect(result.passedMandatoryGate).toBe(true);
      expect(result.strengths.length).toBeGreaterThan(0);
    });

    it("identifies Python as a strength", () => {
      const result = engine.matchResume(seniorPythonPosition, strongPythonResume);
      const pythonMatch = result.itemMatches.find(
        (m) => m.explanation.toLowerCase().includes("python"),
      );
      expect(pythonMatch).toBeDefined();
      expect(pythonMatch!.score).toBeGreaterThan(50);
    });

    it("identifies AWS cert match", () => {
      const result = engine.matchResume(seniorPythonPosition, strongPythonResume);
      const certMatch = result.itemMatches.find(
        (m) => m.explanation.toLowerCase().includes("aws") || m.explanation.toLowerCase().includes("solutions architect"),
      );
      expect(certMatch).toBeDefined();
    });
  });

  describe("Weak match: React dev → Python position", () => {
    it("scores lower than the strong match", () => {
      const strongResult = engine.matchResume(seniorPythonPosition, strongPythonResume);
      const weakResult = engine.matchResume(seniorPythonPosition, juniorReactResume);

      expect(weakResult.overallScore).toBeLessThan(strongResult.overallScore);
    });

    it("has more gaps than strengths", () => {
      const result = engine.matchResume(seniorPythonPosition, juniorReactResume);
      expect(result.gaps.length + result.unknowns.length).toBeGreaterThan(result.strengths.length);
    });
  });

  describe("Good match: React dev → Frontend position", () => {
    it("scores well for matching domain", () => {
      const result = engine.matchResume(frontendLeadPosition, juniorReactResume);
      expect(result.overallScore).toBeGreaterThan(30);
      expect(result.strengths.length).toBeGreaterThan(0);
    });

    it("ranks React dev higher than Python dev for frontend role", () => {
      const results = engine.matchResumes(frontendLeadPosition, [
        strongPythonResume,
        juniorReactResume,
      ]);

      expect(results.length).toBe(2);
      // React dev should rank higher for frontend role
      expect(results[0].capabilityIds[0]).toBe(`cs-${juniorReactResume.id}`);
    });
  });

  describe("Cross-domain: Nurse resume → Python position", () => {
    it("scores very low (domain mismatch)", () => {
      const result = engine.matchResume(seniorPythonPosition, nurseResume);
      expect(result.overallScore).toBeLessThan(30);
      // Most requirements should be unmatched (gaps or unknowns)
      expect(result.gaps.length + result.unknowns.length).toBeGreaterThan(result.strengths.length);
    });
  });

  describe("Batch matching", () => {
    it("returns results sorted by score descending", () => {
      const results = engine.matchResumes(
        seniorPythonPosition,
        [juniorReactResume, strongPythonResume, nurseResume],
      );

      expect(results.length).toBe(3);
      expect(results[0].overallScore).toBeGreaterThanOrEqual(results[1].overallScore);
      expect(results[1].overallScore).toBeGreaterThanOrEqual(results[2].overallScore);
    });

    it("returns empty array for empty input", () => {
      const demand = engine.extractPosition(seniorPythonPosition);
      const results = engine.matchBatch(demand, []);
      expect(results).toHaveLength(0);
    });
  });

  describe("Engine basics", () => {
    it("lists built-in profiles", () => {
      const profiles = engine.listProfiles();
      expect(profiles).toContain("software-engineer");
      expect(profiles).toContain("healthcare-clinical");
    });

    it("throws on unknown profile", () => {
      const demand = engine.extractPosition(seniorPythonPosition);
      const cap = engine.extractResume(strongPythonResume);
      expect(() => engine.match(demand, cap, "nonexistent")).toThrow("not found");
    });

    it("taxonomy has nodes registered", () => {
      expect(engine.taxonomy.totalNodeCount).toBeGreaterThan(100);
    });
  });

  describe("Result structure", () => {
    it("has all required fields", () => {
      const result = engine.matchResume(seniorPythonPosition, strongPythonResume);

      expect(result.demandId).toBeDefined();
      expect(result.capabilityIds).toHaveLength(1);
      expect(typeof result.overallScore).toBe("number");
      expect(typeof result.confidence).toBe("number");
      expect(result.engineVersion).toBe("0.2.0");
      expect(result.profileId).toBe("software-engineer");
      expect(result.computedAt).toBeDefined();
      expect(result.itemMatches.length).toBeGreaterThan(0);
      expect(typeof result.passedMandatoryGate).toBe("boolean");
      expect(Array.isArray(result.failedMandatory)).toBe(true);
      expect(result.categoryScores).toBeDefined();
    });

    it("item matches have breakdowns", () => {
      const result = engine.matchResume(seniorPythonPosition, strongPythonResume);

      for (const match of result.itemMatches) {
        expect(match.demandItemId).toBeDefined();
        expect(typeof match.score).toBe("number");
        expect(match.scoreBreakdown).toBeDefined();
        expect(match.scoreBreakdown.taxonomyMatch).toBeDefined();
        expect(typeof match.scoreBreakdown.levelFit).toBe("number");
        expect(typeof match.explanation).toBe("string");
      }
    });
  });
});
