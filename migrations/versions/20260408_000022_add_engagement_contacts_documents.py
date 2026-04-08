"""Add engagement contacts and documents tables

Revision ID: 0022
Revises: 0021
Create Date: 2026-04-08
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "0022"
down_revision = "0021"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Engagement contacts — org directory for transformation stakeholders
    op.create_table(
        "ai_engagement_contacts",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("engagement_id", UUID(as_uuid=True), sa.ForeignKey("ai_engagements.id"), nullable=False),
        sa.Column("display_name", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255)),
        sa.Column("email", sa.String(255)),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("organization", sa.String(255)),
        sa.Column("category", sa.String(30), nullable=False, server_default="working_team"),  # executive | state | leadership | working_team
        sa.Column("notes", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_ai_engagement_contacts_site_eng", "ai_engagement_contacts", ["site_id", "engagement_id"])

    # Engagement documents — file metadata for uploaded reference docs
    op.create_table(
        "ai_engagement_documents",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("engagement_id", UUID(as_uuid=True), sa.ForeignKey("ai_engagements.id"), nullable=False),
        sa.Column("file_name", sa.String(500), nullable=False),
        sa.Column("file_type", sa.String(100)),
        sa.Column("file_size", sa.Integer),
        sa.Column("storage_path", sa.String(1000), nullable=False),
        sa.Column("category", sa.String(50), server_default="general"),  # general | policy | framework | meeting_notes | playbook | reference
        sa.Column("description", sa.Text),
        sa.Column("uploaded_by", sa.String(255)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("idx_ai_engagement_documents_site_eng", "ai_engagement_documents", ["site_id", "engagement_id"])


def downgrade() -> None:
    op.drop_table("ai_engagement_documents")
    op.drop_table("ai_engagement_contacts")
