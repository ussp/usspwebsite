"""add is_hot, bill_rate, duration_hours to positions

Revision ID: 0012
Revises: 0011
Create Date: 2026-03-31
"""

from alembic import op
import sqlalchemy as sa

revision = "0012"
down_revision = "0011"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "positions",
        sa.Column("is_hot", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.add_column(
        "positions",
        sa.Column("bill_rate", sa.String(100), nullable=True),
    )
    op.add_column(
        "positions",
        sa.Column("duration_hours", sa.String(100), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("positions", "duration_hours")
    op.drop_column("positions", "bill_rate")
    op.drop_column("positions", "is_hot")
