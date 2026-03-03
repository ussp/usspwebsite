"""
Alembic Environment Configuration

Configures Alembic to work with Supabase PostgreSQL database.
Uses DATABASE_URL environment variable for connection string.
"""

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import engine_from_config, pool
from alembic import context

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables from .env.local (Next.js convention)
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv()  # Also check .env

# Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import SQLAlchemy metadata for autogenerate support
from migrations.models import Base

target_metadata = Base.metadata


def get_database_url() -> str:
    """
    Get database URL from environment.

    Supports multiple environment variable names for flexibility:
    - DATABASE_URL (standard)
    - SUPABASE_DATABASE_URL
    - POSTGRES_URL
    """
    url = os.environ.get("DATABASE_URL")
    if not url:
        url = os.environ.get("SUPABASE_DATABASE_URL")
    if not url:
        url = os.environ.get("POSTGRES_URL")

    if not url:
        raise RuntimeError(
            "No database URL found. Set DATABASE_URL, "
            "SUPABASE_DATABASE_URL, or POSTGRES_URL environment variable."
        )

    # Handle Heroku/Railway postgres:// prefix
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    return url


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode - generates SQL without connecting."""
    url = get_database_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode - connects and applies directly."""
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = get_database_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            include_schemas=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
