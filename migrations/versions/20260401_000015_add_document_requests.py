"""add document_requests and candidate_references tables

Revision ID: 0015
Revises: 0014
Create Date: 2026-04-01
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "0015"
down_revision = "0014"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "document_requests",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("application_id", UUID(as_uuid=True), sa.ForeignKey("applications.id"), nullable=False),
        sa.Column("candidate_id", UUID(as_uuid=True), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("request_type", sa.String(30), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("min_references", sa.Integer(), nullable=True),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("submitted_path", sa.Text(), nullable=True),
        sa.Column("submitted_file_name", sa.String(255), nullable=True),
        sa.Column("submitted_text_encrypted", sa.Text(), nullable=True),
        sa.Column("submitted_dl_state", sa.String(2), nullable=True),
        sa.Column("reviewer_notes", sa.Text(), nullable=True),
        sa.Column("reviewed_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id"), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_document_requests_site_application", "document_requests", ["site_id", "application_id"])
    op.create_index("idx_document_requests_site_candidate_status", "document_requests", ["site_id", "candidate_id", "status"])

    op.create_table(
        "candidate_references",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("document_request_id", UUID(as_uuid=True), sa.ForeignKey("document_requests.id"), nullable=False),
        sa.Column("candidate_id", UUID(as_uuid=True), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("ref_name", sa.String(255), nullable=False),
        sa.Column("ref_title", sa.String(255), nullable=True),
        sa.Column("ref_company", sa.String(255), nullable=True),
        sa.Column("ref_phone", sa.String(30), nullable=True),
        sa.Column("ref_email", sa.String(255), nullable=True),
        sa.Column("relationship", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("idx_candidate_references_site_request", "candidate_references", ["site_id", "document_request_id"])


def downgrade() -> None:
    op.drop_index("idx_candidate_references_site_request")
    op.drop_table("candidate_references")
    op.drop_index("idx_document_requests_site_candidate_status")
    op.drop_index("idx_document_requests_site_application")
    op.drop_table("document_requests")
