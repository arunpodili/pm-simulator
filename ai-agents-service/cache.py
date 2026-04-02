"""
Caching Module - Redis-based Caching Layer

Provides:
- Function result caching with TTL
- Cache invalidation
- Cache warming
- Statistics
"""

import os
import json
import hashlib
import functools
from typing import Optional, Callable, Any, Dict
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

# Try to import Redis, fallback to in-memory cache
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logger.warning("Redis not available, using in-memory cache")


class CacheManager:
    """
    Generic caching manager with Redis or in-memory fallback.
    """

    def __init__(self, redis_url: Optional[str] = None):
        self.redis_url = redis_url or os.getenv('REDIS_URL', 'redis://localhost:6379/0')
        self.redis_client = None
        self.memory_cache: Dict[str, Dict[str, Any]] = {}
        self.stats = {'hits': 0, 'misses': 0, 'invalidations': 0}

        if REDIS_AVAILABLE:
            try:
                self.redis_client = redis.from_url(self.redis_url, decode_responses=True)
                self.redis_client.ping()
                logger.info("Redis cache connected")
            except Exception as e:
                logger.warning(f"Redis connection failed: {e}, using in-memory cache")
                self.redis_client = None

    def _generate_key(self, func_name: str, args: tuple, kwargs: dict) -> str:
        """Generate cache key from function arguments."""
        key_data = json.dumps({'func': func_name, 'args': args, 'kwargs': kwargs}, sort_keys=True)
        return f"cache:{func_name}:{hashlib.md5(key_data.encode()).hexdigest()}"

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        try:
            if self.redis_client:
                value = self.redis_client.get(key)
                if value:
                    self.stats['hits'] += 1
                    return json.loads(value)
            else:
                if key in self.memory_cache:
                    entry = self.memory_cache[key]
                    if entry['expires'] > self._now():
                        self.stats['hits'] += 1
                        return entry['value']
                    else:
                        del self.memory_cache[key]

            self.stats['misses'] += 1
            return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None

    def set(self, key: str, value: Any, ttl: int = 300):
        """Set value in cache with TTL (seconds)."""
        try:
            if self.redis_client:
                self.redis_client.setex(key, ttl, json.dumps(value))
            else:
                self.memory_cache[key] = {
                    'value': value,
                    'expires': self._now() + ttl
                }
        except Exception as e:
            logger.error(f"Cache set error: {e}")

    def delete(self, key: str):
        """Delete key from cache."""
        try:
            if self.redis_client:
                self.redis_client.delete(key)
            else:
                self.memory_cache.pop(key, None)
            self.stats['invalidations'] += 1
        except Exception as e:
            logger.error(f"Cache delete error: {e}")

    def delete_pattern(self, pattern: str):
        """Delete keys matching pattern."""
        try:
            if self.redis_client:
                keys = self.redis_client.keys(pattern)
                if keys:
                    self.redis_client.delete(*keys)
            else:
                keys_to_delete = [k for k in self.memory_cache.keys() if pattern in k]
                for k in keys_to_delete:
                    del self.memory_cache[k]
        except Exception as e:
            logger.error(f"Cache delete pattern error: {e}")

    def clear(self):
        """Clear all cache."""
        try:
            if self.redis_client:
                self.redis_client.flushdb()
            else:
                self.memory_cache.clear()
            self.stats['invalidations'] += 1
        except Exception as e:
            logger.error(f"Cache clear error: {e}")

    def get_stats(self) -> Dict[str, int]:
        """Get cache statistics."""
        total = self.stats['hits'] + self.stats['misses']
        hit_rate = (self.stats['hits'] / total * 100) if total > 0 else 0

        return {
            **self.stats,
            'total_requests': total,
            'hit_rate': round(hit_rate, 2),
            'memory_size': len(self.memory_cache) if not self.redis_client else None
        }

    def _now(self) -> int:
        """Get current timestamp."""
        import time
        return int(time.time())


# Global cache instance
cache_manager = CacheManager()


def cache(ttl: int = 300, key_prefix: Optional[str] = None):
    """
    Decorator to cache function results.

    Usage:
        @cache(ttl=600)
        def expensive_function(arg1, arg2):
            return expensive_calculation()

        @cache(ttl=300, key_prefix='benchmarks')
        def get_benchmarks(industry):
            return load_from_db(industry)
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            func_name = key_prefix or func.__name__
            cache_key = cache_manager._generate_key(func_name, args, kwargs)

            # Try to get from cache
            cached_value = cache_manager.get(cache_key)
            if cached_value is not None:
                logger.debug(f"Cache hit for {func_name}")
                return cached_value

            # Execute function
            result = func(*args, **kwargs)

            # Store in cache
            cache_manager.set(cache_key, result, ttl)
            logger.debug(f"Cache miss for {func_name}, stored result")

            return result

        # Attach cache management functions
        wrapper.cache_key = lambda *args, **kwargs: cache_manager._generate_key(
            key_prefix or func.__name__, args, kwargs
        )
        wrapper.invalidate = lambda *args, **kwargs: cache_manager.delete(
            cache_manager._generate_key(key_prefix or func.__name__, args, kwargs)
        )
        wrapper.invalidate_all = lambda: cache_manager.delete_pattern(f"cache:{key_prefix or func.__name__}:*")

        return wrapper
    return decorator


def invalidate_cache(pattern: str):
    """Invalidate cache by pattern."""
    cache_manager.delete_pattern(pattern)
    logger.info(f"Invalidated cache pattern: {pattern}")


def get_cache_stats() -> Dict[str, Any]:
    """Get cache statistics."""
    return cache_manager.get_stats()


# Convenience cache instances with different TTLs
cache_1m = functools.partial(cache, ttl=60)
cache_5m = functools.partial(cache, ttl=300)
cache_15m = functools.partial(cache, ttl=900)
cache_1h = functools.partial(cache, ttl=3600)
cache_1d = functools.partial(cache, ttl=86400)
