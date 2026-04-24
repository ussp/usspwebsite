export type StaffRole = "admin" | "recruiter" | "sales" | "hr_manager" | "viewer";

export type ApplicationStatus =
  | "new"
  | "phone_screen"
  | "interview_zoom"
  | "client_submission"
  | "interview_in_person"
  | "employment_verification"
  | "references"
  | "clearances"
  | "offer_pending"
  | "hired"
  | "rejected"
  | "withdrawn";

export const PIPELINE_STAGES: ApplicationStatus[] = [
  "new",
  "phone_screen",
  "interview_zoom",
  "client_submission",
  "interview_in_person",
  "employment_verification",
  "references",
  "clearances",
  "offer_pending",
  "hired",
];

export const TERMINAL_STATUSES: ApplicationStatus[] = ["rejected", "withdrawn"];

export const STAGE_LABELS: Record<ApplicationStatus, string> = {
  new: "New Application",
  phone_screen: "Phone Screen",
  interview_zoom: "Zoom Interview",
  client_submission: "Client Submission",
  interview_in_person: "Client/In-Person Interview",
  employment_verification: "Employment Verification",
  references: "References",
  clearances: "Clearances",
  offer_pending: "Offer Pending",
  hired: "Hired",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const STAGE_COLORS: Record<ApplicationStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  phone_screen: "bg-purple-100 text-purple-800",
  interview_zoom: "bg-indigo-100 text-indigo-800",
  client_submission: "bg-orange-100 text-orange-800",
  interview_in_person: "bg-violet-100 text-violet-800",
  employment_verification: "bg-cyan-100 text-cyan-800",
  references: "bg-teal-100 text-teal-800",
  clearances: "bg-sky-100 text-sky-800",
  offer_pending: "bg-amber-100 text-amber-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-600",
};

// ── Onboarding (candidate-level, post-hire) ─────────────────────────

export type OnboardingStepKey = "i9_everify" | "background_check" | "orientation_training" | "identity_verification" | "address_verification";
export type OnboardingStepStatus = "not_started" | "in_progress" | "completed";

export const ONBOARDING_STEP_LABELS: Record<OnboardingStepKey, string> = {
  i9_everify: "I-9 / E-Verify",
  background_check: "Background Check",
  orientation_training: "Orientation & Training",
  identity_verification: "Identity Verification (ID)",
  address_verification: "Address Verification (Utility Bill)",
};

export interface CandidateOnboarding {
  id: string;
  site_id: string;
  candidate_id: string;
  application_id: string;
  status: "in_progress" | "completed";
  i9_everify: OnboardingStepStatus;
  background_check: OnboardingStepStatus;
  orientation_training: OnboardingStepStatus;
  identity_verification: OnboardingStepStatus;
  address_verification: OnboardingStepStatus;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string | null;
}

// ── Pipeline Gate Checks ────────────────────────────────────────────

export interface PipelineGateResult {
  passed: boolean;
  gate: string;
  message: string;
  missingItems: string[];
}

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

export interface DashboardPositionSummary {
  id: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  work_mode: string | null;
  active: boolean;
  is_hot: boolean;
  applicationCount: number;
  statusBreakdown: Record<ApplicationStatus, number>;
}

export interface DashboardRecentApplication {
  id: string;
  full_name: string;
  email: string;
  job_title: string;
  job_slug: string;
  status: ApplicationStatus;
  created_at: string;
  position_id: string | null;
}

export interface DashboardMetrics {
  totalPositions: number;
  activePositions: number;
  totalApplications: number;
  newApplications: number;
  totalContacts: number;
  recentContacts: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
  hotPositions: DashboardPositionSummary[];
  recentApplications: DashboardRecentApplication[];
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
  is_hot: boolean;
  bill_rate: string | null;
  duration_hours: string | null;
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
  candidate_id: string | null;
  applicant_type: string | null;
  expected_bill_rate: string | null;
  availability_date: string | null;
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
  is_hot?: boolean;
  bill_rate?: string;
  duration_hours?: string;
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
  is_hot?: boolean;
  bill_rate?: string | null;
  duration_hours?: string | null;
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

export type SalaryType = "hourly" | "annual";

export type WorkPreference = "remote" | "hybrid" | "onsite" | "open_to_travel";

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
  location: string | null;
  work_preference: WorkPreference | null;
  salary_expectation_min: number | null;
  salary_expectation_max: number | null;
  salary_type: SalaryType | null;
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
  location?: string;
  work_preference?: WorkPreference;
  salary_expectation_min?: number;
  salary_expectation_max?: number;
  salary_type?: SalaryType;
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
  location?: string | null;
  work_preference?: WorkPreference | null;
  salary_expectation_min?: number | null;
  salary_expectation_max?: number | null;
  salary_type?: SalaryType | null;
}

