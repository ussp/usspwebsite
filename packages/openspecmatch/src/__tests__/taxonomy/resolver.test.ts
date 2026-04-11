import { describe, it, expect } from "vitest";
import { createDefaultResolver } from "../../taxonomy/index.js";

const resolver = createDefaultResolver();

describe("TaxonomyResolver", () => {
  describe("resolve()", () => {
    it("resolves exact node ID", () => {
      const result = resolver.resolve("python");
      expect(result.node).not.toBeNull();
      expect(result.node!.label).toBe("Python");
      expect(result.confidence).toBe(1.0);
    });

    it("resolves alias", () => {
      const result = resolver.resolve("k8s");
      expect(result.node).not.toBeNull();
      expect(result.node!.label).toBe("Kubernetes");
    });

    it("resolves case-insensitively", () => {
      const result = resolver.resolve("PYTHON");
      expect(result.node).not.toBeNull();
      expect(result.node!.label).toBe("Python");
    });

    it("returns null for unknown term", () => {
      const result = resolver.resolve("xyznonexistent123");
      expect(result.node).toBeNull();
      expect(result.confidence).toBe(0);
    });

    it("resolves multi-word aliases", () => {
      const result = resolver.resolve("aws solutions architect");
      expect(result.node).not.toBeNull();
    });

    it("resolves empty string as no match", () => {
      const result = resolver.resolve("");
      expect(result.node).toBeNull();
    });
  });

  describe("relationship()", () => {
    it("detects exact match", () => {
      const nodeA = resolver.getNode("languages.python")!;
      const rel = resolver.relationship(nodeA, nodeA);
      expect(rel).toBe("exact");
    });

    it("detects sibling relationship", () => {
      const react = resolver.getNode("frontend.react")!;
      const angular = resolver.getNode("frontend.angular")!;
      expect(resolver.relationship(react, angular)).toBe("sibling");
    });

    it("detects parent-child relationship", () => {
      const container = resolver.getNode("cloud.container-orchestration")!;
      const k8s = resolver.getNode("cloud.container-orchestration.kubernetes")!;
      expect(resolver.relationship(container, k8s)).toBe("parent");
      expect(resolver.relationship(k8s, container)).toBe("child");
    });

    it("detects no relationship between unrelated nodes", () => {
      const python = resolver.getNode("languages.python")!;
      const rn = resolver.getNode("healthcare-certs.rn-license")!;
      expect(resolver.relationship(python, rn)).toBe("none");
    });
  });

  describe("tree stats", () => {
    it("has multiple trees registered", () => {
      expect(resolver.treeCount).toBeGreaterThanOrEqual(5);
    });

    it("has 350+ total nodes", () => {
      expect(resolver.totalNodeCount).toBeGreaterThan(350);
    });

    it("technology tree has the most nodes", () => {
      const tech = resolver.getTree("technology")!;
      const certs = resolver.getTree("certifications")!;
      expect(tech.nodes.size).toBeGreaterThan(certs.nodes.size);
    });
  });
});
