"""
SQLAlchemy Models for Alembic Migrations

These models define the database schema for the multi-tenant platform
shared across USSP, VQlab, and other sites on a single Supabase instance.

They are used ONLY for migrations - not for ORM operations.
The application uses the Supabase JS client (Next.js), not SQLAlchemy ORM.
These models ensure the schema matches what the Supabase client expects.

Multi-tenancy: All tenant tables include a `site_id` column (FK to `sites.id`)
that isolates data per site. Application-level filtering is primary; RLS is a safety net.
"""

from sqlalchemy import (
    Column,
    Date,
    Index,
    Integer,
    Numeric,
    String,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


# =============================================================================
# SITES TABLE (site registry)
# =============================================================================


class Site(Base):
    """
    Site registry table.

    Each row represents a website in the multi-tenant platform.
    The `id` is a short string slug used as site_id throughout.
    """

    __tablename__ = "sites"

    id = Column(String(50), primary_key=True)  # e.g. "ussp", "vqlab"
    name = Column(String(255), nullable=False)  # Full company name
    domain = Column(String(255), unique=True, nullable=False)  # e.g. "www.ussp.co"
    config = Column(JSONB, server_default="{}")  # Contact info, branding, etc.
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# =============================================================================
# CLIENTS TABLE (companies that submit positions to USSP)
# =============================================================================


class Client(Base):
    """
    Client companies that submit positions to USSP.

    E.g., Krasan Consulting sends job requirements for their end clients.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "clients"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    name = Column(String(255), nullable=False)
    description = Column(Text)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "name", name="uq_clients_site_name"),
        Index("idx_clients_site_active", "site_id", "active"),
    )


# =============================================================================
# CLIENT_CONTACTS TABLE
# =============================================================================


class ClientContact(Base):
    """
    Contacts at client companies.

    E.g., Dinkar, Kristen, Sandy at Krasan Consulting.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "client_contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(30))
    title = Column(String(255))
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_client_contacts_site_client", "site_id", "client_id"),
    )


# =============================================================================
# END_CLIENTS TABLE (where resources actually work)
# =============================================================================


class EndClient(Base):
    """
    End client organizations where placed resources work.

    E.g., IDJJ (Illinois Dept of Juvenile Justice).
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "end_clients"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    name = Column(String(255), nullable=False)
    description = Column(Text)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "name", name="uq_end_clients_site_name"),
        Index("idx_end_clients_site_active", "site_id", "active"),
    )


# =============================================================================
# POSITIONS TABLE
# =============================================================================


class Position(Base):
    """
    Job positions table.

    Stores active job listings displayed on the careers page.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "positions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    work_mode = Column(String(50))  # On-site, Remote, Hybrid
    description = Column(Text)
    salary_range = Column(String(100))
    department = Column(String(100))
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"))
    end_client_id = Column(UUID(as_uuid=True), ForeignKey("end_clients.id"))
    active = Column(Boolean, default=True, nullable=False)
    is_hot = Column(Boolean, default=False, nullable=False, server_default="false")
    bill_rate = Column(String(100))
    duration_hours = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    posted_at = Column(DateTime(timezone=True))
    closed_at = Column(DateTime(timezone=True))
    created_by = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))

    __table_args__ = (
        UniqueConstraint("site_id", "slug", name="uq_positions_site_slug"),
        Index("idx_positions_site_active", "site_id", "active"),
    )


# =============================================================================
# APPLICATIONS TABLE
# =============================================================================


