import { NextRequest } from "next/server";
import { handleApplicationPost } from "@ussp-platform/core/api/applications";

export async function POST(req: NextRequest) {
  return handleApplicationPost(req);
}
