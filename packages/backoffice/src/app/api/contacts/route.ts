import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getContactSubmissions } from "@ussp-platform/core/queries/admin/contacts";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contacts = await getContactSubmissions();
  return NextResponse.json(contacts);
}
