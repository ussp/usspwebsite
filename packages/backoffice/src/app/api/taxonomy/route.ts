import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getCustomTaxonomyNodes,
  createTaxonomyNode,
  getTaxonomySummary,
  getUnresolvedSkills,
} from "@ussp-platform/core/queries/admin/taxonomy";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const view = url.searchParams.get("view");

  if (view === "summary") {
    const summary = await getTaxonomySummary();
    return NextResponse.json(summary);
  }

  if (view === "unresolved") {
    const unresolved = await getUnresolvedSkills(false);
    return NextResponse.json(unresolved);
  }

  const tree = url.searchParams.get("tree") || undefined;
  const nodes = await getCustomTaxonomyNodes(tree);
  return NextResponse.json(nodes);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "positions.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { tree, node_id, path, label, parent_path, aliases, related_paths, description } = body;

  if (!tree || !node_id || !path || !label) {
    return NextResponse.json({ error: "tree, node_id, path, and label are required" }, { status: 400 });
  }

  const result = await createTaxonomyNode({
    tree,
    node_id,
    path,
    label,
    parent_path,
    aliases: aliases || [],
    related_paths: related_paths || [],
    description,
    created_by: user.staffUserId as string,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.node, { status: 201 });
}
