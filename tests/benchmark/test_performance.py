"""
Performance Benchmarks

Uses pytest-benchmark for performance testing.
Install: pip install pytest-benchmark
"""

import pytest
import time
import random
import string
from unittest.mock import Mock, patch

from auth_middleware import generate_tokens, authenticate_user, decode_token
from cleanup import CleanupManager
from rate_limiter import get_user_tier


class TestAuthPerformance:
    """Benchmark authentication operations."""

    def test_token_generation_benchmark(self, benchmark):
        """Benchmark JWT token generation."""
        result = benchmark(generate_tokens, 'user123', 'user')
        assert 'access_token' in result

    def test_token_decode_benchmark(self, benchmark):
        """Benchmark JWT token decoding."""
        tokens = generate_tokens('user123', 'user')

        result = benchmark(decode_token, tokens['access_token'])
        assert result['sub'] == 'user123'

    def test_authenticate_user_benchmark(self, benchmark):
        """Benchmark user authentication."""
        result = benchmark(authenticate_user, 'user1', 'password123')
        assert result is not None


class TestCleanupPerformance:
    """Benchmark cleanup operations."""

    def test_register_simulation_benchmark(self, benchmark):
        """Benchmark simulation registration."""
        manager = CleanupManager()

        def register_multiple():
            for i in range(100):
                manager.register(f'sim{i}', 'user1', 'pending')

        benchmark(register_multiple)
        assert len(manager.entries) == 100

    def test_cleanup_expired_benchmark(self, benchmark):
        """Benchmark cleanup of expired simulations."""
        manager = CleanupManager()

        # Setup: Add expired simulations
        from datetime import datetime, timedelta
        for i in range(1000):
            manager.register(f'expired{i}', 'user1', 'completed')
            manager.entries[f'expired{i}'].created_at = datetime.utcnow() - timedelta(hours=25)

        result = benchmark(manager.cleanup_expired)
        assert result['removed'] == 1000


class TestRateLimiterPerformance:
    """Benchmark rate limiting operations."""

    def test_get_user_tier_benchmark(self, benchmark):
        """Benchmark user tier detection."""
        from flask import g
        with patch('rate_limiter.g') as mock_g:
            mock_g.current_user = {'sub': 'user1', 'role': 'user', 'tier': 'paid'}

            result = benchmark(get_user_tier)
            assert result == 'paid'


class TestSimulationPerformance:
    """Benchmark simulation operations."""

    def test_stream_processing_benchmark(self, benchmark):
        """Benchmark stream processing."""
        from streaming import SimulationStreamer

        streamer = SimulationStreamer(Mock(), {})
        config = Mock()
        config.simulation_days = 10
        config.random_seed = 42

        def process_all_days():
            results = []
            for day in range(config.simulation_days):
                results.append(streamer._process_day(day, config))
            return results

        result = benchmark(process_all_days)
        assert len(result) == 10

    def test_metrics_calculation_benchmark(self, benchmark):
        """Benchmark metrics calculation."""
        from streaming import SimulationStreamer

        streamer = SimulationStreamer(Mock(), {})

        # Generate large dataset
        day_results = [
            {'new_users': random.randint(10, 50), 'churned': random.randint(0, 5)}
            for _ in range(1000)
        ]

        result = benchmark(streamer._calculate_final_metrics, day_results)
        assert 'total_users_acquired' in result


class TestDatabasePerformance:
    """Benchmark database operations (requires SQLite)."""

    def test_insert_benchmark(self, benchmark):
        """Benchmark database inserts."""
        from database import DatabaseManager, Simulation

        manager = DatabaseManager('sqlite:///:memory:')
        manager.init_engine()
        manager.create_tables()

        session = manager.get_session()

        def insert_many():
            for i in range(100):
                sim = Simulation(
                    id=f'sim{i}',
                    user_id='user1',
                    name=f'Sim {i}'
                )
                session.add(sim)
            session.commit()

        benchmark(insert_many)

        count = session.query(Simulation).count()
        assert count == 100

        session.close()
        manager.close()

    def test_query_benchmark(self, benchmark):
        """Benchmark database queries."""
        from database import DatabaseManager, Simulation

        manager = DatabaseManager('sqlite:///:memory:')
        manager.init_engine()
        manager.create_tables()

        session = manager.get_session()

        # Setup: Insert data
        for i in range(1000):
            sim = Simulation(
                id=f'sim{i}',
                user_id='user1',
                name=f'Sim {i}'
            )
            session.add(sim)
        session.commit()

        def query_all():
            return session.query(Simulation).filter_by(user_id='user1').all()

        result = benchmark(query_all)
        assert len(result) == 1000

        session.close()
        manager.close()


class TestLLMRouterPerformance:
    """Benchmark LLM router operations."""

    def test_route_selection_benchmark(self, benchmark):
        """Benchmark provider routing."""
        from llm_router import LLMRouter, TaskComplexity

        router = LLMRouter(daily_budget=10.0)

        def route_many():
            results = []
            for complexity in [TaskComplexity.LOW, TaskComplexity.MEDIUM, TaskComplexity.HIGH]:
                results.append(router.route('test task', complexity))
            return results

        result = benchmark(route_many)
        assert len(result) == 3


# Performance thresholds
class TestPerformanceThresholds:
    """Ensure performance meets thresholds."""

    def test_token_generation_under_10ms(self):
        """Token generation should be under 10ms."""
        import time

        start = time.time()
        for _ in range(100):
            generate_tokens('user123', 'user')
        elapsed = (time.time() - start) / 100

        assert elapsed < 0.01  # 10ms

    def test_cleanup_under_100ms(self):
        """Cleanup of 1000 entries should be under 100ms."""
        import time
        from datetime import datetime, timedelta

        manager = CleanupManager()

        # Setup
        for i in range(1000):
            manager.register(f'sim{i}', 'user1', 'completed')
            manager.entries[f'sim{i}'].created_at = datetime.utcnow() - timedelta(hours=25)

        start = time.time()
        manager.cleanup_expired()
        elapsed = time.time() - start

        assert elapsed < 0.1  # 100ms


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
