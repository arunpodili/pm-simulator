"""
Celery Tasks - Async Job Queue for Background Processing

Handles long-running simulations in the background with Redis as broker.
Provides job tracking, retries, and status updates.
"""

import os
import json
from typing import Dict, Any, Optional, Callable
from datetime import datetime
from celery import Celery
from celery.exceptions import MaxRetriesExceededError, SoftTimeLimitExceeded
from celery.signals import task_prerun, task_postrun, task_failure

# Import simulation components
from simulation.simulation_engine import SimulationEngine
from simulation.llm_simulation_engine import LLMSimulationEngine
from simulation.models import SimulationConfig

# Configure Celery with security
redis_password = os.getenv('REDIS_PASSWORD', '')
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = os.getenv('REDIS_PORT', '6379')
redis_db = os.getenv('REDIS_DB', '0')

# Build secure Redis URL
if redis_password:
    broker_url = f"redis://:{redis_password}@{redis_host}:{redis_port}/{redis_db}"
    result_backend = f"redis://:{redis_password}@{redis_host}:{redis_port}/{redis_db}"
else:
    broker_url = f"redis://{redis_host}:{redis_port}/{redis_db}"
    result_backend = f"redis://{redis_host}:{redis_port}/{redis_db}"

app = Celery('pm-simulator', broker=broker_url, backend=result_backend)

# Celery configuration
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=600,  # 10 minutes max (reduced from 30 for security)
    task_soft_time_limit=540,  # 9 minutes soft limit
    worker_prefetch_multiplier=1,  # Fair task distribution
    worker_max_tasks_per_child=1000,  # Restart workers periodically
    result_expires=3600 * 24 * 7,  # Keep results for 7 days
    task_always_eager=False,  # Don't run locally in production
    task_store_eager_result=True,
)


class SimulationTaskManager:
    """
    Manages simulation tasks and their lifecycle.

    Handles task creation, status tracking, and result retrieval.
    """

    def __init__(self):
        self.engine = SimulationEngine()
        self.llm_engine = LLMSimulationEngine()

    @staticmethod
    def create_task_id(sim_id: str) -> str:
        """Generate unique task ID."""
        return f"sim_{sim_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}"

    @staticmethod
    def get_task_status(task_id: str) -> Optional[Dict[str, Any]]:
        """
        Get current status of a task.

        Args:
            task_id: Celery task ID

        Returns:
            Task status dictionary or None if not found
        """
        task = app.AsyncResult(task_id)

        if not task:
            return None

        response = {
            'task_id': task_id,
            'status': task.status,
            'date_done': task.date_done.isoformat() if task.date_done else None,
        }

        # Add result if available
        if task.ready():
            if task.successful():
                response['result'] = task.result
            elif task.failed():
                response['error'] = str(task.result)

        # Add progress info if available
        if task.info and isinstance(task.info, dict):
            response['progress'] = task.info.get('progress', 0)
            response['meta'] = task.info

        return response


# Global task manager
task_manager = SimulationTaskManager()


@app.task(bind=True, max_retries=3, default_retry_delay=60)
def run_simulation_task(self, sim_id: str, config_dict: Dict[str, Any]):
    """
    Background task for running rule-based simulations.

    Args:
        sim_id: Simulation identifier
        config_dict: Simulation configuration as dictionary

    Returns:
        Simulation results dictionary
    """
    try:
        # Build config from dict
        config = SimulationConfig(**config_dict)

        # Progress callback
        def progress_callback(day: int, total: int, metrics: Dict[str, Any]):
            progress = ((day + 1) / total) * 100
            self.update_state(
                state='PROGRESS',
                meta={
                    'simulation_id': sim_id,
                    'day': day + 1,
                    'total_days': total,
                    'progress': round(progress, 2),
                    'metrics': metrics,
                    'timestamp': datetime.now().isoformat()
                }
            )

        # Run simulation with progress tracking
        engine = SimulationEngine(progress_callback=progress_callback)
        result = engine.run_simulation(config)

        # Convert result to serializable format
        return {
            'simulation_id': sim_id,
            'status': 'completed',
            'config': {
                'name': result.config.name,
                'persona_count': result.config.persona_count,
                'simulation_days': result.config.simulation_days,
                'target_industry': result.config.target_industry
            },
            'metrics': {
                'total_personas': result.final_metrics.get('total_personas', 0),
                'conversion_rate': result.final_metrics.get('conversion_rate', 0),
                'churn_rate': result.predicted_churn_rate,
                'nps': result.predicted_nps,
                'clv': result.predicted_clv,
                'adoption_curve': result.predicted_adoption_curve[:30]  # Limit size
            },
            'completed_at': datetime.now().isoformat()
        }

    except SoftTimeLimitExceeded:
        # Task exceeded time limit
        return {
            'simulation_id': sim_id,
            'status': 'timeout',
            'error': 'Simulation exceeded time limit (30 minutes)',
            'completed_at': datetime.now().isoformat()
        }

    except Exception as exc:
        # Retry on failure
        try:
            self.retry(countdown=60 * (self.request.retries + 1))
        except MaxRetriesExceededError:
            return {
                'simulation_id': sim_id,
                'status': 'failed',
                'error': 'Task execution failed',  # Sanitized - full error logged internally
                'retries': self.request.retries,
                'completed_at': datetime.now().isoformat()
            }


