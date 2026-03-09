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
    Index,
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
    description = Column(Text)
    salary_range = Column(String(100))
    department = Column(String(100))
    active = Column(Boolean, default=True, nullable=False)
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
    status = Column(String(50), server_default="new")  # new, screening, interview, offer, hired, rejected, withdrawn
    status_updated_at = Column(DateTime(timezone=True))
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("staff_users.id"))

    __table_args__ = (
        Index("idx_applications_site_id", "site_id"),
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
