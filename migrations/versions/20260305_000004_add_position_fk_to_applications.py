"""Add position_id foreign key to applications table

Revision ID: 0004
Revises: 0003
Create Date: 2026-03-05

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add position_id column (nullable initially for backfill)
    op.add_column(
        "applications",
        sa.Column("position_id", UUID(as_uuid=True), nullable=True),
    )

    # Backfill from job_slug → positions.slug
    op.execute("""
        UPDATE applications a
        SET position_id = p.id
        FROM positions p
        WHERE a.job_slug = p.slug
          AND a.position_id IS NULL
    """)

    # Add foreign key constraint
    op.create_foreign_key(
        "applications_position_id_fkey",
        "applications",
        "positions",
        ["position_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("applications_position_id_fkey", "applications", type_="foreignkey")
    op.drop_column("applications", "position_id")
