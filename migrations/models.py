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
    text,
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
    identity_verification = Column(String(20), nullable=False, server_default="not_started")  # not_started | in_progress | completed
    address_verification = Column(String(20), nullable=False, server_default="not_started")  # not_started | in_progress | completed
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


class AIEngagementContact(Base):
    """
    Org directory contacts for an AI transformation engagement.

    Tracks stakeholders, sponsors, working team members across vendors.
    Not limited to Scrum team members — includes executives, PMs, architects, etc.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "ai_engagement_contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    engagement_id = Column(UUID(as_uuid=True), ForeignKey("ai_engagements.id"), nullable=False)
    display_name = Column(String(255), nullable=False)
    full_name = Column(String(255))
    email = Column(String(255))
    title = Column(String(255), nullable=False)
    organization = Column(String(255))
    category = Column(String(30), nullable=False, server_default="working_team")  # executive | state | leadership | working_team
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_ai_engagement_contacts_site_eng", "site_id", "engagement_id"),
    )


class AIEngagementDocument(Base):
    """
    Document metadata for files uploaded to an engagement.

    Actual files stored in Supabase storage; this table tracks metadata.
    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "ai_engagement_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    engagement_id = Column(UUID(as_uuid=True), ForeignKey("ai_engagements.id"), nullable=False)
    file_name = Column(String(500), nullable=False)
    file_type = Column(String(100))
    file_size = Column(Integer)
    storage_path = Column(String(1000), nullable=False)
    category = Column(String(50), server_default="general")  # general | policy | framework | meeting_notes | playbook | reference
    description = Column(Text)
    uploaded_by = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_ai_engagement_documents_site_eng", "site_id", "engagement_id"),
    )


# =============================================================================
# TENANTS TABLE (tenant registry for multi-tenant tools platform)
# =============================================================================


class Tenant(Base):
    """
    Tenant registry for the AI Transformation Tools platform.

    Each tenant gets a separate deployment (Railway service) with its own
    SITE_ID, auth provider, and domain. Data isolation is via site_id filtering.
    USSP is the owner tenant (is_owner=True) and can manage all other tenants.
    """

    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    short_name = Column(String(50), nullable=False)
    domain = Column(String(255))
    auth_provider = Column(String(50), nullable=False, server_default="google")
    logo_url = Column(String(500))
    favicon_url = Column(String(500))
    primary_color = Column(String(7), server_default="#2563EB")
    tagline = Column(String(255))
    auto_provision = Column(Boolean, nullable=False, server_default="false")
    default_role = Column(String(50), nullable=False, server_default="viewer")
    allowed_domain = Column(String(255))
    is_owner = Column(Boolean, nullable=False, server_default="false")
    active = Column(Boolean, nullable=False, server_default="true")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())


# =============================================================================
# TENANT_TOOL_ENTITLEMENTS TABLE (per-tenant feature gating)
# =============================================================================


class TenantToolEntitlement(Base):
    """
    Controls which tools/features each tenant can access in the AI Tools platform.

    Owner tenants (USSP) always have full access. Non-owner tenants only see
    tools that have been explicitly enabled by a USSP admin.
    """

    __tablename__ = "tenant_tool_entitlements"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("tenants.site_id"), nullable=False)
    tool_key = Column(String(100), nullable=False)
    enabled = Column(Boolean, nullable=False, server_default="false")
    enabled_by = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))
    enabled_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "tool_key", name="uq_tenant_tool_site_key"),
        Index("idx_tenant_tool_site", "site_id"),
    )


# =============================================================================
# TAXONOMY NODES (custom skill/capability taxonomy extensions)
# =============================================================================


