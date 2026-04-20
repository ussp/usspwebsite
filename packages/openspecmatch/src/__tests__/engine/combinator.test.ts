import { describe, it, expect } from "vitest";
import { combine } from "../../engine/combinator.js";
import { createDefaultResolver } from "../../taxonomy/index.js";
import type {
  CapabilitySpec,
  CapabilityItem,
} from "../../specs/capability-spec.js";

const resolver = createDefaultResolver();

function mkItem(
  id: string,
  rawText: string,
  overrides: Partial<CapabilityItem> = {},
): CapabilityItem {
  return {
    id,
    category: "infrastructure",
    taxonomyRef: null,
    rawText,
    level: "advanced",
    evidence: [{ type: "experience", description: "base", source: "doc" }],
    ...overrides,
  };
}

function mkSpec(id: string, name: string, items: CapabilityItem[]): CapabilitySpec {
  return {
    id,
    domain: "company",
    name,
    source: {
      type: "company_profile",
      id,
      extractedAt: new Date().toISOString(),
      extractorVersion: "test",
    },
    capabilities: items,
    context: {},
  };
}

describe("Combinator", () => {
  it("returns a tagged single spec when only one is provided", () => {
    const spec = mkSpec("s1", "Solo", [mkItem("i1", "NIC Cloud")]);
    const combined = combine(
      [spec],
      { combinedId: "c1", combinedName: "Consortium" },
      resolver,
    );
    expect(combined.id).toBe("c1");
    expect(combined.name).toBe("Consortium");
    expect(combined.capabilities).toHaveLength(1);
    // attribution evidence added
    const contribEv = combined.capabilities[0].evidence.find((e) =>
      e.description.startsWith("[contributors]"),
    );
    expect(contribEv).toBeDefined();
    expect(contribEv!.description).toContain("s1");
  });

  it("merges overlapping items between two specs (same rawText)", () => {
    const a = mkSpec("ussppl", "USSPPL", [
      mkItem("a1", "Hyderabad presence", { level: "intermediate" }),
    ]);
    const b = mkSpec("fleetronix", "Fleetronix", [
      mkItem("b1", "Hyderabad presence", { level: "expert" }),
    ]);
    const combined = combine(
      [a, b],
      { combinedId: "c", combinedName: "Consortium" },
      resolver,
    );
    expect(combined.capabilities).toHaveLength(1);
    const merged = combined.capabilities[0];
    // Highest level wins
    expect(merged.level).toBe("expert");
    // Attribution covers both contributors
    const contribEv = merged.evidence.find((e) =>
      e.description.startsWith("[contributors]"),
    );
    expect(contribEv).toBeDefined();
    expect(contribEv!.description).toContain("ussppl");
    expect(contribEv!.description).toContain("fleetronix");
    // Evidence is unioned (base + base + contributors)
    expect(merged.evidence.length).toBeGreaterThanOrEqual(3);
  });

  it("preserves non-overlapping items with attribution", () => {
    const a = mkSpec("ussppl", "USSPPL", [mkItem("a1", "Global delivery")]);
    const b = mkSpec("fleetronix", "Fleetronix", [mkItem("b1", "AI dashcam")]);
    const combined = combine(
      [a, b],
      { combinedId: "c", combinedName: "Consortium" },
      resolver,
    );
    expect(combined.capabilities).toHaveLength(2);
    for (const item of combined.capabilities) {
      const contribEv = item.evidence.find((e) =>
        e.description.startsWith("[contributors]"),
      );
      expect(contribEv).toBeDefined();
    }
  });

  it("throws when given zero specs", () => {
    expect(() =>
      combine([], { combinedId: "c", combinedName: "Consortium" }, resolver),
    ).toThrow();
  });

  it("takes max years across merged items", () => {
    const a = mkSpec("a", "A", [mkItem("a1", "real-time tracking", { years: 2 })]);
    const b = mkSpec("b", "B", [mkItem("b1", "real-time tracking", { years: 5 })]);
    const merged = combine(
      [a, b],
      { combinedId: "c", combinedName: "C" },
      resolver,
    ).capabilities[0];
    expect(merged.years).toBe(5);
  });
});
