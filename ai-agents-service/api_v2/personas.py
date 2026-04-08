"""
Persona API Endpoints - CRUD operations for simulation personas
"""
from flask import Blueprint, request, jsonify
from database import db_session
from models.simulation_persona import SimulationPersona
from auth_middleware import require_auth
import uuid

personas_bp = Blueprint('personas', __name__, url_prefix='/api/v2')


@personas_bp.route('/simulations/<simulation_id>/personas', methods=['GET'])
@require_auth
def get_personas(simulation_id):
    """Get all personas for a simulation"""
    personas = db_session.query(SimulationPersona).filter_by(
        simulation_id=simulation_id
    ).all()
    return jsonify({
        'personas': [p.to_dict() for p in personas],
        'count': len(personas),
        'max_allowed': 5,
        'can_add_more': len(personas) < 5
    })


@personas_bp.route('/simulations/<simulation_id>/personas', methods=['POST'])
@require_auth
def create_persona(simulation_id):
    """Create a new persona"""
    data = request.get_json()

    # Check max personas
    existing_count = db_session.query(SimulationPersona).filter_by(
        simulation_id=simulation_id
    ).count()

    if existing_count >= 5:
        return jsonify({'error': 'Maximum 5 personas allowed'}), 400

    # Validate required fields
    required = ['name', 'role', 'pain_level', 'tech_savviness']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    # Validate ranges
    if not 1 <= data['pain_level'] <= 10:
        return jsonify({'error': 'pain_level must be 1-10'}), 400
    if not 1 <= data['tech_savviness'] <= 10:
        return jsonify({'error': 'tech_savviness must be 1-10'}), 400

    persona = SimulationPersona(
        id=str(uuid.uuid4()),
        simulation_id=simulation_id,
        name=data['name'],
        role=data['role'],
        pain_level=data['pain_level'],
        tech_savviness=data['tech_savviness'],
        age_range=data.get('age_range'),
        income_level=data.get('income_level'),
        goals=data.get('goals'),
        frustrations=data.get('frustrations')
    )

    db_session.add(persona)
    db_session.commit()

    return jsonify(persona.to_dict()), 201


@personas_bp.route('/personas/<persona_id>', methods=['PUT'])
@require_auth
def update_persona(persona_id):
    """Update a persona"""
    data = request.get_json()
    persona = db_session.query(SimulationPersona).get(persona_id)

    if not persona:
        return jsonify({'error': 'Persona not found'}), 404

    for field in ['name', 'role', 'pain_level', 'tech_savviness',
                  'age_range', 'income_level', 'goals', 'frustrations']:
        if field in data:
            setattr(persona, field, data[field])

    db_session.commit()
    return jsonify(persona.to_dict())


@personas_bp.route('/personas/<persona_id>', methods=['DELETE'])
@require_auth
def delete_persona(persona_id):
    """Delete a persona"""
    persona = db_session.query(SimulationPersona).get(persona_id)

    if not persona:
        return jsonify({'error': 'Persona not found'}), 404

    db_session.delete(persona)
    db_session.commit()
    return jsonify({'message': 'Persona deleted'})


@personas_bp.route('/personas/<persona_id>/duplicate', methods=['POST'])
@require_auth
def duplicate_persona(persona_id):
    """Duplicate a persona"""
    persona = db_session.query(SimulationPersona).get(persona_id)

    if not persona:
        return jsonify({'error': 'Persona not found'}), 404

    # Check max personas
    existing_count = db_session.query(SimulationPersona).filter_by(
        simulation_id=persona.simulation_id
    ).count()

    if existing_count >= 5:
        return jsonify({'error': 'Maximum 5 personas allowed'}), 400

    new_persona = SimulationPersona(
        id=str(uuid.uuid4()),
        simulation_id=persona.simulation_id,
        name=f"{persona.name} (Copy)",
        role=persona.role,
        pain_level=persona.pain_level,
        tech_savviness=persona.tech_savviness,
        age_range=persona.age_range,
        income_level=persona.income_level,
        goals=persona.goals,
        frustrations=persona.frustrations
    )

    db_session.add(new_persona)
    db_session.commit()

    return jsonify(new_persona.to_dict()), 201
