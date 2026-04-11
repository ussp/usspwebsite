import { describe, it, expect } from "vitest";
import { DemandSpec, DemandItem, LocationRequirement, CompensationRequirement, TimelineRequirement } from "../../specs/demand-spec.js";

const validDemandItem: DemandItem = {
  id: "di-1",
  category: "technical_skill",
  taxonomyRef: { tree: "technology", path: "languages.python", label: "Python" },
  rawText: "5+ years Python experience",
  level: "advanced",
  criticality: "mandatory",
  minYears: 5,
  context: "Backend development",
  acceptableEvidence: ["experience", "project"],
};

const validDemandSpec: DemandSpec = {
  id: "ds-1",
  domain: "position",
  title: "Senior Python Developer",
  source: {
    type: "position",
    id: "pos-123",
    extractedAt: "2026-04-10T00:00:00Z",
    extractorVersion: "0.1.0",
  },
  requirements: [validDemandItem],
  context: {
    industry: "fintech",
    location: {
      city: "Chicago",
      state: "IL",
      country: "US",
      workMode: "hybrid",
    },
    compensation: { min: 60, max: 85, currency: "USD", type: "hourly" },
    timeline: { urgency: "within_30_days", durationMonths: 12 },
  },
};

describe("DemandItem", () => {
  it("accepts valid item", () => {
    expect(DemandItem.parse(validDemandItem)).toEqual(validDemandItem);
  });

  it("accepts item with null taxonomyRef", () => {
    const item = { ...validDemandItem, taxonomyRef: null };
    expect(DemandItem.parse(item).taxonomyRef).toBeNull();
  });

  it("accepts item with evaluationWeight", () => {
    const item = { ...validDemandItem, evaluationWeight: 35 };
    expect(DemandItem.parse(item).evaluationWeight).toBe(35);
  });

  it("rejects invalid category", () => {
    expect(() => DemandItem.parse({ ...validDemandItem, category: "nope" })).toThrow();
  });

  it("rejects negative minYears", () => {
    expect(() => DemandItem.parse({ ...validDemandItem, minYears: -1 })).toThrow();
  });
});

describe("DemandSpec", () => {
  it("accepts valid spec", () => {
    expect(DemandSpec.parse(validDemandSpec)).toEqual(validDemandSpec);
  });

  it("accepts spec with zero requirements", () => {
    const spec = { ...validDemandSpec, requirements: [] };
    expect(DemandSpec.parse(spec).requirements).toHaveLength(0);
  });

  it("accepts spec with minimal context", () => {
    const spec = { ...validDemandSpec, context: {} };
    expect(DemandSpec.parse(spec).context).toEqual({});
  });

  it("rejects invalid domain", () => {
    expect(() => DemandSpec.parse({ ...validDemandSpec, domain: "grant" })).toThrow();
  });
});

describe("LocationRequirement", () => {
  it("accepts valid location", () => {
    const loc = { workMode: "remote" as const };
    expect(LocationRequirement.parse(loc)).toEqual(loc);
  });

  it("rejects travelPercent > 100", () => {
    expect(() => LocationRequirement.parse({ workMode: "onsite", travelPercent: 150 })).toThrow();
  });
});

describe("CompensationRequirement", () => {
  it("accepts valid compensation", () => {
    const comp = { min: 50, max: 80, currency: "USD", type: "hourly" as const };
    expect(CompensationRequirement.parse(comp)).toEqual(comp);
  });

  it("rejects negative min", () => {
    expect(() => CompensationRequirement.parse({ min: -10, currency: "USD", type: "hourly" })).toThrow();
  });
});

describe("TimelineRequirement", () => {
  it("accepts valid timeline", () => {
    const tl = { urgency: "immediate" as const };
    expect(TimelineRequirement.parse(tl)).toEqual(tl);
  });

  it("rejects non-positive durationMonths", () => {
    expect(() => TimelineRequirement.parse({ urgency: "flexible", durationMonths: 0 })).toThrow();
  });
});
