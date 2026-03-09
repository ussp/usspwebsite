import { getServiceClient } from "../supabase/server.js";
import { getSiteId } from "../config.js";
import type { ContactSubmission } from "../types/database.js";

export type { ContactSubmission };

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function submitContactForm(input: ContactFormInput): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("contact_submissions")
    .insert({
      site_id: getSiteId(),
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      message: input.message,
    });

  if (error) {
    return { success: false, error: "Failed to submit contact form" };
  }
  return { success: true };
}