class Application(Base):
    """
    Job applications table.

    Stores applications submitted via LinkedIn OAuth + resume upload.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    position_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"))
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    job_slug = Column(String(255), nullable=False)
    resume_path = Column(Text)
    resume_name = Column(String(255))
    auth_provider = Column(String(50), default="linkedin")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # LinkedIn OIDC profile fields
    linkedin_sub = Column(String(255))
    given_name = Column(String(255))
    family_name = Column(String(255))
    profile_picture = Column(Text)
    locale = Column(String(20))
    email_verified = Column(Boolean)

    # Phone and TCPA SMS consent
    phone = Column(String(30))
    sms_consent = Column(Boolean, default=False, nullable=False)
    sms_consent_timestamp = Column(DateTime(timezone=True))

    # Job alerts opt-in
    job_alerts_opt_in = Column(Boolean, default=False, nullable=False)
    job_alerts_timestamp = Column(DateTime(timezone=True))

    # Vendor application fields
    applicant_type = Column(String(20), server_default="employee")  # employee | vendor
    expected_bill_rate = Column(String(50))
    availability_date = Column(DateTime(timezone=True))

    # Back-office management fields
    status = Column(String(50), server_default="new")  # new, phone_screen, interview_zoom, interview_in_person, employment_verification, references, clearances, offer_pending, onboarding, hired, rejected, withdrawn
    status_updated_at = Column(DateTime(timezone=True))
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"))

    __table_args__ = (
        UniqueConstraint("site_id", "email", "position_id", name="uq_applications_site_email_position"),
        Index("idx_applications_site_id", "site_id"),
        Index("idx_applications_site_email", "site_id", "email"),
        Index("idx_applications_site_position", "site_id", "position_id"),
    )


# =============================================================================
# APPLICATION_POSITIONS TABLE (many-to-many junction)
# =============================================================================


class ApplicationPosition(Base):
    """
    Junction table linking applications to positions.

    One applicant can apply for multiple positions.
    One position can have multiple applicants.
    """

    __tablename__ = "application_positions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    position_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"), nullable=False)
    applied_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("application_id", "position_id", name="uq_application_position"),
    )


# =============================================================================
# CONTACT_SUBMISSIONS TABLE
# =============================================================================


class ContactSubmission(Base):
    """
    Contact form submissions.

    Shared across all sites. Multi-tenant: filtered by site_id.
    """

    __tablename__ = "contact_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(30))
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_contact_submissions_site_id", "site_id"),
    )


# =============================================================================
# ANALYTICS_EVENTS TABLE
# =============================================================================


class AnalyticsEvent(Base):
    """
    Lightweight analytics events.

    Shared across all sites. Multi-tenant: filtered by site_id.
    """

    __tablename__ = "analytics_events"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    event_type = Column(String(100), nullable=False)
    page_path = Column(String(500))
    referrer = Column(String(500))
    event_metadata = Column("metadata", JSONB, server_default="{}")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_analytics_events_site_created", "site_id", "created_at"),
    )


# =============================================================================
# STAFF_USERS TABLE (back-office users)
# =============================================================================


class StaffUser(Base):
    """
    Staff users for the back-office application.

    Authenticated via Google OAuth. Role determines RBAC permissions.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "staff_users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    email = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, server_default="recruiter")
    avatar_url = Column(Text)
    google_sub = Column(String(255))
    active = Column(Boolean, default=True, nullable=False)
    last_login_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "email", name="uq_staff_users_site_email"),
        Index("idx_staff_users_site_active", "site_id", "active"),
    )


# =============================================================================
# APPLICATION_NOTES TABLE
# =============================================================================


class ApplicationNote(Base):
    """
    Notes on job applications, added by staff users.

    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "application_notes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    staff_user_id = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_application_notes_site_app", "site_id", "application_id"),
    )


# =============================================================================
# AUDIT_LOG TABLE
# =============================================================================


class AuditLog(Base):
    """
    Audit log for tracking staff actions in the back-office.

    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "audit_log"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    staff_user_id = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(UUID(as_uuid=True))
    details = Column(JSONB, server_default="{}")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_audit_log_site_created", "site_id", "created_at"),
        Index("idx_audit_log_site_entity", "site_id", "entity_type", "entity_id"),
    )


# =============================================================================
# ARTICLES TABLE (insights / blog / case studies)
# =============================================================================


class Article(Base):
    """
    Articles for the Insights section (blog posts and case studies).

    Multi-tenant: filtered by site_id.
    Content types: 'blog_post' or 'case_study'.
    """

    __tablename__ = "articles"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    slug = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    excerpt = Column(Text)
    body = Column(Text, nullable=False)
    content_type = Column(String(20), nullable=False)  # blog_post | case_study
    author = Column(String(255))
    featured_image_url = Column(Text)
    tags = Column(JSONB, server_default="[]")
    case_study_data = Column(JSONB)  # {client_name, industry, challenge, solution, result}
    status = Column(String(20), nullable=False, server_default="draft")  # draft | published | archived
    published_at = Column(DateTime(timezone=True))
    meta_title = Column(String(255))
    meta_description = Column(Text)
    meta_keywords = Column(String(500))
    created_by = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "slug", name="uq_articles_site_slug"),
        Index("idx_articles_site_status", "site_id", "status"),
        Index("idx_articles_site_type_published", "site_id", "content_type", "published_at"),
    )


