import { NextRequest, NextResponse } from "next/server";
import { handleContact } from "@ussp-platform/core/api/contact";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await handleContact(body);
  return NextResponse.json(result.body, { status: result.status });
}
