"""
Migration: Add simulation_personas and change_logs tables
"""
from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, Text, DateTime, ForeignKey, JSON
from database import DATABASE_URL


def upgrade():
    """Create tables"""
    engine = create_engine(DATABASE_URL)
    metadata = MetaData()

    # simulation_personas table
    simulation_personas = Table(
        'simulation_personas', metadata,
        Column('id', String(36), primary_key=True),
        Column('simulation_id', String(36), ForeignKey('simulations.id'), nullable=False, index=True),
        Column('name', String(100), nullable=False),
        Column('role', String(100), nullable=False),
        Column('pain_level', Integer, nullable=False),
        Column('tech_savviness', Integer, nullable=False),
        Column('age_range', String(20)),
        Column('income_level', String(20)),
        Column('goals', Text),
        Column('frustrations', Text),
        Column('created_at', DateTime),
        Column('updated_at', DateTime)
    )

    # change_logs table
    change_logs = Table(
        'change_logs', metadata,
        Column('id', String(36), primary_key=True),
        Column('simulation_id', String(36), ForeignKey('simulations.id'), nullable=False, index=True),
        Column('author_id', String(36), ForeignKey('users.id'), nullable=False),
        Column('change_type', String(50), nullable=False),
        Column('field', String(100)),
        Column('old_value', JSON),
        Column('new_value', JSON),
        Column('reason', Text),
        Column('impact', Text),
        Column('created_at', DateTime)
    )

    metadata.create_all(engine)
    print("Migration complete: Added simulation_personas and change_logs tables")


def downgrade():
    """Drop tables"""
    engine = create_engine(DATABASE_URL)
    metadata = MetaData()
    metadata.reflect(engine)

    if 'simulation_personas' in metadata.tables:
        metadata.tables['simulation_personas'].drop(engine)
        print("Dropped simulation_personas table")

    if 'change_logs' in metadata.tables:
        metadata.tables['change_logs'].drop(engine)
        print("Dropped change_logs table")


if __name__ == '__main__':
    upgrade()
