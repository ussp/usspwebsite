import { describe, it, expect } from "vitest";
import { CapabilitySpec, CapabilityItem } from "../../specs/capability-spec.js";

const validCapItem: CapabilityItem = {
  id: "ci-1",
  category: "technical_skill",
  taxonomyRef: { tree: "technology", path: "languages.python", label: "Python" },
  rawText: "Python — 7 years building REST APIs and data pipelines",
  level: "advanced",
  years: 7,
  evidence: [
    {
      type: "experience",
      description: "Built ETL pipeline processing 2M records/day",
      date: "2025-03",
      durationMonths: 36,
      source: "resume",
    },
  ],
  lastUsed: "2026-01",
  tools: ["FastAPI", "pandas", "SQLAlchemy"],
};

const validCapSpec: CapabilitySpec = {
  id: "cs-1",
  domain: "candidate",
  name: "Jane Smith",
  source: {
    type: "resume",
    id: "resume-456",
    extractedAt: "2026-04-10T00:00:00Z",
    extractorVersion: "0.1.0",
  },
  capabilities: [validCapItem],
  context: {
    totalExperienceYears: 10,
    currentRole: "Senior Backend Engineer",
    location: { city: "Chicago", state: "IL", country: "US" },
    workPreference: "hybrid",
    compensation: { min: 70, max: 90, currency: "USD", type: "hourly" },
    availability: { date: "2026-05-01", status: "available" },
  },
};

describe("CapabilityItem", () => {
  it("accepts valid item", () => {
    expect(CapabilityItem.parse(validCapItem)).toEqual(validCapItem);
  });

  it("accepts item with null taxonomyRef", () => {
    const item = { ...validCapItem, taxonomyRef: null };
    expect(CapabilityItem.parse(item).taxonomyRef).toBeNull();
  });

  it("accepts item with empty evidence", () => {
    const item = { ...validCapItem, evidence: [] };
    expect(CapabilityItem.parse(item).evidence).toHaveLength(0);
  });

  it("rejects invalid level", () => {
    expect(() => CapabilityItem.parse({ ...validCapItem, level: "master" })).toThrow();
  });

  it("rejects negative years", () => {
    expect(() => CapabilityItem.parse({ ...validCapItem, years: -2 })).toThrow();
  });
});

describe("CapabilitySpec", () => {
  it("accepts valid spec", () => {
    expect(CapabilitySpec.parse(validCapSpec)).toEqual(validCapSpec);
  });

  it("accepts spec with zero capabilities", () => {
    const spec = { ...validCapSpec, capabilities: [] };
    expect(CapabilitySpec.parse(spec).capabilities).toHaveLength(0);
  });

  it("accepts spec with minimal context", () => {
    const spec = { ...validCapSpec, context: {} };
    expect(CapabilitySpec.parse(spec).context).toEqual({});
  });

  it("accepts company domain", () => {
    const spec = {
      ...validCapSpec,
      domain: "company" as const,
      source: { ...validCapSpec.source, type: "company_profile" as const },
    };
    expect(CapabilitySpec.parse(spec).domain).toBe("company");
  });

  it("rejects invalid domain", () => {
    expect(() => CapabilitySpec.parse({ ...validCapSpec, domain: "team" })).toThrow();
  });
});
