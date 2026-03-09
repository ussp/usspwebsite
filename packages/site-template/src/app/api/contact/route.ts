import { NextRequest } from "next/server";
import { handleContactPost } from "@ussp-platform/core/api/contact";

export async function POST(req: NextRequest) {
  return handleContactPost(req);
}
