"""
Unit Tests for Database Module

Uses SQLite in-memory for fast testing without PostgreSQL setup.
"""

import pytest
import sys
import os
from datetime import datetime, timedelta
from unittest.mock import Mock, patch, MagicMock

# Use SQLite for testing
os.environ['DATABASE_URL'] = 'sqlite:///:memory:'

from database import (
    User,
    Simulation,
    SimulationResult,
    SimulationTimeline,
    APILog,
    DatabaseManager,
    db_manager,
    get_user_simulations,
    get_simulation_with_result,
    create_simulation_db,
    update_simulation_status_db,
    create_simulation_result_db,
    log_api_request
)


@pytest.fixture(scope='function')
def db_session():
    """Create database session for each test."""
    # Initialize with SQLite in-memory
    manager = DatabaseManager('sqlite:///:memory:')
    manager.init_engine()
    manager.create_tables()

    session = manager.get_session()

    yield session

    # Cleanup
    session.close()
    manager.close()


class TestUserModel:
    """Test User model."""

    def test_user_creation(self, db_session):
        """Test user creation."""
        user = User(
            id='user-123',
            username='testuser',
            email='test@example.com',
            password_hash='hashed_password',
            role='user',
            tier='free'
        )
        db_session.add(user)
        db_session.commit()

        result = db_session.query(User).filter_by(username='testuser').first()
        assert result is not None
        assert result.username == 'testuser'
        assert result.role == 'user'

    def test_user_to_dict(self, db_session):
        """Test user serialization."""
        user = User(
            id='user-123',
            username='testuser',
            email='test@example.com',
            password_hash='hash',
            role='admin',
            tier='paid'
        )

        data = user.to_dict()

        assert data['id'] == 'user-123'
        assert data['username'] == 'testuser'
        assert data['role'] == 'admin'
        assert 'created_at' in data

    def test_user_relationship(self, db_session):
        """Test user-simulation relationship."""
        user = User(id='user-123', username='test', password_hash='hash')
        db_session.add(user)

        sim = Simulation(
            id='sim-123',
            user_id='user-123',
            name='Test Sim'
        )
        db_session.add(sim)
        db_session.commit()

        assert len(user.simulations) == 1
        assert user.simulations[0].name == 'Test Sim'


class TestSimulationModel:
    """Test Simulation model."""

    def test_simulation_creation(self, db_session):
        """Test simulation creation."""
        sim = Simulation(
            id='sim-123',
            user_id='user-123',
            name='Test Simulation',
            feature_description='Test feature',
            target_industry='saas',
            persona_count=1000,
            simulation_days=90,
            status='pending'
        )
        db_session.add(sim)
        db_session.commit()

        result = db_session.query(Simulation).filter_by(id='sim-123').first()
        assert result is not None
        assert result.name == 'Test Simulation'
        assert result.status == 'pending'

    def test_simulation_to_dict(self, db_session):
        """Test simulation serialization."""
        sim = Simulation(
            id='sim-123',
            user_id='user-123',
            name='Test',
            target_industry='saas',
            persona_count=1000,
            simulation_days=90
        )

        data = sim.to_dict()

        assert data['id'] == 'sim-123'
        assert data['name'] == 'Test'
        assert data['status'] == 'pending'

    def test_simulation_timestamps(self, db_session):
        """Test simulation timestamps."""
        sim = Simulation(
            id='sim-123',
            user_id='user-123',
            name='Test'
        )
        db_session.add(sim)
        db_session.commit()

        assert sim.created_at is not None
        assert sim.updated_at is not None

    def test_simulation_json_fields(self, db_session):
        """Test JSON field storage."""
        sim = Simulation(
            id='sim-123',
            user_id='user-123',
            name='Test',
            features=[{'name': 'Feature 1'}],
            pricing_tiers=[{'name': 'Basic', 'price': 10}]
        )
        db_session.add(sim)
        db_session.commit()

        result = db_session.query(Simulation).filter_by(id='sim-123').first()
        assert result.features == [{'name': 'Feature 1'}]
        assert result.pricing_tiers[0]['price'] == 10


class TestSimulationResultModel:
    """Test SimulationResult model."""

    def test_result_creation(self, db_session):
        """Test result creation."""
        result = SimulationResult(
            id='result-123',
            simulation_id='sim-123',
            total_personas=1000,
            conversion_rate=0.15,
            churn_rate=0.05,
            nps=50.0,
            clv=500.0
        )
        db_session.add(result)
        db_session.commit()

        saved = db_session.query(SimulationResult).filter_by(id='result-123').first()
        assert saved is not None
        assert saved.conversion_rate == 0.15

    def test_result_to_dict(self, db_session):
        """Test result serialization."""
        result = SimulationResult(
            id='result-123',
            simulation_id='sim-123',
            total_personas=1000,
            conversion_rate=0.15
        )

        data = result.to_dict()

        assert data['id'] == 'result-123'
        assert data['total_personas'] == 1000
        assert data['conversion_rate'] == 0.15


