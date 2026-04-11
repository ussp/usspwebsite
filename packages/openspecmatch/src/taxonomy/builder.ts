import type { TaxonomyNode, TaxonomyTree } from "./types.js";

interface NodeDef {
  id: string;
  label: string;
  aliases?: string[];
  related?: string[];
  children?: NodeDef[];
}

/**
 * Build a TaxonomyTree from a nested definition.
 */
export function buildTree(treeId: string, treeName: string, roots: NodeDef[]): TaxonomyTree {
  const nodes = new Map<string, TaxonomyNode>();
  const aliasIndex = new Map<string, string>();

  function walk(def: NodeDef, parentPath: string | null): string {
    const path = parentPath ? `${parentPath}.${def.id}` : def.id;

    const childPaths: string[] = [];
    if (def.children) {
      for (const child of def.children) {
        childPaths.push(walk(child, path));
      }
    }

    const node: TaxonomyNode = {
      id: def.id,
      label: def.label,
      path,
      aliases: def.aliases ?? [],
      parent: parentPath,
      children: childPaths,
      related: def.related ?? [],
    };
    nodes.set(path, node);

    // Index aliases (lowercase)
    aliasIndex.set(def.id.toLowerCase(), path);
    aliasIndex.set(def.label.toLowerCase(), path);
    for (const alias of node.aliases) {
      aliasIndex.set(alias.toLowerCase(), path);
    }

    return path;
  }

  for (const root of roots) {
    walk(root, null);
  }

  return { id: treeId, name: treeName, nodes, aliasIndex };
}
