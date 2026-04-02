"""
Memory Cleanup Module - TTL-based Resource Management

Provides:
- Automatic cleanup of old simulations
- Memory usage monitoring
- Scheduled cleanup tasks
- Emergency cleanup endpoints
"""

import os
import time
import threading
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Set
from dataclasses import dataclass, field
import logging

logger = logging.getLogger(__name__)

# Configuration
SIMULATION_TTL_HOURS = int(os.getenv('SIMULATION_TTL_HOURS', '24'))
CLEANUP_INTERVAL_MINUTES = int(os.getenv('CLEANUP_INTERVAL_MINUTES', '30'))
MAX_SIMULATIONS_PER_USER = int(os.getenv('MAX_SIMULATIONS_PER_USER', '10'))


@dataclass
class SimulationEntry:
    """Tracked simulation entry with metadata."""
    sim_id: str
    user_id: str
    created_at: datetime
    last_accessed: datetime
    status: str
    size_bytes: int = 0

    def is_expired(self, ttl_hours: int = SIMULATION_TTL_HOURS) -> bool:
        """Check if simulation has expired."""
        expiry = self.created_at + timedelta(hours=ttl_hours)
        return datetime.utcnow() > expiry

    def age_hours(self) -> float:
        """Get age in hours."""
        return (datetime.utcnow() - self.created_at).total_seconds() / 3600


class CleanupManager:
    """
    Manages automatic cleanup of simulation data.

    Features:
    - TTL-based expiration
    - Per-user limits
    - Background cleanup thread
    - Emergency cleanup
    """

    def __init__(self):
        self.entries: Dict[str, SimulationEntry] = {}
        self._lock = threading.Lock()
        self._cleanup_thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()
        self._cleanup_count = 0

    def register(self, sim_id: str, user_id: str, status: str = 'pending'):
        """
        Register a new simulation for tracking.

        Args:
            sim_id: Simulation identifier
            user_id: User who created the simulation
            status: Initial status
        """
        with self._lock:
            now = datetime.utcnow()
            self.entries[sim_id] = SimulationEntry(
                sim_id=sim_id,
                user_id=user_id,
                created_at=now,
                last_accessed=now,
                status=status,
                size_bytes=0
            )

            logger.info(f"Registered simulation {sim_id} for cleanup tracking")

            # Check per-user limits
            self._enforce_user_limit(user_id)

    def update_status(self, sim_id: str, status: str, size_bytes: Optional[int] = None):
        """Update simulation status and size."""
        with self._lock:
            entry = self.entries.get(sim_id)
            if entry:
                entry.status = status
                entry.last_accessed = datetime.utcnow()
                if size_bytes is not None:
                    entry.size_bytes = size_bytes

    def touch(self, sim_id: str):
        """Update last accessed time."""
        with self._lock:
            entry = self.entries.get(sim_id)
            if entry:
                entry.last_accessed = datetime.utcnow()

    def _enforce_user_limit(self, user_id: str):
        """
        Enforce maximum simulations per user.
        Removes oldest simulations for user.
        """
        user_entries = [
            e for e in self.entries.values()
            if e.user_id == user_id
        ]

        if len(user_entries) > MAX_SIMULATIONS_PER_USER:
            # Sort by creation time, oldest first
            user_entries.sort(key=lambda e: e.created_at)

            # Remove oldest entries
            to_remove = user_entries[:-MAX_SIMULATIONS_PER_USER]
            for entry in to_remove:
                logger.warning(f"Removing old simulation {entry.sim_id} due to user limit")
                self._remove_simulation(entry.sim_id)

    def _remove_simulation(self, sim_id: str) -> bool:
        """
        Remove a simulation from all storage.

        Args:
            sim_id: Simulation to remove

        Returns:
            True if removed successfully
        """
        try:
            # Remove from entries tracking
            if sim_id in self.entries:
                del self.entries[sim_id]

            # Note: Actual removal from active_simulations and simulation_results
            # should be done by the caller (app_v2.py) after calling this method

            logger.info(f"Cleaned up simulation: {sim_id}")
            self._cleanup_count += 1
            return True

        except Exception as e:
            logger.error(f"Failed to cleanup simulation {sim_id}: {e}")
            return False

    def cleanup_expired(self) -> Dict[str, Any]:
        """
        Run cleanup of expired simulations.

        Returns:
            Statistics about cleanup
        """
        removed = []
        errors = []

        with self._lock:
            expired = [
                e for e in self.entries.values()
                if e.is_expired()
            ]

            for entry in expired:
                if self._remove_simulation(entry.sim_id):
                    removed.append(entry.sim_id)
                else:
                    errors.append(entry.sim_id)

        stats = {
            'expired_found': len(expired),
            'removed': len(removed),
            'errors': len(errors),
            'total_remaining': len(self.entries),
            'simulation_ids': removed
        }

        if removed:
            logger.info(f"Cleanup completed: {stats}")

        return stats

    def cleanup_by_age(self, max_age_hours: int) -> Dict[str, Any]:
        """
        Cleanup simulations older than specified hours.

        Args:
            max_age_hours: Maximum age in hours

        Returns:
            Cleanup statistics
        """
        removed = []

        with self._lock:
            old = [
                e for e in self.entries.values()
                if e.age_hours() > max_age_hours
            ]

            for entry in old:
                if self._remove_simulation(entry.sim_id):
                    removed.append(entry.sim_id)

        return {
            'older_than_hours': max_age_hours,
            'found': len(old),
            'removed': len(removed)
        }

    def emergency_cleanup(self, keep_recent: int = 100) -> Dict[str, Any]:
        """
        Emergency cleanup - keep only most recent simulations.

        Args:
            keep_recent: Number of recent simulations to keep

        Returns:
            Cleanup statistics
        """
        removed = []

        with self._lock:
            # Sort by last accessed, most recent first
            sorted_entries = sorted(
                self.entries.values(),
                key=lambda e: e.last_accessed,
                reverse=True
            )

            # Keep only recent ones
            to_remove = sorted_entries[keep_recent:]
            for entry in to_remove:
                if self._remove_simulation(entry.sim_id):
                    removed.append(entry.sim_id)

        return {
            'emergency': True,
            'kept': keep_recent,
            'removed': len(removed)
        }

    def get_stats(self) -> Dict[str, Any]:
        """Get cleanup statistics."""
        with self._lock:
            total = len(self.entries)
            by_status = {}
            by_user: Dict[str, int] = {}
            total_size = 0

            for entry in self.entries.values():
                by_status[entry.status] = by_status.get(entry.status, 0) + 1
                by_user[entry.user_id] = by_user.get(entry.user_id, 0) + 1
                total_size += entry.size_bytes

            expired_count = sum(1 for e in self.entries.values() if e.is_expired())

            return {
                'total_simulations': total,
                'expired_count': expired_count,
                'by_status': by_status,
                'by_user': by_user,
                'total_size_mb': round(total_size / (1024 * 1024), 2),
                'cleanup_count': self._cleanup_count,
                'ttl_hours': SIMULATION_TTL_HOURS
            }

    def start_background_cleanup(self):
        """Start background cleanup thread."""
        if self._cleanup_thread and self._cleanup_thread.is_alive():
            logger.warning("Background cleanup already running")
            return

        self._stop_event.clear()
        self._cleanup_thread = threading.Thread(
            target=self._cleanup_loop,
            daemon=True
        )
        self._cleanup_thread.start()
        logger.info("Background cleanup started")

    def stop_background_cleanup(self):
        """Stop background cleanup thread."""
        self._stop_event.set()
        if self._cleanup_thread:
            self._cleanup_thread.join(timeout=5)
        logger.info("Background cleanup stopped")

    def _cleanup_loop(self):
        """Background cleanup loop."""
        interval_seconds = CLEANUP_INTERVAL_MINUTES * 60

        while not self._stop_event.is_set():
            try:
                stats = self.cleanup_expired()
                if stats['removed'] > 0:
                    logger.info(f"Background cleanup: removed {stats['removed']} expired simulations")
            except Exception as e:
                logger.error(f"Background cleanup error: {e}")

            # Wait for interval or until stopped
            self._stop_event.wait(interval_seconds)


