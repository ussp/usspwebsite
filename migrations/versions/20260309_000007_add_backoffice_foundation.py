"""Add back-office foundation: staff_users, application_notes, audit_log tables + extend positions/applications

Revision ID: 0007
Revises: 0006
Create Date: 2026-03-09

Adds staff_users table for back-office authentication (Google OAuth),
application_notes for recruiter notes on applications, audit_log for
tracking staff actions. Extends positions with salary_range, department,
created_by, updated_at. Extends applications with status, status_updated_at,
assigned_to.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID

# revision identifiers, used by Alembic.
revision = "0007"
down_revision = "0006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # -------------------------------------------------------------------------
    # 1. Create staff_users table (must be created before FKs reference it)
    # -------------------------------------------------------------------------
    op.create_table(
        "staff_users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), nullable=False, server_default="recruiter"),
        sa.Column("avatar_url", sa.Text),
        sa.Column("google_sub", sa.String(255)),
        sa.Column("active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("last_login_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_unique_constraint("uq_staff_users_site_email", "staff_users", ["site_id", "email"])
    op.create_index("idx_staff_users_site_active", "staff_users", ["site_id", "active"])

    # -------------------------------------------------------------------------
    # 2. Extend positions table
    # -------------------------------------------------------------------------
    op.add_column("positions", sa.Column("salary_range", sa.String(100)))
    op.add_column("positions", sa.Column("department", sa.String(100)))
    op.add_column("positions", sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")))
    op.add_column("positions", sa.Column("created_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id")))

    # -------------------------------------------------------------------------
    # 3. Extend applications table
    # -------------------------------------------------------------------------
    op.add_column("applications", sa.Column("status", sa.String(50), server_default="new"))
    op.add_column("applications", sa.Column("status_updated_at", sa.DateTime(timezone=True)))
    op.add_column("applications", sa.Column("assigned_to", UUID(as_uuid=True), sa.ForeignKey("staff_users.id")))

    # -------------------------------------------------------------------------
    # 4. Create application_notes table
    # -------------------------------------------------------------------------
    op.create_table(
        "application_notes",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("application_id", UUID(as_uuid=True), sa.ForeignKey("applications.id"), nullable=False),
        sa.Column("staff_user_id", UUID(as_uuid=True), sa.ForeignKey("staff_users.id"), nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_application_notes_site_app", "application_notes", ["site_id", "application_id"])

    # -------------------------------------------------------------------------
    # 5. Create audit_log table
    # -------------------------------------------------------------------------
    op.create_table(
        "audit_log",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("staff_user_id", UUID(as_uuid=True), sa.ForeignKey("staff_users.id"), nullable=False),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("entity_type", sa.String(50), nullable=False),
        sa.Column("entity_id", UUID(as_uuid=True)),
        sa.Column("details", JSONB, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_audit_log_site_created", "audit_log", ["site_id", "created_at"])
    op.create_index("idx_audit_log_site_entity", "audit_log", ["site_id", "entity_type", "entity_id"])

    # -------------------------------------------------------------------------
    # 6. Enable RLS on new tables
    # -------------------------------------------------------------------------
    for table in ["staff_users", "application_notes", "audit_log"]:
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
        op.execute(f"""
            CREATE POLICY {table}_site_isolation ON {table}
            FOR ALL
            USING (site_id = current_setting('app.current_site_id', true))
        """)


def downgrade() -> None:
    # Drop RLS policies
    for table in ["audit_log", "application_notes", "staff_users"]:
        op.execute(f"DROP POLICY IF EXISTS {table}_site_isolation ON {table}")
        op.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY")

    # Drop audit_log
    op.drop_index("idx_audit_log_site_entity")
    op.drop_index("idx_audit_log_site_created")
    op.drop_table("audit_log")

    # Drop application_notes
    op.drop_index("idx_application_notes_site_app")
    op.drop_table("application_notes")

    # Revert applications
    op.drop_column("applications", "assigned_to")
    op.drop_column("applications", "status_updated_at")
    op.drop_column("applications", "status")

    # Revert positions
    op.drop_column("positions", "created_by")
    op.drop_column("positions", "updated_at")
    op.drop_column("positions", "department")
    op.drop_column("positions", "salary_range")

    # Drop staff_users
    op.drop_index("idx_staff_users_site_active")
    op.drop_constraint("uq_staff_users_site_email", "staff_users", type_="unique")
    op.drop_table("staff_users")
