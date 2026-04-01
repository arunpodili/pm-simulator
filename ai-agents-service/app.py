"""
AI Agents Service - User Simulation Engine (MiroFish-inspired)
Lightweight Flask backend for PM Simulator user simulations

Supports:
1. Rule-based simulation (1000 personas, statistical, ~5 min)
2. LLM-driven simulation (50 agents, qualitative debates, ~15 min)
3. Hybrid mode (both)
"""

import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import simulation components
from simulation.simulation_engine import SimulationEngine
from simulation.models import SimulationConfig
from simulation.llm_simulation_engine import LLMSimulationEngine, HybridSimulationEngine

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Simulation storage
active_simulations = {}
simulation_results = {}
simulation_engine = SimulationEngine()
llm_simulation_engine = LLMSimulationEngine()
hybrid_simulation_engine = HybridSimulationEngine()

# ============================================================================
# USER SIMULATION API ENDPOINTS (MiroFish Integration)
# ============================================================================

@app.route('/api/simulation/health', methods=['GET'])
def simulation_health():
    """Health check for simulation service"""
    return jsonify({
        'status': 'healthy',
        'active_simulations': len(active_simulations),
        'completed_simulations': len(simulation_results)
    })


@app.route('/api/simulation/create', methods=['POST'])
def create_simulation():
    """Create a new user simulation"""
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

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

    # Store config
    active_simulations[sim_id] = {
        'config': config,
        'status': 'pending',
        'progress': 0,
        'created_at': datetime.now().isoformat()
    }

    return jsonify({
        'success': True,
        'simulation_id': sim_id,
        'status': 'pending',
        'config': {
            'name': config.name,
            'persona_count': config.persona_count,
            'simulation_days': config.simulation_days
        }
    })


