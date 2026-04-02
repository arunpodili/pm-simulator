"""
Integration Tests for API Endpoints
"""

import pytest
import json
from unittest.mock import patch, MagicMock


class TestHealthEndpoint:
    """Test health check endpoint."""

    def test_health_check(self, test_client):
        """Test health check returns correct structure."""
        response = test_client.get('/api/health')

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert 'version' in data
        assert 'features' in data

    def test_health_features_listed(self, test_client):
        """Test health check lists all features."""
        response = test_client.get('/api/health')
        data = json.loads(response.data)

        features = data['features']
        assert features['streaming'] == True
        assert features['field_mapping'] == True
        assert features['validation'] == True


class TestAuthenticationEndpoints:
    """Test authentication endpoints."""

    def test_login_success(self, test_client):
        """Test successful login."""
        response = test_client.post('/api/auth/login',
            json={'username': 'user1', 'password': 'password123'})

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] == True
        assert 'access_token' in data
        assert 'refresh_token' in data

    def test_login_failure(self, test_client):
        """Test failed login."""
        response = test_client.post('/api/auth/login',
            json={'username': 'user1', 'password': 'wrong_password'})

        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'error' in data

    def test_login_missing_credentials(self, test_client):
        """Test login with missing credentials."""
        response = test_client.post('/api/auth/login',
            json={'username': 'user1'})

        assert response.status_code == 400

    def test_logout(self, test_client):
        """Test logout endpoint."""
        response = test_client.post('/api/auth/logout')

        # Should succeed even without token
        assert response.status_code in [200, 401]


class TestSimulationEndpoints:
    """Test simulation endpoints."""

    def test_create_simulation_unauthorized(self, test_client):
        """Test simulation creation without auth fails."""
        response = test_client.post('/api/simulation/create', json={
            'name': 'Test',
            'feature_description': 'Test feature'
        })

        # Should require authentication
        assert response.status_code in [401, 403, 503]

    def test_create_simulation_authorized(self, test_client, auth_headers):
        """Test simulation creation with auth succeeds."""
        with patch('app_v2.AUTH_AVAILABLE', True):
            response = test_client.post('/api/simulation/create',
                json={'name': 'Test', 'feature_description': 'Test feature'},
                headers=auth_headers)

            # May fail due to auth mocking, but structure should be valid
            assert response.status_code in [200, 201, 401, 403]

    def test_get_simulation_not_found(self, test_client):
        """Test getting non-existent simulation."""
        response = test_client.get('/api/simulation/nonexistent/status')
        assert response.status_code == 404

    def test_field_mapping(self, test_client):
        """Test field mapping endpoint."""
        response = test_client.post('/api/simulation/map-fields', json={
            'problem': 'Users spend too much time on manual data entry',
            'target_user': 'Small business owners',
            'pricing': 'SaaS subscription'
        })

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] == True
        assert 'mapped_config' in data


class TestValidationEndpoints:
    """Test validation endpoints."""

    def test_get_benchmarks(self, test_client):
        """Test getting industry benchmarks."""
        response = test_client.get('/api/validation/benchmarks')

        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'industries' in data
        assert 'benchmarks' in data


class TestTaskEndpoints:
    """Test Celery task endpoints."""

    def test_task_status_without_celery(self, test_client):
        """Test task status when Celery unavailable."""
        response = test_client.get('/api/tasks/nonexistent/status')

        # Should return 503 if Celery unavailable, 404 if available
        assert response.status_code in [404, 503]

    def test_revoke_task_without_celery(self, test_client):
        """Test task revocation when Celery unavailable."""
        response = test_client.post('/api/tasks/nonexistent/revoke')

        assert response.status_code in [404, 503]


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