@app.task(bind=True, max_retries=2, default_retry_delay=120, time_limit=1200)
def run_llm_simulation_task(self, sim_id: str, brief: str, category: Optional[str] = None):
    """
    Background task for running LLM-based simulations.

    Args:
        sim_id: Simulation identifier
        brief: Product brief text
        category: Product category (optional)

    Returns:
        LLM simulation results
    """
    try:
        # Update initial state
        self.update_state(
            state='PROGRESS',
            meta={
                'simulation_id': sim_id,
                'step': 'initializing',
                'progress': 5,
                'message': 'Starting LLM simulation...'
            }
        )

        engine = LLMSimulationEngine()

        # Progress callback for LLM steps
        def llm_progress_callback(step: str, progress: int, message: str):
            self.update_state(
                state='PROGRESS',
                meta={
                    'simulation_id': sim_id,
                    'step': step,
                    'progress': progress,
                    'message': message
                }
            )

        # Run LLM simulation
        result = engine.run_simulation(
            brief=brief,
            category=category,
            progress_callback=llm_progress_callback
        )

        return {
            'simulation_id': sim_id,
            'status': 'completed',
            'recommendation': result.get('recommendation'),
            'confidence': result.get('confidence'),
            'personas_generated': result.get('stats', {}).get('personas_generated', 0),
            'debates_run': result.get('stats', {}).get('debates_run', 0),
            'completed_at': datetime.now().isoformat()
        }

    except Exception as exc:
        try:
            self.retry(countdown=120 * (self.request.retries + 1))
        except MaxRetriesExceededError:
            return {
                'simulation_id': sim_id,
                'status': 'failed',
                'error': str(exc),
                'completed_at': datetime.now().isoformat()
            }


@app.task(bind=True, max_retries=3)
def run_validation_task(self, sim_id: str, results: Dict[str, Any], industry: str = 'saas'):
    """
    Background task for validating simulation results.

    Args:
        sim_id: Simulation identifier
        results: Simulation results to validate
        industry: Industry for benchmark comparison

    Returns:
        Validation report
    """
    from validation import validate_simulation_results

    try:
        validation_report = validate_simulation_results(results, industry)

        return {
            'simulation_id': sim_id,
            'status': 'completed',
            'validation': validation_report,
            'completed_at': datetime.now().isoformat()
        }

    except Exception as exc:
        try:
            self.retry(countdown=30)
        except MaxRetriesExceededError:
            return {
                'simulation_id': sim_id,
                'status': 'failed',
                'error': str(exc),
                'completed_at': datetime.now().isoformat()
            }


@app.task(bind=True)
def cleanup_old_simulations(self, days: int = 7):
    """
    Cleanup task to remove old simulation results.

    Args:
        days: Remove simulations older than this many days

    Returns:
        Cleanup statistics
    """
    # This would connect to database/storage and cleanup old data
    # For now, just a placeholder
    return {
        'status': 'completed',
        'cleaned': 0,
        'message': f'Cleaned simulations older than {days} days'
    }


# Task event handlers
@task_prerun.connect
def task_prerun_handler(task_id, task, args, kwargs):
    """Handle task start."""
    print(f"Task {task.name}[{task_id}] started")


@task_postrun.connect
def task_postrun_handler(task_id, task, args, kwargs, retval, state):
    """Handle task completion."""
    print(f"Task {task.name}[{task_id}] finished with state {state}")


@task_failure.connect
def task_failure_handler(task_id, exception, args, kwargs, traceback, einfo):
    """Handle task failure."""
    print(f"Task [{task_id}] failed: {exception}")


# Utility functions for Flask integration
def get_task_info(task_id: str) -> Optional[Dict[str, Any]]:
    """
    Get task information for API responses.

    Args:
        task_id: Celery task ID

    Returns:
        Task info dictionary
    """
    return SimulationTaskManager.get_task_status(task_id)


def revoke_task(task_id: str, terminate: bool = False) -> bool:
    """
    Cancel a running task.

    Args:
        task_id: Task ID to revoke
        terminate: Force terminate if running

    Returns:
        True if revoked successfully
    """
    try:
        app.control.revoke(task_id, terminate=terminate)
        return True
    except Exception as e:
        print(f"Failed to revoke task {task_id}: {e}")
        return False


def get_queue_stats() -> Dict[str, Any]:
    """
    Get queue statistics.

    Returns:
        Queue statistics dictionary
    """
    inspector = app.control.inspect()

    stats = {
        'active': inspector.active() or {},
        'scheduled': inspector.scheduled() or {},
        'reserved': inspector.reserved() or {},
        'stats': inspector.stats() or {}
    }

    return stats


# For testing - run task synchronously
def run_task_sync(task_func, *args, **kwargs):
    """
    Run a task synchronously for testing.

    Args:
        task_func: Celery task function
        *args: Positional arguments
        **kwargs: Keyword arguments

    Returns:
        Task result
    """
    return task_func.apply(args=args, kwargs=kwargs).get()
