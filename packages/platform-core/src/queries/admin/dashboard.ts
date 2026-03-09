import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { DashboardMetrics, ApplicationStatus } from "../../types/admin.js";

export async function getDashboardMetrics(
  siteId?: string
): Promise<DashboardMetrics> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const [positions, applications, contacts] = await Promise.all([
    supabase
      .from("positions")
      .select("id, active", { count: "exact" })
      .eq("site_id", site),
    supabase
      .from("applications")
      .select("id, status", { count: "exact" })
      .eq("site_id", site),
    supabase
      .from("contact_submissions")
      .select("id, created_at", { count: "exact" })
      .eq("site_id", site),
  ]);

  const positionData = positions.data || [];
  const applicationData = applications.data || [];
  const contactData = contacts.data || [];

  const activePositions = positionData.filter((p) => p.active).length;

  // Count applications by status
  const statusCounts: Record<ApplicationStatus, number> = {
    new: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0,
  };
  for (const app of applicationData) {
    const status = (app.status || "new") as ApplicationStatus;
    if (status in statusCounts) {
      statusCounts[status]++;
    }
  }

  // Recent contacts (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentContacts = contactData.filter(
    (c) => new Date(c.created_at) >= sevenDaysAgo
  ).length;

  return {
    totalPositions: positionData.length,
    activePositions,
    totalApplications: applicationData.length,
    newApplications: statusCounts.new,
    totalContacts: contactData.length,
    recentContacts,
    applicationsByStatus: statusCounts,
  };
}