class TaxonomyNode(Base):
    """
    Custom taxonomy node added by recruiters or admins.

    Extends the base taxonomy shipped with @openspecmatch/engine.
    Custom nodes are merged with the base taxonomy at matching time.
    Mature custom nodes can be promoted to the base package via admin script.

    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "taxonomy_nodes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")

    # Tree and position in the hierarchy
    tree = Column(String(50), nullable=False)  # e.g. "technology", "certifications", "domain-knowledge"
    node_id = Column(String(100), nullable=False)  # kebab-case identifier e.g. "power-bi"
    path = Column(String(500), nullable=False)  # Full dot-path e.g. "data.analytics.power-bi"
    label = Column(String(255), nullable=False)  # Human-readable e.g. "Power BI"
    parent_path = Column(String(500))  # Parent's full path (null for root nodes)

    # Discovery helpers
    aliases = Column(JSONB, server_default="[]")  # Alternative names ["powerbi", "microsoft power bi"]
    related_paths = Column(JSONB, server_default="[]")  # Related node paths for sibling/related matching

    # Metadata
    description = Column(Text)  # Optional description of what this skill/cert/tool is
    source = Column(String(50), server_default="recruiter")  # "recruiter" | "admin" | "auto" | "promoted"
    usage_count = Column(Integer, server_default="0")  # How many times this node has been used in matching
    promoted = Column(Boolean, server_default="false")  # True = exported to base package
    promoted_at = Column(DateTime(timezone=True))

    # Audit
    created_by = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "tree", "path", name="uq_taxonomy_node_site_tree_path"),
        Index("idx_taxonomy_node_site", "site_id"),
        Index("idx_taxonomy_node_tree", "site_id", "tree"),
    )


# =============================================================================
# UNRESOLVED SKILLS (skills from matches that didn't resolve in taxonomy)
# =============================================================================


class UnresolvedSkill(Base):
    """
    Tracks skills/terms encountered during matching that couldn't be resolved
    in the taxonomy. Recruiters review these and add taxonomy nodes for them.

    Multi-tenant: filtered by site_id.
    """

    __tablename__ = "unresolved_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False, server_default="ussp")
    raw_text = Column(String(500), nullable=False)  # The original text that couldn't be resolved
    source = Column(String(50), nullable=False)  # "position_requirement" | "resume_extraction"
    source_id = Column(String(255))  # Position ID or candidate ID where this was found
    occurrence_count = Column(Integer, server_default="1")  # How many times seen
    resolved = Column(Boolean, server_default="false")  # True = a taxonomy node was created for this
    resolved_node_path = Column(String(500))  # Path of the taxonomy node that resolved it
    first_seen_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_seen_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("site_id", "raw_text", name="uq_unresolved_skill_site_text"),
        Index("idx_unresolved_skill_site", "site_id"),
        Index("idx_unresolved_skill_unresolved", "site_id", "resolved"),
    )


# =============================================================================
# READINESS ASSESSMENT WORKFLOW
# =============================================================================


class ReadinessAssessment(Base):
    """Top-level readiness assessment record. Can be standalone or linked to an engagement."""

    __tablename__ = "readiness_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    name = Column(String(255), nullable=False)
    engagement_id = Column(UUID(as_uuid=True), nullable=True)
    prior_assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id"), nullable=True)
    status = Column(String(50), nullable=False, server_default="draft")
    created_by = Column(String(255), nullable=False)
    deadline = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_readiness_assessments_site", "site_id"),
        Index("idx_readiness_assessments_status", "site_id", "status"),
    )


class AssessmentCompany(Base):
    """Company profile data per readiness assessment."""

    __tablename__ = "assessment_companies"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    name = Column(String(255), nullable=False)
    industry = Column(String(100))
    entity_type = Column(String(50), nullable=False)
    state = Column(String(50))
    size = Column(String(50))
    sector_constraints = Column(JSONB, server_default="{}")
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_assessment_companies_assessment", "assessment_id"),
    )


class AssessmentTeam(Base):
    """Team details per readiness assessment."""

    __tablename__ = "assessment_teams"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    name = Column(String(255), nullable=False)
    team_function = Column(String(50))
    methodology = Column(String(50))
    size = Column(Integer)
    objectives = Column(Text)
    pain_points = Column(Text)
    ai_hopes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_assessment_teams_assessment", "assessment_id"),
    )


class AssessmentMember(Base):
    """Team member directory per readiness assessment."""

    __tablename__ = "assessment_members"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    team_id = Column(UUID(as_uuid=True), ForeignKey("assessment_teams.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    custom_role_label = Column(String(255))
    seniority = Column(String(50))
    vendor = Column(String(50))
    in_pilot = Column(Boolean, server_default=text("false"), nullable=False)
    ai_tool = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_assessment_members_team", "team_id"),
    )


class TeamTrainingStatus(Base):
    """Training completion tracking per team member per track."""

    __tablename__ = "team_training_status"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    member_id = Column(UUID(as_uuid=True), ForeignKey("assessment_members.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    track_name = Column(String(100), nullable=False)
    status = Column(String(50), server_default=text("'pending'"), nullable=False)
    scheduled_date = Column(Date)
    completed_date = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_training_status_member", "member_id"),
        Index("idx_training_status_site", "site_id"),
    )


class AssessmentPolicy(Base):
    """AI policy intake per readiness assessment."""

    __tablename__ = "assessment_policies"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    has_policy = Column(Boolean, nullable=False, server_default="false")
    policy_document_url = Column(String(500))
    coverage = Column(JSONB, server_default="{}")
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_assessment_policies_assessment", "assessment_id"),
    )


class QuestionBank(Base):
    """Versioned question bank for readiness questionnaires."""

    __tablename__ = "question_bank"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=True)
    category = Column(String(50), nullable=False)
    capability = Column(String(100))
    question_text = Column(Text, nullable=False)
    description = Column(Text)
    entity_types = Column(JSONB, server_default="[]")
    roles = Column(JSONB, server_default="[]")
    is_default = Column(Boolean, server_default="true")
    sort_order = Column(Integer, server_default="0")
    version = Column(Integer, nullable=False, server_default="1")
    status = Column(String(20), nullable=False, server_default="active")
    parent_question_id = Column(UUID(as_uuid=True), ForeignKey("question_bank.id"), nullable=True)
    created_by = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_question_bank_site", "site_id"),
        Index("idx_question_bank_category", "category"),
        Index("idx_question_bank_status", "status"),
        Index("idx_question_bank_parent", "parent_question_id"),
    )


class QuestionDevelopmentRequest(Base):
    """Tracks unmapped roles needing question development."""

    __tablename__ = "question_development_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    custom_role_label = Column(String(255), nullable=False)
    status = Column(String(20), nullable=False, server_default="pending")
    requested_from_assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id"), nullable=True)
    resolved_by = Column(String(255))
    resolved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_question_dev_requests_site", "site_id"),
        Index("idx_question_dev_requests_status", "site_id", "status"),
    )


class AssessmentQuestionnaire(Base):
    """Generated questionnaire instance per readiness assessment."""

    __tablename__ = "assessment_questionnaires"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    status = Column(String(20), nullable=False, server_default="draft")
    generated_at = Column(DateTime(timezone=True))
    customized = Column(Boolean, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_assessment_questionnaires_assessment", "assessment_id"),
    )


class QuestionnaireQuestion(Base):
    """Questions selected for a specific questionnaire with version pinning."""

    __tablename__ = "questionnaire_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    questionnaire_id = Column(UUID(as_uuid=True), ForeignKey("assessment_questionnaires.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("question_bank.id"), nullable=False)
    question_version = Column(Integer, nullable=False)
    sort_order = Column(Integer, nullable=False, server_default="0")
    is_required = Column(Boolean, server_default="true")
    target_roles = Column(JSONB, server_default="[]")

    __table_args__ = (
        Index("idx_questionnaire_questions_qid", "questionnaire_id"),
    )


class QuestionnaireResponse(Base):
    """Individual member response to a questionnaire, accessed via token."""

    __tablename__ = "questionnaire_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    questionnaire_id = Column(UUID(as_uuid=True), ForeignKey("assessment_questionnaires.id", ondelete="CASCADE"), nullable=False)
    member_id = Column(UUID(as_uuid=True), ForeignKey("assessment_members.id", ondelete="CASCADE"), nullable=False)
    token = Column(UUID(as_uuid=True), server_default=func.gen_random_uuid(), nullable=False, unique=True)
    status = Column(String(20), nullable=False, server_default="not_started")
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))

    __table_args__ = (
        Index("idx_questionnaire_responses_questionnaire", "questionnaire_id"),
        Index("idx_questionnaire_responses_token", "token", unique=True),
    )


class ResponseAnswer(Base):
    """Individual answer per question per response."""

    __tablename__ = "response_answers"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    response_id = Column(UUID(as_uuid=True), ForeignKey("questionnaire_responses.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("question_bank.id"), nullable=False)
    score = Column(Integer)
    comment = Column(Text)
    flag = Column(String(20))
    answered_at = Column(DateTime(timezone=True))

    __table_args__ = (
        Index("idx_response_answers_response", "response_id"),
    )


class QuestionFeedbackStats(Base):
    """Cached aggregate feedback stats per question."""

    __tablename__ = "question_feedback_stats"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    question_id = Column(UUID(as_uuid=True), ForeignKey("question_bank.id", ondelete="CASCADE"), nullable=False, unique=True)
    times_asked = Column(Integer, server_default="0")
    avg_score = Column(Numeric(3, 2))
    unclear_count = Column(Integer, server_default="0")
    not_applicable_count = Column(Integer, server_default="0")
    needs_review = Column(Boolean, server_default="false")
    last_computed_at = Column(DateTime(timezone=True))

    __table_args__ = (
        Index("idx_question_feedback_question", "question_id", unique=True),
    )


# =============================================================================
# READINESS DELIVERABLES — CATALOG, SCOPE, CONSTRAINTS, SDLC, USE CASES, RISKS, PILOTS
# =============================================================================


class CatalogVersion(Base):
    __tablename__ = "catalog_versions"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    version_number = Column(Integer, nullable=False, unique=True)
    release_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    release_notes = Column(Text)
    item_count = Column(Integer, server_default="0")
    created_by = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AIEnhancementCatalog(Base):
    __tablename__ = "ai_enhancement_catalog"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    pillar = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    example_tools = Column(Text)
    version = Column(Integer, nullable=False, server_default="1")
    status = Column(String(20), nullable=False, server_default="active")
    parent_item_id = Column(UUID(as_uuid=True), ForeignKey("ai_enhancement_catalog.id"), nullable=True)
    catalog_version_id = Column(UUID(as_uuid=True), ForeignKey("catalog_versions.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    __table_args__ = (
        Index("idx_catalog_pillar", "pillar"),
        Index("idx_catalog_status", "status"),
    )


class AssessmentEnhancementStatus(Base):
    __tablename__ = "assessment_enhancement_status"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    catalog_item_id = Column(UUID(as_uuid=True), ForeignKey("ai_enhancement_catalog.id"), nullable=False)
    catalog_version = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, server_default="not_evaluated")
    tool_used = Column(String(255))
    blocking_constraint_id = Column(UUID(as_uuid=True), nullable=True)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (
        Index("idx_enhancement_status_assessment", "assessment_id"),
    )


class AssessmentVersionStamp(Base):
    __tablename__ = "assessment_version_stamps"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    source_type = Column(String(50), nullable=False)
    source_version = Column(Integer, nullable=False)
    source_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    __table_args__ = (
        Index("idx_version_stamps_assessment", "assessment_id"),
    )


class AssessmentScope(Base):
    __tablename__ = "assessment_scope"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    pillar = Column(String(50), nullable=False)
    in_scope = Column(Boolean, nullable=False, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    __table_args__ = (
        UniqueConstraint("assessment_id", "pillar", name="uq_scope_assessment_pillar"),
        Index("idx_scope_assessment", "assessment_id"),
    )


class AssessmentConstraintModel(Base):
    __tablename__ = "assessment_constraints"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    severity = Column(String(10), nullable=False, server_default="hard")
    source = Column(String(255))
    notes = Column(Text)
    sort_order = Column(Integer, server_default="0")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    __table_args__ = (
        Index("idx_constraints_assessment", "assessment_id"),
    )


class AssessmentApprovedTool(Base):
    __tablename__ = "assessment_approved_tools"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    tool_name = Column(String(255), nullable=False)
    vendor = Column(String(255))
    capabilities = Column(Text)
    restrictions = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    __table_args__ = (
        Index("idx_approved_tools_assessment", "assessment_id"),
    )


class AssessmentWorkflowPhase(Base):
    __tablename__ = "assessment_workflow_phases"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    pillar = Column(String(50))
    roles_involved = Column(JSONB, server_default="[]")
    current_tools = Column(JSONB, server_default="[]")
    time_spent_hours = Column(Numeric(6, 1))
    pain_points = Column(Text)
    sort_order = Column(Integer, server_default="0")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (
        Index("idx_workflow_phases_assessment", "assessment_id"),
    )


class AssessmentAIOpportunity(Base):
    __tablename__ = "assessment_ai_opportunities"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    phase_id = Column(UUID(as_uuid=True), ForeignKey("assessment_workflow_phases.id", ondelete="CASCADE"), nullable=False)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    description = Column(Text, nullable=False)
    approved_tool = Column(String(255))
    expected_improvement = Column(Text)
    improvement_type = Column(String(30))
    improvement_pct = Column(Numeric(5, 1))
    constraint_compliant = Column(Boolean, server_default="true")
    is_current_strength = Column(Boolean, server_default="false")
    sort_order = Column(Integer, server_default="0")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    __table_args__ = (
        Index("idx_opportunities_phase", "phase_id"),
        Index("idx_opportunities_assessment", "assessment_id"),
    )


class AssessmentDataReadiness(Base):
    __tablename__ = "assessment_data_readiness"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False, unique=True)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    data_quality = Column(Integer)
    data_accessibility = Column(Integer)
    data_governance = Column(Integer)
    data_pipelines = Column(Integer)
    data_security = Column(Integer)
    evidence_notes = Column(JSONB, server_default="{}")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())


class AssessmentUseCase(Base):
    __tablename__ = "assessment_use_cases"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    pillar = Column(String(50))
    affected_roles = Column(JSONB, server_default="[]")
    impact_score = Column(Integer)
    effort_score = Column(Integer)
    quadrant = Column(String(30))
    timeline_months = Column(Integer)
    required_tools = Column(Text)
    prerequisites = Column(Text)
    sort_order = Column(Integer, server_default="0")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (
        Index("idx_use_cases_assessment", "assessment_id"),
    )


class AssessmentRisk(Base):
    __tablename__ = "assessment_risks"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(30), nullable=False)
    likelihood = Column(Integer)
    impact_score = Column(Integer)
    risk_score = Column(Integer)
    mitigation = Column(Text)
    owner = Column(String(255))
    is_preseeded = Column(Boolean, server_default="false")
    sort_order = Column(Integer, server_default="0")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (
        Index("idx_risks_assessment", "assessment_id"),
    )


class AssessmentPilotModel(Base):
    __tablename__ = "assessment_pilots"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String(50), ForeignKey("sites.id"), nullable=False)
    use_case_id = Column(UUID(as_uuid=True), ForeignKey("assessment_use_cases.id"), nullable=True)
    title = Column(String(255), nullable=False)
    scope_description = Column(Text)
    success_criteria = Column(Text)
    timeline = Column(String(100))
    team_roles = Column(JSONB, server_default="[]")
    tools_needed = Column(Text)
    estimated_cost = Column(String(255))
    go_nogo_criteria = Column(Text)
    sort_order = Column(Integer, server_default="0")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (
        Index("idx_pilots_assessment", "assessment_id"),
    )