@app.route('/api/simulation/<sim_id>/run', methods=['POST'])
def run_simulation(sim_id):
    """Run the simulation (can be async)"""
    if sim_id not in active_simulations:
        return jsonify({'error': 'Simulation not found'}), 404

    sim_data = active_simulations[sim_id]
    config = sim_data['config']

    # Update status
    sim_data['status'] = 'running'

    try:
        # Run simulation
        result = simulation_engine.run_simulation(config)

        # Store results
        simulation_results[sim_id] = result
        sim_data['status'] = 'completed'
        sim_data['progress'] = 100

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
        sim_data['error'] = str(e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/simulation/<sim_id>/status', methods=['GET'])
def get_simulation_status(sim_id):
    """Get simulation status and progress"""
    if sim_id not in active_simulations:
        return jsonify({'error': 'Simulation not found'}), 404

    sim_data = active_simulations[sim_id]

    return jsonify({
        'simulation_id': sim_id,
        'status': sim_data['status'],
        'progress': sim_data.get('progress', 0),
        'created_at': sim_data['created_at']
    })


@app.route('/api/simulation/<sim_id>/results', methods=['GET'])
def get_simulation_results(sim_id):
    """Get full simulation results"""
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


@app.route('/api/simulation/<sim_id>/agents', methods=['GET'])
def get_simulation_agents(sim_id):
    """Get all agents in the simulation"""
    if sim_id not in simulation_results:
        return jsonify({'error': 'Simulation results not found'}), 404

    result = simulation_results[sim_id]

    agents_data = []
    for agent in result.personas[:100]:  # Limit to first 100 for performance
        agents_data.append(agent.to_dict())

    return jsonify({
        'simulation_id': sim_id,
        'total_agents': len(result.personas),
        'returned_agents': len(agents_data),
        'agents': agents_data
    })


@app.route('/api/simulation/<sim_id>/agent/<agent_id>/journey', methods=['GET'])
def get_agent_journey(sim_id, agent_id):
    """Get journey for a specific agent"""
    if sim_id not in simulation_results:
        return jsonify({'error': 'Simulation results not found'}), 404

    journey = simulation_engine.get_agent_journey(agent_id)

    return jsonify({
        'simulation_id': sim_id,
        'agent_id': agent_id,
        'journey': journey
    })


@app.route('/api/simulation/templates', methods=['GET'])
def get_simulation_templates():
    """Get simulation configuration templates"""
    return jsonify({
        'templates': [
            {
                'id': 'saas_launch',
                'name': 'SaaS Product Launch',
                'description': 'Simulate launch of a new SaaS feature',
                'default_config': {
                    'persona_count': 1000,
                    'simulation_days': 90,
                    'market_saturation': 0.3,
                    'marketing_spend_level': 'medium'
                }
            },
            {
                'id': 'mobile_app',
                'name': 'Mobile App Release',
                'description': 'Simulate mobile app user acquisition',
                'default_config': {
                    'persona_count': 5000,
                    'simulation_days': 60,
                    'market_saturation': 0.5,
                    'marketing_spend_level': 'high'
                }
            },
            {
                'id': 'enterprise_feature',
                'name': 'Enterprise Feature Rollout',
                'description': 'Simulate enterprise feature adoption',
                'default_config': {
                    'persona_count': 500,
                    'simulation_days': 180,
                    'market_saturation': 0.7,
                    'marketing_spend_level': 'low'
                }
            }
        ]
    })


# ============================================================================
# LLM-DRIVEN SIMULATION ENDPOINTS (NEW)
# ============================================================================

@app.route('/api/simulation/llm/create', methods=['POST'])
def create_llm_simulation():
    """
    Create LLM-driven simulation with focused personas.

    This runs qualitative debates with 30-50 behaviorally-distinct agents
    instead of statistical simulation with 1000 generic personas.
    """
    data = request.json

    if not data or 'brief' not in data:
        return jsonify({'error': 'brief required'}), 400

    brief = data['brief']
    category = data.get('category')  # Auto-detected if None
    num_personas = data.get('num_personas', 5)  # 4-8 recommended
    variants_per_persona = data.get('variants_per_persona', 5)  # 3-10
    debate_rounds = data.get('debate_rounds', 10)
    topics = data.get('topics')  # Auto-generated if None

    # Create simulation ID
    import uuid
    sim_id = str(uuid.uuid4())[:8]

    # Store config
    active_simulations[sim_id] = {
        'config': {
            'type': 'llm',
            'brief': brief,
            'category': category,
            'num_personas': num_personas,
            'variants_per_persona': variants_per_persona,
            'debate_rounds': debate_rounds,
            'topics': topics
        },
        'status': 'pending',
        'progress': 0,
        'created_at': datetime.now().isoformat()
    }

    return jsonify({
        'success': True,
        'simulation_id': sim_id,
        'status': 'pending',
        'config': {
            'type': 'llm',
            'brief': brief[:100] + '...' if len(brief) > 100 else brief,
            'estimated_agents': num_personas * variants_per_persona,
            'estimated_duration_minutes': debate_rounds * 1.5
        }
    })


@app.route('/api/simulation/llm/<sim_id>/run', methods=['POST'])
def run_llm_simulation(sim_id):
    """Run LLM-driven simulation"""
    if sim_id not in active_simulations:
        return jsonify({'error': 'Simulation not found'}), 404

    sim_data = active_simulations[sim_id]
    config = sim_data['config']

    if config.get('type') != 'llm':
        return jsonify({'error': 'Not an LLM simulation'}), 400

    sim_data['status'] = 'running'
    sim_data['progress'] = 10

    try:
        # Run LLM simulation
        result = llm_simulation_engine.run_simulation(
            brief=config['brief'],
            category=config.get('category'),
            num_personas=config.get('num_personas', 5),
            variants_per_persona=config.get('variants_per_persona', 5),
            debate_rounds=config.get('debate_rounds', 10),
            topics=config.get('topics')
        )

        # Store results
        simulation_results[sim_id] = result
        sim_data['status'] = 'completed'
        sim_data['progress'] = 100

        return jsonify({
            'success': True,
            'simulation_id': sim_id,
            'status': 'completed',
            'recommendation': result['report'].get('go_no_go_recommendation'),
            'confidence': result['report'].get('confidence_level'),
            'summary': result['report'].get('executive_summary'),
            'personas_generated': len(result['personas']),
            'debates_run': len(result['debate_results'])
        })

    except Exception as e:
        sim_data['status'] = 'failed'
        sim_data['error'] = str(e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/simulation/hybrid/create', methods=['POST'])
def create_hybrid_simulation():
    """
    Create hybrid simulation (rule-based + LLM).

    Combines statistical metrics (NPS, churn, adoption curve)
    with qualitative insights (debate transcripts, specific feedback).
    """
    data = request.json

    if not data or 'brief' not in data:
        return jsonify({'error': 'brief required'}), 400

    brief = data['brief']
    mode = data.get('mode', 'complete')  # quick, deep, or complete

    import uuid
    sim_id = str(uuid.uuid4())[:8]

    active_simulations[sim_id] = {
        'config': {
            'type': 'hybrid',
            'brief': brief,
            'mode': mode
        },
        'status': 'pending',
        'progress': 0,
        'created_at': datetime.now().isoformat()
    }

    return jsonify({
        'success': True,
        'simulation_id': sim_id,
        'status': 'pending',
        'mode': mode,
        'brief': brief[:100] + '...' if len(brief) > 100 else brief
    })


@app.route('/api/simulation/hybrid/<sim_id>/run', methods=['POST'])
def run_hybrid_simulation(sim_id):
    """Run hybrid simulation"""
    if sim_id not in active_simulations:
        return jsonify({'error': 'Simulation not found'}), 404

    sim_data = active_simulations[sim_id]
    config = sim_data['config']

    if config.get('type') != 'hybrid':
        return jsonify({'error': 'Not a hybrid simulation'}), 400

    sim_data['status'] = 'running'

    try:
        result = hybrid_simulation_engine.run_hybrid_simulation(
            brief=config['brief'],
            mode=config.get('mode', 'complete')
        )

        simulation_results[sim_id] = result
        sim_data['status'] = 'completed'
        sim_data['progress'] = 100

        return jsonify({
            'success': True,
            'simulation_id': sim_id,
            'status': 'completed',
            'mode': config.get('mode'),
            'has_rule_based': 'rule_based' in result,
            'has_llm_based': 'llm_based' in result
        })

    except Exception as e:
        sim_data['status'] = 'failed'
        return jsonify({'error': str(e)}), 500


@app.route('/api/simulation/<sim_id>/llm/results', methods=['GET'])
def get_llm_results(sim_id):
    """Get LLM simulation results"""
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
        'report': result.get('report'),
        'personas': result.get('personas'),
        'debate_results': result.get('debate_results'),
        'stats': result.get('stats')
    })