# =============================================================================
# CANDIDATES TABLE (unique person entity across applications)
# =============================================================================


class Candidate(Base):
    """
    Unique person entity across applications.

    Represents a candidate who may have multiple applications and resumes.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    email = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(30))
    linkedin_sub = Column(String(255))
    profile_picture = Column(Text)
    candidate_type = Column(String(20), nullable=False, server_default="external")  # internal_employee | external | vendor
    current_status = Column(String(30), nullable=False, server_default="available")  # available | employed | on_assignment | not_looking | blacklisted
    source = Column(String(50), server_default="application")  # application | referral | sourced | internal
    tags = Column(JSONB, server_default="[]")
    summary = Column(Text)
    location = Column(String(255))  # e.g. "Chicago, IL"
    work_preference = Column(String(20))  # remote | hybrid | onsite | open_to_travel
    salary_expectation_min = Column(Integer)
    salary_expectation_max = Column(Integer)
    salary_type = Column(String(20))  # hourly | annual
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "email", name="uq_candidates_site_email"),
        Index("idx_candidates_site_type", "site_id", "candidate_type"),
        Index("idx_candidates_site_status", "site_id", "current_status"),
    )


# =============================================================================
# RESUMES TABLE (versioned resume storage per candidate)
# =============================================================================


class Resume(Base):
    """
    Versioned resume storage per candidate.

    Stores resume files and extracted data for matching.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    storage_path = Column(Text, nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50))
    position_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"))
    is_primary = Column(Boolean, nullable=False, server_default="false")
    extracted_text = Column(Text)
    extracted_skills = Column(JSONB, server_default="[]")
    extracted_experience_years = Column(Integer)
    extracted_education = Column(JSONB, server_default="[]")
    extraction_status = Column(String(20), server_default="pending")  # pending | processing | completed | failed
    extraction_error = Column(Text)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_resumes_site_candidate", "site_id", "candidate_id"),
        Index("idx_resumes_site_extraction_status", "site_id", "extraction_status"),
    )


# =============================================================================
# CANDIDATE_SKILLS TABLE (normalized skills for matching)
# =============================================================================


class CandidateSkill(Base):
    """
    Normalized skills for matching.

    Each row represents a skill associated with a candidate.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "candidate_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    skill_name = Column(String(255), nullable=False)
    proficiency_level = Column(String(20))  # beginner | intermediate | advanced | expert
    years_experience = Column(Integer)
    source = Column(String(20), server_default="extracted")  # extracted | self_reported | recruiter_assessed
    last_seen_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "candidate_id", "skill_name", name="uq_candidate_skills_site_candidate_skill"),
        Index("idx_candidate_skills_site_skill", "site_id", "skill_name"),
    )


# =============================================================================
# CANDIDATE_CERTIFICATIONS TABLE (professional certifications with verification)
# =============================================================================


class CandidateCertification(Base):
    """
    Professional certifications for a candidate.

    Tracks certification name, issuer, dates, and recruiter verification status.
    Can be sourced from resume extraction, self-reported, or recruiter-added.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "candidate_certifications"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    certification_name = Column(String(255), nullable=False)
    issuing_organization = Column(String(255))
    issue_date = Column(Date)
    expiry_date = Column(Date)
    credential_id = Column(String(255))
    source = Column(String(20), nullable=False, server_default="recruiter_added")  # extracted | self_reported | recruiter_added
    verified = Column(Boolean, nullable=False, server_default="false")
    verified_by = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))
    verified_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "candidate_id", "certification_name", name="uq_candidate_certs_site_candidate_name"),
        Index("idx_candidate_certs_site_name", "site_id", "certification_name"),
        Index("idx_candidate_certs_site_candidate", "site_id", "candidate_id"),
    )


# =============================================================================
# POSITION_REQUIREMENTS TABLE (structured requirements from job description)
# =============================================================================


