"""Add clients, end_clients, client_contacts tables and work_mode to positions

Revision ID: 0010
Revises: 0009
Create Date: 2026-03-13

Adds client and end client tracking for positions:
- clients: companies that submit positions to USSP (e.g., Krasan Consulting)
- client_contacts: contacts at client companies (e.g., Dinkar, Kristen)
- end_clients: organizations where placed resources work (e.g., IDJJ)
- positions.work_mode: On-site, Remote, or Hybrid
- positions.client_id: FK to clients
- positions.end_client_id: FK to end_clients
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers
revision = "0010"
down_revision = "0009"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create clients table
    op.create_table(
        "clients",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_unique_constraint("uq_clients_site_name", "clients", ["site_id", "name"])
    op.create_index("idx_clients_site_active", "clients", ["site_id", "active"])

    # Create client_contacts table
    op.create_table(
        "client_contacts",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("client_id", UUID(as_uuid=True), sa.ForeignKey("clients.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255)),
        sa.Column("phone", sa.String(30)),
        sa.Column("title", sa.String(255)),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_client_contacts_site_client", "client_contacts", ["site_id", "client_id"])

    # Create end_clients table
    op.create_table(
        "end_clients",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_unique_constraint("uq_end_clients_site_name", "end_clients", ["site_id", "name"])
    op.create_index("idx_end_clients_site_active", "end_clients", ["site_id", "active"])

    # Add new columns to positions
    op.add_column("positions", sa.Column("work_mode", sa.String(50)))
    op.add_column("positions", sa.Column("client_id", UUID(as_uuid=True), sa.ForeignKey("clients.id")))
    op.add_column("positions", sa.Column("end_client_id", UUID(as_uuid=True), sa.ForeignKey("end_clients.id")))


def downgrade() -> None:
    op.drop_column("positions", "end_client_id")
    op.drop_column("positions", "client_id")
    op.drop_column("positions", "work_mode")

    op.drop_index("idx_end_clients_site_active", table_name="end_clients")
    op.drop_constraint("uq_end_clients_site_name", "end_clients")
    op.drop_table("end_clients")

    op.drop_index("idx_client_contacts_site_client", table_name="client_contacts")
    op.drop_table("client_contacts")

    op.drop_index("idx_clients_site_active", table_name="clients")
    op.drop_constraint("uq_clients_site_name", "clients")
    op.drop_table("clients")
