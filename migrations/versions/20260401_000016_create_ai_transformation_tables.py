"""create AI transformation monitoring tables

Revision ID: 0016
Revises: 0015
Create Date: 2026-04-01

Independent module: ai_engagements, ai_teams, ai_team_members,
ai_assessments, ai_metrics, ai_training_plans.
Only FK to sites and staff_users — no ATS table dependencies.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision = "0016"
down_revision = "0015"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # =========================================================================
    # ai_engagements — Training engagement with a client
    # =========================================================================
    op.create_table(
        "ai_engagements",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("client_name", sa.String(255), nullable=False),
        sa.Column("engagement_lead_id", UUID(as_uuid=True), sa.ForeignKey("staff_users.id"), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="draft"),
        sa.Column("integration_type", sa.String(20), nullable=True),
        sa.Column("integration_config", JSONB, nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_unique_constraint("uq_ai_engagements_site_name", "ai_engagements", ["site_id", "name"])
    op.create_index("idx_ai_engagements_site_status", "ai_engagements", ["site_id", "status"])
    op.create_index("idx_ai_engagements_site_lead", "ai_engagements", ["site_id", "engagement_lead_id"])

    # =========================================================================
    # ai_teams — Teams within an engagement
    # =========================================================================
    op.create_table(
        "ai_teams",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("engagement_id", UUID(as_uuid=True), sa.ForeignKey("ai_engagements.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("team_size", sa.Integer(), nullable=False),
        sa.Column("external_team_id", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_ai_teams_site_engagement", "ai_teams", ["site_id", "engagement_id"])

    # =========================================================================
    # ai_team_members — Individual members with roles
    # =========================================================================
    op.create_table(
        "ai_team_members",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("team_id", UUID(as_uuid=True), sa.ForeignKey("ai_teams.id"), nullable=False),
        sa.Column("display_name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), nullable=False),
        sa.Column("external_user_id", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_ai_team_members_site_team", "ai_team_members", ["site_id", "team_id"])

    # =========================================================================
    # ai_assessments — Measurement period (baseline or post-training)
    # =========================================================================
    op.create_table(
        "ai_assessments",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("team_id", UUID(as_uuid=True), sa.ForeignKey("ai_teams.id"), nullable=False),
        sa.Column("assessment_type", sa.String(20), nullable=False),
        sa.Column("period_start", sa.DateTime(timezone=True), nullable=False),
        sa.Column("period_end", sa.DateTime(timezone=True), nullable=False),
        sa.Column("sprint_count", sa.Integer(), nullable=True),
        sa.Column("data_source", sa.String(20), nullable=False, server_default="manual"),
        sa.Column("status", sa.String(20), nullable=False, server_default="draft"),
        sa.Column("assessed_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id"), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_unique_constraint("uq_ai_assessments_site_team_type", "ai_assessments", ["site_id", "team_id", "assessment_type"])
    op.create_index("idx_ai_assessments_site_team", "ai_assessments", ["site_id", "team_id"])

    # =========================================================================
    # ai_metrics — Unified metrics (DORA, SPACE, DevEx, Scrum)
    # =========================================================================
    op.create_table(
        "ai_metrics",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("ai_assessments.id"), nullable=False),
        sa.Column("category", sa.String(20), nullable=False),
        sa.Column("metric_name", sa.String(50), nullable=False),
        sa.Column("metric_value", sa.Numeric(), nullable=False),
        sa.Column("metric_unit", sa.String(30), nullable=False),
        sa.Column("member_id", UUID(as_uuid=True), sa.ForeignKey("ai_team_members.id"), nullable=True),
        sa.Column("raw_data", JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_ai_metrics_site_assessment_category", "ai_metrics", ["site_id", "assessment_id", "category", "metric_name"])
    op.create_index("idx_ai_metrics_site_assessment_member", "ai_metrics", ["site_id", "assessment_id", "member_id"])

    # =========================================================================
    # ai_training_plans — Role-based training recommendations
    # =========================================================================
    op.create_table(
        "ai_training_plans",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("team_id", UUID(as_uuid=True), sa.ForeignKey("ai_teams.id"), nullable=False),
        sa.Column("member_id", UUID(as_uuid=True), sa.ForeignKey("ai_team_members.id"), nullable=True),
        sa.Column("role", sa.String(50), nullable=False),
        sa.Column("activity_summary", JSONB, nullable=True),
        sa.Column("recommended_tools", JSONB, nullable=False, server_default="[]"),
        sa.Column("recommended_training", JSONB, nullable=False, server_default="[]"),
        sa.Column("status", sa.String(20), nullable=False, server_default="proposed"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_ai_training_plans_site_team", "ai_training_plans", ["site_id", "team_id"])
    op.create_index("idx_ai_training_plans_site_team_role", "ai_training_plans", ["site_id", "team_id", "role"])


def downgrade() -> None:
    op.drop_table("ai_training_plans")
    op.drop_table("ai_metrics")
    op.drop_table("ai_assessments")
    op.drop_table("ai_team_members")
    op.drop_table("ai_teams")
    op.drop_table("ai_engagements")
