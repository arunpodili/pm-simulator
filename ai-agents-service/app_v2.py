"""
AI Agents Service v2.0 - Production-Ready PM Simulator
With Streaming, Field Mapping, Async Jobs, Validation, and Security
"""

import os
import sys
from datetime import datetime
from flask import Flask, request, jsonify, Response, stream_with_context, g
from flask_cors import CORS
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Import simulation components
from simulation.simulation_engine import SimulationEngine
from simulation.models import SimulationConfig
from simulation.llm_simulation_engine import LLMSimulationEngine, HybridSimulationEngine

# Import new modules
from streaming import init_streaming, streaming_bp
from field_mapper import map_user_brief
from validation import validate_simulation_results

# Import security modules
try:
    from auth_middleware import (
        require_auth, require_role, require_owner_or_admin,
        handle_login, handle_logout, handle_refresh, get_auth_token
    )
    AUTH_AVAILABLE = True
except ImportError:
    AUTH_AVAILABLE = False
    logger.warning("Authentication module not available")

try:
    from rate_limiter import limiter, api_limit, simulation_limit
    RATE_LIMIT_AVAILABLE = True
except ImportError:
    RATE_LIMIT_AVAILABLE = False
    logger.warning("Rate limiting module not available")

try:
    from cleanup import cleanup_manager, init_cleanup
    CLEANUP_AVAILABLE = True
except ImportError:
    CLEANUP_AVAILABLE = False
    logger.warning("Cleanup module not available")

try:
    from cache import cache, cache_manager, cache_5m, cache_1h, get_cache_stats
    CACHE_AVAILABLE = True
except ImportError:
    CACHE_AVAILABLE = False
    logger.warning("Cache module not available")

# Import Celery tasks (optional - if Redis is available)
try:
    from tasks import run_simulation_task, get_task_info, revoke_task
    CELERY_AVAILABLE = True
except ImportError:
    CELERY_AVAILABLE = False
    logger.warning("Celery not available. Running in synchronous mode.")

app = Flask(__name__)

# Initialize compression
from response_compression import init_compression
init_compression(app)

CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('ALLOWED_ORIGINS', '*').split(','),
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Authorization", "Content-Type"]
    }
})

# Initialize rate limiter
if RATE_LIMIT_AVAILABLE:
    limiter.init_app(app)
    logger.info("Rate limiting enabled")

# Simulation storage
active_simulations = {}
simulation_results = {}
simulation_engine = SimulationEngine()
llm_simulation_engine = LLMSimulationEngine()
hybrid_simulation_engine = HybridSimulationEngine()

# Initialize cleanup manager
if CLEANUP_AVAILABLE:
    init_cleanup(app, active_simulations, simulation_results)
    logger.info("Cleanup manager initialized")

# Initialize streaming module (with auth wrapper)
init_streaming(app, SimulationEngine(), {})
app.register_blueprint(streaming_bp)

# Register v2 API blueprints
from api_v2 import simulations as sim_v2
from api_v2.personas import personas_bp
from api_v2.change_logs import change_logs_bp
from api_v2.monitoring import monitoring_bp

app.register_blueprint(sim_v2.bp)
app.register_blueprint(personas_bp)
app.register_blueprint(change_logs_bp)
app.register_blueprint(monitoring_bp)

logger.info("Registered API v2 blueprints: simulations, personas, change_logs, monitoring")


def get_current_user_id():
    """Get current user ID from auth context or return anonymous."""
    if AUTH_AVAILABLE and hasattr(g, 'current_user'):
        return g.current_user.get('sub', 'anonymous')
    return 'anonymous'

