"""
Streaming Module - Server-Sent Events for Real-Time Simulation Progress

Provides real-time updates during simulation execution via SSE.
"""

import json
import time
from typing import Generator, Dict, Any, Optional
from datetime import datetime
from flask import Response, stream_with_context, Blueprint
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Blueprint for streaming routes
streaming_bp = Blueprint('streaming', __name__)


class SimulationStreamer:
    """
    Manages real-time streaming of simulation progress.

    Uses Server-Sent Events (SSE) to push updates to connected clients
    as the simulation progresses day-by-day.
    """

    def __init__(self, simulation_engine, active_simulations: dict):
        """
        Initialize streamer with simulation engine and state storage.

        Args:
            simulation_engine: The SimulationEngine instance
            active_simulations: Shared dict tracking simulation state
        """
        self.simulation_engine = simulation_engine
        self.active_simulations = active_simulations

    def generate_stream(self, sim_id: str, config: Any) -> Generator[str, None, None]:
        """
        Generate SSE stream for simulation progress.

        Yields SSE-formatted data events with simulation updates.
        Format: data: {json}\n\n

        Args:
            sim_id: Unique simulation identifier
            config: SimulationConfig instance

        Yields:
            SSE formatted strings with progress updates
        """
        try:
            total_days = config.simulation_days

            # Send initial event
            yield self._format_event({
                'type': 'init',
                'simulation_id': sim_id,
                'total_days': total_days,
                'message': 'Simulation started'
            })

            # Run simulation with progress callback
            day_results = []

            for day in range(total_days):
                # Process single day
                day_data = self._process_day(day, config)
                day_results.append(day_data)

                # Calculate progress
                progress = ((day + 1) / total_days) * 100

                # Prepare update payload
                update = {
                    'type': 'progress',
                    'day': day + 1,
                    'total_days': total_days,
                    'progress': round(progress, 2),
                    'metrics': self._extract_day_metrics(day_data),
                    'timestamp': datetime.now().isoformat()
                }

                # Update active simulation state
                if sim_id in self.active_simulations:
                    self.active_simulations[sim_id]['progress'] = progress
                    self.active_simulations[sim_id]['current_day'] = day + 1

                # Yield SSE event
                yield self._format_event(update)

                # Small delay for streaming effect (optional)
                time.sleep(0.05)

            # Send completion event
            final_metrics = self._calculate_final_metrics(day_results)
            yield self._format_event({
                'type': 'complete',
                'simulation_id': sim_id,
                'progress': 100,
                'final_metrics': final_metrics,
                'timestamp': datetime.now().isoformat()
            })

            # Store results
            if sim_id in self.active_simulations:
                self.active_simulations[sim_id]['status'] = 'completed'
                self.active_simulations[sim_id]['results'] = final_metrics

        except Exception as e:
            logger.error(f"Streaming error for {sim_id}: {str(e)}")
            yield self._format_event({
                'type': 'error',
                'simulation_id': sim_id,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })

            if sim_id in self.active_simulations:
                self.active_simulations[sim_id]['status'] = 'failed'
                self.active_simulations[sim_id]['error'] = str(e)

    def _format_event(self, data: Dict[str, Any]) -> str:
        """
        Format data as SSE event.

        Args:
            data: Dictionary to serialize

        Returns:
            SSE formatted string
        """
        return f"data: {json.dumps(data)}\n\n"

    def _process_day(self, day: int, config: Any) -> Dict[str, Any]:
        """
        Process a single simulation day.

        This is a simplified version - in production, this would call
        the actual simulation engine's day processing logic.

        Args:
            day: Day number (0-indexed)
            config: Simulation configuration

        Returns:
            Day processing results
        """
        # Simulate day processing
        # In real implementation, this calls simulation_engine.process_day()

        import random
        random.seed(config.random_seed + day if config.random_seed else None)

        return {
            'day': day,
            'new_users': random.randint(10, 50),
            'churned': random.randint(0, 5),
            'conversions': random.randint(1, 10),
            'revenue': random.uniform(100, 500),
            'satisfaction': random.uniform(0.6, 0.9)
        }

    def _extract_day_metrics(self, day_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract key metrics from day results.

        Args:
            day_data: Raw day processing data

        Returns:
            Simplified metrics for frontend display
        """
        return {
            'new_users': day_data.get('new_users', 0),
            'active_users': day_data.get('new_users', 0) - day_data.get('churned', 0),
            'daily_revenue': round(day_data.get('revenue', 0), 2),
            'satisfaction': round(day_data.get('satisfaction', 0.7), 2)
        }

    def _calculate_final_metrics(self, day_results: list) -> Dict[str, Any]:
        """
        Calculate final metrics from all days.

        Args:
            day_results: List of daily results

        Returns:
            Aggregated final metrics
        """
        total_new = sum(d.get('new_users', 0) for d in day_results)
        total_churned = sum(d.get('churned', 0) for d in day_results)
        total_revenue = sum(d.get('revenue', 0) for d in day_results)
        avg_satisfaction = sum(d.get('satisfaction', 0) for d in day_results) / len(day_results) if day_results else 0

        return {
            'total_users_acquired': total_new,
            'total_users_churned': total_churned,
            'net_user_growth': total_new - total_churned,
            'total_revenue': round(total_revenue, 2),
            'average_satisfaction': round(avg_satisfaction, 2),
            'conversion_rate': round((total_new / max(day_results[0].get('total_users', 1000), 1)) * 100, 2) if day_results else 0
        }


class StreamManager:
    """
    Manages multiple concurrent simulation streams.

    Handles connection tracking and cleanup for SSE connections.
    """

    def __init__(self):
        self.active_streams: Dict[str, Any] = {}

    def register_stream(self, sim_id: str, generator: Generator):
        """Register a new stream for tracking."""
        self.active_streams[sim_id] = {
            'generator': generator,
            'started_at': datetime.now().isoformat(),
            'status': 'active'
        }

    def cancel_stream(self, sim_id: str) -> bool:
        """
        Cancel an active stream.

        Args:
            sim_id: Simulation ID to cancel

        Returns:
            True if cancelled, False if not found
        """
        if sim_id in self.active_streams:
            self.active_streams[sim_id]['status'] = 'cancelled'
            return True
        return False

    def get_stream_status(self, sim_id: str) -> Optional[Dict[str, Any]]:
        """Get status of a stream."""
        return self.active_streams.get(sim_id)


# Global stream manager instance
stream_manager = StreamManager()


# Flask routes
@streaming_bp.route('/api/simulation/<sim_id>/stream')
def stream_simulation_endpoint(sim_id: str):
    """
    SSE endpoint for streaming simulation progress.

    Connects to this endpoint to receive real-time updates.

    Returns:
        Response with text/event-stream mimetype
    """
    from flask import current_app

    # Get simulation data from app context
    active_sims = current_app.config.get('ACTIVE_SIMULATIONS', {})

    if sim_id not in active_sims:
        return Response(
            f"data: {json.dumps({'type': 'error', 'error': 'Simulation not found'})}\n\n",
            mimetype='text/event-stream',
            status=404
        )

    sim_data = active_sims[sim_id]
    config = sim_data.get('config')

    if not config:
        return Response(
            f"data: {json.dumps({'type': 'error', 'error': 'No configuration found'})}\n\n",
            mimetype='text/event-stream',
            status=400
        )

    # Create streamer instance
    from simulation.simulation_engine import SimulationEngine
    engine = SimulationEngine()
    streamer = SimulationStreamer(engine, active_sims)

    # Generate and return SSE stream
    def generate():
        for event in streamer.generate_stream(sim_id, config):
            # Check if cancelled
            stream_status = stream_manager.get_stream_status(sim_id)
            if stream_status and stream_status.get('status') == 'cancelled':
                yield streamer._format_event({
                    'type': 'cancelled',
                    'simulation_id': sim_id
                })
                break
            yield event

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',  # Disable nginx buffering
            'Connection': 'keep-alive',
        }
    )


@streaming_bp.route('/api/simulation/<sim_id>/cancel', methods=['POST'])
def cancel_simulation(sim_id: str):
    """
    Cancel a running simulation.

    Args:
        sim_id: Simulation ID to cancel

    Returns:
        JSON confirmation
    """
    cancelled = stream_manager.cancel_stream(sim_id)

    if cancelled:
        return jsonify({
            'success': True,
            'message': f'Simulation {sim_id} cancelled'
        })
    else:
        return jsonify({
            'success': False,
            'error': 'Simulation not found or already completed'
        }), 404


@streaming_bp.route('/api/stream/health')
def stream_health():
    """Health check for streaming service."""
    return jsonify({
        'status': 'healthy',
        'active_streams': len(stream_manager.active_streams),
        'service': 'sse-streaming'
    })


# Utility functions for integration
def init_streaming(app, simulation_engine, active_simulations):
    """
    Initialize streaming module with Flask app.

    Args:
        app: Flask application instance
        simulation_engine: SimulationEngine instance
        active_simulations: Shared active simulations dict
    """
    app.config['SIMULATION_ENGINE'] = simulation_engine
    app.config['ACTIVE_SIMULATIONS'] = active_simulations
    app.register_blueprint(streaming_bp)
    logger.info("Streaming module initialized")