export interface CandidateFilters {
  candidate_type?: CandidateType;
  current_status?: CandidateStatus;
  search?: string;
}

// ── Candidate Certifications ────────────────────────────────────────

export type CertificationSource = "extracted" | "self_reported" | "recruiter_added";

export interface CandidateCertification {
  id: string;
  site_id: string;
  candidate_id: string;
  certification_name: string;
  issuing_organization: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  source: CertificationSource;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateCertificationInput {
  candidate_id: string;
  certification_name: string;
  issuing_organization?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  source?: CertificationSource;
}

export interface UpdateCertificationInput {
  certification_name?: string;
  issuing_organization?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  credential_id?: string | null;
  verified?: boolean;
  verified_by?: string | null;
  verified_at?: string | null;
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

// ── Candidate PII (Encrypted) ─────────────────────────────────────

export type VisaType = "H1B" | "L1" | "OPT" | "CPT" | "GC" | "citizen" | "EAD" | "other";

export interface CandidatePii {
  id: string;
  candidate_id: string;
  ssn: string | null;
  dl_number: string | null;
  dl_state: string | null;
  dob: string | null;
  visa_type: VisaType | null;
  visa_doc_path: string | null;
  visa_doc_name: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface UpsertCandidatePiiInput {
  ssn?: string;
  dl_number?: string;
  dl_state?: string;
  dob?: string;
  visa_type?: VisaType;
  visa_doc_path?: string;
  visa_doc_name?: string;
}

// ── Pipeline History & Position Stats ──────────────────────────────

export interface StatusHistoryEntry {
  status: string;
  changed_at: string;
  changed_by_name: string | null;
}

export interface PositionStats {
  totalApplicants: number;
  newApplicants: number;
  rejectedCount: number;
  inProgressCount: number;
  hiredCount: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  recentCandidates: Array<{
    id: string;
    full_name: string;
    status: ApplicationStatus;
    status_updated_at: string | null;
    created_at: string;
  }>;
  applicantFlow: Array<{ week: string; count: number }>;
}

export interface PositionListItem extends AdminPosition {
  applicant_count: number;
  new_applicant_count: number;
}

// ── Document Requests ────────────────────────────────────────────

export type DocumentRequestType =
  | "ssn"
  | "drivers_license"
  | "dob"
  | "visa_document"
  | "references"
  | "background_check_consent"
  | "right_to_represent"
  | "identity_document"
  | "address_proof"
  | "employment_agreement"
  | "nda"
  | "tax_forms"
  | "direct_deposit"
  | "emergency_contact"
  | "other";

export type DocumentRequestStatus = "pending" | "submitted" | "approved" | "rejected";

export type DocumentRequestOwner = "recruiter" | "hr" | "finance" | "candidate";

export const DOCUMENT_REQUEST_TYPE_LABELS: Record<DocumentRequestType, string> = {
  ssn: "Social Security Number",
  drivers_license: "Driver's License",
  dob: "Date of Birth",
  visa_document: "Work Authorization Document",
  references: "Professional References",
  background_check_consent: "Background Check Consent",
  right_to_represent: "Right to Represent (RTR)",
  identity_document: "Identity Document (ID)",
  address_proof: "Address Proof (Utility Bill)",
  employment_agreement: "Employment Agreement",
  nda: "Non-Disclosure Agreement (NDA)",
  tax_forms: "Tax Forms (W-4 / W-9)",
  direct_deposit: "Direct Deposit Authorization",
  emergency_contact: "Emergency Contact Information",
  other: "Other Document",
};

/** Who is responsible for collecting/providing each document type */
export const DOCUMENT_REQUEST_OWNER: Record<DocumentRequestType, DocumentRequestOwner> = {
  ssn: "candidate",
  drivers_license: "candidate",
  dob: "candidate",
  visa_document: "candidate",
  references: "recruiter",
  background_check_consent: "hr",
  right_to_represent: "recruiter",
  identity_document: "recruiter",
  address_proof: "candidate",
  employment_agreement: "hr",
  nda: "hr",
  tax_forms: "hr",
  direct_deposit: "finance",
  emergency_contact: "hr",
  other: "recruiter",
};

/** Tooltips explaining why each document is required */
export const DOCUMENT_REQUEST_TOOLTIPS: Record<DocumentRequestType, string> = {
  ssn: "Required for employment verification, tax reporting, and background checks. Collected before offer stage.",
  drivers_license: "Government-issued ID for identity verification. Required by most partners and for I-9 compliance.",
  dob: "Required for background check processing and employment verification.",
  visa_document: "Work authorization proof required for non-citizens. Must be valid for the duration of the engagement.",
  references: "Professional references required before advancing past the references stage. Minimum 2-3 typically required.",
  background_check_consent: "Signed consent form authorizing background check. Required by HR before processing.",
  right_to_represent: "Partner requirement (e.g., Krasan). Signed RTR confirms USSP has the right to submit the candidate. Must be obtained before submitting to the partner's ATS.",
  identity_document: "Valid government-issued photo ID. Required by partners for consultant submission and I-9 verification.",
  address_proof: "Utility bill or similar document confirming US residency. Required by partners (e.g., Krasan) during onboarding.",
  employment_agreement: "Signed employment or contractor agreement between USSP and the consultant. Required by HR before start date.",
  nda: "Non-disclosure agreement protecting client and USSP confidential information. Required before accessing client systems.",
  tax_forms: "W-4 (employees) or W-9 (contractors) for tax withholding. Required by finance before first payment.",
  direct_deposit: "Bank account details and signed ACH authorization for payroll. Required by finance before first payment.",
  emergency_contact: "Emergency contact information for the consultant. Required by HR for personnel file.",
  other: "Additional documentation as needed for specific situations.",
};

export const DOCUMENT_REQUEST_STATUS_LABELS: Record<DocumentRequestStatus, string> = {
  pending: "Pending",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
};

export interface DocumentRequest {
  id: string;
  site_id: string;
  application_id: string;
  candidate_id: string;
  request_type: DocumentRequestType;
  status: DocumentRequestStatus;
  description: string | null;
  due_date: string | null;
  min_references: number | null;
  submitted_at: string | null;
  submitted_path: string | null;
  submitted_file_name: string | null;
  submitted_text_encrypted: string | null;
  submitted_dl_state: string | null;
  reviewer_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string | null;
}

export interface CandidateReferenceRecord {
  id: string;
  document_request_id: string;
  candidate_id: string;
  ref_name: string;
  ref_title: string | null;
  ref_company: string | null;
  ref_phone: string | null;
  ref_email: string | null;
  relationship: string | null;
  created_at: string;
}

export interface CreateDocumentRequestInput {
  application_id: string;
  candidate_id: string;
  request_type: DocumentRequestType;
  description?: string;
  due_date?: string;
  min_references?: number;
}

export interface SubmitDocumentRequestInput {
  submitted_path?: string;
  submitted_file_name?: string;
  submitted_text?: string;
  submitted_dl_state?: string;
}

export interface CreateCandidateReferenceInput {
  ref_name: string;
  ref_title?: string;
  ref_company?: string;
  ref_phone?: string;
  ref_email?: string;
  relationship?: string;
}

// ── Corporate Vault (USSP entity-level docs) ───────────────────────────

export type CorporateDocType =
  | "w9"
  | "articles_incorporation"
  | "bep_cert"
  | "cert_good_standing"
  | "cert_insurance"
  | "ach_voided_check"
  | "other";

export const CORPORATE_DOC_TYPES: CorporateDocType[] = [
  "w9",
  "articles_incorporation",
  "bep_cert",
  "cert_good_standing",
  "cert_insurance",
  "ach_voided_check",
  "other",
];

export const CORPORATE_DOC_TYPE_DEFAULTS: Record<
  CorporateDocType,
  { label: string; defaultExpiryDays: number | null; description: string }
> = {
  w9: {
    label: "W-9 Form",
    defaultExpiryDays: 365,
    description: "IRS tax identification form. Convention-refreshed annually.",
  },
  articles_incorporation: {
    label: "Articles of Incorporation",
    defaultExpiryDays: null,
    description: "State-issued incorporation document. No expiry.",
  },
  bep_cert: {
    label: "BEP Certification Letter",
    defaultExpiryDays: 365,
    description: "Illinois Business Enterprise Program certification. Annual renewal.",
  },
  cert_good_standing: {
    label: "Certificate of Good Standing",
    defaultExpiryDays: null,
    description: "Secretary of State certificate. Typically on-demand.",
  },
  cert_insurance: {
    label: "Certificate of Insurance",
    defaultExpiryDays: 365,
    description: "COI naming clients + State as additional insured. Annual renewal.",
  },
  ach_voided_check: {
    label: "ACH Voided Check / Bank Letter",
    defaultExpiryDays: null,
    description: "Bank document for ACH payment setup. Refresh only when account changes.",
  },
  other: {
    label: "Other Corporate Document",
    defaultExpiryDays: null,
    description: "Any other USSP corporate document.",
  },
};

export interface CorporateDocument {
  id: string;
  site_id: string;
  doc_type: CorporateDocType;
  display_name: string;
  description: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  issued_date: string | null;
  expiry_date: string | null;
  is_current: boolean;
  superseded_by_id: string | null;
  uploaded_by: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateCorporateDocumentInput {
  doc_type: CorporateDocType;
  display_name: string;
  description?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  issued_date?: string | null;
  expiry_date?: string | null;
  notes?: string;
}

export interface UpdateCorporateDocumentInput {
  display_name?: string;
  description?: string | null;
  issued_date?: string | null;
  expiry_date?: string | null;
  notes?: string | null;
}

// ── Client Documents (per-client signed paperwork) ─────────────────────

export type ClientDocType =
  | "mva"
  | "nda"
  | "ssa"
  | "requisition"
  | "work_order"
  | "other";

export const CLIENT_DOC_TYPES: ClientDocType[] = [
  "mva",
  "nda",
  "ssa",
  "requisition",
  "work_order",
  "other",
];

export const CLIENT_DOC_TYPE_DEFAULTS: Record<
  ClientDocType,
  { label: string; description: string }
> = {
  mva: {
    label: "Master Vendor Agreement",
    description: "Top-level vendor agreement with the client.",
  },
  nda: {
    label: "Mutual NDA",
    description: "Non-disclosure agreement signed with the client.",
  },
  ssa: {
    label: "Subcontractor Services Agreement",
    description: "Signed subcontract enrollment contract.",
  },
  requisition: {
    label: "Requisition Process Document",
    description: "Client-specific requisition / submission process paperwork.",
  },
  work_order: {
    label: "Work Order",
    description: "Per-placement work order. Optionally linked to an assignment.",
  },
  other: {
    label: "Other Client Document",
    description: "Any other client-specific document.",
  },
};

export interface ClientDocument {
  id: string;
  site_id: string;
  client_id: string;
  assignment_id: string | null;
  doc_type: ClientDocType;
  display_name: string;
  description: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  effective_date: string | null;
  expiry_date: string | null;
  uploaded_by: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateClientDocumentInput {
  client_id: string;
  assignment_id?: string | null;
  doc_type: ClientDocType;
  display_name: string;
  description?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  effective_date?: string | null;
  expiry_date?: string | null;
  notes?: string;
}

export interface UpdateClientDocumentInput {
  display_name?: string;
  description?: string | null;
  assignment_id?: string | null;
  effective_date?: string | null;
  expiry_date?: string | null;
  notes?: string | null;
}

// ── Shared: expiry status derivation ───────────────────────────────────

export type ExpiryStatus = "none" | "on_file" | "expiring_soon_90" | "expiring_soon_30" | "expired";

export function deriveExpiryStatus(expiryDate: string | null | undefined, today: Date = new Date()): ExpiryStatus {
  if (!expiryDate) return "none";
  const datePart = expiryDate.split("T")[0];
  const parts = datePart.split("-").map((n) => parseInt(n, 10));
  const [y, m, d] = parts;
  if (!y || !m || !d) return "none";
  const expiryUtc = Date.UTC(y, m - 1, d);
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const daysOut = Math.round((expiryUtc - todayUtc) / 86_400_000);
  if (daysOut < 0) return "expired";
  if (daysOut <= 30) return "expiring_soon_30";
  if (daysOut <= 90) return "expiring_soon_90";
  return "on_file";
}
