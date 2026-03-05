"""Add posted_at and closed_at date columns to positions table

Revision ID: 0003
Revises: 0002
Create Date: 2026-03-05

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("positions", sa.Column("posted_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("positions", sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True))

    # Backfill posted_at from created_at for existing rows
    op.execute("UPDATE positions SET posted_at = created_at WHERE posted_at IS NULL")


def downgrade() -> None:
    op.drop_column("positions", "closed_at")
    op.drop_column("positions", "posted_at")