# ============================================================================
# HEALTH & INFO ENDPOINTS
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Comprehensive health check"""
    return jsonify({
        'status': 'healthy',
        'version': '2.0.0',
        'features': {
            'streaming': True,
            'field_mapping': True,
            'validation': True,
            'async_tasks': CELERY_AVAILABLE,
            'llm_router': True
        },
        'active_simulations': len(active_simulations),
        'completed_simulations': len(simulation_results)
    })


# ============================================================================
# FIELD MAPPING ENDPOINTS
# ============================================================================

@app.route('/api/simulation/map-fields', methods=['POST'])
def map_fields():
    """
    Map user input fields to simulation parameters.

    Request Body:
        {
            "problem": "string",
            "target_user": "string",
            "pricing": "string",
            "competitors": "string",
            "success_metric": "string",
            "additional_context": "string"
        }

    Returns:
        Mapped configuration with confidence scores
    """
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        mapped_config = map_user_brief(data)

        return jsonify({
            'success': True,
            'mapped_config': mapped_config,
            'overall_confidence': round(
                sum([
                    mapped_config['pain_severity']['confidence'],
                    mapped_config['market_size']['confidence'],
                    mapped_config['price_sensitivity']['confidence'],
                    mapped_config['viral_potential']['confidence'],
                    mapped_config['competitive_pressure']['confidence'],
                    mapped_config['tech_adoption_speed']['confidence']
                ]) / 6 * 100, 1
            )
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/simulation/presets', methods=['POST'])
def get_presets():
    """
    Get simulation presets based on field mapping.

    Returns optimal persona count, simulation days, and marketing spend
    based on the mapped configuration.
    """
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        mapped = map_user_brief(data)

        # Calculate presets based on mapping
        market_size = mapped['market_size']['value']
        pain_severity = mapped['pain_severity']['value']
        competition = mapped['competitive_pressure']['value']

        # Market size multipliers
        multipliers = {
            'enterprise': 0.5,
            'mid_market': 1.0,
            'smb': 1.5,
            'consumer': 2.0
        }
        multiplier = multipliers.get(market_size, 1.0)

        # Base values
        persona_count = int(1000 * multiplier)
        simulation_days = 90
        marketing_spend = 'medium'

        # Adjust for pain severity
        if pain_severity > 0.8:
            simulation_days = 60
            marketing_spend = 'high'
        elif pain_severity < 0.4:
            simulation_days = 120
            marketing_spend = 'low'

        # Adjust for competition
        if competition > 0.7:
            marketing_spend = 'high'

        return jsonify({
            'success': True,
            'presets': {
                'persona_count': persona_count,
                'simulation_days': simulation_days,
                'marketing_spend_level': marketing_spend
            },
            'reasoning': {
                'market_size': f"{market_size} market detected",
                'pain_severity': f"Pain level: {pain_severity:.2f}",
                'competition': f"Competitive pressure: {competition:.2f}"
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint."""
    if not AUTH_AVAILABLE:
        return jsonify({'error': 'Authentication not available'}), 503
    return handle_login()


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """User logout endpoint."""
    if not AUTH_AVAILABLE:
        return jsonify({'error': 'Authentication not available'}), 503
    return handle_logout()


@app.route('/api/auth/refresh', methods=['POST'])
def refresh():
    """Token refresh endpoint."""
    if not AUTH_AVAILABLE:
        return jsonify({'error': 'Authentication not available'}), 503
    return handle_refresh()


# ============================================================================
# SIMULATION ENDPOINTS (Enhanced + Secured)
# ============================================================================

def auth_and_limit(f):
    """Combined decorator for auth and rate limiting."""
    if AUTH_AVAILABLE:
        f = require_auth(f)
    if RATE_LIMIT_AVAILABLE:
        f = api_limit(f)
    return f


@app.route('/api/simulation/create', methods=['POST'])
@auth_and_limit
def create_simulation():
    """Create a new simulation with enhanced validation"""
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        # Get current user ID
        user_id = get_current_user_id()

        # Build simulation config
        config = SimulationConfig(
            name=data.get('name', 'Untitled Simulation'),
            feature_description=data.get('feature_description', ''),
            target_industry=data.get('target_industry', 'saas'),
            persona_count=data.get('persona_count', 1000),
            simulation_days=data.get('simulation_days', 90),
            random_seed=data.get('random_seed'),
            features=data.get('features', []),
            pricing_tiers=data.get('pricing_tiers', []),
            pain_points_solved=data.get('pain_points_solved', []),
            differentiators=data.get('differentiators', []),
            market_saturation=data.get('market_saturation', 0.5),
            competitor_strength=data.get('competitor_strength', 0.5),
            marketing_spend_level=data.get('marketing_spend_level', 'medium')
        )

        # Create simulation ID
        import uuid
        sim_id = str(uuid.uuid4())[:8]

        # Store config with user_id
        active_simulations[sim_id] = {
            'config': config,
            'status': 'pending',
            'progress': 0,
            'created_at': datetime.now().isoformat(),
            'user_id': user_id,
            'has_streaming': True
        }

        # Register with cleanup manager
        if CLEANUP_AVAILABLE:
            cleanup_manager.register(sim_id, user_id, 'pending')

        logger.info(f"Simulation {sim_id} created by user {user_id}")

        return jsonify({
            'success': True,
            'simulation_id': sim_id,
            'status': 'pending',
            'streaming_available': True,
            'config': {
                'name': config.name,
                'persona_count': config.persona_count,
                'simulation_days': config.simulation_days
            }
        })

    except Exception as e:
        logger.error(f"Failed to create simulation: {e}")
        return jsonify({'error': 'Failed to create simulation'}), 500


