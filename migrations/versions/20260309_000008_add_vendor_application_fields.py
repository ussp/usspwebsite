"""Add vendor application fields: applicant_type, expected_bill_rate, availability_date

Revision ID: 0008
Revises: 0007
Create Date: 2026-03-09

Adds applicant_type (employee/vendor toggle), expected_bill_rate, and
availability_date columns to the applications table so vendors can submit
candidates with additional context.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0008"
down_revision = "0007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "applications",
        sa.Column("applicant_type", sa.String(20), server_default="employee"),
    )
    op.add_column(
        "applications",
        sa.Column("expected_bill_rate", sa.String(50), nullable=True),
    )
    op.add_column(
        "applications",
        sa.Column("availability_date", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("applications", "availability_date")
    op.drop_column("applications", "expected_bill_rate")
    op.drop_column("applications", "applicant_type")
