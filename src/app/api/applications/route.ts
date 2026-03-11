import { NextRequest, NextResponse } from "next/server";
import { handleApplication } from "@ussp-platform/core/api/applications";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await handleApplication(body);
  return NextResponse.json(result.body, { status: result.status });
}
