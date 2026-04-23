"""
Monitoring & Observability Module

Provides:
- Prometheus metrics export
- Structured logging
- Distributed tracing hooks
- Health checks
- Performance profiling
"""

import os
import time
import logging
import json
from functools import wraps
from typing import Dict, Any, Optional, Callable
from datetime import datetime
from flask import Flask, request, g
from prometheus_flask_exporter import PrometheusMetrics
from prometheus_client import Counter, Histogram, Gauge, Info
import threading

logger = logging.getLogger(__name__)


# Prometheus Metrics
SIMULATION_CREATED = Counter(
    'pm_simulation_created_total',
    'Total simulations created',
    ['user_tier', 'industry']
)

SIMULATION_COMPLETED = Counter(
    'pm_simulation_completed_total',
    'Total simulations completed',
    ['status', 'industry']
)

SIMULATION_DURATION = Histogram(
    'pm_simulation_duration_seconds',
    'Simulation duration in seconds',
    ['status'],
    buckets=[10, 30, 60, 120, 300, 600, 1800, 3600]
)

API_REQUESTS = Counter(
    'pm_api_requests_total',
    'Total API requests',
    ['method', 'endpoint', 'status_code']
)

API_LATENCY = Histogram(
    'pm_api_latency_seconds',
    'API request latency',
    ['method', 'endpoint'],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

ACTIVE_SIMULATIONS = Gauge(
    'pm_active_simulations',
    'Currently active simulations',
    ['status']
)

LLM_REQUESTS = Counter(
    'pm_llm_requests_total',
    'LLM API requests',
    ['provider', 'status']
)

LLM_COST = Counter(
    'pm_llm_cost_usd',
    'LLM API cost in USD',
    ['provider']
)

LLM_LATENCY = Histogram(
    'pm_llm_latency_seconds',
    'LLM API latency',
    ['provider'],
    buckets=[0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0]
)

DB_CONNECTIONS = Gauge(
    'pm_db_connections',
    'Database connection pool size'
)

CACHE_HIT_RATE = Gauge(
    'pm_cache_hit_rate',
    'Cache hit rate percentage'
)

APP_INFO = Info(
    'pm_app',
    'Application information'
)


class StructuredLogger:
    """
    Structured JSON logger for centralized logging.

    Outputs logs in JSON format compatible with ELK/Loki/Grafana.
    """

    def __init__(self, service_name: str = 'pm-simulator'):
        self.service_name = service_name
        self.logger = logging.getLogger(service_name)

    def _log(self, level: str, message: str, **kwargs):
        """Create structured log entry."""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'level': level.upper(),
            'service': self.service_name,
            'message': message,
            'thread_id': threading.current_thread().ident,
            **kwargs
        }

        # Add request context if available
        if hasattr(g, 'request_id'):
            log_entry['request_id'] = g.request_id
        if hasattr(g, 'current_user'):
            log_entry['user_id'] = g.current_user.get('sub')

        self.logger.log(
            getattr(logging, level.upper()),
            json.dumps(log_entry)
        )

    def debug(self, message: str, **kwargs):
        self._log('debug', message, **kwargs)

    def info(self, message: str, **kwargs):
        self._log('info', message, **kwargs)

    def warning(self, message: str, **kwargs):
        self._log('warning', message, **kwargs)

    def error(self, message: str, **kwargs):
        self._log('error', message, **kwargs)

    def critical(self, message: str, **kwargs):
        self._log('critical', message, **kwargs)


# Singleton structured logger
structured_logger = StructuredLogger()


class MetricsCollector:
    """
    Collects and exposes application metrics.
    """

    def __init__(self, app: Optional[Flask] = None):
        self.app = app
        self.metrics = None

        if app:
            self.init_app(app)

    def init_app(self, app: Flask):
        """Initialize metrics with Flask app."""
        # Initialize Prometheus exporter
        self.metrics = PrometheusMetrics(app)

        # Set static info
        APP_INFO.info({
            'version': '2.0.0',
            'environment': os.getenv('FLASK_ENV', 'production'),
            'python_version': os.sys.version.split()[0]
        })

        # Add before/after request handlers
        @app.before_request
        def before_request():
            g.request_start_time = time.time()
            g.request_id = os.urandom(8).hex()

        @app.after_request
        def after_request(response):
            # Calculate latency
            if hasattr(g, 'request_start_time'):
                latency = time.time() - g.request_start_time

                # Record metrics
                endpoint = request.endpoint or 'unknown'
                method = request.method
                status_code = response.status_code

                API_REQUESTS.labels(
                    method=method,
                    endpoint=endpoint,
                    status_code=status_code
                ).inc()

                API_LATENCY.labels(
                    method=method,
                    endpoint=endpoint
                ).observe(latency)

                # Log slow requests
                if latency > 1.0:
                    structured_logger.warning(
                        'Slow request detected',
                        endpoint=endpoint,
                        method=method,
                        latency_seconds=latency,
                        status_code=status_code
                    )

            return response

        logger.info("Metrics collector initialized")

    def record_simulation_created(self, user_tier: str, industry: str):
        """Record simulation creation."""
        SIMULATION_CREATED.labels(
            user_tier=user_tier,
            industry=industry
        ).inc()

    def record_simulation_completed(self, status: str, industry: str, duration: float):
        """Record simulation completion."""
        SIMULATION_COMPLETED.labels(
            status=status,
            industry=industry
        ).inc()

        SIMULATION_DURATION.labels(
            status=status
        ).observe(duration)

    def update_active_simulations(self, status: str, count: int):
        """Update active simulation gauge."""
        ACTIVE_SIMULATIONS.labels(status=status).set(count)

    def record_llm_request(self, provider: str, status: str, cost: float = 0.0, latency: float = 0.0):
        """Record LLM API request."""
        LLM_REQUESTS.labels(provider=provider, status=status).inc()
        LLM_COST.labels(provider=provider).inc(cost)
        LLM_LATENCY.labels(provider=provider).observe(latency)

    def update_db_connections(self, count: int):
        """Update database connection gauge."""
        DB_CONNECTIONS.set(count)


