"""
Integration Tests for PostgreSQL Database

These tests require a running PostgreSQL instance.
Set DATABASE_URL environment variable to run these tests.
"""

import pytest
import os
from datetime import datetime

# Skip these tests if no PostgreSQL available
pytestmark = pytest.mark.skipif(
    not os.getenv('TEST_DATABASE_URL'),
    reason='TEST_DATABASE_URL not set'
)

from database import (
    User, Simulation, SimulationResult,
    DatabaseManager, create_simulation_db,
    update_simulation_status_db
)


@pytest.fixture(scope='module')
def postgres_db():
    """Create PostgreSQL connection for integration tests."""
    database_url = os.getenv('TEST_DATABASE_URL')
    manager = DatabaseManager(database_url)
    manager.init_engine()
    manager.create_tables()

    yield manager

    # Cleanup - drop test tables
    manager.drop_tables()
    manager.close()


@pytest.fixture
def db_session(postgres_db):
    """Create fresh session for each test."""
    session = postgres_db.get_session()
    yield session
    session.rollback()
    session.close()


@pytest.mark.integration
class TestPostgreSQLIntegration:
    """PostgreSQL integration tests."""

    def test_postgres_connection(self, postgres_db):
        """Test PostgreSQL connection."""
        from sqlalchemy import text
        with postgres_db.engine.connect() as conn:
            result = conn.execute(text('SELECT 1'))
            assert result.scalar() == 1

    def test_user_crud(self, db_session):
        """Test user CRUD operations."""
        # Create
        user = User(
            id='test-user-1',
            username='testuser',
            email='test@example.com',
            password_hash='hashed',
            role='user'
        )
        db_session.add(user)
        db_session.commit()

        # Read
        fetched = db_session.query(User).filter_by(id='test-user-1').first()
        assert fetched.username == 'testuser'

        # Update
        fetched.role = 'admin'
        db_session.commit()

        updated = db_session.query(User).filter_by(id='test-user-1').first()
        assert updated.role == 'admin'

        # Delete
        db_session.delete(updated)
        db_session.commit()

        deleted = db_session.query(User).filter_by(id='test-user-1').first()
        assert deleted is None

    def test_simulation_with_result(self, db_session):
        """Test simulation and result relationship."""
        sim = create_simulation_db(
            db_session,
            'test-sim-1',
            'test-user-1',
            {
                'name': 'Test Sim',
                'feature_description': 'Test',
                'target_industry': 'saas',
                'persona_count': 1000,
                'simulation_days': 90
            }
        )

        # Add result
        result = SimulationResult(
            id='test-result-1',
            simulation_id='test-sim-1',
            total_personas=1000,
            conversion_rate=0.15
        )
        db_session.add(result)
        db_session.commit()

        # Query with join
        from sqlalchemy.orm import joinedload
        fetched = db_session.query(Simulation).options(
            joinedload(Simulation.result)
        ).filter_by(id='test-sim-1').first()

        assert fetched.result is not None
        assert fetched.result.conversion_rate == 0.15

    def test_concurrent_simulations(self, db_session):
        """Test handling multiple simulations."""
        # Create multiple simulations
        for i in range(10):
            sim = Simulation(
                id=f'concurrent-sim-{i}',
                user_id='test-user-1',
                name=f'Sim {i}',
                status='pending'
            )
            db_session.add(sim)

        db_session.commit()

        # Query all
        sims = db_session.query(Simulation).filter(
            Simulation.user_id == 'test-user-1'
        ).all()

        assert len(sims) == 10

    def test_status_transitions(self, db_session):
        """Test simulation status transitions."""
        sim = Simulation(
            id='status-sim-1',
            user_id='test-user-1',
            name='Status Test',
            status='pending'
        )
        db_session.add(sim)
        db_session.commit()

        # Transition to running
        update_simulation_status_db(db_session, 'status-sim-1', 'running')
        db_session.commit()

        fetched = db_session.query(Simulation).filter_by(id='status-sim-1').first()
        assert fetched.status == 'running'
        assert fetched.started_at is not None

        # Transition to completed
        update_simulation_status_db(db_session, 'status-sim-1', 'completed')
        db_session.commit()

        fetched = db_session.query(Simulation).filter_by(id='status-sim-1').first()
        assert fetched.status == 'completed'
        assert fetched.completed_at is not None


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
