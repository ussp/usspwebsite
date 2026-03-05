"""Enhance applications table with LinkedIn profile, phone, SMS consent, job alerts

Revision ID: 0002
Revises: 0001
Create Date: 2026-03-03

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # LinkedIn OIDC profile fields
    op.add_column("applications", sa.Column("linkedin_sub", sa.String(255), nullable=True))
    op.add_column("applications", sa.Column("given_name", sa.String(255), nullable=True))
    op.add_column("applications", sa.Column("family_name", sa.String(255), nullable=True))
    op.add_column("applications", sa.Column("profile_picture", sa.Text(), nullable=True))
    op.add_column("applications", sa.Column("locale", sa.String(20), nullable=True))
    op.add_column("applications", sa.Column("email_verified", sa.Boolean(), nullable=True))

    # Phone and TCPA SMS consent
    op.add_column("applications", sa.Column("phone", sa.String(30), nullable=True))
    op.add_column("applications", sa.Column("sms_consent", sa.Boolean(), server_default="false", nullable=False))
    op.add_column("applications", sa.Column("sms_consent_timestamp", sa.DateTime(timezone=True), nullable=True))

    # Job alerts opt-in
    op.add_column("applications", sa.Column("job_alerts_opt_in", sa.Boolean(), server_default="false", nullable=False))
    op.add_column("applications", sa.Column("job_alerts_timestamp", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("applications", "job_alerts_timestamp")
    op.drop_column("applications", "job_alerts_opt_in")
    op.drop_column("applications", "sms_consent_timestamp")
    op.drop_column("applications", "sms_consent")
    op.drop_column("applications", "phone")
    op.drop_column("applications", "email_verified")
    op.drop_column("applications", "locale")
    op.drop_column("applications", "profile_picture")
    op.drop_column("applications", "family_name")
    op.drop_column("applications", "given_name")
    op.drop_column("applications", "linkedin_sub")