# Singleton metrics collector
metrics_collector = MetricsCollector()


def monitor_endpoint(f: Callable) -> Callable:
    """
    Decorator to monitor endpoint performance.

    Usage:
        @app.route('/api/simulation')
        @monitor_endpoint
        def create_simulation():
            ...
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        start_time = time.time()
        endpoint = request.endpoint
        method = request.method

        try:
            result = f(*args, **kwargs)
            status = 'success'
            return result
        except Exception as e:
            status = 'error'
            structured_logger.error(
                'Endpoint error',
                endpoint=endpoint,
                method=method,
                error=str(e)
            )
            raise
        finally:
            duration = time.time() - start_time
            structured_logger.info(
                'Endpoint completed',
                endpoint=endpoint,
                method=method,
                duration_seconds=duration,
                status=status
            )

    return decorated


class HealthChecker:
    """
    Health check manager for dependencies.
    """

    def __init__(self):
        self.checks: Dict[str, Callable] = {}

    def register_check(self, name: str, check_func: Callable):
        """Register a health check."""
        self.checks[name] = check_func

    def run_checks(self) -> Dict[str, Any]:
        """Run all health checks."""
        results = {}
        overall_status = 'healthy'

        for name, check_func in self.checks.items():
            try:
                result = check_func()
                results[name] = {
                    'status': 'healthy' if result else 'unhealthy',
                    'details': result if isinstance(result, dict) else {}
                }
                if not result:
                    overall_status = 'degraded'
            except Exception as e:
                results[name] = {
                    'status': 'unhealthy',
                    'error': str(e)
                }
                overall_status = 'unhealthy'

        return {
            'status': overall_status,
            'checks': results,
            'timestamp': datetime.utcnow().isoformat()
        }


# Singleton health checker
health_checker = HealthChecker()


def init_monitoring(app: Flask):
    """Initialize monitoring with Flask app."""
    # Initialize metrics
    metrics_collector.init_app(app)

    # Register health checks
    health_checker.register_check('api', lambda: {'status': 'ok'})

    # Add health check endpoint
    @app.route('/api/health/detailed')
    def detailed_health():
        return health_checker.run_checks()

    # Register database health check
    def db_health_check():
        try:
            # This would check actual DB connection
            return {'connected': True, 'pool_size': 10}
        except Exception as e:
            return {'connected': False, 'error': str(e)}

    health_checker.register_check('database', db_health_check)

    # Configure structured logging
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('%(message)s'))
    structured_logger.logger.addHandler(handler)
    structured_logger.logger.setLevel(logging.INFO)

    structured_logger.info('Monitoring initialized')
    logger.info('Monitoring initialized')


def log_simulation_event(sim_id: str, event: str, **kwargs):
    """Log simulation event."""
    structured_logger.info(
        f'Simulation {event}',
        simulation_id=sim_id,
        event=event,
        **kwargs
    )


def log_api_event(endpoint: str, method: str, status_code: int, **kwargs):
    """Log API event."""
    structured_logger.info(
        'API request',
        endpoint=endpoint,
        method=method,
        status_code=status_code,
        **kwargs
    )


def log_llm_event(provider: str, model: str, tokens: int, cost: float, **kwargs):
    """Log LLM API event."""
    structured_logger.info(
        'LLM request',
        provider=provider,
        model=model,
        tokens=tokens,
        cost_usd=cost,
        **kwargs
    )
    metrics_collector.record_llm_request(provider, 'success', cost)


# Grafana dashboard configuration
GRAFANA_DASHBOARD = {
    "dashboard": {
        "title": "PM Simulator Metrics",
        "panels": [
            {
                "title": "API Request Rate",
                "targets": [
                    {
                        "expr": "rate(pm_api_requests_total[5m])",
                        "legendFormat": "{{method}} {{endpoint}}"
                    }
                ]
            },
            {
                "title": "API Latency (p99)",
                "targets": [
                    {
                        "expr": "histogram_quantile(0.99, rate(pm_api_latency_seconds_bucket[5m]))",
                        "legendFormat": "p99"
                    }
                ]
            },
            {
                "title": "Active Simulations",
                "targets": [
                    {
                        "expr": "pm_active_simulations",
                        "legendFormat": "{{status}}"
                    }
                ]
            },
            {
                "title": "LLM Cost",
                "targets": [
                    {
                        "expr": "rate(pm_llm_cost_usd[1h])",
                        "legendFormat": "{{provider}}"
                    }
                ]
            }
        ]
    }
}


def get_grafana_dashboard() -> Dict:
    """Get Grafana dashboard configuration."""
    return GRAFANA_DASHBOARD
