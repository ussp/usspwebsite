"""add location and work_preference columns to candidates

Revision ID: 0020
Revises: 0019
Create Date: 2026-04-02

Adds location (e.g. "Chicago, IL") and work_preference (remote/hybrid/onsite/open_to_travel)
columns to candidates table. Used for location-based matching and work mode compatibility.
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = "0020"
down_revision = "0019"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("candidates", sa.Column("location", sa.String(255), nullable=True))
    op.add_column("candidates", sa.Column("work_preference", sa.String(20), nullable=True))


def downgrade() -> None:
    op.drop_column("candidates", "work_preference")
    op.drop_column("candidates", "location")
