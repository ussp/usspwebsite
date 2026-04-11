/**
 * Promote mature custom taxonomy nodes to the base OpenSpecMatch package.
 *
 * This script:
 * 1. Reads custom taxonomy nodes from the DB (usage_count >= threshold, not yet promoted)
 * 2. Shows them for review
 * 3. Generates TypeScript code to add to the base taxonomy trees
 * 4. Marks them as promoted in the DB
 *
 * Run: npx tsx scripts/promote-taxonomy.ts [--dry-run] [--min-usage=5]
 *
 * Flags:
 *   --dry-run     Show what would be promoted without making changes
 *   --min-usage=N Only promote nodes used N+ times (default: 3)
 *   --all         Promote all custom nodes regardless of usage count
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Load env
for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq > 0) process.env[t.slice(0, eq)] = t.slice(eq + 1);
}

const SITE_ID = "ussp";
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Parse args
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const minUsageArg = args.find(a => a.startsWith("--min-usage="));
const minUsage = all ? 0 : (minUsageArg ? parseInt(minUsageArg.split("=")[1], 10) : 3);

async function main() {
  console.log("═".repeat(70));
  console.log("  Promote Custom Taxonomy Nodes to Base Package");
  console.log(`  Mode: ${dryRun ? "DRY RUN" : "LIVE"} | Min usage: ${minUsage}`);
  console.log("═".repeat(70));

  // 1. Load unpromoted custom nodes
  const { data: nodes, error } = await sb
    .from("taxonomy_nodes")
    .select("*")
    .eq("site_id", SITE_ID)
    .eq("promoted", false)
    .gte("usage_count", minUsage)
    .order("tree")
    .order("path");

  if (error || !nodes?.length) {
    console.log("\nNo custom nodes ready for promotion.");
    if (!all) {
      console.log(`  (Showing nodes with usage >= ${minUsage}. Use --all to see all.)`);
    }
    return;
  }

  console.log(`\nFound ${nodes.length} nodes ready for promotion:\n`);

  // Group by tree
  const byTree = new Map<string, typeof nodes>();
  for (const node of nodes) {
    const list = byTree.get(node.tree) || [];
    list.push(node);
    byTree.set(node.tree, list);
  }

  // 2. Show for review
  for (const [tree, treeNodes] of byTree) {
    console.log(`  ${tree} (${treeNodes.length} nodes):`);
    for (const node of treeNodes) {
      const aliases = (node.aliases || []).join(", ");
      console.log(`    + ${node.path} — "${node.label}" [used ${node.usage_count}x]${aliases ? ` aliases: ${aliases}` : ""}`);
    }
  }

  // 3. Generate TypeScript code
  console.log(`\n${"─".repeat(70)}`);
  console.log("Generated TypeScript to add to base taxonomy:\n");

  for (const [tree, treeNodes] of byTree) {
    const fileName = getTreeFileName(tree);
    console.log(`// ── Add to packages/openspecmatch/src/taxonomy/trees/${fileName} ──`);
    console.log(`// Inside the "${tree}" tree children array:\n`);

    for (const node of treeNodes) {
      const aliases = (node.aliases || []).length > 0
        ? `, aliases: ${JSON.stringify(node.aliases)}`
        : "";
      const related = (node.related_paths || []).length > 0
        ? `, related: ${JSON.stringify(node.related_paths)}`
        : "";
      const parentComment = node.parent_path ? ` // child of ${node.parent_path}` : "";
      console.log(`      { id: "${node.node_id}", label: "${node.label}"${aliases}${related} },${parentComment}`);
    }
    console.log();
  }

  // 4. Write patch files
  if (!dryRun) {
    for (const [tree, treeNodes] of byTree) {
      const patchPath = `packages/openspecmatch/taxonomy-patches/${tree}-custom.json`;
      const patch = treeNodes.map(n => ({
        id: n.node_id,
        label: n.label,
        path: n.path,
        parentPath: n.parent_path,
        aliases: n.aliases || [],
        relatedPaths: n.related_paths || [],
      }));
      writeFileSync(patchPath, JSON.stringify(patch, null, 2));
      console.log(`  Wrote patch: ${patchPath}`);
    }

    // 5. Mark as promoted in DB
    const ids = nodes.map(n => n.id);
    const { error: updateErr } = await sb
      .from("taxonomy_nodes")
      .update({
        promoted: true,
        promoted_at: new Date().toISOString(),
      })
      .in("id", ids);

    if (updateErr) {
      console.error(`\n  Error marking promoted: ${updateErr.message}`);
    } else {
      console.log(`\n  ✓ Marked ${ids.length} nodes as promoted in DB`);
    }
  } else {
    console.log("  (Dry run — no changes made. Remove --dry-run to promote.)");
  }

  console.log(`\n${"═".repeat(70)}`);
  console.log("Next steps:");
  console.log("  1. Review the generated code above");
  console.log("  2. Add the nodes to the appropriate tree file in packages/openspecmatch/src/taxonomy/trees/");
  console.log("  3. Run: cd packages/openspecmatch && npx vitest run");
  console.log("  4. Commit and push");
  console.log("��".repeat(70));
}

function getTreeFileName(tree: string): string {
  const map: Record<string, string> = {
    "technology": "technology.ts",
    "certifications": "certifications.ts",
    "education": "education.ts",
    "domain-knowledge": "domain-knowledge.ts",
    "soft-skills": "soft-skills.ts",
  };
  return map[tree] || `${tree}.ts`;
}

// Ensure patch directory exists
import { mkdirSync } from "node:fs";
const patchDir = "packages/openspecmatch/taxonomy-patches";
if (!existsSync(patchDir)) {
  mkdirSync(patchDir, { recursive: true });
}

main().catch(console.error);
