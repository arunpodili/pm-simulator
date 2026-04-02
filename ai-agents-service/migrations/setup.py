# Alembic Migration Script
# Run: alembic revision --autogenerate -m "Initial migration"
# Then: alembic upgrade head

"""
Database Migration Configuration

Run these commands:
1. alembic init migrations
2. Edit alembic.ini with your DATABASE_URL
3. alembic revision --autogenerate -m "Initial migration"
4. alembic upgrade head
"""

# alembic.ini template
ALEMBIC_INI_TEMPLATE = """
# ALEMBIC CONFIGURATION
[alembic]
script_location = migrations
prepend_sys_path = .
version_path_separator = os
sqlalchemy.url = %(DATABASE_URL)s

[post_write_hooks]

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
"""

# env.py template
ENV_PY_TEMPLATE = """
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import Base

# this is the Alembic Config object
config = context.config

# Set database URL from environment
config.set_main_option('sqlalchemy.url', os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/pm_simulator'))

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option('sqlalchemy.url')
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={'paramstyle': 'named'},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
"""


def setup_alembic_instructions():
    """Print instructions for setting up Alembic migrations."""
    print("""
    === DATABASE MIGRATION SETUP ===

    1. Install Alembic:
       pip install alembic

    2. Initialize migrations:
       cd ai-agents-service
       alembic init migrations

    3. Update migrations/env.py:
       Replace the content with the template from migrations/env.py.template

    4. Update alembic.ini:
       Set sqlalchemy.url to your DATABASE_URL

    5. Create initial migration:
       alembic revision --autogenerate -m "Initial migration"

    6. Apply migration:
       alembic upgrade head

    === COMMON COMMANDS ===

    # Create new migration
    alembic revision --autogenerate -m "Description"

    # Apply migrations
    alembic upgrade head

    # Rollback one migration
    alembic downgrade -1

    # View current version
    alembic current

    # View history
    alembic history
    """)


if __name__ == '__main__':
    setup_alembic_instructions()
