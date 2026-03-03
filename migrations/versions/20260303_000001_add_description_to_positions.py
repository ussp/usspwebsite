"""Add description column to positions table

Revision ID: 0001
Revises: None
Create Date: 2026-03-03

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("positions", sa.Column("description", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("positions", "description")
