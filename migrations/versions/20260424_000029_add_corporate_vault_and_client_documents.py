"""Add corporate_documents and client_documents tables + storage buckets

Revision ID: 0029
Revises: 0028
Create Date: 2026-04-24

Introduces two new capabilities:
- corporate_documents: USSP entity-level docs (W-9, BEP, COI, etc.) with
  version history via is_current + superseded_by_id.
- client_documents: per-client signed paperwork (MVA, NDA, Work Orders),
  optional FK to employee_assignments for Work Orders.

Also seeds two private Supabase storage buckets.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "0029"
down_revision = "0028"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ---------------------------------------------------------------------
    # corporate_documents — USSP's own entity-level docs (admin-only vault)
    # ---------------------------------------------------------------------
    op.create_table(
        "corporate_documents",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("doc_type", sa.String(50), nullable=False),  # w9 | articles_incorporation | bep_cert | cert_good_standing | cert_insurance | ach_voided_check | other
        sa.Column("display_name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("file_name", sa.String(500), nullable=False),
        sa.Column("file_type", sa.String(100), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("storage_path", sa.String(1000), nullable=False),
        sa.Column("issued_date", sa.Date()),
        sa.Column("expiry_date", sa.Date()),
        sa.Column("is_current", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("superseded_by_id", UUID(as_uuid=True), sa.ForeignKey("corporate_documents.id"), nullable=True),
        sa.Column("uploaded_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id"), nullable=False),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index(
        "idx_corporate_documents_site_type_current",
        "corporate_documents",
        ["site_id", "doc_type", "is_current"],
    )
    op.create_index(
        "idx_corporate_documents_site_expiry",
        "corporate_documents",
        ["site_id", "expiry_date"],
    )

    # ---------------------------------------------------------------------
    # client_documents — per-client signed paperwork (admin + recruiter)
    # ---------------------------------------------------------------------
    op.create_table(
        "client_documents",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("client_id", UUID(as_uuid=True), sa.ForeignKey("clients.id"), nullable=False),
        sa.Column("assignment_id", UUID(as_uuid=True), sa.ForeignKey("employee_assignments.id"), nullable=True),
        sa.Column("doc_type", sa.String(50), nullable=False),  # mva | nda | ssa | requisition | work_order | other
        sa.Column("display_name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("file_name", sa.String(500), nullable=False),
        sa.Column("file_type", sa.String(100), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("storage_path", sa.String(1000), nullable=False),
        sa.Column("effective_date", sa.Date()),
        sa.Column("expiry_date", sa.Date()),
        sa.Column("uploaded_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id"), nullable=False),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index(
        "idx_client_documents_site_client",
        "client_documents",
        ["site_id", "client_id"],
    )
    op.create_index(
        "idx_client_documents_site_assignment",
        "client_documents",
        ["site_id", "assignment_id"],
    )
    op.create_index(
        "idx_client_documents_site_type",
        "client_documents",
        ["site_id", "doc_type"],
    )

    # ---------------------------------------------------------------------
    # Seed Supabase storage buckets (private, idempotent)
    # ---------------------------------------------------------------------
    op.execute(
        """
        INSERT INTO storage.buckets (id, name, public)
        VALUES
            ('corporate-vault', 'corporate-vault', false),
            ('client-documents', 'client-documents', false)
        ON CONFLICT (id) DO NOTHING
        """
    )


def downgrade() -> None:
    # Drop tables; leave buckets in place (manual cleanup to avoid data loss)
    op.drop_index("idx_client_documents_site_type", table_name="client_documents")
    op.drop_index("idx_client_documents_site_assignment", table_name="client_documents")
    op.drop_index("idx_client_documents_site_client", table_name="client_documents")
    op.drop_table("client_documents")

    op.drop_index("idx_corporate_documents_site_expiry", table_name="corporate_documents")
    op.drop_index("idx_corporate_documents_site_type_current", table_name="corporate_documents")
    op.drop_table("corporate_documents")
