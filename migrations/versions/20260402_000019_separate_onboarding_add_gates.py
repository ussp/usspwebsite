"""separate onboarding from hiring pipeline, create candidate_onboardings table

Revision ID: 0019
Revises: 0018
Create Date: 2026-04-02

Removes 'onboarding' as an application pipeline stage. Creates a separate
candidate-level onboarding checklist (I-9/E-Verify, Background Check,
Orientation/Training) that auto-triggers when an application reaches 'hired'.
Migrates existing 'onboarding' applications to 'hired' with onboarding records.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers
revision = "0019"
down_revision = "0018"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Create candidate_onboardings table ──────────────────────────────
    op.create_table(
        "candidate_onboardings",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("candidate_id", UUID(as_uuid=True), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("application_id", UUID(as_uuid=True), sa.ForeignKey("applications.id"), nullable=False),
        sa.Column("status", sa.String(20), server_default="in_progress", nullable=False),
        sa.Column("i9_everify", sa.String(20), server_default="not_started", nullable=False),
        sa.Column("background_check", sa.String(20), server_default="not_started", nullable=False),
        sa.Column("orientation_training", sa.String(20), server_default="not_started", nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_unique_constraint(
        "uq_candidate_onboardings_site_application",
        "candidate_onboardings",
        ["site_id", "application_id"],
    )
    op.create_index(
        "idx_candidate_onboardings_site_candidate",
        "candidate_onboardings",
        ["site_id", "candidate_id"],
    )

    # ── Migrate existing 'onboarding' applications ──────────────────────
    # Create onboarding records for apps at 'onboarding' that have a candidate_id
    op.execute("""
        INSERT INTO candidate_onboardings (site_id, candidate_id, application_id)
        SELECT site_id, candidate_id, id
        FROM applications
        WHERE status = 'onboarding' AND candidate_id IS NOT NULL
    """)

    # Move all 'onboarding' applications to 'hired'
    op.execute("""
        UPDATE applications SET status = 'hired', status_updated_at = NOW()
        WHERE status = 'onboarding'
    """)


def downgrade() -> None:
    # Note: cannot perfectly restore which apps were at 'onboarding' vs 'hired'
    op.drop_index("idx_candidate_onboardings_site_candidate", table_name="candidate_onboardings")
    op.drop_constraint("uq_candidate_onboardings_site_application", "candidate_onboardings", type_="unique")
    op.drop_table("candidate_onboardings")
