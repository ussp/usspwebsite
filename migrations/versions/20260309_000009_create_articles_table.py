"""Create articles table for Insights section (blog posts and case studies)

Revision ID: 0009
Revises: 0008
Create Date: 2026-03-09

Adds the articles table to support the Insights content hub.
Each article has a content_type (blog_post or case_study), markdown body,
SEO metadata fields, and an optional case_study_data JSONB column for
structured case study fields (client_name, industry, challenge, solution, result).
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB


# revision identifiers, used by Alembic.
revision = "0009"
down_revision = "0008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "articles",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False),
        sa.Column("slug", sa.String(255), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("excerpt", sa.Text),
        sa.Column("body", sa.Text, nullable=False),
        sa.Column("content_type", sa.String(20), nullable=False),
        sa.Column("author", sa.String(255)),
        sa.Column("featured_image_url", sa.Text),
        sa.Column("tags", JSONB, server_default="[]"),
        sa.Column("case_study_data", JSONB),
        sa.Column("status", sa.String(20), nullable=False, server_default="draft"),
        sa.Column("published_at", sa.DateTime(timezone=True)),
        sa.Column("meta_title", sa.String(255)),
        sa.Column("meta_description", sa.Text),
        sa.Column("meta_keywords", sa.String(500)),
        sa.Column("created_by", UUID(as_uuid=True), sa.ForeignKey("staff_users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("site_id", "slug", name="uq_articles_site_slug"),
    )

    op.create_index("idx_articles_site_status", "articles", ["site_id", "status"])
    op.create_index("idx_articles_site_type_published", "articles", ["site_id", "content_type", "published_at"])

    # Enable RLS
    op.execute("ALTER TABLE articles ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY site_isolation ON articles
        USING (site_id = current_setting('app.site_id', true))
    """)


def downgrade() -> None:
    op.execute("DROP POLICY IF EXISTS site_isolation ON articles")
    op.drop_index("idx_articles_site_type_published", "articles")
    op.drop_index("idx_articles_site_status", "articles")
    op.drop_table("articles")
