"""Add question types + external survey source support.

Extends the readiness questionnaire schema to handle:
- non-Likert question types (single_choice | multi_choice | numeric | free_text)
- de-identified / external responses without a pre-registered member
- import provenance (source system, external id, batch tracking)

Also adds a survey_imports batch table for tracking imports from xlsx/csv.

Revision ID: 0030
Revises: 0029
Create Date: 2026-05-19
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision = "0030"
down_revision = "0029"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── question_bank: question_type + options ─────────────────────────
    op.add_column(
        "question_bank",
        sa.Column(
            "question_type",
            sa.String(20),
            nullable=False,
            server_default=sa.text("'likert'"),
        ),  # likert | single_choice | multi_choice | numeric | free_text
    )
    op.add_column(
        "question_bank",
        sa.Column(
            "options",
            JSONB,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),  # [{value, label}] for single/multi-choice
    )

    # ── response_answers: support non-Likert answer values ─────────────
    op.add_column(
        "response_answers",
        sa.Column("text_value", sa.Text(), nullable=True),
    )
    op.add_column(
        "response_answers",
        sa.Column(
            "choice_values",
            JSONB,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
    )
    op.add_column(
        "response_answers",
        sa.Column("numeric_value", sa.Numeric(), nullable=True),
    )

    # ── questionnaire_responses: anonymous + external source tracking ──
    op.alter_column(
        "questionnaire_responses",
        "member_id",
        existing_type=UUID(as_uuid=True),
        nullable=True,
    )
    op.add_column(
        "questionnaire_responses",
        sa.Column("respondent_role", sa.String(50), nullable=True),
    )
    op.add_column(
        "questionnaire_responses",
        sa.Column("respondent_email", sa.String(255), nullable=True),
    )
    op.add_column(
        "questionnaire_responses",
        sa.Column(
            "source",
            sa.String(30),
            nullable=False,
            server_default=sa.text("'native'"),
        ),  # native | surveymonkey | csv_import | manual
    )
    op.add_column(
        "questionnaire_responses",
        sa.Column("external_id", sa.String(100), nullable=True),
    )
    op.add_column(
        "questionnaire_responses",
        sa.Column("import_batch_id", UUID(as_uuid=True), nullable=True),
    )

    # Partial unique index on (questionnaire_id, external_id) where
    # external_id IS NOT NULL — prevents re-importing the same external
    # respondent into the same questionnaire.
    op.create_index(
        "uq_responses_questionnaire_external",
        "questionnaire_responses",
        ["questionnaire_id", "external_id"],
        unique=True,
        postgresql_where=sa.text("external_id IS NOT NULL"),
    )
    op.create_index(
        "idx_responses_import_batch",
        "questionnaire_responses",
        ["import_batch_id"],
    )

    # ── survey_imports — batch tracking for external survey imports ────
    op.create_table(
        "survey_imports",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "site_id",
            sa.String(50),
            sa.ForeignKey("sites.id"),
            nullable=False,
        ),
        sa.Column(
            "assessment_id",
            UUID(as_uuid=True),
            sa.ForeignKey("readiness_assessments.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("source", sa.String(30), nullable=False),  # surveymonkey | csv_import | manual
        sa.Column("file_name", sa.String(500), nullable=True),
        sa.Column("total_rows", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("loaded_rows", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("skipped_rows", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("error_rows", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "status",
            sa.String(20),
            nullable=False,
            server_default=sa.text("'pending'"),
        ),  # pending | processing | completed | failed
        sa.Column(
            "error_log",
            JSONB,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column("created_by", sa.String(255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("idx_survey_imports_site", "survey_imports", ["site_id"])
    op.create_index(
        "idx_survey_imports_assessment", "survey_imports", ["assessment_id"]
    )
    op.create_index("idx_survey_imports_status", "survey_imports", ["status"])

    # Now that survey_imports exists, add the FK from questionnaire_responses
    op.create_foreign_key(
        "fk_responses_import_batch",
        "questionnaire_responses",
        "survey_imports",
        ["import_batch_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_responses_import_batch", "questionnaire_responses", type_="foreignkey"
    )
    op.drop_index("idx_survey_imports_status", table_name="survey_imports")
    op.drop_index("idx_survey_imports_assessment", table_name="survey_imports")
    op.drop_index("idx_survey_imports_site", table_name="survey_imports")
    op.drop_table("survey_imports")

    op.drop_index(
        "idx_responses_import_batch", table_name="questionnaire_responses"
    )
    op.drop_index(
        "uq_responses_questionnaire_external",
        table_name="questionnaire_responses",
    )

    op.drop_column("questionnaire_responses", "import_batch_id")
    op.drop_column("questionnaire_responses", "external_id")
    op.drop_column("questionnaire_responses", "source")
    op.drop_column("questionnaire_responses", "respondent_email")
    op.drop_column("questionnaire_responses", "respondent_role")
    op.alter_column(
        "questionnaire_responses",
        "member_id",
        existing_type=UUID(as_uuid=True),
        nullable=False,
    )

    op.drop_column("response_answers", "numeric_value")
    op.drop_column("response_answers", "choice_values")
    op.drop_column("response_answers", "text_value")

    op.drop_column("question_bank", "options")
    op.drop_column("question_bank", "question_type")
