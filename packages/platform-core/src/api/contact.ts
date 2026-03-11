import { submitContactForm } from "../queries/contact.js";
import type { ApiResponse } from "./upload.js";

export async function handleContact(body: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return { status: 400, body: { error: "Missing required fields" } };
    }

    const result = await submitContactForm({
      name,
      email,
      phone: body.phone as string | undefined,
      message,
    });

    if (!result.success) {
      return { status: 500, body: { error: result.error } };
    }

    return { status: 200, body: { success: true } };
  } catch {
    return { status: 500, body: { error: "Internal server error" } };
  }
}
