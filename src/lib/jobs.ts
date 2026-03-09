// Re-export from shared platform package
// All queries are auto-filtered by SITE_ID env var
export { getActiveJobs, getJobBySlug } from "@ussp-platform/core/queries/jobs";
export type { Job } from "@ussp-platform/core/queries/jobs";
