import { NextRequest } from "next/server";
import { handleUploadPost } from "@ussp-platform/core/api/upload";

export async function POST(req: NextRequest) {
  return handleUploadPost(req);
}
