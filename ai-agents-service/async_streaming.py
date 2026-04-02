"""
Async Streaming Module - Non-blocking SSE with asyncio

Provides:
- Async/await based streaming
- WebSocket support
- Non-blocking simulation processing
- Concurrent stream management
"""

import asyncio
import json
from typing import Dict, Any, Optional, Callable, Set
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class AsyncSimulationStreamer:
    """
    Async simulation streamer using asyncio for non-blocking operation.
    """

    def __init__(self):
        self.active_streams: Dict[str, Dict[str, Any]] = {}
        self._lock = asyncio.Lock()

    async def process_day_async(
        self,
        day: int,
        config: Any,
        progress_callback: Optional[Callable] = None
    ) -> Dict[str, Any]:
        """
        Process a single simulation day asynchronously.

        Args:
            day: Day number
            config: Simulation configuration
            progress_callback: Optional callback for progress

        Returns:
            Day processing results
        """
        # Use asyncio to avoid blocking
        await asyncio.sleep(0.01)  # Simulate async work

        # Generate deterministic random data using day as seed
        import random
        rng = random.Random(config.random_seed + day if config.random_seed else day)

        result = {
            'day': day,
            'new_users': rng.randint(10, 50),
            'churned': rng.randint(0, 5),
            'conversions': rng.randint(1, 10),
            'revenue': rng.uniform(100, 500),
            'satisfaction': rng.uniform(0.6, 0.9)
        }

        if progress_callback:
            await progress_callback(day, result)

        return result

    async def run_simulation_stream(
        self,
        sim_id: str,
        config: Any,
        message_queue: asyncio.Queue
    ):
        """
        Run simulation and send updates to message queue.

        Args:
            sim_id: Simulation ID
            config: Simulation configuration
            message_queue: Async queue for messages
        """
        try:
            total_days = config.simulation_days

            # Send init message
            await message_queue.put({
                'type': 'init',
                'simulation_id': sim_id,
                'total_days': total_days,
                'message': 'Simulation started'
            })

            # Process days asynchronously
            for day in range(total_days):
                # Check if cancelled
                async with self._lock:
                    if sim_id in self.active_streams:
                        if self.active_streams[sim_id].get('cancelled'):
                            await message_queue.put({
                                'type': 'cancelled',
                                'simulation_id': sim_id
                            })
                            return

                # Process day
                day_data = await self.process_day_async(day, config)
                progress = ((day + 1) / total_days) * 100

                # Send update
                await message_queue.put({
                    'type': 'progress',
                    'day': day + 1,
                    'total_days': total_days,
                    'progress': round(progress, 2),
                    'metrics': {
                        'new_users': day_data['new_users'],
                        'active_users': day_data['new_users'] - day_data['churned'],
                        'daily_revenue': round(day_data['revenue'], 2),
                        'satisfaction': round(day_data['satisfaction'], 2)
                    },
                    'timestamp': datetime.now().isoformat()
                })

            # Send completion
            await message_queue.put({
                'type': 'complete',
                'simulation_id': sim_id,
                'progress': 100,
                'final_metrics': {
                    'total_users_acquired': sum(d.get('new_users', 0) for d in [day_data]),
                    'average_satisfaction': round(day_data['satisfaction'], 2)
                },
                'timestamp': datetime.now().isoformat()
            })

        except Exception as e:
            logger.error(f"Streaming error for {sim_id}: {e}")
            await message_queue.put({
                'type': 'error',
                'simulation_id': sim_id,
                'error': 'Simulation failed',
                'timestamp': datetime.now().isoformat()
            })

    async def register_stream(self, sim_id: str):
        """Register a new stream."""
        async with self._lock:
            self.active_streams[sim_id] = {
                'started_at': datetime.now().isoformat(),
                'cancelled': False
            }

    async def cancel_stream(self, sim_id: str) -> bool:
        """Cancel an active stream."""
        async with self._lock:
            if sim_id in self.active_streams:
                self.active_streams[sim_id]['cancelled'] = True
                return True
            return False


class WebSocketManager:
    """
    WebSocket connection manager for real-time updates.
    """

    def __init__(self):
        self.connections: Dict[str, Set] = {}  # sim_id -> set of websockets
        self._lock = asyncio.Lock()

    async def connect(self, sim_id: str, websocket):
        """Register new WebSocket connection."""
        async with self._lock:
            if sim_id not in self.connections:
                self.connections[sim_id] = set()
            self.connections[sim_id].add(websocket)
            logger.info(f"WebSocket connected for {sim_id}. Total: {len(self.connections[sim_id])}")

    async def disconnect(self, sim_id: str, websocket):
        """Remove WebSocket connection."""
        async with self._lock:
            if sim_id in self.connections:
                self.connections[sim_id].discard(websocket)
                if not self.connections[sim_id]:
                    del self.connections[sim_id]

    async def broadcast(self, sim_id: str, message: Dict[str, Any]):
        """Broadcast message to all connections for a simulation."""
        if sim_id not in self.connections:
            return

        disconnected = set()
        for ws in self.connections[sim_id]:
            try:
                await ws.send(json.dumps(message))
            except Exception:
                disconnected.add(ws)

        # Clean up disconnected clients
        async with self._lock:
            for ws in disconnected:
                self.connections[sim_id].discard(ws)


# Singleton instances
async_streamer = AsyncSimulationStreamer()
ws_manager = WebSocketManager()


# SSE Generator using asyncio
async def sse_event_generator(sim_id: str, message_queue: asyncio.Queue):
    """
    Async generator for SSE events.

    Usage with Flask:
        @app.route('/stream')
        def stream():
            queue = asyncio.Queue()
            return Response(
                async_stream_events(sim_id, queue),
                mimetype='text/event-stream'
            )
    """
    while True:
        try:
            # Wait for message with timeout
            message = await asyncio.wait_for(
                message_queue.get(),
                timeout=30.0
            )

            # Format as SSE
            yield f"data: {json.dumps(message)}\n\n"

            # Stop on completion or error
            if message.get('type') in ['complete', 'error', 'cancelled']:
                break

        except asyncio.TimeoutError:
            # Send keepalive
            yield f"data: {json.dumps({'type': 'keepalive'})}\n\n"
            continue

        except Exception as e:
            logger.error(f"SSE generator error: {e}")
            break


# Background task runner
def run_async_task(coro):
    """
    Run async coroutine in background thread.

    Usage:
        run_async_task(streamer.run_simulation_stream(sim_id, config, queue))
    """
    def run():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(coro)
        finally:
            loop.close()

    import threading
    thread = threading.Thread(target=run, daemon=True)
    thread.start()
    return thread
