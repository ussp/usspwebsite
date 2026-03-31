"""add candidate_pii table for encrypted PII document storage

Revision ID: 0013
Revises: 0012
Create Date: 2026-03-31
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "0013"
down_revision = "0012"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "candidate_pii",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("candidate_id", UUID(as_uuid=True), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("ssn_encrypted", sa.Text(), nullable=True),
        sa.Column("dl_number_encrypted", sa.Text(), nullable=True),
        sa.Column("dl_state", sa.String(2), nullable=True),
        sa.Column("dob_encrypted", sa.Text(), nullable=True),
        sa.Column("visa_type", sa.String(20), nullable=True),
        sa.Column("visa_doc_path", sa.Text(), nullable=True),
        sa.Column("visa_doc_name", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("site_id", "candidate_id", name="uq_candidate_pii_site_candidate"),
    )
    op.create_index("idx_candidate_pii_site_candidate", "candidate_pii", ["site_id", "candidate_id"])


def downgrade() -> None:
    op.drop_index("idx_candidate_pii_site_candidate")
    op.drop_table("candidate_pii")
