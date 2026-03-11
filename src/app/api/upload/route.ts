import { NextRequest, NextResponse } from "next/server";
import { handleUpload } from "@ussp-platform/core/api/upload";

export async function POST(req: NextRequest) {
  const input = await req.json();
  const result = await handleUpload(input);
  return NextResponse.json(result.body, { status: result.status });
}
