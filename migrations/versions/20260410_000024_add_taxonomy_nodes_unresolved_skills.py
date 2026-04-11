"""add taxonomy_nodes and unresolved_skills tables

Revision ID: 0024
Revises: 0023
Create Date: 2026-04-10
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision = "0024"
down_revision = "0023"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── taxonomy_nodes ──────────────────────────────────────────────
    op.create_table(
        "taxonomy_nodes",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("tree", sa.String(50), nullable=False),
        sa.Column("node_id", sa.String(100), nullable=False),
        sa.Column("path", sa.String(500), nullable=False),
        sa.Column("label", sa.String(255), nullable=False),
        sa.Column("parent_path", sa.String(500)),
        sa.Column("aliases", JSONB, server_default="[]"),
        sa.Column("related_paths", JSONB, server_default="[]"),
        sa.Column("description", sa.Text),
        sa.Column("source", sa.String(50), server_default="recruiter"),
        sa.Column("usage_count", sa.Integer, server_default="0"),
        sa.Column("promoted", sa.Boolean, server_default="false"),
        sa.Column("promoted_at", sa.DateTime(timezone=True)),
        sa.Column("created_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.UniqueConstraint("site_id", "tree", "path", name="uq_taxonomy_node_site_tree_path"),
    )
    op.create_index("idx_taxonomy_node_site", "taxonomy_nodes", ["site_id"])
    op.create_index("idx_taxonomy_node_tree", "taxonomy_nodes", ["site_id", "tree"])

    # ── unresolved_skills ───────────────────────────────────────────
    op.create_table(
        "unresolved_skills",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("raw_text", sa.String(500), nullable=False),
        sa.Column("source", sa.String(50), nullable=False),
        sa.Column("source_id", sa.String(255)),
        sa.Column("occurrence_count", sa.Integer, server_default="1"),
        sa.Column("resolved", sa.Boolean, server_default="false"),
        sa.Column("resolved_node_path", sa.String(500)),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.UniqueConstraint("site_id", "raw_text", name="uq_unresolved_skill_site_text"),
    )
    op.create_index("idx_unresolved_skill_site", "unresolved_skills", ["site_id"])
    op.create_index("idx_unresolved_skill_unresolved", "unresolved_skills", ["site_id", "resolved"])

    # Enable RLS
    op.execute("ALTER TABLE taxonomy_nodes ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE unresolved_skills ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    op.drop_table("unresolved_skills")
    op.drop_table("taxonomy_nodes")
