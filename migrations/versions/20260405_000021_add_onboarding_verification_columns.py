"""add identity_verification and address_verification to candidate_onboardings

Revision ID: 0021
Revises: 0020
Create Date: 2026-04-05

Adds two new onboarding step columns for identity verification (government ID)
and address verification (utility bill / proof of address).
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = "0021"
down_revision = "0020"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "candidate_onboardings",
        sa.Column("identity_verification", sa.String(20), server_default="not_started", nullable=False),
    )
    op.add_column(
        "candidate_onboardings",
        sa.Column("address_verification", sa.String(20), server_default="not_started", nullable=False),
    )


def downgrade() -> None:
    op.drop_column("candidate_onboardings", "address_verification")
    op.drop_column("candidate_onboardings", "identity_verification")
