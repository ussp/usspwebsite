import { getServiceClient } from "../supabase/server.js";
import { getSiteId } from "../config.js";

export interface TrackEventInput {
  eventType: string;
  pagePath?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

export async function trackEvent(input: TrackEventInput): Promise<void> {
  const supabase = getServiceClient();

  await supabase.from("analytics_events").insert({
    site_id: getSiteId(),
    event_type: input.eventType,
    page_path: input.pagePath || null,
    referrer: input.referrer || null,
    metadata: input.metadata || {},
  });
}
