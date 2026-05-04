"""Add anonymous_aggregate flag to question_bank.

Flagged questions are surfaced in reports as aggregate-only (no per-member
or per-role attribution). Used for sentiment questions where identifiable
answers would suppress honest signal.

Revision ID: 0028
Revises: 0027
"""

from alembic import op
import sqlalchemy as sa

revision = "0028"
down_revision = "0027"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "question_bank",
        sa.Column(
            "anonymous_aggregate",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column("question_bank", "anonymous_aggregate")
