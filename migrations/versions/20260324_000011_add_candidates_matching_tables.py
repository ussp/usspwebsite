"""Add candidates, resumes, skills, requirements, match scores, assignments, scan jobs tables

Revision ID: 0011
Revises: 0010
Create Date: 2026-03-24

Adds the job matching system tables:
- candidates: unique person entity across applications
- resumes: versioned resume storage per candidate
- candidate_skills: normalized skills for matching
- position_requirements: structured requirements from job description
- match_scores: persisted match results
- employee_assignments: internal employee deployment tracking
- match_scan_jobs: background scan tracking
- applications.candidate_id: FK linking applications to candidates
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = "0011"
down_revision = "0010"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create candidates table
    op.create_table(
        "candidates",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(30)),
        sa.Column("linkedin_sub", sa.String(255)),
        sa.Column("profile_picture", sa.Text()),
        sa.Column("candidate_type", sa.String(20), nullable=False, server_default="external"),
        sa.Column("current_status", sa.String(30), nullable=False, server_default="available"),
        sa.Column("source", sa.String(50), server_default="application"),
        sa.Column("tags", postgresql.JSONB, server_default="[]"),
        sa.Column("summary", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_unique_constraint("uq_candidates_site_email", "candidates", ["site_id", "email"])
    op.create_index("idx_candidates_site_type", "candidates", ["site_id", "candidate_type"])
    op.create_index("idx_candidates_site_status", "candidates", ["site_id", "current_status"])

    # Create resumes table
    op.create_table(
        "resumes",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("storage_path", sa.Text(), nullable=False),
        sa.Column("file_name", sa.String(255), nullable=False),
        sa.Column("file_type", sa.String(50)),
        sa.Column("position_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("positions.id")),
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("extracted_text", sa.Text()),
        sa.Column("extracted_skills", postgresql.JSONB, server_default="[]"),
        sa.Column("extracted_experience_years", sa.Integer()),
        sa.Column("extracted_education", postgresql.JSONB, server_default="[]"),
        sa.Column("extraction_status", sa.String(20), server_default="pending"),
        sa.Column("extraction_error", sa.Text()),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_resumes_site_candidate", "resumes", ["site_id", "candidate_id"])
    op.create_index("idx_resumes_site_extraction_status", "resumes", ["site_id", "extraction_status"])

    # Create candidate_skills table
    op.create_table(
        "candidate_skills",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("skill_name", sa.String(255), nullable=False),
        sa.Column("proficiency_level", sa.String(20)),
        sa.Column("years_experience", sa.Integer()),
        sa.Column("source", sa.String(20), server_default="extracted"),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_unique_constraint("uq_candidate_skills_site_candidate_skill", "candidate_skills", ["site_id", "candidate_id", "skill_name"])
    op.create_index("idx_candidate_skills_site_skill", "candidate_skills", ["site_id", "skill_name"])

    # Create position_requirements table
    op.create_table(
        "position_requirements",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("position_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("positions.id"), nullable=False),
        sa.Column("required_skills", postgresql.JSONB, server_default="[]"),
        sa.Column("preferred_skills", postgresql.JSONB, server_default="[]"),
        sa.Column("min_experience_years", sa.Integer()),
        sa.Column("max_experience_years", sa.Integer()),
        sa.Column("education_level", sa.String(50)),
        sa.Column("required_certifications", postgresql.JSONB, server_default="[]"),
        sa.Column("location_requirement", sa.String(255)),
        sa.Column("work_mode", sa.String(50)),
        sa.Column("salary_min", sa.Integer()),
        sa.Column("salary_max", sa.Integer()),
        sa.Column("industry", sa.String(100)),
        sa.Column("extraction_method", sa.String(20), server_default="manual"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_unique_constraint("uq_position_requirements_site_position", "position_requirements", ["site_id", "position_id"])

    # Create match_scores table
    op.create_table(
        "match_scores",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("position_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("positions.id"), nullable=False),
        sa.Column("resume_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resumes.id")),
        sa.Column("overall_score", sa.Integer(), nullable=False),
        sa.Column("confidence", sa.Integer(), server_default="100"),
        sa.Column("dimensions", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("match_areas", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("gap_areas", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("algorithm_version", sa.String(50), nullable=False),
        sa.Column("engine_config", postgresql.JSONB, server_default="{}"),
        sa.Column("is_stale", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("match_type", sa.String(20), nullable=False, server_default="applied"),
        sa.Column("scored_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("staff_users.id")),
        sa.Column("feedback_score", sa.Integer()),
        sa.Column("feedback_notes", sa.Text()),
        sa.Column("computed_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_unique_constraint("uq_match_scores_candidate_position_resume", "match_scores", ["candidate_id", "position_id", "resume_id"])
    op.create_index("idx_match_scores_site_position_score", "match_scores", ["site_id", "position_id", sa.text("overall_score DESC")])
    op.create_index("idx_match_scores_site_candidate", "match_scores", ["site_id", "candidate_id"])
    op.create_index("idx_match_scores_site_stale", "match_scores", ["site_id", "is_stale"])

    # Create employee_assignments table
    op.create_table(
        "employee_assignments",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("position_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("positions.id")),
        sa.Column("client_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("clients.id")),
        sa.Column("end_client_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("end_clients.id")),
        sa.Column("role_title", sa.String(255), nullable=False),
        sa.Column("start_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_date", sa.DateTime(timezone=True)),
        sa.Column("bill_rate", sa.String(50)),
        sa.Column("pay_rate", sa.String(50)),
        sa.Column("status", sa.String(20), nullable=False, server_default="active"),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_employee_assignments_site_candidate", "employee_assignments", ["site_id", "candidate_id"])
    op.create_index("idx_employee_assignments_site_status", "employee_assignments", ["site_id", "status"])
    op.create_index("idx_employee_assignments_site_end_date", "employee_assignments", ["site_id", "end_date"])

    # Create match_scan_jobs table
    op.create_table(
        "match_scan_jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("site_id", sa.String(50), sa.ForeignKey("sites.id"), nullable=False, server_default="ussp"),
        sa.Column("position_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("positions.id"), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("total_resumes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("processed_resumes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("algorithm_version", sa.String(50), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True)),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        sa.Column("error_message", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_match_scan_jobs_site_position_status", "match_scan_jobs", ["site_id", "position_id", "status"])

    # Add candidate_id column to applications table
    op.add_column("applications", sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id")))


def downgrade() -> None:
    # Remove candidate_id from applications
    op.drop_column("applications", "candidate_id")

    # Drop match_scan_jobs
    op.drop_index("idx_match_scan_jobs_site_position_status", table_name="match_scan_jobs")
    op.drop_table("match_scan_jobs")

    # Drop employee_assignments
    op.drop_index("idx_employee_assignments_site_end_date", table_name="employee_assignments")
    op.drop_index("idx_employee_assignments_site_status", table_name="employee_assignments")
    op.drop_index("idx_employee_assignments_site_candidate", table_name="employee_assignments")
    op.drop_table("employee_assignments")

    # Drop match_scores
    op.drop_index("idx_match_scores_site_stale", table_name="match_scores")
    op.drop_index("idx_match_scores_site_candidate", table_name="match_scores")
    op.drop_index("idx_match_scores_site_position_score", table_name="match_scores")
    op.drop_constraint("uq_match_scores_candidate_position_resume", "match_scores")
    op.drop_table("match_scores")

    # Drop position_requirements
    op.drop_constraint("uq_position_requirements_site_position", "position_requirements")
    op.drop_table("position_requirements")

    # Drop candidate_skills
    op.drop_index("idx_candidate_skills_site_skill", table_name="candidate_skills")
    op.drop_constraint("uq_candidate_skills_site_candidate_skill", "candidate_skills")
    op.drop_table("candidate_skills")

    # Drop resumes
    op.drop_index("idx_resumes_site_extraction_status", table_name="resumes")
    op.drop_index("idx_resumes_site_candidate", table_name="resumes")
    op.drop_table("resumes")

    # Drop candidates
    op.drop_index("idx_candidates_site_status", table_name="candidates")
    op.drop_index("idx_candidates_site_type", table_name="candidates")
    op.drop_constraint("uq_candidates_site_email", "candidates")
    op.drop_table("candidates")
