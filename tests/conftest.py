"""
Test Suite Configuration
"""

import pytest
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'ai-agents-service'))

# Test configuration
TEST_DATABASE_URL = "postgresql://test:test@localhost:5432/pm_simulator_test"
TEST_REDIS_URL = "redis://localhost:6379/1"  # Use DB 1 for tests


def pytest_configure(config):
    """Configure pytest."""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "e2e: marks tests as end-to-end tests"
    )


@pytest.fixture(scope='session')
def test_client():
    """Create Flask test client."""
    from app_v2 import app
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    return app.test_client()


@pytest.fixture
def mock_simulation_config():
    """Mock simulation configuration."""
    return {
        'name': 'Test Simulation',
        'feature_description': 'Test feature',
        'target_industry': 'saas',
        'persona_count': 100,
        'simulation_days': 30
    }


@pytest.fixture
def auth_headers():
    """Mock authentication headers."""
    return {
        'Authorization': 'Bearer test-token'
    }