@app.route('/api/simulation/<sim_id>/run', methods=['POST'])
@auth_and_limit
def run_simulation(sim_id):
    """Run simulation synchronously"""
    if sim_id not in active_simulations:
        return jsonify({'error': 'Simulation not found'}), 404

    sim_data = active_simulations[sim_id]

    # Check ownership
    if AUTH_AVAILABLE:
        error = require_owner_or_admin(sim_data.get('user_id', 'anonymous'))
        if error:
            return error

    config = sim_data['config']
    sim_data['status'] = 'running'

    # Update cleanup manager
    if CLEANUP_AVAILABLE:
        cleanup_manager.update_status(sim_id, 'running')

    try:
        result = simulation_engine.run_simulation(config)
        simulation_results[sim_id] = result
        sim_data['status'] = 'completed'
        sim_data['progress'] = 100

        # Update cleanup manager
        if CLEANUP_AVAILABLE:
            cleanup_manager.update_status(sim_id, 'completed', size_bytes=sys.getsizeof(result))

        return jsonify({
            'success': True,
            'simulation_id': sim_id,
            'status': 'completed',
            'summary': {
                'total_personas': result.final_metrics.get('total_personas', 0),
                'conversion_rate': result.final_metrics.get('conversion_rate', 0),
                'churn_rate': result.predicted_churn_rate,
                'nps': result.predicted_nps,
                'predicted_clv': result.predicted_clv
            }
        })

    except Exception as e:
        sim_data['status'] = 'failed'
        sim_data['error'] = 'Simulation failed'  # Sanitized
        logger.error(f"Simulation {sim_id} failed: {e}")
        return jsonify({'error': 'Simulation failed'}), 500


