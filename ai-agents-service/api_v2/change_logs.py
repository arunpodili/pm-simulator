"""
Change Log API Endpoints - Track changes to simulations
"""
from flask import Blueprint, request, jsonify
from database import db_session
from models.change_log import ChangeLog
from auth_middleware import require_auth
import uuid

change_logs_bp = Blueprint('change_logs', __name__, url_prefix='/api/v2')


@change_logs_bp.route('/simulations/<simulation_id>/changelog', methods=['GET'])
@require_auth
def get_changelog(simulation_id):
    """Get change history for a simulation"""
    entries = db_session.query(ChangeLog).filter_by(
        simulation_id=simulation_id
    ).order_by(ChangeLog.created_at.desc()).all()

    return jsonify({
        'entries': [e.to_dict() for e in entries],
        'count': len(entries)
    })


@change_logs_bp.route('/simulations/<simulation_id>/changelog/annotate', methods=['POST'])
@require_auth
def add_annotation(simulation_id):
    """Add manual annotation to change log"""
    data = request.get_json()
    user = request.user  # Set by auth_middleware

    entry = ChangeLog(
        id=str(uuid.uuid4()),
        simulation_id=simulation_id,
        author_id=user['id'],
        change_type='decision',
        field=data.get('field'),
        old_value=data.get('old_value'),
        new_value=data.get('new_value'),
        reason=data.get('reason'),
        impact=data.get('impact')
    )

    db_session.add(entry)
    db_session.commit()

    return jsonify(entry.to_dict()), 201
