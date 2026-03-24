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
  work_mode: string | null;
  description: string | null;
  salary_range: string | null;
  department: string | null;
  client_id: string | null;
  end_client_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string | null;
  posted_at: string | null;
  closed_at: string | null;
  created_by: string | null;
  client_name?: string | null;
  end_client_name?: string | null;
}

export interface AdminClient {
  id: string;
  site_id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface AdminClientContact {
  id: string;
  site_id: string;
  client_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  active: boolean;
  created_at: string;
}

export interface AdminEndClient {
  id: string;
  site_id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string | null;
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
  work_mode?: string;
  description?: string;
  salary_range?: string;
  department?: string;
  client_id?: string;
  end_client_id?: string;
  active?: boolean;
  posted_at?: string;
}

export interface UpdatePositionInput {
  title?: string;
  slug?: string;
  location?: string;
  type?: string;
  work_mode?: string;
  description?: string;
  salary_range?: string;
  department?: string;
  client_id?: string | null;
  end_client_id?: string | null;
  active?: boolean;
  posted_at?: string;
  closed_at?: string;
}

export interface CreateClientInput {
  name: string;
  description?: string;
  active?: boolean;
}

export interface UpdateClientInput {
  name?: string;
  description?: string;
  active?: boolean;
}

export interface CreateClientContactInput {
  client_id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
}

export interface UpdateClientContactInput {
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  active?: boolean;
}

export interface CreateEndClientInput {
  name: string;
  description?: string;
  active?: boolean;
}

export interface UpdateEndClientInput {
  name?: string;
  description?: string;
  active?: boolean;
}

export interface ClientFilters {
  active?: boolean;
  search?: string;
}

export interface EndClientFilters {
  active?: boolean;
  search?: string;
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
  position_id?: string;
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

export type ArticleContentType = "case_study" | "blog_post";
export type ArticleStatus = "draft" | "published" | "archived";

export interface AdminArticle {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  content_type: ArticleContentType;
  author: string | null;
  featured_image_url: string | null;
  tags: string[];
  case_study_data: import("./database.js").CaseStudyData | null;
  status: ArticleStatus;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateArticleInput {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  content_type: ArticleContentType;
  author?: string;
  featured_image_url?: string;
  tags?: string[];
  case_study_data?: import("./database.js").CaseStudyData;
  status?: ArticleStatus;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface UpdateArticleInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  content_type?: ArticleContentType;
  author?: string;
  featured_image_url?: string;
  tags?: string[];
  case_study_data?: import("./database.js").CaseStudyData | null;
  status?: ArticleStatus;
  published_at?: string | null;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface ArticleFilters {
  content_type?: ArticleContentType;
  status?: ArticleStatus;
  search?: string;
}

// ── Candidates ──────────────────────────────────────────────────────

export type CandidateType = "internal_employee" | "external" | "vendor";
export type CandidateStatus = "available" | "employed" | "on_assignment" | "not_looking" | "blacklisted";

export interface AdminCandidate {
  id: string;
  site_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  linkedin_sub: string | null;
  profile_picture: string | null;
  candidate_type: CandidateType;
  current_status: CandidateStatus;
  source: string;
  tags: string[];
  summary: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateCandidateInput {
  email: string;
  full_name: string;
  phone?: string;
  linkedin_sub?: string;
  profile_picture?: string;
  candidate_type?: CandidateType;
  current_status?: CandidateStatus;
  source?: string;
  tags?: string[];
  summary?: string;
}

export interface UpdateCandidateInput {
  full_name?: string;
  phone?: string;
  linkedin_sub?: string;
  profile_picture?: string;
  candidate_type?: CandidateType;
  current_status?: CandidateStatus;
  source?: string;
  tags?: string[];
  summary?: string;
}

export interface CandidateFilters {
  candidate_type?: CandidateType;
  current_status?: CandidateStatus;
  search?: string;
}

// ── Resumes ─────────────────────────────────────────────────────────

export type ExtractionStatus = "pending" | "processing" | "completed" | "failed";

export interface AdminResume {
  id: string;
  site_id: string;
  candidate_id: string;
  storage_path: string;
  file_name: string;
  file_type: string | null;
  position_id: string | null;
  is_primary: boolean;
  extracted_text: string | null;
  extracted_skills: string[];
  extracted_experience_years: number | null;
  extracted_education: Array<{ degree: string; institution: string; year?: number }>;
  extraction_status: ExtractionStatus;
  extraction_error: string | null;
  uploaded_at: string;
}

export interface CreateResumeInput {
  candidate_id: string;
  storage_path: string;
  file_name: string;
  file_type?: string;
  position_id?: string;
  is_primary?: boolean;
}

// ── Position Requirements ───────────────────────────────────────────

export interface AdminPositionRequirement {
  id: string;
  site_id: string;
  position_id: string;
  required_skills: string[];
  preferred_skills: string[];
  min_experience_years: number | null;
  max_experience_years: number | null;
  education_level: string | null;
  required_certifications: string[];
  location_requirement: string | null;
  work_mode: string | null;
  salary_min: number | null;
  salary_max: number | null;
  industry: string | null;
  extraction_method: string;
  created_at: string;
  updated_at: string | null;
}

export interface UpsertPositionRequirementInput {
  position_id: string;
  required_skills?: string[];
  preferred_skills?: string[];
  min_experience_years?: number;
  max_experience_years?: number;
  education_level?: string;
  required_certifications?: string[];
  location_requirement?: string;
  work_mode?: string;
  salary_min?: number;
  salary_max?: number;
  industry?: string;
  extraction_method?: string;
}

// ── Match Scores ────────────────────────────────────────────────────

export type MatchType = "applied" | "passive_scan" | "manual_trigger";

export interface AdminMatchScore {
  id: string;
  site_id: string;
  candidate_id: string;
  position_id: string;
  resume_id: string | null;
  overall_score: number;
  confidence: number;
  dimensions: import("./matching.js").DimensionResult[];
  match_areas: string[];
  gap_areas: string[];
  algorithm_version: string;
  engine_config: Record<string, unknown>;
  is_stale: boolean;
  match_type: MatchType;
  scored_by: string | null;
  feedback_score: number | null;
  feedback_notes: string | null;
  computed_at: string;
  created_at: string;
  updated_at: string | null;
  // Joined fields
  candidate_name?: string;
  candidate_email?: string;
  candidate_type?: CandidateType;
}

export interface MatchFilters {
  match_type?: MatchType;
  is_stale?: boolean;
  min_score?: number;
}

export interface MatchFeedbackInput {
  feedback_score: number;
  feedback_notes?: string;
}

// ── Employee Assignments ────────────────────────────────────────────

export type AssignmentStatus = "active" | "completed" | "terminated" | "on_hold";

export interface AdminAssignment {
  id: string;
  site_id: string;
  candidate_id: string;
  position_id: string | null;
  client_id: string | null;
  end_client_id: string | null;
  role_title: string;
  start_date: string;
  end_date: string | null;
  bill_rate: string | null;
  pay_rate: string | null;
  status: AssignmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  // Joined fields
  candidate_name?: string;
  client_name?: string;
  end_client_name?: string;
}

export interface CreateAssignmentInput {
  candidate_id: string;
  position_id?: string;
  client_id?: string;
  end_client_id?: string;
  role_title: string;
  start_date: string;
  end_date?: string;
  bill_rate?: string;
  pay_rate?: string;
  status?: AssignmentStatus;
  notes?: string;
}

export interface UpdateAssignmentInput {
  position_id?: string | null;
  client_id?: string | null;
  end_client_id?: string | null;
  role_title?: string;
  start_date?: string;
  end_date?: string | null;
  bill_rate?: string | null;
  pay_rate?: string | null;
  status?: AssignmentStatus;
  notes?: string | null;
}

export interface AssignmentFilters {
  candidate_id?: string;
  status?: AssignmentStatus;
  end_client_id?: string;
  expiring_within_days?: number;
}
