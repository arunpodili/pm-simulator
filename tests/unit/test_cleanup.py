"""
Unit Tests for Cleanup Manager
"""

import pytest
from datetime import datetime, timedelta
from cleanup import (
    CleanupManager,
    SimulationEntry,
    SIMULATION_TTL_HOURS,
    MAX_SIMULATIONS_PER_USER
)


class TestSimulationEntry:
    """Test SimulationEntry data class."""

    def test_entry_creation(self):
        """Test entry creation."""
        entry = SimulationEntry(
            sim_id='sim123',
            user_id='user1',
            created_at=datetime.utcnow(),
            last_accessed=datetime.utcnow(),
            status='pending'
        )

        assert entry.sim_id == 'sim123'
        assert entry.user_id == 'user1'
        assert entry.status == 'pending'

    def test_is_expired(self):
        """Test expiration detection."""
        old_entry = SimulationEntry(
            sim_id='sim123',
            user_id='user1',
            created_at=datetime.utcnow() - timedelta(hours=25),
            last_accessed=datetime.utcnow(),
            status='completed'
        )

        assert old_entry.is_expired() == True

    def test_not_expired(self):
        """Test non-expired entry."""
        new_entry = SimulationEntry(
            sim_id='sim123',
            user_id='user1',
            created_at=datetime.utcnow() - timedelta(hours=1),
            last_accessed=datetime.utcnow(),
            status='completed'
        )

        assert new_entry.is_expired() == False

    def test_age_hours(self):
        """Test age calculation."""
        entry = SimulationEntry(
            sim_id='sim123',
            user_id='user1',
            created_at=datetime.utcnow() - timedelta(hours=5),
            last_accessed=datetime.utcnow(),
            status='completed'
        )

        age = entry.age_hours()
        assert 4.9 < age < 5.1  # Approximate


class TestCleanupManager:
    """Test CleanupManager functionality."""

    @pytest.fixture
    def manager(self):
        """Create fresh manager for each test."""
        return CleanupManager()

    def test_register_simulation(self, manager):
        """Test simulation registration."""
        manager.register('sim1', 'user1', 'pending')

        assert 'sim1' in manager.entries
        assert manager.entries['sim1'].user_id == 'user1'

    def test_update_status(self, manager):
        """Test status update."""
        manager.register('sim1', 'user1', 'pending')
        manager.update_status('sim1', 'running', size_bytes=1024)

        assert manager.entries['sim1'].status == 'running'
        assert manager.entries['sim1'].size_bytes == 1024

    def test_cleanup_expired(self, manager):
        """Test expired simulation cleanup."""
        # Add expired simulation
        manager.register('sim1', 'user1', 'completed')
        manager.entries['sim1'].created_at = datetime.utcnow() - timedelta(hours=25)

        # Add fresh simulation
        manager.register('sim2', 'user1', 'completed')

        stats = manager.cleanup_expired()

        assert stats['expired_found'] == 1
        assert stats['removed'] == 1
        assert 'sim1' not in manager.entries
        assert 'sim2' in manager.entries

    def test_cleanup_by_age(self, manager):
        """Test age-based cleanup."""
        manager.register('sim1', 'user1', 'completed')
        manager.entries['sim1'].created_at = datetime.utcnow() - timedelta(hours=48)

        stats = manager.cleanup_by_age(24)

        assert stats['removed'] == 1
        assert 'sim1' not in manager.entries

    def test_emergency_cleanup(self, manager):
        """Test emergency cleanup."""
        # Add 5 simulations
        for i in range(5):
            manager.register(f'sim{i}', 'user1', 'completed')

        stats = manager.emergency_cleanup(keep_recent=3)

        assert stats['emergency'] == True
        assert stats['kept'] == 3
        assert stats['removed'] == 2
        assert len(manager.entries) == 3

    def test_get_stats(self, manager):
        """Test statistics retrieval."""
        manager.register('sim1', 'user1', 'pending')
        manager.register('sim2', 'user1', 'completed')
        manager.register('sim3', 'user2', 'completed')

        stats = manager.get_stats()

        assert stats['total_simulations'] == 3
        assert stats['by_status']['pending'] == 1
        assert stats['by_status']['completed'] == 2
        assert 'user1' in stats['by_user']
        assert 'user2' in stats['by_user']

    def test_user_limit_enforcement(self, manager):
        """Test per-user simulation limit."""
        # Register more than max simulations for one user
        for i in range(MAX_SIMULATIONS_PER_USER + 5):
            manager.register(f'sim{i}', 'user1', 'completed')

        # Should have removed oldest, keeping only MAX_SIMULATIONS_PER_USER
        user_sims = [e for e in manager.entries.values() if e.user_id == 'user1']
        assert len(user_sims) <= MAX_SIMULATIONS_PER_USER


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