# Singleton instance
cleanup_manager = CleanupManager()


def init_cleanup(app, active_simulations: dict, simulation_results: dict):
    """
    Initialize cleanup manager with Flask app.

    Args:
        app: Flask application
        active_simulations: Reference to active simulations dict
        simulation_results: Reference to results dict
    """
    # Monkey-patch cleanup manager to also clean the app dicts
    original_remove = cleanup_manager._remove_simulation

    def patched_remove(sim_id: str) -> bool:
        # Remove from app dicts
        if sim_id in active_simulations:
            del active_simulations[sim_id]
        if sim_id in simulation_results:
            del simulation_results[sim_id]

        # Call original
        return original_remove(sim_id)

    cleanup_manager._remove_simulation = patched_remove

    # Start background cleanup
    cleanup_manager.start_background_cleanup()

    # Register cleanup endpoint
    from flask import g
    from auth_middleware import require_auth, require_role

    @app.route('/api/admin/cleanup', methods=['POST'])
    @require_auth
    @require_role('admin')
    def admin_cleanup():
        """Admin endpoint to trigger cleanup."""
        data = request.get_json() or {}
        action = data.get('action', 'expired')

        if action == 'expired':
            stats = cleanup_manager.cleanup_expired()
        elif action == 'emergency':
            stats = cleanup_manager.emergency_cleanup(
                keep_recent=data.get('keep_recent', 100)
            )
        elif action == 'by_age':
            hours = data.get('hours', 24)
            stats = cleanup_manager.cleanup_by_age(hours)
        else:
            return {'error': 'Unknown action'}, 400

        return {'success': True, 'stats': stats}

    @app.route('/api/admin/cleanup/stats', methods=['GET'])
    @require_auth
    @require_role('admin')
    def cleanup_stats():
        """Get cleanup statistics."""
        return cleanup_manager.get_stats()

    logger.info("Cleanup module initialized")


# Import at end to avoid circular imports
from flask import request
