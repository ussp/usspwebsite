import { describe, it, expect } from "vitest";
import {
  ProficiencyLevel,
  LEVEL_ORDINAL,
  Criticality,
  DemandCategory,
  TaxonomyRef,
  Evidence,
  EvidenceType,
  TaxonomyMatchType,
} from "../../specs/common.js";

describe("ProficiencyLevel", () => {
  it("accepts valid levels", () => {
    for (const level of ["awareness", "beginner", "intermediate", "advanced", "expert"]) {
      expect(ProficiencyLevel.parse(level)).toBe(level);
    }
  });

  it("rejects invalid level", () => {
    expect(() => ProficiencyLevel.parse("master")).toThrow();
  });
});

describe("LEVEL_ORDINAL", () => {
  it("maps levels to increasing integers", () => {
    expect(LEVEL_ORDINAL.awareness).toBe(1);
    expect(LEVEL_ORDINAL.expert).toBe(5);
    expect(LEVEL_ORDINAL.advanced).toBeGreaterThan(LEVEL_ORDINAL.intermediate);
  });
});

describe("Criticality", () => {
  it("accepts valid values", () => {
    for (const c of ["mandatory", "important", "preferred", "optional"]) {
      expect(Criticality.parse(c)).toBe(c);
    }
  });

  it("rejects invalid value", () => {
    expect(() => Criticality.parse("critical")).toThrow();
  });
});

describe("DemandCategory", () => {
  it("accepts Phase 1 categories", () => {
    for (const cat of ["technical_skill", "certification", "education"]) {
      expect(DemandCategory.parse(cat)).toBe(cat);
    }
  });

  it("accepts Phase 2 categories", () => {
    for (const cat of ["financial", "compliance", "infrastructure"]) {
      expect(DemandCategory.parse(cat)).toBe(cat);
    }
  });

  it("rejects unknown category", () => {
    expect(() => DemandCategory.parse("magic")).toThrow();
  });
});

describe("TaxonomyRef", () => {
  it("accepts valid ref", () => {
    const ref = { tree: "technology", path: "cloud.kubernetes", label: "Kubernetes" };
    expect(TaxonomyRef.parse(ref)).toEqual(ref);
  });

  it("rejects missing fields", () => {
    expect(() => TaxonomyRef.parse({ tree: "technology" })).toThrow();
  });
});

describe("Evidence", () => {
  it("accepts valid evidence", () => {
    const e = {
      type: "experience",
      description: "Led team of 5 building microservices",
      date: "2024-01",
      durationMonths: 24,
      source: "resume",
    };
    expect(Evidence.parse(e)).toEqual(e);
  });

  it("accepts evidence without optional fields", () => {
    const e = { type: "certification", description: "AWS SAA", source: "resume" };
    expect(Evidence.parse(e)).toEqual(e);
  });

  it("rejects invalid evidence type", () => {
    expect(() =>
      Evidence.parse({ type: "guess", description: "x", source: "y" }),
    ).toThrow();
  });

  it("rejects negative durationMonths", () => {
    expect(() =>
      Evidence.parse({
        type: "experience",
        description: "x",
        source: "y",
        durationMonths: -1,
      }),
    ).toThrow();
  });
});

describe("TaxonomyMatchType", () => {
  it("accepts all match types", () => {
    for (const t of ["exact", "parent", "child", "sibling", "related", "none"]) {
      expect(TaxonomyMatchType.parse(t)).toBe(t);
    }
  });
});
