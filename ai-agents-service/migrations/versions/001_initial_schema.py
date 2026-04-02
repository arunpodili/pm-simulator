"""
Initial Database Schema Migration

Revision ID: 001
Revises:
Create Date: 2026-04-02
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Create initial tables with indexes."""

    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column('username', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('email', sa.String(255), unique=True, nullable=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), default='user', index=True),
        sa.Column('tier', sa.String(50), default='free'),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.Column('api_key', sa.String(255), unique=True, nullable=True, index=True),
        sa.Column('ip_whitelist', postgresql.ARRAY(sa.String()), nullable=True)
    )

    # Simulations table
    op.create_table(
        'simulations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('feature_description', sa.Text(), nullable=True),
        sa.Column('target_industry', sa.String(50), default='saas', index=True),
        sa.Column('persona_count', sa.Integer(), default=1000),
        sa.Column('simulation_days', sa.Integer(), default=90),
        sa.Column('random_seed', sa.Integer(), nullable=True),
        sa.Column('features', postgresql.JSONB(), default=[]),
        sa.Column('pricing_tiers', postgresql.JSONB(), default=[]),
        sa.Column('pain_points_solved', postgresql.JSONB(), default=[]),
        sa.Column('differentiators', postgresql.JSONB(), default=[]),
        sa.Column('market_saturation', sa.Float(), default=0.5),
        sa.Column('competitor_strength', sa.Float(), default=0.5),
        sa.Column('marketing_spend_level', sa.String(50), default='medium'),
        sa.Column('status', sa.String(50), default='pending', index=True),
        sa.Column('progress', sa.Float(), default=0.0),
        sa.Column('task_id', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now())
    )

    # Simulation results table
    op.create_table(
        'simulation_results',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('simulation_id', sa.String(36), sa.ForeignKey('simulations.id', ondelete='CASCADE'), unique=True, nullable=False),
        sa.Column('total_personas', sa.Integer(), default=0),
        sa.Column('conversion_rate', sa.Float(), default=0.0),
        sa.Column('churn_rate', sa.Float(), default=0.0),
        sa.Column('nps', sa.Float(), default=0.0),
        sa.Column('clv', sa.Float(), default=0.0),
        sa.Column('final_metrics', postgresql.JSONB(), default={}),
        sa.Column('adoption_curve', postgresql.JSONB(), default=[]),
        sa.Column('cohort_analysis', postgresql.JSONB(), default={}),
        sa.Column('predicted_churn_rate', sa.Float(), nullable=True),
        sa.Column('predicted_nps', sa.Float(), nullable=True),
        sa.Column('predicted_clv', sa.Float(), nullable=True),
        sa.Column('predicted_adoption_curve', postgresql.JSONB(), default=[]),
        sa.Column('validation_report', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    # Simulation timeline table
    op.create_table(
        'simulation_timeline',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('simulation_id', sa.String(36), sa.ForeignKey('simulations.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('day', sa.Integer(), nullable=False),
        sa.Column('new_users', sa.Integer(), default=0),
        sa.Column('churned', sa.Integer(), default=0),
        sa.Column('conversions', sa.Integer(), default=0),
        sa.Column('revenue', sa.Float(), default=0.0),
        sa.Column('satisfaction', sa.Float(), default=0.0),
        sa.Column('active_users', sa.Integer(), default=0),
        sa.UniqueConstraint('simulation_id', 'day', name='uq_timeline_sim_day')
    )

    # API logs table
    op.create_table(
        'api_logs',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('endpoint', sa.String(255), nullable=False, index=True),
        sa.Column('method', sa.String(10), nullable=False),
        sa.Column('status_code', sa.Integer(), nullable=True),
        sa.Column('response_time_ms', sa.Integer(), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True, index=True),
        sa.Column('user_agent', sa.String(512), nullable=True),
        sa.Column('request_id', sa.String(36), nullable=True, index=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), index=True)
    )

    # Audit logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('action', sa.String(100), nullable=False, index=True),
        sa.Column('resource_type', sa.String(100), nullable=False),
        sa.Column('resource_id', sa.String(36), nullable=True),
        sa.Column('old_values', postgresql.JSONB(), nullable=True),
        sa.Column('new_values', postgresql.JSONB(), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(512), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), index=True)
    )

    # Webhooks table
    op.create_table(
        'webhooks',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('url', sa.String(2048), nullable=False),
        sa.Column('events', postgresql.ARRAY(sa.String()), nullable=False),
        sa.Column('secret', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now())
    )

    # Create indexes for better query performance
    op.create_index('idx_simulations_user_status', 'simulations', ['user_id', 'status'])
    op.create_index('idx_simulations_created', 'simulations', ['created_at'])
    op.create_index('idx_simulations_industry', 'simulations', ['target_industry'])
    op.create_index('idx_api_logs_user_endpoint', 'api_logs', ['user_id', 'endpoint'])
    op.create_index('idx_audit_logs_resource', 'audit_logs', ['resource_type', 'resource_id'])


def downgrade():
    """Drop all tables."""
    op.drop_table('webhooks')
    op.drop_table('audit_logs')
    op.drop_table('api_logs')
    op.drop_table('simulation_timeline')
    op.drop_table('simulation_results')
    op.drop_table('simulations')
    op.drop_table('users')