class PositionRequirement(Base):
    """
    Structured requirements from job description.

    Extracted or manually entered requirements for matching against candidates.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "position_requirements"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    position_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"), nullable=False)
    required_skills = Column(JSONB, server_default="[]")
    preferred_skills = Column(JSONB, server_default="[]")
    min_experience_years = Column(Integer)
    max_experience_years = Column(Integer)
    education_level = Column(String(50))
    required_certifications = Column(JSONB, server_default="[]")
    location_requirement = Column(String(255))
    work_mode = Column(String(50))
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    industry = Column(String(100))
    extraction_method = Column(String(20), server_default="manual")  # manual | parsed | ai
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "position_id", name="uq_position_requirements_site_position"),
    )


# =============================================================================
# MATCH_SCORES TABLE (persisted match results)
# =============================================================================


class MatchScore(Base):
    """
    Persisted match results between candidates and positions.

    Stores computed match scores with dimensional breakdowns.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "match_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    position_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"), nullable=False)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"))
    overall_score = Column(Integer, nullable=False)  # 0-100
    confidence = Column(Integer, server_default="100")  # 0-100
    dimensions = Column(JSONB, nullable=False, server_default="[]")
    match_areas = Column(JSONB, nullable=False, server_default="[]")
    gap_areas = Column(JSONB, nullable=False, server_default="[]")
    algorithm_version = Column(String(50), nullable=False)
    engine_config = Column(JSONB, server_default="{}")
    is_stale = Column(Boolean, nullable=False, server_default="false")
    match_type = Column(String(20), nullable=False, server_default="applied")  # applied | passive_scan | manual_trigger
    scored_by = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))
    feedback_score = Column(Integer)  # nullable, recruiter override 0-100
    feedback_notes = Column(Text)
    computed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("candidate_id", "position_id", "resume_id", name="uq_match_scores_candidate_position_resume"),
        Index("idx_match_scores_site_position_score", "site_id", "position_id", overall_score.desc()),
        Index("idx_match_scores_site_candidate", "site_id", "candidate_id"),
        Index("idx_match_scores_site_stale", "site_id", "is_stale"),
    )


# =============================================================================
# EMPLOYEE_ASSIGNMENTS TABLE (internal employee deployment tracking)
# =============================================================================


class EmployeeAssignment(Base):
    """
    Internal employee deployment tracking.

    Tracks where employees are assigned, their rates, and assignment status.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "employee_assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    position_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"))
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"))
    end_client_id = Column(UUID(as_uuid=True), ForeignKey("end_clients.id"))
    role_title = Column(String(255), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True))
    bill_rate = Column(String(50))
    pay_rate = Column(String(50))
    status = Column(String(20), nullable=False, server_default="active")  # active | completed | terminated | on_hold
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_employee_assignments_site_candidate", "site_id", "candidate_id"),
        Index("idx_employee_assignments_site_status", "site_id", "status"),
        Index("idx_employee_assignments_site_end_date", "site_id", "end_date"),
    )


# =============================================================================
# MATCH_SCAN_JOBS TABLE (background scan tracking)
# =============================================================================


class MatchScanJob(Base):
    """
    Background scan tracking for job matching.

    Tracks bulk matching operations against positions.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "match_scan_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    position_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"), nullable=False)
    status = Column(String(20), nullable=False, server_default="pending")  # pending | running | completed | failed
    total_resumes = Column(Integer, nullable=False, server_default="0")
    processed_resumes = Column(Integer, nullable=False, server_default="0")
    algorithm_version = Column(String(50), nullable=False)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_match_scan_jobs_site_position_status", "site_id", "position_id", "status"),
    )


# =============================================================================
# CANDIDATE_PII TABLE (encrypted PII document storage)
# =============================================================================


