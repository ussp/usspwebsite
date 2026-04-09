"""add tenants and tool entitlements tables

Revision ID: 0023
Revises: 0022
Create Date: 2026-04-09
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "0023"
down_revision = "0022"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Tenants registry
    op.create_table(
        "tenants",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), unique=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("short_name", sa.String(50), nullable=False),
        sa.Column("domain", sa.String(255)),
        sa.Column("auth_provider", sa.String(50), nullable=False, server_default="google"),
        sa.Column("logo_url", sa.String(500)),
        sa.Column("favicon_url", sa.String(500)),
        sa.Column("primary_color", sa.String(7), server_default="#2563EB"),
        sa.Column("tagline", sa.String(255)),
        sa.Column("auto_provision", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("default_role", sa.String(50), nullable=False, server_default="viewer"),
        sa.Column("allowed_domain", sa.String(255)),
        sa.Column("is_owner", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Tool entitlements
    op.create_table(
        "tenant_tool_entitlements",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("tenants.site_id"), nullable=False),
        sa.Column("tool_key", sa.String(100), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("enabled_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id")),
        sa.Column("enabled_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("site_id", "tool_key", name="uq_tenant_tool_site_key"),
        sa.Index("idx_tenant_tool_site", "site_id"),
    )

    # Seed USSP as owner tenant
    op.execute("""
        INSERT INTO tenants (site_id, name, short_name, domain, auth_provider, is_owner)
        VALUES ('ussp', 'US Software Professionals', 'USSP', 'tools.ussp.co', 'google', true)
    """)


def downgrade() -> None:
    op.drop_table("tenant_tool_entitlements")
    op.drop_table("tenants")
