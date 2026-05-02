import { NextResponse } from "next/server";

// Healthcheck endpoint for Railway. Excluded from the tenant-resolution
// middleware (see middleware.ts matcher) so it returns 200 regardless of
// whether the request Host maps to a registered tenant.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true });
}
