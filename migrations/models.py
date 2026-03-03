"""
SQLAlchemy Models for Alembic Migrations

These models define the database schema for USSP Supabase PostgreSQL.
They are used ONLY for migrations - not for ORM operations.

The application uses the Supabase JS client (Next.js), not SQLAlchemy ORM.
These models ensure the schema matches what the Supabase client expects.
"""

from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


# =============================================================================
# POSITIONS TABLE
# =============================================================================


class Position(Base):
    """
    Job positions table.

    Stores active job listings displayed on the careers page.
    """

    __tablename__ = "positions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    location = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    description = Column(Text)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("slug", name="positions_slug_key"),
    )


# =============================================================================
# APPLICATIONS TABLE
# =============================================================================


class Application(Base):
    """
    Job applications table.

    Stores applications submitted via LinkedIn OAuth + resume upload.
    """

    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    job_slug = Column(String(255), nullable=False)
    resume_path = Column(Text)
    resume_name = Column(String(255))
    auth_provider = Column(String(50), default="linkedin")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
