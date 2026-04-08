"""
Metrics and Analytics Collection for PM Simulator
Tracks application performance, business metrics, and user engagement
"""
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import json
import logging
from functools import wraps
import time

logger = logging.getLogger(__name__)


class MetricsCollector:
    """Collect and aggregate application metrics"""

    def __init__(self):
        self.metrics_store: Dict[str, Any] = {
            'counters': {},
            'gauges': {},
            'histograms': {},
            'timers': {}
        }
        self.business_metrics: Dict[str, Any] = {
            'simulations_run': 0,
            'simulations_completed': 0,
            'exports_generated': {
                'pdf': 0,
                'docx': 0,
                'notion': 0,
                'google_docs': 0
            },
            'personas_created': 0,
            'active_users': 0,
            'api_calls': 0
        }

    def increment_counter(self, name: str, value: int = 1, tags: Optional[Dict[str, str]] = None):
        """Increment a counter metric"""
        key = f"{name}:{json.dumps(tags or {}, sort_keys=True)}"
        if key not in self.metrics_store['counters']:
            self.metrics_store['counters'][key] = 0
        self.metrics_store['counters'][key] += value

    def record_gauge(self, name: str, value: float, tags: Optional[Dict[str, str]] = None):
        """Record a gauge metric (point-in-time value)"""
        key = f"{name}:{json.dumps(tags or {}, sort_keys=True)}"
        self.metrics_store['gauges'][key] = {
            'value': value,
            'timestamp': datetime.utcnow().isoformat()
        }

    def record_histogram(self, name: str, value: float, tags: Optional[Dict[str, str]] = None):
        """Record a histogram metric (distribution)"""
        key = f"{name}:{json.dumps(tags or {}, sort_keys=True)}"
        if key not in self.metrics_store['histograms']:
            self.metrics_store['histograms'][key] = []
        self.metrics_store['histograms'][key].append({
            'value': value,
            'timestamp': datetime.utcnow().isoformat()
        })

    def record_timer(self, name: str, duration_ms: float, tags: Optional[Dict[str, str]] = None):
        """Record a timer metric (operation duration)"""
        key = f"{name}:{json.dumps(tags or {}, sort_keys=True)}"
        if key not in self.metrics_store['timers']:
            self.metrics_store['timers'][key] = []
        self.metrics_store['timers'][key].append({
            'duration_ms': duration_ms,
            'timestamp': datetime.utcnow().isoformat()
        })

    def track_business_event(self, event_type: str, details: Optional[Dict[str, Any]] = None):
        """Track business-level events"""
        if event_type == 'simulation_run':
            self.business_metrics['simulations_run'] += 1
        elif event_type == 'simulation_completed':
            self.business_metrics['simulations_completed'] += 1
        elif event_type.startswith('export_'):
            export_type = event_type.replace('export_', '')
            if export_type in self.business_metrics['exports_generated']:
                self.business_metrics['exports_generated'][export_type] += 1
        elif event_type == 'persona_created':
            self.business_metrics['personas_created'] += 1
        elif event_type == 'api_call':
            self.business_metrics['api_calls'] += 1

        logger.info(f"Business event: {event_type}", extra={'details': details or {}})

    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get summary of all metrics"""
        return {
            'application': {
                'counters': self.metrics_store['counters'],
                'gauges': self.metrics_store['gauges'],
                'timers': self._compute_timer_stats()
            },
            'business': self.business_metrics,
            'timestamp': datetime.utcnow().isoformat()
        }

    def _compute_timer_stats(self) -> Dict[str, Any]:
        """Compute statistics for timers"""
        stats = {}
        for key, values in self.metrics_store['timers'].items():
            if values:
                durations = [v['duration_ms'] for v in values[-100:]]  # Last 100 samples
                stats[key] = {
                    'count': len(durations),
                    'avg_ms': sum(durations) / len(durations),
                    'min_ms': min(durations),
                    'max_ms': max(durations),
                    'p95_ms': sorted(durations)[int(len(durations) * 0.95)] if len(durations) > 1 else durations[0]
                }
        return stats


# Global metrics collector instance
metrics_collector = MetricsCollector()


def track_performance(metric_name: str, tags: Optional[Dict[str, str]] = None):
    """Decorator to track function performance"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration_ms = (time.time() - start_time) * 1000
                metrics_collector.record_timer(metric_name, duration_ms, tags)
                metrics_collector.increment_counter(f"{metric_name}_success", tags=tags)
                return result
            except Exception as e:
                duration_ms = (time.time() - start_time) * 1000
                metrics_collector.record_timer(metric_name, duration_ms, tags)
                metrics_collector.increment_counter(f"{metric_name}_error", tags={**(tags or {}), 'error': type(e).__name__})
                raise
        return wrapper
    return decorator


class HealthChecker:
    """System health checks and monitoring"""

    def __init__(self):
        self.checks: Dict[str, Any] = {}

    def register_check(self, name: str, check_func, description: str = ""):
        """Register a health check"""
        self.checks[name] = {
            'func': check_func,
            'description': description,
            'last_result': None,
            'last_run': None
        }

    def run_checks(self) -> Dict[str, Any]:
        """Run all health checks"""
        results = {
            'status': 'healthy',
            'checks': {},
            'timestamp': datetime.utcnow().isoformat()
        }

        for name, check in self.checks.items():
            try:
                start_time = time.time()
                check_result = check['func']()
                duration_ms = (time.time() - start_time) * 1000

                self.checks[name]['last_result'] = check_result
                self.checks[name]['last_run'] = datetime.utcnow().isoformat()

                results['checks'][name] = {
                    'status': 'pass' if check_result else 'fail',
                    'duration_ms': round(duration_ms, 2),
                    'description': check['description']
                }

                if not check_result:
                    results['status'] = 'unhealthy'

            except Exception as e:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(e),
                    'description': check['description']
                }
                results['status'] = 'unhealthy'

        return results


# Global health checker instance
health_checker = HealthChecker()