class CandidatePii(Base):
    """
    Encrypted PII document storage per candidate.

    Stores sensitive identity documents (SSN, DL, DOB, visa docs)
    with application-level AES-256-GCM encryption.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "candidate_pii"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    ssn_encrypted = Column(Text)  # AES-256-GCM encrypted SSN
    dl_number_encrypted = Column(Text)  # AES-256-GCM encrypted driver's license number
    dl_state = Column(String(2))  # US state code (not PII alone)
    dob_encrypted = Column(Text)  # AES-256-GCM encrypted date of birth
    visa_type = Column(String(20))  # H1B | L1 | OPT | CPT | GC | citizen | EAD | other
    visa_doc_path = Column(Text)  # Supabase Storage path (bucket: candidate-documents)
    visa_doc_name = Column(String(255))  # Original filename
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "candidate_id", name="uq_candidate_pii_site_candidate"),
        Index("idx_candidate_pii_site_candidate", "site_id", "candidate_id"),
    )


# =============================================================================
# DOCUMENT_REQUESTS TABLE (recruiter-to-candidate document requests)
# =============================================================================


class DocumentRequest(Base):
    """
    Document requests created by recruiters for candidates to fulfill.

    Part of the compliance workflow: recruiter requests documents (SSN, DL, visa, references, etc.)
    and candidate fulfills them via the self-service portal.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "document_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    request_type = Column(String(30), nullable=False)  # ssn | drivers_license | dob | visa_document | references | background_check_consent | other
    status = Column(String(20), nullable=False, server_default="pending")  # pending | submitted | approved | rejected
    description = Column(Text)  # Custom note from recruiter
    due_date = Column(DateTime(timezone=True))
    min_references = Column(Integer)  # Only for references type (e.g. 2 or 3)

    # Candidate submission
    submitted_at = Column(DateTime(timezone=True))
    submitted_path = Column(Text)  # Supabase Storage path for uploaded file
    submitted_file_name = Column(String(255))
    submitted_text_encrypted = Column(Text)  # AES-256-GCM encrypted (SSN/DOB/DL text)
    submitted_dl_state = Column(String(2))  # DL state code

    # Recruiter review
    reviewer_notes = Column(Text)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))
    reviewed_at = Column(DateTime(timezone=True))

    created_by = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_document_requests_site_application", "site_id", "application_id"),
        Index("idx_document_requests_site_candidate_status", "site_id", "candidate_id", "status"),
    )


# =============================================================================
# CANDIDATE_REFERENCES TABLE (reference contacts submitted by candidates)
# =============================================================================


class CandidateReference(Base):
    """
    Reference contacts submitted by candidates in response to a document request.

    Linked to a document_request of type 'references'.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "candidate_references"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    document_request_id = Column(UUID(as_uuid=True), ForeignKey("document_requests.id"), nullable=False)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    ref_name = Column(String(255), nullable=False)
    ref_title = Column(String(255))
    ref_company = Column(String(255))
    ref_phone = Column(String(30))
    ref_email = Column(String(255))
    relationship = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_candidate_references_site_request", "site_id", "document_request_id"),
    )


# =============================================================================
# CANDIDATE_ONBOARDINGS TABLE (post-hire onboarding checklist)
# =============================================================================


class CandidateOnboarding(Base):
    """
    Post-hire onboarding checklist for a candidate.

    Auto-created when an application reaches 'hired' status.
    Tracks I-9/E-Verify, background check, and orientation/training steps.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "candidate_onboardings"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    status = Column(String(20), nullable=False, server_default="in_progress")  # in_progress | completed
    i9_everify = Column(String(20), nullable=False, server_default="not_started")  # not_started | in_progress | completed
    background_check = Column(String(20), nullable=False, server_default="not_started")
    orientation_training = Column(String(20), nullable=False, server_default="not_started")
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "application_id", name="uq_candidate_onboardings_site_application"),
        Index("idx_candidate_onboardings_site_candidate", "site_id", "candidate_id"),
    )


# =============================================================================
# AI TRANSFORMATION MONITORING TOOL TABLES
# =============================================================================
# These tables are fully independent — only FK to `sites` and `staff_users`.
# No references to ATS tables (positions, applications, candidates, etc.).
# This module can be spun off into its own product at any time.
# =============================================================================


class AIEngagement(Base):
    """
    AI training engagement with a client organization.

    Represents a full engagement lifecycle: baseline → training → post-assessment.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "ai_engagements"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    name = Column(String(255), nullable=False)
    client_name = Column(String(255), nullable=False)
    engagement_lead_id = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))
    status = Column(String(20), nullable=False, server_default="draft")  # draft | baseline | training | post_assessment | completed | archived
    integration_type = Column(String(20))  # jira | azure_devops | github | gitlab | linear | manual
    integration_config = Column(JSONB)  # { baseUrl, projectKey, boardId, token_encrypted }
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "name", name="uq_ai_engagements_site_name"),
        Index("idx_ai_engagements_site_status", "site_id", "status"),
        Index("idx_ai_engagements_site_lead", "site_id", "engagement_lead_id"),
    )


class AITeam(Base):
    """
    Teams within an AI training engagement.

    One engagement can train multiple teams. Each team gets independent
    baseline and post-training assessments.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "ai_teams"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    engagement_id = Column(UUID(as_uuid=True), ForeignKey("ai_engagements.id"), nullable=False)
    name = Column(String(255), nullable=False)
    team_size = Column(Integer, nullable=False)
    external_team_id = Column(String(255))  # Jira board ID, ADO team ID, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_ai_teams_site_engagement", "site_id", "engagement_id"),
    )


