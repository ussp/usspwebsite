"""Add multi-tenancy: sites table, site_id columns, contact_submissions, analytics_events

Revision ID: 0006
Revises: 0005
Create Date: 2026-03-06

Adds the sites registry table and site_id foreign key to positions and
applications for multi-tenant data isolation. Also creates shared
contact_submissions and analytics_events tables.

Backward compatible: DEFAULT 'ussp' on site_id means all existing rows
auto-assign to USSP. No application code changes required for USSP to
keep working.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID

# revision identifiers, used by Alembic.
revision = "0006"
down_revision = "0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # -------------------------------------------------------------------------
    # 1. Create sites table
    # -------------------------------------------------------------------------
    op.create_table(
        "sites",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("domain", sa.String(255), unique=True, nullable=False),
        sa.Column("config", JSONB, server_default="{}"),
        sa.Column("active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # Seed USSP as first site
    op.execute("""
        INSERT INTO sites (id, name, domain, config)
        VALUES ('ussp', 'US Software Professionals Inc.', 'www.ussp.co', '{
            "phone": "+1-(312) 546-4306",
            "fax": "+1-(312) 253-2026",
            "email": "accounts@ussoftwarepro.com",
            "address": "875 N Michigan Ave, Suite 3100, Chicago, IL 60614",
            "storageBucket": "resumes"
        }'::jsonb)
    """)

    # -------------------------------------------------------------------------
    # 2. Add site_id to positions
    # -------------------------------------------------------------------------
    op.add_column("positions", sa.Column("site_id", sa.String(50), server_default="ussp", nullable=False))

    # Backfill existing rows
    op.execute("UPDATE positions SET site_id = 'ussp' WHERE site_id IS NULL OR site_id = ''")

    # Add FK constraint
    op.create_foreign_key("fk_positions_site_id", "positions", "sites", ["site_id"], ["id"])

    # Drop old unique constraint on slug alone, replace with (site_id, slug)
    op.drop_constraint("positions_slug_key", "positions", type_="unique")
    op.create_unique_constraint("uq_positions_site_slug", "positions", ["site_id", "slug"])

    # Index for filtered queries
    op.create_index("idx_positions_site_active", "positions", ["site_id", "active"])

    # -------------------------------------------------------------------------
    # 3. Add site_id to applications
    # -------------------------------------------------------------------------
    op.add_column("applications", sa.Column("site_id", sa.String(50), server_default="ussp", nullable=False))

    # Backfill existing rows
    op.execute("UPDATE applications SET site_id = 'ussp' WHERE site_id IS NULL OR site_id = ''")

    # Add FK constraint
    op.create_foreign_key("fk_applications_site_id", "applications", "sites", ["site_id"], ["id"])

    # Index
    op.create_index("idx_applications_site_id", "applications", ["site_id"])

    # -------------------------------------------------------------------------
    # 4. Create contact_submissions table
    # -------------------------------------------------------------------------
    op.create_table(
        "contact_submissions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(30)),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_contact_submissions_site_id", "contact_submissions", ["site_id"])

    # -------------------------------------------------------------------------
    # 5. Create analytics_events table
    # -------------------------------------------------------------------------
    op.create_table(
        "analytics_events",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("event_type", sa.String(100), nullable=False),
        sa.Column("page_path", sa.String(500)),
        sa.Column("referrer", sa.String(500)),
        sa.Column("metadata", JSONB, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_analytics_events_site_created", "analytics_events", ["site_id", "created_at"])

    # -------------------------------------------------------------------------
    # 6. Enable RLS on tenant tables (safety net)
    # -------------------------------------------------------------------------
    for table in ["positions", "applications", "contact_submissions", "analytics_events"]:
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")

        # Policy: service role bypasses RLS. For anon/authenticated, filter by site_id.
        op.execute(f"""
            CREATE POLICY {table}_site_isolation ON {table}
            FOR ALL
            USING (site_id = current_setting('app.current_site_id', true))
        """)


def downgrade() -> None:
    # Drop RLS policies
    for table in ["analytics_events", "contact_submissions", "applications", "positions"]:
        op.execute(f"DROP POLICY IF EXISTS {table}_site_isolation ON {table}")
        op.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY")

    # Drop analytics_events
    op.drop_index("idx_analytics_events_site_created")
    op.drop_table("analytics_events")

    # Drop contact_submissions
    op.drop_index("idx_contact_submissions_site_id")
    op.drop_table("contact_submissions")

    # Revert applications
    op.drop_index("idx_applications_site_id")
    op.drop_constraint("fk_applications_site_id", "applications", type_="foreignkey")
    op.drop_column("applications", "site_id")

    # Revert positions
    op.drop_index("idx_positions_site_active")
    op.drop_constraint("uq_positions_site_slug", "positions", type_="unique")
    op.create_unique_constraint("positions_slug_key", "positions", ["slug"])
    op.drop_constraint("fk_positions_site_id", "positions", type_="foreignkey")
    op.drop_column("positions", "site_id")

    # Drop sites table
    op.drop_table("sites")
