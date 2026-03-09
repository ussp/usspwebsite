import { NextRequest, NextResponse } from "next/server";
import { submitContactForm } from "../queries/contact.js";

export async function handleContactPost(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await submitContactForm({
      name,
      email,
      phone: body.phone,
      message,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
