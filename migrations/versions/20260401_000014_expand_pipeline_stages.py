"""expand application pipeline stages from 7 to 12

Revision ID: 0014
Revises: 0013
Create Date: 2026-04-01
"""

from alembic import op

revision = "0014"
down_revision = "0013"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Remap old statuses to new granular pipeline stages
    # Column is String(50) with no CHECK constraint, so only data migration needed
    op.execute(
        "UPDATE applications SET status = 'phone_screen' WHERE status = 'screening'"
    )
    op.execute(
        "UPDATE applications SET status = 'interview_zoom' WHERE status = 'interview'"
    )
    op.execute(
        "UPDATE applications SET status = 'offer_pending' WHERE status = 'offer'"
    )


def downgrade() -> None:
    # Reverse: collapse new statuses back to old ones
    op.execute(
        "UPDATE applications SET status = 'screening' WHERE status = 'phone_screen'"
    )
    op.execute(
        "UPDATE applications SET status = 'interview' WHERE status IN ('interview_zoom', 'interview_in_person')"
    )
    op.execute(
        "UPDATE applications SET status = 'offer' WHERE status = 'offer_pending'"
    )
    # Collapse stages that have no old equivalent back to screening
    op.execute(
        "UPDATE applications SET status = 'screening' WHERE status IN ('employment_verification', 'references', 'clearances', 'onboarding')"
    )
