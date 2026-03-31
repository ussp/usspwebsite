import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  DashboardMetrics,
  ApplicationStatus,
  DashboardPositionSummary,
  DashboardRecentApplication,
} from "../../types/admin.js";

export async function getDashboardMetrics(
  siteId?: string
): Promise<DashboardMetrics> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const [positions, applications, contacts] = await Promise.all([
    supabase
      .from("positions")
      .select("id, title, slug, location, type, work_mode, active", {
        count: "exact",
      })
      .eq("site_id", site),
    supabase
      .from("applications")
      .select(
        "id, status, position_id, full_name, email, job_title, job_slug, created_at",
        { count: "exact" }
      )
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

  // Build hot positions: positions ranked by application count
  const positionAppMap = new Map<
    string,
    { count: number; statuses: Record<ApplicationStatus, number> }
  >();
  for (const app of applicationData) {
    if (!app.position_id) continue;
    if (!positionAppMap.has(app.position_id)) {
      positionAppMap.set(app.position_id, {
        count: 0,
        statuses: {
          new: 0,
          screening: 0,
          interview: 0,
          offer: 0,
          hired: 0,
          rejected: 0,
          withdrawn: 0,
        },
      });
    }
    const entry = positionAppMap.get(app.position_id)!;
    entry.count++;
    const status = (app.status || "new") as ApplicationStatus;
    if (status in entry.statuses) {
      entry.statuses[status]++;
    }
  }

  const hotPositions: DashboardPositionSummary[] = positionData
    .map((p) => {
      const appInfo = positionAppMap.get(p.id);
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        location: p.location,
        type: p.type,
        work_mode: p.work_mode,
        active: p.active,
        applicationCount: appInfo?.count || 0,
        statusBreakdown: appInfo?.statuses || {
          new: 0,
          screening: 0,
          interview: 0,
          offer: 0,
          hired: 0,
          rejected: 0,
          withdrawn: 0,
        },
      };
    })
    .filter((p) => p.active || p.applicationCount > 0)
    .sort((a, b) => b.applicationCount - a.applicationCount)
    .slice(0, 10);

  // Recent applications (latest 10)
  const recentApplications: DashboardRecentApplication[] = [...applicationData]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 10)
    .map((a) => ({
      id: a.id,
      full_name: a.full_name,
      email: a.email,
      job_title: a.job_title,
      job_slug: a.job_slug,
      status: (a.status || "new") as ApplicationStatus,
      created_at: a.created_at,
      position_id: a.position_id,
    }));

  return {
    totalPositions: positionData.length,
    activePositions,
    totalApplications: applicationData.length,
    newApplications: statusCounts.new,
    totalContacts: contactData.length,
    recentContacts,
    applicationsByStatus: statusCounts,
    hotPositions,
    recentApplications,
  };
}