@app.route('/api/simulation/<sim_id>/llm/personas', methods=['GET'])
def get_llm_personas(sim_id):
    """Get personas from LLM simulation"""
    if sim_id not in simulation_results:
        return jsonify({'error': 'Simulation results not found'}), 404

    result = simulation_results[sim_id]
    personas = result.get('personas', [])

    # Return primary personas (not variants)
    primary = [p for p in personas if not p.get('is_variant')]

    return jsonify({
        'simulation_id': sim_id,
        'total_personas': len(personas),
        'primary_personas': len(primary),
        'personas': primary
    })


@app.route('/api/simulation/<sim_id>/llm/transcript/<agent_id>', methods=['GET'])
def get_agent_transcript(sim_id, agent_id):
    """Get debate transcript for a specific agent"""
    if sim_id not in simulation_results:
        return jsonify({'error': 'Simulation results not found'}), 404

    transcript = llm_simulation_engine.get_agent_transcript(agent_id)

    return jsonify({
        'simulation_id': sim_id,
        'agent_id': agent_id,
        'transcript': transcript
    })


@app.route('/api/simulation/llm/recommendations', methods=['GET'])
def get_llm_recommendations():
    """Get latest simulation recommendations"""
    recommendations = llm_simulation_engine.get_recommendations()
    return jsonify(recommendations)


@app.route('/api/simulation/list', methods=['GET'])
def list_simulations():
    """List all simulations"""
    simulations = []

    for sim_id, sim_data in active_simulations.items():
        simulations.append({
            'id': sim_id,
            'name': sim_data['config'].name,
            'status': sim_data['status'],
            'created_at': sim_data['created_at']
        })

    return jsonify({
        'simulations': simulations,
        'total': len(simulations)
    })


if __name__ == '__main__':
    port = int(os.getenv('AI_SERVICE_PORT', 5001))
    print(f"Starting User Simulation Service on port {port}")
    print(f"Simulation Engine: Loaded")
    app.run(host='0.0.0.0', port=port, debug=True)
