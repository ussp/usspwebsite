import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".ppt": "application/vnd.ms-powerpoint",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

/**
 * GET /api/docs/[...path]
 * Auth-protected document serving. Only logged-in staff can access.
 * Files are stored in packages/backoffice/private-docs/
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized — login required" }, { status: 401 });
  }

  const { path: segments } = await params;
  const relativePath = segments.join("/");

  // Prevent directory traversal
  if (relativePath.includes("..") || relativePath.includes("~")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const filePath = join(process.cwd(), "private-docs", relativePath);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const ext = "." + relativePath.split(".").pop()?.toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const fileName = relativePath.split("/").pop() || "document";

  const fileBuffer = readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
