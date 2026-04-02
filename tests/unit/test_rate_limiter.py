"""
Unit Tests for Rate Limiter
"""

import pytest
from unittest.mock import patch, MagicMock

from rate_limiter import (
    get_user_tier,
    get_limit_key,
    RateLimiter,
    limiter,
    RATE_LIMITS
)


class TestUserTierDetection:
    """Test user tier detection."""

    def test_get_user_tier_admin(self):
        """Test admin tier detection."""
        with patch('rate_limiter.g') as mock_g:
            mock_g.current_user = {'sub': 'admin1', 'role': 'admin'}
            assert get_user_tier() == 'admin'

    def test_get_user_tier_paid(self):
        """Test paid tier detection."""
        with patch('rate_limiter.g') as mock_g:
            mock_g.current_user = {'sub': 'user1', 'role': 'user', 'tier': 'paid'}
            assert get_user_tier() == 'paid'

    def test_get_user_tier_free(self):
        """Test free tier detection."""
        with patch('rate_limiter.g') as mock_g:
            mock_g.current_user = {'sub': 'user1', 'role': 'user'}
            assert get_user_tier() == 'free'

    def test_get_user_tier_anonymous(self):
        """Test anonymous tier detection."""
        with patch('rate_limiter.g') as mock_g:
            mock_g.current_user = None
            assert get_user_tier() == 'free'


class TestLimitKeyGeneration:
    """Test rate limit key generation."""

    def test_limit_key_with_user_id(self):
        """Test key generation with user ID."""
        with patch('rate_limiter.g') as mock_g:
            mock_g.current_user = {'sub': 'user123'}
            assert get_limit_key() == 'user:user123'

    def test_limit_key_without_user(self):
        """Test key generation without user (IP based)."""
        with patch('rate_limiter.g') as mock_g, \
             patch('rate_limiter.get_remote_address') as mock_ip:
            mock_g.current_user = None
            mock_ip.return_value = '192.168.1.1'
            assert get_limit_key() == 'ip:192.168.1.1'


class TestRateLimitConfiguration:
    """Test rate limit configuration."""

    def test_free_tier_limits(self):
        """Test free tier limits."""
        limits = RATE_LIMITS['free']
        assert limits['per_minute'] == '10/minute'
        assert limits['per_hour'] == '100/hour'
        assert limits['simulation_per_hour'] == '5/hour'

    def test_paid_tier_limits(self):
        """Test paid tier limits."""
        limits = RATE_LIMITS['paid']
        assert limits['per_minute'] == '100/minute'
        assert limits['simulation_per_hour'] == '50/hour'

    def test_admin_tier_limits(self):
        """Test admin tier limits."""
        limits = RATE_LIMITS['admin']
        assert limits['per_day'] == 'unlimited'
        assert limits['simulation_per_hour'] == 'unlimited'


class TestRateLimiterInit:
    """Test rate limiter initialization."""

    def test_init_without_app(self):
        """Test initialization without Flask app."""
        rl = RateLimiter()
        assert rl.limiter is None

    def test_init_with_app(self):
        """Test initialization with Flask app."""
        from flask import Flask
        app = Flask(__name__)
        rl = RateLimiter(app)
        assert rl.limiter is not None


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
