"""add salary expectations to candidates + candidate_certifications table

Revision ID: 0018
Revises: 0017
Create Date: 2026-04-02

Adds salary_expectation_min, salary_expectation_max, salary_type columns to
candidates table. Creates candidate_certifications table for tracking
professional certifications with recruiter verification workflow.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers
revision = "0018"
down_revision = "0017"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Add salary columns to candidates ────────────────────────────────
    op.add_column("candidates", sa.Column("salary_expectation_min", sa.Integer(), nullable=True))
    op.add_column("candidates", sa.Column("salary_expectation_max", sa.Integer(), nullable=True))
    op.add_column("candidates", sa.Column("salary_type", sa.String(20), nullable=True))

    # ── Create candidate_certifications table ───────────────────────────
    op.create_table(
        "candidate_certifications",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("candidate_id", UUID(as_uuid=True), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("certification_name", sa.String(255), nullable=False),
        sa.Column("issuing_organization", sa.String(255), nullable=True),
        sa.Column("issue_date", sa.Date(), nullable=True),
        sa.Column("expiry_date", sa.Date(), nullable=True),
        sa.Column("credential_id", sa.String(255), nullable=True),
        sa.Column("source", sa.String(20), server_default="recruiter_added", nullable=False),
        sa.Column("verified", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("verified_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id"), nullable=True),
        sa.Column("verified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_unique_constraint(
        "uq_candidate_certs_site_candidate_name",
        "candidate_certifications",
        ["site_id", "candidate_id", "certification_name"],
    )
    op.create_index(
        "idx_candidate_certs_site_name",
        "candidate_certifications",
        ["site_id", "certification_name"],
    )
    op.create_index(
        "idx_candidate_certs_site_candidate",
        "candidate_certifications",
        ["site_id", "candidate_id"],
    )


def downgrade() -> None:
    op.drop_index("idx_candidate_certs_site_candidate", table_name="candidate_certifications")
    op.drop_index("idx_candidate_certs_site_name", table_name="candidate_certifications")
    op.drop_constraint("uq_candidate_certs_site_candidate_name", "candidate_certifications", type_="unique")
    op.drop_table("candidate_certifications")

    op.drop_column("candidates", "salary_type")
    op.drop_column("candidates", "salary_expectation_max")
    op.drop_column("candidates", "salary_expectation_min")
