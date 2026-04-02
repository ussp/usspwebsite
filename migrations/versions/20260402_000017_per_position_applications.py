"""per-position applications: one application per (email, position)

Revision ID: 0017
Revises: 0016
Create Date: 2026-04-02

Adds unique constraint on (site_id, email, position_id) so each candidate
gets a separate application record per job with independent pipeline tracking.
Also adds indexes for efficient email and position lookups.
"""

from alembic import op

# revision identifiers
revision = "0017"
down_revision = "0016"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add indexes first (needed for the unique constraint and query performance)
    op.create_index(
        "idx_applications_site_email",
        "applications",
        ["site_id", "email"],
    )
    op.create_index(
        "idx_applications_site_position",
        "applications",
        ["site_id", "position_id"],
    )

    # Add unique constraint: one application per (site, email, position)
    # Postgres treats NULLs as distinct in unique constraints,
    # so rows with NULL position_id won't conflict.
    op.create_unique_constraint(
        "uq_applications_site_email_position",
        "applications",
        ["site_id", "email", "position_id"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_applications_site_email_position", "applications", type_="unique")
    op.drop_index("idx_applications_site_position", table_name="applications")
    op.drop_index("idx_applications_site_email", table_name="applications")
