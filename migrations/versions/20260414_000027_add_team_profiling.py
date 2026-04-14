"""Add team profiling columns and training status table.

Extends assessment_members with vendor, in_pilot, ai_tool fields.
Extends assessment_ai_opportunities with stair_step.
Adds team_training_status table.

Revision ID: 0027
Revises: 0026
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "0027"
down_revision = "0026"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add vendor, in_pilot, ai_tool to assessment_members
    op.add_column(
        "assessment_members",
        sa.Column("vendor", sa.String(50), nullable=True),
    )
    op.add_column(
        "assessment_members",
        sa.Column("in_pilot", sa.Boolean(), server_default=sa.text("false"), nullable=False),
    )
    op.add_column(
        "assessment_members",
        sa.Column("ai_tool", sa.String(50), nullable=True),
    )

    # Add stair_step to assessment_ai_opportunities (if table exists)
    op.add_column(
        "assessment_enhancement_status",
        sa.Column("stair_step", sa.Integer(), nullable=True),
    )

    # Create team_training_status table
    op.create_table(
        "team_training_status",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("member_id", UUID(as_uuid=True), sa.ForeignKey("assessment_members.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("track_name", sa.String(100), nullable=False),
        sa.Column("status", sa.String(50), server_default="pending", nullable=False),
        sa.Column("scheduled_date", sa.Date(), nullable=True),
        sa.Column("completed_date", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("idx_training_status_member", "team_training_status", ["member_id"])
    op.create_index("idx_training_status_site", "team_training_status", ["site_id"])


def downgrade() -> None:
    op.drop_index("idx_training_status_site", table_name="team_training_status")
    op.drop_index("idx_training_status_member", table_name="team_training_status")
    op.drop_table("team_training_status")
    op.drop_column("assessment_enhancement_status", "stair_step")
    op.drop_column("assessment_members", "ai_tool")
    op.drop_column("assessment_members", "in_pilot")
    op.drop_column("assessment_members", "vendor")