@app.route('/api/simulation/<sim_id>/run-async', methods=['POST'])
@auth_and_limit
def run_simulation_async(sim_id):
    """
    Run simulation asynchronously using Celery.

    Returns immediately with task ID. Check status via /api/tasks/{task_id}/status
    """
    if not CELERY_AVAILABLE:
        return jsonify({
            'error': 'Async tasks not available. Use /api/simulation/{id}/run instead'
        }), 503

    if sim_id not in active_simulations:
        return jsonify({'error': 'Simulation not found'}), 404

    sim_data = active_simulations[sim_id]

    # Check ownership
    if AUTH_AVAILABLE:
        error = require_owner_or_admin(sim_data.get('user_id', 'anonymous'))
        if error:
            return error

    config = sim_data['config']

    try:
        # Queue the task
        task = run_simulation_task.delay(sim_id, config.__dict__)

        sim_data['status'] = 'queued'
        sim_data['task_id'] = task.id

        if CLEANUP_AVAILABLE:
            cleanup_manager.update_status(sim_id, 'queued')

        return jsonify({
            'success': True,
            'simulation_id': sim_id,
            'task_id': task.id,
            'status': 'queued',
            'message': 'Simulation queued. Check status via /api/tasks/{task_id}/status'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# VALIDATION ENDPOINTS
# ============================================================================

@app.route('/api/simulation/<sim_id>/validate', methods=['POST'])
def validate_simulation(sim_id):
    """
    Validate simulation results against industry benchmarks.

    Returns confidence score and recommendations.
    """
    if sim_id not in simulation_results:
        return jsonify({'error': 'Simulation results not found'}), 404

    data = request.json or {}
    industry = data.get('industry', 'saas')

    try:
        result = simulation_results[sim_id]

        # Prepare results for validation
        results_for_validation = {
            'trial_to_paid': result.final_metrics.get('conversion_rate', 0),
            'monthly_churn': result.predicted_churn_rate,
            'nps': result.predicted_nps,
            'conversion_rate': result.final_metrics.get('conversion_rate', 0),
        }

        validation = validate_simulation_results(results_for_validation, industry)

        return jsonify({
            'success': True,
            'simulation_id': sim_id,
            'validation': validation
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/validation/benchmarks', methods=['GET'])
@cache_1h(key_prefix='benchmarks')
def get_benchmarks():
    """Get available industry benchmarks (cached for 1 hour)"""
    from validation import validator

    return jsonify({
        'industries': validator.get_available_industries(),
        'benchmarks': {
            industry: validator.get_industry_metrics(industry)
            for industry in validator.get_available_industries()
        }
    })


# ============================================================================
# TASK MANAGEMENT ENDPOINTS (Celery)
# ============================================================================

@app.route('/api/tasks/<task_id>/status', methods=['GET'])
def get_task_status_endpoint(task_id):
    """Get async task status"""
    if not CELERY_AVAILABLE:
        return jsonify({'error': 'Celery not available'}), 503

    try:
        status = get_task_info(task_id)
        if status:
            return jsonify(status)
        return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/tasks/<task_id>/revoke', methods=['POST'])
def revoke_task_endpoint(task_id):
    """Cancel a running task"""
    if not CELERY_AVAILABLE:
        return jsonify({'error': 'Celery not available'}), 503

    try:
        revoked = revoke_task(task_id, terminate=True)
        if revoked:
            return jsonify({'success': True, 'message': 'Task revoked'})
        return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/tasks/queue', methods=['GET'])
def get_queue_status():
    """Get Celery queue statistics"""
    if not CELERY_AVAILABLE:
        return jsonify({'error': 'Celery not available'}), 503

    try:
        from tasks import get_queue_stats
        stats = get_queue_stats()
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# ORIGINAL ENDPOINTS (Compatibility)
# ============================================================================

@app.route('/api/simulation/health', methods=['GET'])
def simulation_health():
    """Legacy health endpoint"""
    return jsonify({
        'status': 'healthy',
        'active_simulations': len(active_simulations),
        'completed_simulations': len(simulation_results),
        'version': '2.0.0'
    })


@app.route('/api/simulation/<sim_id>/status', methods=['GET'])
def get_simulation_status(sim_id):
    """Get simulation status"""
    if sim_id not in active_simulations:
        return jsonify({'error': 'Simulation not found'}), 404

    sim_data = active_simulations[sim_id]

    return jsonify({
        'simulation_id': sim_id,
        'status': sim_data['status'],
        'progress': sim_data.get('progress', 0),
        'created_at': sim_data['created_at'],
        'streaming_available': sim_data.get('has_streaming', True)
    })


@app.route('/api/simulation/<sim_id>/results', methods=['GET'])
def get_simulation_results(sim_id):
    """Get simulation results"""
    if sim_id not in simulation_results:
        if sim_id in active_simulations:
            return jsonify({
                'simulation_id': sim_id,
                'status': active_simulations[sim_id]['status'],
                'message': 'Simulation still running'
            })
        return jsonify({'error': 'Simulation results not found'}), 404

    result = simulation_results[sim_id]

    return jsonify({
        'simulation_id': sim_id,
        'config': {
            'name': result.config.name,
            'target_industry': result.config.target_industry,
            'persona_count': result.config.persona_count,
            'simulation_days': result.config.simulation_days
        },
        'final_metrics': result.final_metrics,
        'predictions': {
            'churn_rate': result.predicted_churn_rate,
            'nps': result.predicted_nps,
            'clv': result.predicted_clv
        },
        'adoption_curve': result.predicted_adoption_curve,
        'cohort_analysis': result.cohort_analysis,
        'timeline_sample': result.timeline[:30] if len(result.timeline) > 30 else result.timeline
    })


# ============================================================================
# ENHANCED SIMULATION ENDPOINTS (For 3D Visualization)
# ============================================================================

@app.route('/api/simulation/<sim_id>/stream')
def stream_simulation(sim_id):
    """Stream simulation progress via Server-Sent Events"""
    if sim_id not in active_simulations:
        return jsonify({'error': 'Simulation not found'}), 404

    sim_data = active_simulations[sim_id]

    def generate():
        import time
        import json

        # Send initial progress
        yield f"data: {json.dumps({'type': 'progress', 'data': {'progress': sim_data.get('progress', 0)}, 'timestamp': datetime.now().isoformat()})}\n\n"

        # Poll for progress updates
        last_progress = -1
        max_wait = 300  # 5 minutes timeout
        waited = 0

        while waited < max_wait:
            current_progress = sim_data.get('progress', 0)
            current_status = sim_data.get('status', 'pending')

            if current_progress != last_progress:
                yield f"data: {json.dumps({'type': 'progress', 'data': {'progress': current_progress}, 'timestamp': datetime.now().isoformat()})}\n\n"
                last_progress = current_progress

            if current_status == 'completed':
                # Send full results
                if sim_id in simulation_results:
                    result = simulation_results[sim_id]
                    yield f"data: {json.dumps({'type': 'complete', 'data': _serialize_result(result, sim_id), 'timestamp': datetime.now().isoformat()})}\n\n"
                break

            if current_status == 'failed':
                yield f"data: {json.dumps({'type': 'error', 'data': {'message': sim_data.get('error', 'Simulation failed')}, 'timestamp': datetime.now().isoformat()})}\n\n"
                break

            time.sleep(1)
            waited += 1

        # Final complete event if not already sent
        if waited >= max_wait:
            yield f"data: {json.dumps({'type': 'error', 'data': {'message': 'Simulation timeout'}, 'timestamp': datetime.now().isoformat()})}\n\n"

    return Response(
        generate(),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        }
    )


def _serialize_result(result, sim_id):
    """Serialize simulation result for JSON response"""
    return {
        'id': sim_id,
        'config': {
            'name': result.config.name,
            'target_industry': result.config.target_industry,
            'persona_count': result.config.persona_count,
            'simulation_days': result.config.simulation_days
        },
        'status': 'completed',
        'progress': 100,
        'personas': [
            {
                'id': p.id,
                'name': getattr(p, 'name', f'Agent {i}'),
                'demographics': {
                    'age': getattr(p.demographics, 'age', 30),
                    'location': getattr(p.demographics, 'location', 'Unknown'),
                    'income_level': getattr(p.demographics, 'income_level', 'medium'),
                    'education': getattr(p.demographics, 'education', 'college'),
                    'occupation': getattr(p.demographics, 'occupation', 'Professional'),
                    'tech_savviness': getattr(p.demographics, 'tech_savviness', 5),
                    'industry': getattr(p.demographics, 'industry', 'saas')
                },
                'behavioral': {
                    'archetype': getattr(p.behavioral, 'archetype', 'EARLY_MAJORITY').name,
                    'price_sensitivity': getattr(p.behavioral, 'price_sensitivity', 5),
                    'feature_preference': getattr(p.behavioral, 'feature_preference', 'simplicity'),
                    'decision_making_style': getattr(p.behavioral, 'decision_making_style', 'analytical'),
                    'pain_tolerance': getattr(p.behavioral, 'pain_tolerance', 5)
                },
                'context': {
                    'current_pain_level': getattr(p.context, 'current_pain_level', 5),
                    'alternatives_used': getattr(p.context, 'alternatives_used', []),
                    'budget_constraints': getattr(p.context, 'budget_constraints', None),
                    'decision_making_power': getattr(p.context, 'decision_making_power', 'individual'),
                    'timeline_urgency': getattr(p.context, 'timeline_urgency', 'medium')
                },
                'current_state': getattr(p, 'current_state', 'unaware'),
                'satisfaction_score': getattr(p, 'satisfaction_score', 5.0),
                'engagement_level': getattr(p, 'engagement_level', 5.0),
                'actions_taken': getattr(p, 'actions_taken', [])
            }
            for i, p in enumerate(result.personas)
        ],
        'social_graph': {},  # Will be populated if available
        'timeline': [
            {
                'day': t.get('day', i),
                'events': t.get('events', []),
                'metrics': t.get('metrics', {})
            }
            for i, t in enumerate(result.timeline)
        ],
        'final_metrics': result.final_metrics,
        'predicted_adoption_curve': result.predicted_adoption_curve,
        'predicted_churn_rate': result.predicted_churn_rate,
        'predicted_nps': result.predicted_nps,
        'predicted_clv': result.predicted_clv,
        'cohort_analysis': result.cohort_analysis,
        'insights': []
    }


@app.route('/api/simulation/<sim_id>/agent/<agent_id>/journey', methods=['GET'])
def get_agent_journey(sim_id, agent_id):
    """Get the journey/timeline of a specific agent"""
    if sim_id not in simulation_results:
        return jsonify({'error': 'Simulation results not found'}), 404

    result = simulation_results[sim_id]

    # Find the agent
    agent = None
    for persona in result.personas:
        if str(getattr(persona, 'id', '')) == agent_id:
            agent = persona
            break

    if not agent:
        return jsonify({'error': 'Agent not found'}), 404

    # Extract journey from timeline
    journey = []
    for day_data in result.timeline:
        for event in day_data.get('events', []):
            if event.get('agent_id') == agent_id:
                journey.append({
                    'day': day_data.get('day', 0),
                    'action': event.get('action', 'UNKNOWN'),
                    'reason': f"State changed from {event.get('previous_state')} to {event.get('current_state')}",
                    'satisfaction_change': round(event.get('satisfaction', 5) - agent.satisfaction_score, 2)
                })

    return jsonify(journey)


@app.route('/api/simulation/<sim_id>/export', methods=['GET'])
def export_simulation(sim_id):
    """Export simulation results in various formats"""
    if sim_id not in simulation_results:
        return jsonify({'error': 'Simulation results not found'}), 404

    result = simulation_results[sim_id]
    format_type = request.args.get('format', 'json')

    if format_type == 'json':
        return jsonify(_serialize_result(result, sim_id))
    elif format_type == 'csv':
        # Generate CSV
        import csv
        import io

        output = io.StringIO()
        writer = csv.writer(output)

        # Header
        writer.writerow([
            'agent_id', 'name', 'age', 'location', 'occupation',
            'tech_savviness', 'archetype', 'price_sensitivity',
            'current_state', 'satisfaction_score', 'engagement_level'
        ])

        # Data
        for persona in result.personas:
            writer.writerow([
                getattr(persona, 'id', ''),
                getattr(persona, 'name', ''),
                getattr(persona.demographics, 'age', ''),
                getattr(persona.demographics, 'location', ''),
                getattr(persona.demographics, 'occupation', ''),
                getattr(persona.demographics, 'tech_savviness', ''),
                getattr(persona.behavioral, 'archetype', ''),
                getattr(persona.behavioral, 'price_sensitivity', ''),
                getattr(persona, 'current_state', ''),
                getattr(persona, 'satisfaction_score', ''),
                getattr(persona, 'engagement_level', '')
            ])

        output.seek(0)
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': f'attachment; filename=simulation_{sim_id}.csv'}
        )
    else:
        return jsonify({'error': 'Unsupported format'}), 400


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("=" * 60)
    print("PM Simulator v2.0 - Production Server")
    print("=" * 60)
    print(f"\nFeatures enabled:")
    print(f"  - Streaming API: Yes")
    print(f"  - Field Mapping: Yes")
    print(f"  - Validation: Yes")
    print(f"  - Async Tasks: {CELERY_AVAILABLE}")
    print(f"\nEndpoints:")
    print(f"  - Health:    http://localhost:5001/api/health")
    print(f"  - Streaming: http://localhost:5001/api/simulation/{{id}}/stream")
    print(f"  - Mapping:   http://localhost:5001/api/simulation/map-fields")
    print(f"  - Validate:  http://localhost:5001/api/simulation/{{id}}/validate")
    print("=" * 60)

    app.run(host='0.0.0.0', port=5001, debug=True)
