import type {
  TaxonomyTree,
  TaxonomyNode,
  ResolveResult,
  TaxonomyRelationship,
} from "./types.js";

/**
 * Resolves strings against taxonomy trees and computes relationships.
 */
export class TaxonomyResolver {
  private trees: Map<string, TaxonomyTree> = new Map();
  /** Global alias → { tree, path } for cross-tree lookups */
  private globalIndex: Map<string, { tree: string; path: string }> = new Map();

  registerTree(tree: TaxonomyTree): void {
    this.trees.set(tree.id, tree);
    // Build global index
    for (const [alias, path] of tree.aliasIndex) {
      this.globalIndex.set(alias, { tree: tree.id, path });
    }
    // Also index by node id and path
    for (const [path, node] of tree.nodes) {
      const key = node.id.toLowerCase();
      if (!this.globalIndex.has(key)) {
        this.globalIndex.set(key, { tree: tree.id, path });
      }
      // Index full path
      const pathKey = path.toLowerCase();
      if (!this.globalIndex.has(pathKey)) {
        this.globalIndex.set(pathKey, { tree: tree.id, path });
      }
    }
  }

  /**
   * Resolve a raw string (e.g., "k8s", "Python", "AWS SAA") to a taxonomy node.
   */
  resolve(input: string): ResolveResult {
    const normalized = input.trim().toLowerCase();
    if (!normalized) {
      return { node: null, tree: null, confidence: 0, method: "none" };
    }

    // 1. Try exact match in global index
    const entry = this.globalIndex.get(normalized);
    if (entry) {
      const tree = this.trees.get(entry.tree)!;
      const node = tree.nodes.get(entry.path)!;
      return { node, tree: entry.tree, confidence: 1.0, method: "exact_alias" };
    }

    // 2. Try partial match — check if input contains or is contained in an alias
    // This handles cases like "AWS Certified Solutions Architect" matching "aws-saa"
    for (const [alias, ref] of this.globalIndex) {
      if (alias.length > 3 && (normalized.includes(alias) || alias.includes(normalized))) {
        const tree = this.trees.get(ref.tree)!;
        const node = tree.nodes.get(ref.path)!;
        return { node, tree: ref.tree, confidence: 0.7, method: "lowercase_alias" };
      }
    }

    return { node: null, tree: null, confidence: 0, method: "none" };
  }

  /**
   * Compute the relationship between two nodes.
   */
  relationship(nodeA: TaxonomyNode, nodeB: TaxonomyNode): TaxonomyRelationship {
    if (nodeA.path === nodeB.path) return "exact";
    if (nodeA.path === nodeB.parent) return "parent";
    if (nodeB.path === nodeA.parent) return "child";
    if (nodeA.parent && nodeA.parent === nodeB.parent) return "sibling";
    if (nodeA.related.includes(nodeB.path) || nodeB.related.includes(nodeA.path)) {
      return "related";
    }
    // Check if they share a grandparent (2 levels up)
    if (nodeA.parent && nodeB.parent) {
      const parentA = this.getNode(nodeA.parent);
      const parentB = this.getNode(nodeB.parent);
      if (parentA && parentB && parentA.parent && parentA.parent === parentB.parent) {
        return "related";
      }
    }
    return "none";
  }

  getNode(path: string): TaxonomyNode | null {
    for (const tree of this.trees.values()) {
      const node = tree.nodes.get(path);
      if (node) return node;
    }
    return null;
  }

  getTree(id: string): TaxonomyTree | undefined {
    return this.trees.get(id);
  }

  get treeCount(): number {
    return this.trees.size;
  }

  get totalNodeCount(): number {
    let count = 0;
    for (const tree of this.trees.values()) {
      count += tree.nodes.size;
    }
    return count;
  }
}
