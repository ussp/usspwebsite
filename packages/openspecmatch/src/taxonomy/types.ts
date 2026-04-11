/** A single node in a taxonomy tree */
export interface TaxonomyNode {
  /** Unique identifier within the tree (e.g., "kubernetes") */
  id: string;
  /** Human-readable label (e.g., "Kubernetes") */
  label: string;
  /** Full dot-path from root (e.g., "cloud.container-orchestration.kubernetes") */
  path: string;
  /** Alternative names / abbreviations (e.g., ["k8s", "kube"]) */
  aliases: string[];
  /** Parent node path (null for root nodes) */
  parent: string | null;
  /** Child node paths */
  children: string[];
  /** Related node paths (cross-branch relationships) */
  related: string[];
}

/** A complete taxonomy tree */
export interface TaxonomyTree {
  /** Tree identifier (e.g., "technology", "certifications") */
  id: string;
  /** Human-readable name */
  name: string;
  /** All nodes, keyed by full path */
  nodes: Map<string, TaxonomyNode>;
  /** Alias → full path lookup */
  aliasIndex: Map<string, string>;
}

/** Result of resolving a string against the taxonomy */
export interface ResolveResult {
  /** The matched node (null if no match) */
  node: TaxonomyNode | null;
  /** The tree this node belongs to */
  tree: string | null;
  /** How confident the match is (0-1) */
  confidence: number;
  /** How the match was found */
  method: "exact_id" | "exact_alias" | "lowercase_alias" | "none";
}

/** Relationship between two taxonomy nodes */
export type TaxonomyRelationship =
  | "exact"
  | "parent"
  | "child"
  | "sibling"
  | "related"
  | "none";
