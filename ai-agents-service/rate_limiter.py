"""
Rate Limiting Module - Flask-Limiter Integration

Provides:
- Global rate limiting for all endpoints
- Tier-based limits (free/paid users)
- Redis-backed storage for distributed deployments
- Custom error responses
"""

import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

# Rate limit configuration
RATE_LIMIT_STORAGE_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

# Tier-based limits
RATE_LIMITS = {
    'free': {
        'per_minute': '10/minute',
        'per_hour': '100/hour',
        'per_day': '500/day',
        'simulation_per_hour': '5/hour'
    },
    'paid': {
        'per_minute': '100/minute',
        'per_hour': '1000/hour',
        'per_day': '5000/day',
        'simulation_per_hour': '50/hour'
    },
    'admin': {
        'per_minute': '1000/minute',
        'per_hour': '10000/hour',
        'per_day': 'unlimited',
        'simulation_per_hour': 'unlimited'
    }
}


def get_user_tier() -> str:
    """
    Determine user's rate limit tier.

    Checks:
    1. Admin role from JWT
    2. Paid subscription status
    3. Default to free

    Returns:
        Tier name (free/paid/admin)
    """
    from flask import g

    # Check if we have auth context
    if hasattr(g, 'current_user'):
        role = g.current_user.get('role')
        if role == 'admin':
            return 'admin'

        # Check for paid status (would fetch from database)
        # For now, simple check
        if g.current_user.get('tier') == 'paid':
            return 'paid'

    return 'free'


def get_limit_key() -> str:
    """
    Generate rate limit key based on user identity.

    Returns:
        String key for rate limiting
    """
    from flask import g, request

    # Use user ID if authenticated
    if hasattr(g, 'current_user'):
        user_id = g.current_user.get('sub')
        if user_id:
            return f"user:{user_id}"

    # Fall back to IP address
    return f"ip:{get_remote_address()}"


class RateLimiter:
    """
    Custom rate limiter with tier-based limits.
    """

    def __init__(self, app=None):
        self.app = app
        self.limiter = None

        if app:
            self.init_app(app)

    def init_app(self, app):
        """Initialize rate limiter with Flask app."""

        # Configure limiter with Redis storage
        self.limiter = Limiter(
            app=app,
            key_func=get_limit_key,
            storage_uri=RATE_LIMIT_STORAGE_URL,
            storage_options={
                'socket_connect_timeout': 5,
                'socket_timeout': 5,
                'password': os.getenv('REDIS_PASSWORD')  # Add password support
            },
            default_limits=["10/minute"],  # Global default
            strategy='fixed-window',  # Fixed window algorithm
            enabled=not os.getenv('RATE_LIMIT_DISABLED'),  # Disable in tests
            headers_enabled=True,  # Add rate limit headers
            swallow_errors=True  # Don't crash on Redis errors
        )

        # Custom error handler
        @app.errorhandler(429)
        def rate_limit_handler(e):
            return {
                'error': 'Rate limit exceeded',
                'message': str(e.description),
                'retry_after': e.description.split('retry after ')[-1] if 'retry after' in str(e.description) else '60'
            }, 429

        logger.info("Rate limiter initialized")

    def limit(self, tier_limits: Dict[str, str] = None):
        """
        Decorator for endpoint-specific rate limits.

        Args:
            tier_limits: Dict mapping tier to limit string

        Usage:
            @app.route('/api/simulation')
            @limiter.limit({'free': '5/hour', 'paid': '50/hour'})
            def create_simulation():
                ...
        """
        if tier_limits is None:
            tier_limits = {}

        def decorator(f):
            # Get limit for current tier
            tier = get_user_tier()
            limit = tier_limits.get(tier, '10/minute')

            # Skip limit for admin unlimited
            if limit == 'unlimited':
                return f

            return self.limiter.limit(limit)(f)

        return decorator

    def exempt(self, f):
        """Mark endpoint as exempt from rate limiting."""
        return self.limiter.exempt(f)


# Singleton instance
limiter = RateLimiter()


def get_rate_limit_status() -> Dict[str, Any]:
    """
    Get current rate limit status for user.

    Returns:
        Dictionary with limit info
    """
    from flask import g

    tier = get_user_tier()
    limits = RATE_LIMITS.get(tier, RATE_LIMITS['free'])

    return {
        'tier': tier,
        'limits': limits,
        'key': get_limit_key()
    }


# Utility decorators

def simulation_limit(f):
    """
    Rate limit specifically for simulation endpoints.

    Free: 5/hour
    Paid: 50/hour
    Admin: unlimited
    """
    def wrapper(*args, **kwargs):
        from flask import g
        tier = get_user_tier()

        limits = {
            'free': '5/hour',
            'paid': '50/hour',
            'admin': None
        }

        limit = limits.get(tier)
        if limit:
            return limiter.limiter.limit(limit)(f)(*args, **kwargs)

        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


def api_limit(f):
    """
    General API rate limit.

    Free: 10/minute
    Paid: 100/minute
    Admin: 1000/minute
    """
    def wrapper(*args, **kwargs):
        tier = get_user_tier()

        limits = {
            'free': '10/minute',
            'paid': '100/minute',
            'admin': '1000/minute'
        }

        limit = limits.get(tier, '10/minute')
        return limiter.limiter.limit(limit)(f)(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper
