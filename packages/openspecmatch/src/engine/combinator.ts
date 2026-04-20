/**
 * Multi-entity Capability Combinator
 *
 * Merges N CapabilitySpecs (e.g., a primary bidder + tech partners) into a
 * single combined CapabilitySpec representing the consortium. Overlapping
 * items are merged with attribution preserved in item-level metadata.
 *
 * See add-rfp-matching-phase2 spec for the formal contract.
 */

import type { CapabilitySpec, CapabilityItem } from "../specs/capability-spec.js";
import type { TaxonomyResolver } from "../taxonomy/resolver.js";
import { LEVEL_ORDINAL } from "../specs/common.js";

export interface CombinationPolicy {
  /** ID for the combined entity */
  combinedId: string;
  /** Display name for the combined entity */
  combinedName: string;
  /** Optional: treat items as overlapping only if same category AND (taxonomy match OR text similarity above this) */
  textSimilarityThreshold?: number;
}

/**
 * Combine multiple capability specs into one consortium spec.
 */
export function combine(
  specs: CapabilitySpec[],
  policy: CombinationPolicy,
  resolver: TaxonomyResolver,
): CapabilitySpec {
  if (specs.length === 0) {
    throw new Error("combine(): must provide at least one CapabilitySpec");
  }
  if (specs.length === 1) {
    return tagSingleEntity(specs[0], policy);
  }

  const buckets = new Map<string, CapabilityItem[]>();
  // originOf maps every input item id -> the source spec id that contributed it.
  const originOf = new Map<string, string>();

  for (const spec of specs) {
    for (const item of spec.capabilities) {
      originOf.set(item.id, spec.id);
      const key = bucketKey(item, resolver);
      const list = buckets.get(key) ?? [];
      list.push(item);
      buckets.set(key, list);
    }
  }

  const mergedItems: CapabilityItem[] = [];
  for (const [, items] of buckets) {
    if (items.length === 1) {
      mergedItems.push(attribute(items[0], [originOf.get(items[0].id)!]));
    } else {
      mergedItems.push(mergeOverlapping(items, originOf));
    }
  }

  // Context: prefer first spec's context; list all constituent entity metadata
  const [first] = specs;
  return {
    id: policy.combinedId,
    domain: "company",
    name: policy.combinedName,
    source: {
      type: "company_profile",
      id: policy.combinedId,
      extractedAt: new Date().toISOString(),
      extractorVersion: "combinator-v1",
    },
    capabilities: mergedItems,
    context: {
      ...first.context,
      metadata: {
        ...(first.context.metadata ?? {}),
        consortium: {
          entities: specs.map((s) => ({ id: s.id, name: s.name })),
        },
      },
    },
  };
}

// ── Internal helpers ───────────────────────────────────────────────

/** Bucket key: category + resolved taxonomy path if present, otherwise category + lowercased raw text */
function bucketKey(item: CapabilityItem, resolver: TaxonomyResolver): string {
  if (item.taxonomyRef) {
    const node = resolver.getNode(item.taxonomyRef.path);
    if (node) return `${item.category}::${node.path}`;
  }
  // Fallback: normalise raw text
  return `${item.category}::${item.rawText.toLowerCase().trim()}`;
}

/** Merge N overlapping items into one */
function mergeOverlapping(
  items: CapabilityItem[],
  originOf: Map<string, string>,
): CapabilityItem {
  // Highest level wins
  const sorted = [...items].sort(
    (a, b) => LEVEL_ORDINAL[b.level] - LEVEL_ORDINAL[a.level],
  );
  const top = sorted[0];

  // Union evidence
  const allEvidence = items.flatMap((i) => i.evidence);

  // Max years
  const years = items.reduce(
    (max, i) => (i.years !== undefined && i.years > max ? i.years : max),
    0,
  );

  // Latest lastUsed
  const lastUsed = items
    .map((i) => i.lastUsed)
    .filter((d): d is string => !!d)
    .sort()
    .pop();

  // Union tools
  const tools = Array.from(
    new Set(items.flatMap((i) => i.tools ?? [])),
  );

  // Attribution: all unique source entities
  const contributors = Array.from(
    new Set(items.map((i) => originOf.get(i.id)!).filter(Boolean)),
  );

  const merged: CapabilityItem = {
    id: `merged:${top.id}`,
    category: top.category,
    taxonomyRef: top.taxonomyRef,
    rawText: top.rawText,
    level: top.level,
    evidence: allEvidence,
    ...(years > 0 ? { years } : {}),
    ...(lastUsed ? { lastUsed } : {}),
    ...(tools.length > 0 ? { tools } : {}),
  };
  return attribute(merged, contributors);
}

/** Tag a single spec for uniform downstream handling */
function tagSingleEntity(
  spec: CapabilitySpec,
  policy: CombinationPolicy,
): CapabilitySpec {
  return {
    ...spec,
    id: policy.combinedId,
    name: policy.combinedName,
    capabilities: spec.capabilities.map((item) => attribute(item, [spec.id])),
  };
}

/** Add contributor attribution via an evidence record so it survives serialization */
function attribute(item: CapabilityItem, contributors: string[]): CapabilityItem {
  if (contributors.length === 0) return item;
  const already = item.evidence.some((e) =>
    e.description.startsWith("[contributors]"),
  );
  if (already) return item;
  return {
    ...item,
    evidence: [
      ...item.evidence,
      {
        type: "reference",
        description: `[contributors] ${contributors.join(", ")}`,
        source: "combinator",
      },
    ],
  };
}
