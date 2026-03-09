export type StaffRole = "admin" | "recruiter" | "sales" | "hr_manager" | "viewer";

export type ApplicationStatus =
  | "new"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

export interface StaffUser {
  id: string;
  site_id: string;
  email: string;
  full_name: string;
  role: StaffRole;
  avatar_url: string | null;
  google_sub: string | null;
  active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ApplicationNote {
  id: string;
  site_id: string;
  application_id: string;
  staff_user_id: string;
  content: string;
  created_at: string;
  staff_user?: Pick<StaffUser, "full_name" | "avatar_url">;
}

export interface AuditLogEntry {
  id: string;
  site_id: string;
  staff_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
  staff_user?: Pick<StaffUser, "full_name" | "email">;
}

export interface DashboardMetrics {
  totalPositions: number;
  activePositions: number;
  totalApplications: number;
  newApplications: number;
  totalContacts: number;
  recentContacts: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
}

export interface AdminPosition {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  description: string | null;
  salary_range: string | null;
  department: string | null;
  active: boolean;
  created_at: string;
  updated_at: string | null;
  posted_at: string | null;
  closed_at: string | null;
  created_by: string | null;
}

export interface AdminApplication {
  id: string;
  site_id: string;
  position_id: string | null;
  full_name: string;
  email: string;
  job_title: string;
  job_slug: string;
  resume_path: string | null;
  resume_name: string | null;
  auth_provider: string;
  created_at: string;
  linkedin_sub: string | null;
  given_name: string | null;
  family_name: string | null;
  profile_picture: string | null;
  locale: string | null;
  email_verified: boolean | null;
  phone: string | null;
  sms_consent: boolean;
  sms_consent_timestamp: string | null;
  job_alerts_opt_in: boolean;
  job_alerts_timestamp: string | null;
  status: ApplicationStatus;
  status_updated_at: string | null;
  assigned_to: string | null;
  assigned_staff?: Pick<StaffUser, "full_name" | "email"> | null;
}

export interface CreatePositionInput {
  title: string;
  slug: string;
  location: string;
  type: string;
  description?: string;
  salary_range?: string;
  department?: string;
  active?: boolean;
  posted_at?: string;
}

export interface UpdatePositionInput {
  title?: string;
  slug?: string;
  location?: string;
  type?: string;
  description?: string;
  salary_range?: string;
  department?: string;
  active?: boolean;
  posted_at?: string;
  closed_at?: string;
}

export interface CreateStaffUserInput {
  email: string;
  full_name: string;
  role: StaffRole;
}

export interface UpdateStaffUserInput {
  full_name?: string;
  role?: StaffRole;
  active?: boolean;
}

export interface PositionFilters {
  active?: boolean;
  department?: string;
  search?: string;
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  assigned_to?: string;
  search?: string;
  job_slug?: string;
}

export interface ContactFilters {
  search?: string;
}

export interface AuditFilters {
  entity_type?: string;
  entity_id?: string;
  staff_user_id?: string;
  limit?: number;
}
