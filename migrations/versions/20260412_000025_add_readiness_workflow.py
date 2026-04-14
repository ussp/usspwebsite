"""add readiness assessment workflow tables

Revision ID: 0025
Revises: 0024
Create Date: 2026-04-12
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision = "0025"
down_revision = "0024"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── readiness_assessments ──────────────────────────────────────
    op.create_table(
        "readiness_assessments",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("engagement_id", UUID(as_uuid=True), nullable=True),
        sa.Column("prior_assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id"), nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="draft"),  # draft | collecting | completed
        sa.Column("created_by", sa.String(255), nullable=False),
        sa.Column("deadline", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_readiness_assessments_site", "readiness_assessments", ["site_id"])
    op.create_index("idx_readiness_assessments_status", "readiness_assessments", ["site_id", "status"])

    # ── assessment_companies ───────────────────────────────────────
    op.create_table(
        "assessment_companies",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("industry", sa.String(100)),
        sa.Column("entity_type", sa.String(50), nullable=False),  # private | public_university | state_agency | federal_agency | municipality | regulated_entity
        sa.Column("state", sa.String(50)),
        sa.Column("size", sa.String(50)),  # small | medium | large | enterprise
        sa.Column("sector_constraints", JSONB, server_default="{}"),
        sa.Column("notes", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_assessment_companies_assessment", "assessment_companies", ["assessment_id"])

    # ── assessment_teams ───────────────────────────────────────────
    op.create_table(
        "assessment_teams",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("team_function", sa.String(50)),  # development | qa | devops | data | mixed
        sa.Column("methodology", sa.String(50)),  # scrum | kanban | safe | waterfall | other
        sa.Column("size", sa.Integer),
        sa.Column("objectives", sa.Text),
        sa.Column("pain_points", sa.Text),
        sa.Column("ai_hopes", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_assessment_teams_assessment", "assessment_teams", ["assessment_id"])

    # ── assessment_members ─────────────────────────────────────────
    op.create_table(
        "assessment_members",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("team_id", UUID(as_uuid=True), sa.ForeignKey("assessment_teams.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), nullable=False),
        sa.Column("custom_role_label", sa.String(255)),  # used when role = "other"
        sa.Column("seniority", sa.String(50)),  # junior | mid | senior | lead | principal
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_assessment_members_team", "assessment_members", ["team_id"])

    # ── assessment_policies ────────────────────────────────────────
    op.create_table(
        "assessment_policies",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("has_policy", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("policy_document_url", sa.String(500)),
        sa.Column("coverage", JSONB, server_default="{}"),  # { data_privacy: bool, ip_ownership: bool, approved_tools: bool, prohibited_uses: bool, data_handling: bool }
        sa.Column("notes", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_assessment_policies_assessment", "assessment_policies", ["assessment_id"])

    # ── question_bank ──────────────────────────────────────────────
    op.create_table(
        "question_bank",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=True),  # null = global default
        sa.Column("category", sa.String(50), nullable=False),  # dora_capability | ai_policy | role_specific | workflow
        sa.Column("capability", sa.String(100)),  # e.g., ai_accessible_data, ai_stance_clarity, etc.
        sa.Column("question_text", sa.Text, nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("entity_types", JSONB, server_default="[]"),  # which entity types this applies to, empty = all
        sa.Column("roles", JSONB, server_default="[]"),  # which roles this applies to, empty = all (universal)
        sa.Column("is_default", sa.Boolean, server_default="true"),
        sa.Column("sort_order", sa.Integer, server_default="0"),
        sa.Column("version", sa.Integer, nullable=False, server_default="1"),
        sa.Column("status", sa.String(20), nullable=False, server_default="active"),  # draft | active | deprecated
        sa.Column("parent_question_id", UUID(as_uuid=True), sa.ForeignKey("question_bank.id"), nullable=True),
        sa.Column("created_by", sa.String(255)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_question_bank_site", "question_bank", ["site_id"])
    op.create_index("idx_question_bank_category", "question_bank", ["category"])
    op.create_index("idx_question_bank_status", "question_bank", ["status"])
    op.create_index("idx_question_bank_parent", "question_bank", ["parent_question_id"])

    # ── question_development_requests ──────────────────────────────
    op.create_table(
        "question_development_requests",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("custom_role_label", sa.String(255), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),  # pending | in_progress | completed
        sa.Column("requested_from_assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id"), nullable=True),
        sa.Column("resolved_by", sa.String(255)),
        sa.Column("resolved_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_question_dev_requests_site", "question_development_requests", ["site_id"])
    op.create_index("idx_question_dev_requests_status", "question_development_requests", ["site_id", "status"])

    # ── assessment_questionnaires ──────────────────────────────────
    op.create_table(
        "assessment_questionnaires",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("assessment_id", UUID(as_uuid=True), sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="draft"),  # draft | ready | sent | closed
        sa.Column("generated_at", sa.DateTime(timezone=True)),
        sa.Column("customized", sa.Boolean, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_assessment_questionnaires_assessment", "assessment_questionnaires", ["assessment_id"])

    # ── questionnaire_questions ────────────────────────────────────
    op.create_table(
        "questionnaire_questions",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("questionnaire_id", UUID(as_uuid=True), sa.ForeignKey("assessment_questionnaires.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_id", UUID(as_uuid=True), sa.ForeignKey("question_bank.id"), nullable=False),
        sa.Column("question_version", sa.Integer, nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("is_required", sa.Boolean, server_default="true"),
        sa.Column("target_roles", JSONB, server_default="[]"),  # which roles see this question in this questionnaire
    )
    op.create_index("idx_questionnaire_questions_qid", "questionnaire_questions", ["questionnaire_id"])

    # ── questionnaire_responses ────────────────────────────────────
    op.create_table(
        "questionnaire_responses",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("questionnaire_id", UUID(as_uuid=True), sa.ForeignKey("assessment_questionnaires.id", ondelete="CASCADE"), nullable=False),
        sa.Column("member_id", UUID(as_uuid=True), sa.ForeignKey("assessment_members.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False, unique=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="not_started"),  # not_started | in_progress | completed
        sa.Column("started_at", sa.DateTime(timezone=True)),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
    )
    op.create_index("idx_questionnaire_responses_questionnaire", "questionnaire_responses", ["questionnaire_id"])
    op.create_index("idx_questionnaire_responses_token", "questionnaire_responses", ["token"], unique=True)

    # ── response_answers ───────────────────────────────────────────
    op.create_table(
        "response_answers",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("response_id", UUID(as_uuid=True), sa.ForeignKey("questionnaire_responses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_id", UUID(as_uuid=True), sa.ForeignKey("question_bank.id"), nullable=False),
        sa.Column("score", sa.Integer),  # 1-5 Likert scale
        sa.Column("comment", sa.Text),
        sa.Column("flag", sa.String(20)),  # null | unclear | not_applicable
        sa.Column("answered_at", sa.DateTime(timezone=True)),
    )
    op.create_index("idx_response_answers_response", "response_answers", ["response_id"])

    # ── question_feedback_stats ────────────────────────────────────
    op.create_table(
        "question_feedback_stats",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("question_id", UUID(as_uuid=True), sa.ForeignKey("question_bank.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("times_asked", sa.Integer, server_default="0"),
        sa.Column("avg_score", sa.Numeric(3, 2)),
        sa.Column("unclear_count", sa.Integer, server_default="0"),
        sa.Column("not_applicable_count", sa.Integer, server_default="0"),
        sa.Column("needs_review", sa.Boolean, server_default="false"),
        sa.Column("last_computed_at", sa.DateTime(timezone=True)),
    )
    op.create_index("idx_question_feedback_question", "question_feedback_stats", ["question_id"], unique=True)


def downgrade() -> None:
    op.drop_table("question_feedback_stats")
    op.drop_table("response_answers")
    op.drop_table("questionnaire_responses")
    op.drop_table("questionnaire_questions")
    op.drop_table("assessment_questionnaires")
    op.drop_table("question_development_requests")
    op.drop_table("question_bank")
    op.drop_table("assessment_policies")
    op.drop_table("assessment_members")
    op.drop_table("assessment_teams")
    op.drop_table("assessment_companies")
    op.drop_table("readiness_assessments")
