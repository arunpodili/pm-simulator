"""
Unit Tests for Streaming Module

Tests SSE streaming, async operations, and stream management.
"""

import pytest
import json
import time
import random
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime

from streaming import (
    SimulationStreamer,
    StreamManager,
    streaming_bp,
    init_streaming
)


class TestSimulationStreamer:
    """Test SimulationStreamer class."""

    @pytest.fixture
    def mock_config(self):
        """Create mock simulation config."""
        config = Mock()
        config.simulation_days = 10
        config.random_seed = 42
        return config

    @pytest.fixture
    def streamer(self):
        """Create streamer instance."""
        mock_engine = Mock()
        active_sims = {}
        return SimulationStreamer(mock_engine, active_sims)

    def test_init(self, streamer):
        """Test streamer initialization."""
        assert streamer.simulation_engine is not None
        assert streamer.active_simulations == {}

    def test_process_day(self, streamer, mock_config):
        """Test single day processing."""
        result = streamer._process_day(0, mock_config)

        assert 'day' in result
        assert 'new_users' in result
        assert 'churned' in result
        assert 'conversions' in result
        assert 'revenue' in result
        assert 'satisfaction' in result

        assert isinstance(result['day'], int)
        assert isinstance(result['new_users'], int)
        assert 10 <= result['new_users'] <= 50
        assert 0 <= result['churned'] <= 5

    def test_process_day_deterministic(self, streamer, mock_config):
        """Test that same seed produces same results."""
        result1 = streamer._process_day(0, mock_config)
        result2 = streamer._process_day(0, mock_config)

        assert result1 == result2

    def test_process_day_different_seeds(self, streamer, mock_config):
        """Test that different seeds produce different results."""
        mock_config.random_seed = 42
        result1 = streamer._process_day(0, mock_config)

        mock_config.random_seed = 43
        result2 = streamer._process_day(0, mock_config)

        assert result1 != result2

    def test_process_day_no_seed(self, streamer, mock_config):
        """Test processing without seed."""
        mock_config.random_seed = None
        result = streamer._process_day(0, mock_config)

        assert 'day' in result
        assert result['day'] == 0

    def test_extract_day_metrics(self, streamer):
        """Test metrics extraction."""
        day_data = {
            'day': 5,
            'new_users': 30,
            'churned': 3,
            'revenue': 250.5,
            'satisfaction': 0.75
        }

        metrics = streamer._extract_day_metrics(day_data)

        assert metrics['new_users'] == 30
        assert metrics['active_users'] == 27
        assert metrics['daily_revenue'] == 250.5
        assert metrics['satisfaction'] == 0.75

    def test_calculate_final_metrics(self, streamer):
        """Test final metrics calculation."""
        day_results = [
            {'new_users': 20, 'churned': 2, 'revenue': 100.0, 'satisfaction': 0.8},
            {'new_users': 30, 'churned': 3, 'revenue': 200.0, 'satisfaction': 0.9},
        ]

        metrics = streamer._calculate_final_metrics(day_results)

        assert metrics['total_users_acquired'] == 50
        assert metrics['total_users_churned'] == 5
        assert metrics['net_user_growth'] == 45
        assert metrics['total_revenue'] == 300.0

    def test_format_event(self, streamer):
        """Test SSE event formatting."""
        data = {'type': 'test', 'message': 'hello'}
        event = streamer._format_event(data)

        assert event.startswith('data: ')
        assert event.endswith('\n\n')
        assert 'test' in event
        assert 'hello' in event


class TestStreamManager:
    """Test StreamManager class."""

    @pytest.fixture
    def manager(self):
        """Create stream manager instance."""
        return StreamManager()

    def test_register_stream(self, manager):
        """Test stream registration."""
        sim_id = 'sim123'
        generator = (x for x in range(10))

        manager.register_stream(sim_id, generator)

        assert sim_id in manager.active_streams
        assert manager.active_streams[sim_id]['status'] == 'active'

    def test_cancel_stream(self, manager):
        """Test stream cancellation."""
        sim_id = 'sim123'
        manager.register_stream(sim_id, None)

        result = manager.cancel_stream(sim_id)

        assert result is True
        assert manager.active_streams[sim_id]['status'] == 'cancelled'

    def test_cancel_nonexistent_stream(self, manager):
        """Test cancelling non-existent stream."""
        result = manager.cancel_stream('nonexistent')
        assert result is False

    def test_get_stream_status(self, manager):
        """Test getting stream status."""
        sim_id = 'sim123'
        manager.register_stream(sim_id, None)

        status = manager.get_stream_status(sim_id)

        assert status is not None
        assert status['status'] == 'active'

    def test_get_stream_status_nonexistent(self, manager):
        """Test getting status of non-existent stream."""
        status = manager.get_stream_status('nonexistent')
        assert status is None


class TestStreamingIntegration:
    """Integration tests for streaming module."""

    def test_generate_stream(self):
        """Test full stream generation."""
        mock_engine = Mock()
        active_sims = {}
        streamer = SimulationStreamer(mock_engine, active_sims)

        config = Mock()
        config.simulation_days = 3
        config.random_seed = 42

        # Collect events
        events = []
        for event in streamer.generate_stream('sim123', config):
            events.append(event)
            if len(events) > 5:  # Safety break
                break

        assert len(events) > 0
        # Should have init + days + complete
        assert any('init' in e for e in events)
        assert any('progress' in e for e in events)

    def test_stream_error_handling(self):
        """Test stream error handling."""
        mock_engine = Mock()
        active_sims = {}
        streamer = SimulationStreamer(mock_engine, active_sims)

        config = Mock()
        config.simulation_days = 3
        config.random_seed = 42

        # Force an error
        with patch.object(streamer, '_process_day', side_effect=Exception('Test error')):
            events = list(streamer.generate_stream('sim123', config))

        assert any('error' in e for e in events)


class TestConcurrency:
    """Test concurrent stream handling."""

    def test_multiple_streams_independent(self):
        """Test that multiple streams don't interfere."""
        manager = StreamManager()

        # Register multiple streams
        for i in range(5):
            manager.register_stream(f'sim{i}', None)

        assert len(manager.active_streams) == 5

        # Cancel one
        manager.cancel_stream('sim0')

        # Others should still exist
        assert len(manager.active_streams) == 5
        assert manager.active_streams['sim0']['status'] == 'cancelled'
        assert manager.active_streams['sim1']['status'] == 'active'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
