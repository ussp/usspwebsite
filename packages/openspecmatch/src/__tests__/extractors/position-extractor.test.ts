import { describe, it, expect } from "vitest";
import { PositionExtractor } from "../../extractors/position-extractor.js";
import { createDefaultResolver } from "../../taxonomy/index.js";

const resolver = createDefaultResolver();
const extractor = new PositionExtractor(resolver);

describe("PositionExtractor", () => {
  it("extracts required skills as mandatory items", () => {
    const result = extractor.extract({
      id: "pos-1",
      title: "Dev",
      requiredSkills: ["Python", "PostgreSQL"],
    });
    expect(result.requirements.length).toBeGreaterThanOrEqual(2);
    const python = result.requirements.find(r => r.rawText === "Python");
    expect(python).toBeDefined();
    expect(python!.criticality).toBe("mandatory");
    expect(python!.taxonomyRef).not.toBeNull();
  });

  it("extracts preferred skills as preferred items", () => {
    const result = extractor.extract({
      id: "pos-2",
      title: "Dev",
      preferredSkills: ["Docker"],
    });
    const docker = result.requirements.find(r => r.rawText === "Docker");
    expect(docker).toBeDefined();
    expect(docker!.criticality).toBe("preferred");
  });

  it("extracts certifications as mandatory", () => {
    const result = extractor.extract({
      id: "pos-3",
      title: "Cloud Engineer",
      requiredCertifications: ["AWS Solutions Architect"],
    });
    const cert = result.requirements.find(r => r.rawText === "AWS Solutions Architect");
    expect(cert).toBeDefined();
    expect(cert!.criticality).toBe("mandatory");
    expect(cert!.category).toBe("certification");
  });

  it("extracts education level and field", () => {
    const result = extractor.extract({
      id: "pos-4",
      title: "Analyst",
      educationLevel: "Bachelor's",
      educationField: "Computer Science",
    });
    const edu = result.requirements.filter(r => r.category === "education");
    expect(edu.length).toBeGreaterThanOrEqual(1);
  });

  it("extracts sector as domain knowledge", () => {
    const result = extractor.extract({
      id: "pos-5",
      title: "Gov IT",
      sector: "Federal Government",
    });
    const sector = result.requirements.find(r => r.rawText === "Federal Government");
    expect(sector).toBeDefined();
    expect(sector!.category).toBe("domain_knowledge");
  });

  it("extracts compliance requirements", () => {
    const result = extractor.extract({
      id: "pos-6",
      title: "Health IT",
      requiredCompliance: ["HIPAA"],
    });
    const compliance = result.requirements.find(r => r.rawText === "HIPAA");
    expect(compliance).toBeDefined();
    expect(compliance!.category).toBe("compliance");
    expect(compliance!.criticality).toBe("mandatory");
  });

  it("extracts experience requirement for 5+ years", () => {
    const result = extractor.extract({
      id: "pos-7",
      title: "Senior Dev",
      minExperienceYears: 5,
    });
    const exp = result.requirements.find(r => r.rawText.includes("5+ years"));
    expect(exp).toBeDefined();
    expect(exp!.minYears).toBe(5);
  });

  it("produces valid DemandSpec structure", () => {
    const result = extractor.extract({
      id: "pos-8",
      title: "Full Stack",
      requiredSkills: ["React"],
      location: { city: "Chicago", state: "IL", workMode: "hybrid" },
    });
    expect(result.id).toBe("ds-pos-8");
    expect(result.domain).toBe("position");
    expect(result.title).toBe("Full Stack");
    expect(result.source.type).toBe("position");
    expect(result.context.location?.workMode).toBe("hybrid");
  });

  it("handles empty position", () => {
    const result = extractor.extract({ id: "empty", title: "Empty" });
    expect(result.requirements).toHaveLength(0);
  });
});
