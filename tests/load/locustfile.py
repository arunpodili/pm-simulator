"""
Load Testing with Locust

Install: pip install locust
Run: locust -f tests/load/locustfile.py --host=http://localhost:5001

Then open http://localhost:8089 to configure and start test.
"""

from locust import HttpUser, task, between
import json
import random


class BaseUser(HttpUser):
    """Base user class with authentication."""
    wait_time = between(1, 3)

    def on_start(self):
        """Login on start."""
        # Try to login (will fail if auth not available, that's OK for load testing)
        response = self.client.post('/api/auth/login', json={
            'username': f'user{self.user_id}',
            'password': 'password123'
        })

        if response.status_code == 200:
            data = response.json()
            self.token = data.get('access_token')
        else:
            self.token = None

    def get_headers(self):
        """Get auth headers."""
        if self.token:
            return {'Authorization': f'Bearer {self.token}'}
        return {}


class SimulationUser(BaseUser):
    """User that creates and runs simulations."""
    weight = 3

    @task(1)
    def health_check(self):
        """Check API health."""
        self.client.get('/api/health')

    @task(5)
    def field_mapping(self):
        """Test field mapping endpoint."""
        self.client.post('/api/simulation/map-fields', json={
            'problem': 'Users spend too much time on manual data entry',
            'target_user': 'Small business owners',
            'pricing': 'SaaS subscription $29/month',
            'competitors': 'Competitor A, Competitor B'
        })

    @task(3)
    def create_simulation(self):
        """Create a simulation."""
        response = self.client.post(
            '/api/simulation/create',
            json={
                'name': f'Test Simulation {random.randint(1, 10000)}',
                'feature_description': 'Automated data entry solution',
                'target_industry': random.choice(['saas', 'fintech', 'ecommerce']),
                'persona_count': random.choice([100, 500, 1000]),
                'simulation_days': random.choice([30, 60, 90])
            },
            headers=self.get_headers()
        )

        if response.status_code == 200:
            data = response.json()
            self.simulation_id = data.get('simulation_id')

    @task(2)
    def get_simulation_status(self):
        """Get simulation status."""
        if hasattr(self, 'simulation_id'):
            self.client.get(
                f'/api/simulation/{self.simulation_id}/status',
                headers=self.get_headers()
            )

    @task(1)
    def run_simulation(self):
        """Run simulation."""
        if hasattr(self, 'simulation_id'):
            self.client.post(
                f'/api/simulation/{self.simulation_id}/run',
                headers=self.get_headers()
            )


class ValidationUser(BaseUser):
    """User that works with validation endpoints."""
    weight = 2

    @task(1)
    def get_benchmarks(self):
        """Get industry benchmarks."""
        self.client.get('/api/validation/benchmarks')

    @task(3)
    def validate_results(self):
        """Validate simulation results."""
        self.client.post('/api/simulation/test-sim/validate', json={
            'industry': random.choice(['saas', 'fintech', 'ecommerce'])
        }, headers=self.get_headers())


class AdminUser(BaseUser):
    """Admin user that performs administrative tasks."""
    weight = 1

    @task(1)
    def cleanup_stats(self):
        """View cleanup statistics."""
        self.client.get(
            '/api/admin/cleanup/stats',
            headers=self.get_headers()
        )

    @task(1)
    def trigger_cleanup(self):
        """Trigger cleanup."""
        self.client.post(
            '/api/admin/cleanup',
            json={'action': 'expired'},
            headers=self.get_headers()
        )

    @task(3)
    def view_queue_status(self):
        """View Celery queue status."""
        self.client.get(
            '/api/tasks/queue',
            headers=self.get_headers()
        )


class StreamingUser(BaseUser):
    """User that tests streaming endpoints."""
    weight = 1

    @task(1)
    def test_streaming(self):
        """Test streaming endpoint."""
        # Note: SSE streaming doesn't work well with Locust's HTTP client
        # This is a placeholder for streaming load testing
        pass


class BurstLoadUser(BaseUser):
    """User that creates burst load."""
    weight = 5
    wait_time = between(0.1, 0.5)  # Very short wait

    @task(10)
    def health_burst(self):
        """Rapid health checks."""
        self.client.get('/api/health')

    @task(5)
    def field_mapping_burst(self):
        """Rapid field mapping."""
        self.client.post('/api/simulation/map-fields', json={
            'problem': 'Test problem',
            'target_user': 'Test user'
        })


# Configuration for different load scenarios
class SteadyLoadShape:
    """Steady load shape - constant users."""
    target_users = 50
    spawn_rate = 2


class SpikeLoadShape:
    """Spike load shape - sudden increase."""
    """Example usage:
    from locust import LoadTestShape

    class SpikeShape(LoadTestShape):
        stages = [
            (60, 10),    # 10 users for 1 min
            (60, 100),   # 100 users for 1 min (spike)
            (60, 10),    # Back to 10 users
        ]
    """
    pass


# Expected performance thresholds
PERFORMANCE_THRESHOLDS = {
    'health_check': {'p95': 100, 'p99': 200},  # ms
    'field_mapping': {'p95': 500, 'p99': 1000},
    'create_simulation': {'p95': 200, 'p99': 500},
    'run_simulation': {'p95': 5000, 'p99': 10000},
    'validate_results': {'p95': 300, 'p99': 600},
}


# Test scenarios
SCENARIOS = {
    'smoke': {
        'users': 1,
        'duration': '1m',
        'description': 'Single user smoke test'
    },
    'load': {
        'users': 50,
        'duration': '10m',
        'description': 'Normal load test'
    },
    'stress': {
        'users': 200,
        'duration': '10m',
        'description': 'Stress test'
    },
    'spike': {
        'users': 500,
        'duration': '5m',
        'description': 'Spike test'
    },
    'soak': {
        'users': 50,
        'duration': '60m',
        'description': 'Soak test for memory leaks'
    }
}


if __name__ == '__main__':
    print("Load testing configuration:")
    print("\nScenarios:")
    for name, config in SCENARIOS.items():
        print(f"  {name}: {config['description']} ({config['users']} users, {config['duration']})")

    print("\nRun with: locust -f locustfile.py --host=http://localhost:5001")
    print("Then visit: http://localhost:8089")
