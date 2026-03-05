"""Create application_positions junction table for many-to-many

Revision ID: 0005
Revises: 0004
Create Date: 2026-03-05

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "application_positions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("application_id", UUID(as_uuid=True), sa.ForeignKey("applications.id"), nullable=False),
        sa.Column("position_id", UUID(as_uuid=True), sa.ForeignKey("positions.id"), nullable=False),
        sa.Column("applied_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("application_id", "position_id", name="uq_application_position"),
    )

    # Backfill from existing applications that have a position_id
    op.execute("""
        INSERT INTO application_positions (application_id, position_id, applied_at)
        SELECT a.id, a.position_id, a.created_at
        FROM applications a
        WHERE a.position_id IS NOT NULL
        ON CONFLICT DO NOTHING
    """)


def downgrade() -> None:
    op.drop_table("application_positions")
