"""add readiness deliverables: catalog, scope, constraints, SDLC, use cases, risks, pilots

Revision ID: 0026
Revises: 0025
Create Date: 2026-04-13
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision = "0026"
down_revision = "0025"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── catalog_versions ───────────────────────────────────────────
    op.create_table(
        "catalog_versions",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("version_number", sa.Integer, nullable=False, unique=True),
        sa.Column("release_date", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("release_notes", sa.Text),
        sa.Column("item_count", sa.Integer, server_default="0"),
        sa.Column("created_by", sa.String(255)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # ── ai_enhancement_catalog ─────────────────────────────────────
    op.create_table(
        "ai_enhancement_catalog",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("pillar", sa.String(50), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("example_tools", sa.Text),
        sa.Column("version", sa.Integer, nullable=False, server_default="1"),
        sa.Column("status", sa.String(20), nullable=False, server_default="active"),  # active | deprecated | new
        sa.Column("parent_item_id", UUID(as_uuid=True), sa.ForeignKey("ai_enhancement_catalog.id"), nullable=True),
        sa.Column("catalog_version_id", UUID(as_uuid=True), sa.ForeignKey("catalog_versions.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_catalog_pillar", "ai_enhancement_catalog", ["pillar"])
    op.create_index("idx_catalog_status", "ai_enhancement_catalog", ["status"])

    # ── assessment_enhancement_status ──────────────────────────────
    op.create_table(
        "assessment_enhancement_status",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("catalog_item_id", UUID(as_uuid=True), sa.ForeignKey("ai_enhancement_catalog.id"), nullable=False),
        sa.Column("catalog_version", sa.Integer, nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="not_evaluated"),  # in_use | opportunity | blocked | not_applicable | not_evaluated
        sa.Column("tool_used", sa.String(255)),
        sa.Column("blocking_constraint_id", UUID(as_uuid=True), nullable=True),
        sa.Column("notes", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_enhancement_status_assessment", "assessment_enhancement_status", ["assessment_id"])

    # ── assessment_version_stamps ──────────────────────────────────
    op.create_table(
        "assessment_version_stamps",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("source_type", sa.String(50), nullable=False),  # catalog | question_bank | sdlc_template | risk_template | constraint_template
        sa.Column("source_version", sa.Integer, nullable=False),
        sa.Column("source_date", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_version_stamps_assessment", "assessment_version_stamps", ["assessment_id"])

    # ── assessment_scope ───────────────────────────────────────────
    op.create_table(
        "assessment_scope",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("pillar", sa.String(50), nullable=False),
        sa.Column("in_scope", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("assessment_id", "pillar", name="uq_scope_assessment_pillar"),
    )
    op.create_index("idx_scope_assessment", "assessment_scope", ["assessment_id"])

    # ── assessment_constraints ─────────────────────────────────────
    op.create_table(
        "assessment_constraints",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("category", sa.String(50), nullable=False),  # technology | ai_tools | process | data_privacy | policy_compliance | budget_resources
        sa.Column("severity", sa.String(10), nullable=False, server_default="hard"),  # hard | soft
        sa.Column("source", sa.String(255)),
        sa.Column("notes", sa.Text),
        sa.Column("sort_order", sa.Integer, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_constraints_assessment", "assessment_constraints", ["assessment_id"])

    # ── assessment_approved_tools ──────────────────────────────────
    op.create_table(
        "assessment_approved_tools",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("tool_name", sa.String(255), nullable=False),
        sa.Column("vendor", sa.String(255)),
        sa.Column("capabilities", sa.Text),
        sa.Column("restrictions", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_approved_tools_assessment", "assessment_approved_tools", ["assessment_id"])

    # ── assessment_workflow_phases ─────────────────────────────────
    op.create_table(
        "assessment_workflow_phases",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("pillar", sa.String(50)),
        sa.Column("roles_involved", JSONB, server_default="[]"),
        sa.Column("current_tools", JSONB, server_default="[]"),
        sa.Column("time_spent_hours", sa.Numeric(6, 1)),
        sa.Column("pain_points", sa.Text),
        sa.Column("sort_order", sa.Integer, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_workflow_phases_assessment", "assessment_workflow_phases", ["assessment_id"])

    # ── assessment_ai_opportunities ────────────────────────────────
    op.create_table(
        "assessment_ai_opportunities",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("phase_id", UUID(as_uuid=True), sa.ForeignKey("assessment_workflow_phases.id", ondelete="CASCADE"), nullable=False),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("approved_tool", sa.String(255)),
        sa.Column("expected_improvement", sa.Text),
        sa.Column("improvement_type", sa.String(30)),  # time_savings | quality | automation | insight
        sa.Column("improvement_pct", sa.Numeric(5, 1)),
        sa.Column("constraint_compliant", sa.Boolean, server_default="true"),
        sa.Column("is_current_strength", sa.Boolean, server_default="false"),
        sa.Column("sort_order", sa.Integer, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_opportunities_phase", "assessment_ai_opportunities", ["phase_id"])
    op.create_index("idx_opportunities_assessment", "assessment_ai_opportunities", ["assessment_id"])

    # ── assessment_data_readiness ──────────────────────────────────
    op.create_table(
        "assessment_data_readiness",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("data_quality", sa.Integer),
        sa.Column("data_accessibility", sa.Integer),
        sa.Column("data_governance", sa.Integer),
        sa.Column("data_pipelines", sa.Integer),
        sa.Column("data_security", sa.Integer),
        sa.Column("evidence_notes", JSONB, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )

    # ── assessment_use_cases ───────────────────────────────────────
    op.create_table(
        "assessment_use_cases",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("pillar", sa.String(50)),
        sa.Column("affected_roles", JSONB, server_default="[]"),
        sa.Column("impact_score", sa.Integer),
        sa.Column("effort_score", sa.Integer),
        sa.Column("quadrant", sa.String(30)),  # quick_win | strategic_bet | fill_in | avoid
        sa.Column("timeline_months", sa.Integer),
        sa.Column("required_tools", sa.Text),
        sa.Column("prerequisites", sa.Text),
        sa.Column("sort_order", sa.Integer, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_use_cases_assessment", "assessment_use_cases", ["assessment_id"])

    # ── assessment_risks ───────────────────────────────────────────
    op.create_table(
        "assessment_risks",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("category", sa.String(30), nullable=False),  # technical | organizational | regulatory | ethical
        sa.Column("likelihood", sa.Integer),
        sa.Column("impact_score", sa.Integer),
        sa.Column("risk_score", sa.Integer),
        sa.Column("mitigation", sa.Text),
        sa.Column("owner", sa.String(255)),
        sa.Column("is_preseeded", sa.Boolean, server_default="false"),
        sa.Column("sort_order", sa.Integer, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_risks_assessment", "assessment_risks", ["assessment_id"])

    # ── assessment_pilots ──────────────────────────────────────────
    op.create_table(
        "assessment_pilots",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("use_case_id", UUID(as_uuid=True), sa.ForeignKey("assessment_use_cases.id"), nullable=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("scope_description", sa.Text),
        sa.Column("success_criteria", sa.Text),
        sa.Column("timeline", sa.String(100)),
        sa.Column("team_roles", JSONB, server_default="[]"),
        sa.Column("tools_needed", sa.Text),
        sa.Column("estimated_cost", sa.String(255)),
        sa.Column("go_nogo_criteria", sa.Text),
        sa.Column("sort_order", sa.Integer, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_pilots_assessment", "assessment_pilots", ["assessment_id"])


def downgrade() -> None:
    op.drop_table("assessment_pilots")
    op.drop_table("assessment_risks")
    op.drop_table("assessment_use_cases")
    op.drop_table("assessment_data_readiness")
    op.drop_table("assessment_ai_opportunities")
    op.drop_table("assessment_workflow_phases")
    op.drop_table("assessment_approved_tools")
    op.drop_table("assessment_constraints")
    op.drop_table("assessment_scope")
    op.drop_table("assessment_version_stamps")
    op.drop_table("assessment_enhancement_status")
    op.drop_table("ai_enhancement_catalog")
    op.drop_table("catalog_versions")