class TestSimulationTimelineModel:
    """Test SimulationTimeline model."""

    def test_timeline_entry_creation(self, db_session):
        """Test timeline entry creation."""
        entry = SimulationTimeline(
            simulation_id='sim-123',
            day=1,
            new_users=50,
            churned=5,
            conversions=10,
            revenue=500.0,
            satisfaction=0.8,
            active_users=45
        )
        db_session.add(entry)
        db_session.commit()

        result = db_session.query(SimulationTimeline).filter_by(simulation_id='sim-123').first()
        assert result is not None
        assert result.day == 1
        assert result.new_users == 50


class TestAPILogModel:
    """Test APILog model."""

    def test_api_log_creation(self, db_session):
        """Test API log creation."""
        log = APILog(
            user_id='user-123',
            endpoint='/api/simulation/create',
            method='POST',
            status_code=200,
            response_time_ms=150,
            ip_address='192.168.1.1'
        )
        db_session.add(log)
        db_session.commit()

        result = db_session.query(APILog).filter_by(endpoint='/api/simulation/create').first()
        assert result is not None
        assert result.method == 'POST'
        assert result.status_code == 200

    def test_api_log_timestamps(self, db_session):
        """Test API log timestamps."""
        log = APILog(
            endpoint='/api/test',
            method='GET',
            status_code=200
        )
        db_session.add(log)
        db_session.commit()

        assert log.created_at is not None


class TestDatabaseManager:
    """Test DatabaseManager."""

    def test_init(self):
        """Test manager initialization."""
        manager = DatabaseManager('sqlite:///:memory:')
        assert manager.database_url == 'sqlite:///:memory:'
        assert manager.engine is None

    def test_init_engine(self):
        """Test engine initialization."""
        manager = DatabaseManager('sqlite:///:memory:')
        manager.init_engine()

        assert manager.engine is not None
        assert manager.SessionLocal is not None

    def test_create_tables(self):
        """Test table creation."""
        manager = DatabaseManager('sqlite:///:memory:')
        manager.init_engine()
        manager.create_tables()

        # Tables should exist now
        from sqlalchemy import inspect
        inspector = inspect(manager.engine)
        tables = inspector.get_table_names()

        assert 'users' in tables
        assert 'simulations' in tables
        assert 'simulation_results' in tables


class TestUtilityFunctions:
    """Test database utility functions."""

    def test_create_simulation_db(self, db_session):
        """Test simulation creation utility."""
        config = {
            'name': 'Test Sim',
            'feature_description': 'Test',
            'target_industry': 'saas',
            'persona_count': 1000,
            'simulation_days': 90,
            'features': [{'name': 'Feature 1'}]
        }

        sim = create_simulation_db(db_session, 'sim-123', 'user-123', config)

        assert sim.id == 'sim-123'
        assert sim.user_id == 'user-123'
        assert sim.name == 'Test Sim'

    def test_update_simulation_status_db(self, db_session):
        """Test status update utility."""
        sim = Simulation(id='sim-123', user_id='user-123', name='Test', status='pending')
        db_session.add(sim)
        db_session.commit()

        update_simulation_status_db(db_session, 'sim-123', 'running')

        result = db_session.query(Simulation).filter_by(id='sim-123').first()
        assert result.status == 'running'
        assert result.started_at is not None

    def test_create_simulation_result_db(self, db_session):
        """Test result creation utility."""
        result_data = {
            'total_personas': 1000,
            'conversion_rate': 0.15,
            'final_metrics': {'key': 'value'}
        }

        result = create_simulation_result_db(db_session, 'sim-123', result_data)

        assert result.simulation_id == 'sim-123'
        assert result.total_personas == 1000

    def test_log_api_request(self, db_session):
        """Test API logging utility."""
        log = log_api_request(
            db_session,
            user_id='user-123',
            endpoint='/api/test',
            method='GET',
            status_code=200,
            response_time_ms=100,
            ip_address='192.168.1.1',
            user_agent='Test Agent'
        )

        assert log.endpoint == '/api/test'
        assert log.status_code == 200

    def test_get_user_simulations(self, db_session):
        """Test getting user simulations."""
        # Create user and simulations
        user = User(id='user-123', username='test', password_hash='hash')
        db_session.add(user)

        sim1 = Simulation(id='sim-1', user_id='user-123', name='Sim 1', created_at=datetime.utcnow() - timedelta(days=1))
        sim2 = Simulation(id='sim-2', user_id='user-123', name='Sim 2', created_at=datetime.utcnow())
        db_session.add_all([sim1, sim2])
        db_session.commit()

        sims = get_user_simulations(db_session, 'user-123')

        assert len(sims) == 2
        # Should be ordered by created_at desc
        assert sims[0].name == 'Sim 2'

    def test_get_simulation_with_result(self, db_session):
        """Test getting simulation with result."""
        sim = Simulation(id='sim-123', user_id='user-123', name='Test')
        result = SimulationResult(id='res-123', simulation_id='sim-123', total_personas=1000)
        db_session.add_all([sim, result])
        db_session.commit()

        fetched = get_simulation_with_result(db_session, 'sim-123')

        assert fetched is not None
        assert fetched.name == 'Test'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
