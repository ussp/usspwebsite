import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getArticleById, updateArticle } from "@ussp-platform/core/queries/admin/articles";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(article);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "articles.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const result = await updateArticle(id, body);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json(result.article);
}
