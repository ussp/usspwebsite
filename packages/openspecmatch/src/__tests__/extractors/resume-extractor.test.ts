import { describe, it, expect } from "vitest";
import { ResumeExtractor } from "../../extractors/resume-extractor.js";
import { createDefaultResolver } from "../../taxonomy/index.js";

const resolver = createDefaultResolver();
const extractor = new ResumeExtractor(resolver);

describe("ResumeExtractor (rule-based)", () => {
  it("extracts technical skills from resume text", () => {
    const result = extractor.extract({
      id: "r-1",
      name: "Test",
      text: "Skills: Python (5 years), React (3 years), PostgreSQL, Docker, AWS",
    });
    const skills = result.capabilities.filter(c => c.category === "technical_skill");
    expect(skills.length).toBeGreaterThanOrEqual(4);
    const python = skills.find(s => s.rawText === "Python");
    expect(python).toBeDefined();
    expect(python!.taxonomyRef).not.toBeNull();
    expect(python!.years).toBe(5);
  });

  it("infers proficiency level from years", () => {
    const result = extractor.extract({
      id: "r-2",
      name: "Test",
      text: "Python (8 years), JavaScript (1 year)",
    });
    const python = result.capabilities.find(c => c.rawText === "Python");
    const js = result.capabilities.find(c => c.rawText === "JavaScript");
    expect(python!.level).toBe("expert"); // 8 years
    expect(js!.level).toBe("beginner"); // 1 year
  });

  it("extracts certifications", () => {
    const result = extractor.extract({
      id: "r-3",
      name: "Test",
      text: "Certifications: AWS Solutions Architect Associate, Certified Kubernetes Administrator",
    });
    const certs = result.capabilities.filter(c => c.category === "certification");
    expect(certs.length).toBeGreaterThanOrEqual(2);
  });

  it("extracts education degree", () => {
    const result = extractor.extract({
      id: "r-4",
      name: "Test",
      text: "Education: B.S. Computer Science, University of Illinois, 2020",
    });
    const edu = result.capabilities.filter(c => c.category === "education");
    expect(edu.length).toBeGreaterThanOrEqual(1);
    expect(edu.some(e => e.rawText.includes("Bachelor"))).toBe(true);
  });

  it("extracts soft skills from evidence patterns", () => {
    const result = extractor.extract({
      id: "r-5",
      name: "Test",
      text: "Led team of 5 engineers. Mentored 3 junior developers. Collaborated with product and design teams.",
    });
    const soft = result.capabilities.filter(c => c.category === "soft_skill");
    expect(soft.length).toBeGreaterThanOrEqual(2);
    expect(soft.some(s => s.taxonomyRef !== null)).toBe(true);
  });

  it("extracts domain knowledge", () => {
    const result = extractor.extract({
      id: "r-6",
      name: "Test",
      text: "5 years at Department of Homeland Security. HIPAA compliance experience. Epic EHR implementation.",
    });
    const domain = result.capabilities.filter(c => c.category === "domain_knowledge");
    expect(domain.length).toBeGreaterThanOrEqual(1);
  });

  it("estimates total experience years", () => {
    const result = extractor.extract({
      id: "r-7",
      name: "Test",
      text: "10 years of professional experience in software engineering",
    });
    expect(result.context.totalExperienceYears).toBe(10);
  });

  it("handles minimal resume", () => {
    const result = extractor.extract({
      id: "r-8",
      name: "Test",
      text: "John Doe. Looking for work.",
    });
    // Minimal text may still pick up a word or two — the key is it doesn't crash
    expect(result.capabilities.length).toBeLessThanOrEqual(2);
    expect(result.id).toBe("cs-r-8");
  });

  it("does not produce false positives for common words", () => {
    const result = extractor.extract({
      id: "r-9",
      name: "Test",
      text: "Managed legal compliance documentation for construction project logistics.",
    });
    // Should NOT pick up "legal", "construction", "logistics" as domain knowledge
    const domain = result.capabilities.filter(c => c.category === "domain_knowledge");
    const falsePositives = domain.filter(d =>
      d.rawText.includes("Legal") || d.rawText.includes("Construction") || d.rawText.includes("Logistics")
    );
    expect(falsePositives).toHaveLength(0);
  });

  it("resolves aliases correctly", () => {
    const result = extractor.extract({
      id: "r-10",
      name: "Test",
      text: "Expert in k8s, tf, and gcp. Built REST APIs with Node.js.",
    });
    const skills = result.capabilities.filter(c => c.category === "technical_skill");
    const k8s = skills.find(s => s.taxonomyRef?.label === "Kubernetes");
    const tf = skills.find(s => s.taxonomyRef?.label === "Terraform");
    expect(k8s).toBeDefined();
    expect(tf).toBeDefined();
  });
});