class AITeamMember(Base):
    """
    Individual team members with roles for role-based training recommendations.

    Used for per-person activity analysis and customized AI training plans.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "ai_team_members"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    team_id = Column(UUID(as_uuid=True), ForeignKey("ai_teams.id"), nullable=False)
    display_name = Column(String(255), nullable=False)  # "Dev-1" or real name
    role = Column(String(50), nullable=False)  # developer | qa | scrum_master | product_owner | devops | designer
    external_user_id = Column(String(255))  # Jira account ID for integration mapping
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_ai_team_members_site_team", "site_id", "team_id"),
    )


class AIAssessment(Base):
    """
    A measurement period (baseline or post-training) for a specific team.

    Each team gets one baseline and one post-training assessment.
    Metrics are pulled from integrations (Jira, Azure DevOps, GitHub)
    and/or entered via SPACE/DevEx surveys.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "ai_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    team_id = Column(UUID(as_uuid=True), ForeignKey("ai_teams.id"), nullable=False)
    assessment_type = Column(String(20), nullable=False)  # baseline | post_training
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    sprint_count = Column(Integer)
    data_source = Column(String(20), nullable=False, server_default="manual")  # integration | manual
    status = Column(String(20), nullable=False, server_default="draft")  # draft | collecting | completed
    assessed_by = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "team_id", "assessment_type", name="uq_ai_assessments_site_team_type"),
        Index("idx_ai_assessments_site_team", "site_id", "team_id"),
    )


class AIMetric(Base):
    """
    Unified metrics table for DORA, SPACE, DevEx, and Scrum metrics.

    One row per metric per assessment (or per member for survey responses).
    Categories: dora, space, devex, scrum.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "ai_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("ai_assessments.id"), nullable=False)
    category = Column(String(20), nullable=False)  # dora | space | devex | scrum
    metric_name = Column(String(50), nullable=False)  # e.g., "deployment_frequency", "velocity", "satisfaction"
    metric_value = Column(Numeric, nullable=False)
    metric_unit = Column(String(30), nullable=False)  # per_week | minutes | percentage | story_points | score_1_5 | count
    member_id = Column(UUID(as_uuid=True), ForeignKey("ai_team_members.id"))  # NULL for team-level, set for individual surveys
    raw_data = Column(JSONB)  # Source data from integration
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_ai_metrics_site_assessment_category", "site_id", "assessment_id", "category", "metric_name"),
        Index("idx_ai_metrics_site_assessment_member", "site_id", "assessment_id", "member_id"),
    )


class AITrainingPlan(Base):
    """
    Role-based AI training recommendations generated from activity analysis.

    Analyzes what each team member does (from Jira data) and recommends
    specific AI tools and training modules customized for their role.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "ai_training_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    team_id = Column(UUID(as_uuid=True), ForeignKey("ai_teams.id"), nullable=False)
    member_id = Column(UUID(as_uuid=True), ForeignKey("ai_team_members.id"))  # NULL for team-wide recs
    role = Column(String(50), nullable=False)  # developer | qa | scrum_master | product_owner | devops | designer
    activity_summary = Column(JSONB)  # { issueTypes: [...], storyPoints: N, topActivities: [...] }
    recommended_tools = Column(JSONB, nullable=False, server_default="[]")  # [{ tool, reason, expected_impact }]
    recommended_training = Column(JSONB, nullable=False, server_default="[]")  # [{ module, description, duration_hours, priority }]
    status = Column(String(20), nullable=False, server_default="proposed")  # proposed | approved | in_progress | completed
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_ai_training_plans_site_team", "site_id", "team_id"),
        Index("idx_ai_training_plans_site_team_role", "site_id", "team_id", "role"),
    )
