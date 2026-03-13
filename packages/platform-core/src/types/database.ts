export interface Job {
  title: string;
  slug: string;
  location: string;
  type: string;
  description: string;
  posted_at: string;
  closed_at: string | null;
  site_id: string;
}

export interface Application {
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
}

export interface ContactSubmission {
  id: string;
  site_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

export interface CaseStudyData {
  client_name?: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  result?: string;
}

export interface Article {
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  content_type: "case_study" | "blog_post";
  author: string | null;
  featured_image_url: string | null;
  tags: string[];
  case_study_data: CaseStudyData | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  site_id: string;
}

export interface Client {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  site_id: string;
  created_at: string;
  updated_at: string | null;
}

export interface ClientContact {
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

export interface EndClient {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  site_id: string;
  created_at: string;
  updated_at: string | null;
}

export interface AnalyticsEvent {
  id: string;
  site_id: string;
  event_type: string;
  page_path: string | null;
  referrer: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
