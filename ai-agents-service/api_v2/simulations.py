"""
Simulation CRUD API Endpoints

Provides complete CRUD operations for simulations with bulk support.
"""

from flask import Blueprint, request, jsonify, g
from sqlalchemy.orm import joinedload
from datetime import datetime
from typing import List, Dict, Any
import uuid

from database import (
    Simulation, SimulationResult, SimulationTimeline,
    create_simulation_db, update_simulation_status_db,
    create_simulation_result_db, db_manager
)
from auth_middleware import require_auth, require_owner_or_admin
from cache import cache, cache_5m, invalidate_cache

bp = Blueprint('simulations_v2', __name__, url_prefix='/api/v2/simulations')


# ============================================================================
# CRUD ENDPOINTS
# ============================================================================

@bp.route('', methods=['GET'])
@require_auth
def list_simulations():
    """
    List simulations with filtering and pagination.

    Query Parameters:
        - status: Filter by status (pending, running, completed, failed)
        - industry: Filter by target industry
        - page: Page number (default: 1)
        - per_page: Items per page (default: 20, max: 100)
        - sort_by: Sort field (created_at, name, status)
        - sort_order: asc or desc
    """
    user_id = g.current_user.get('sub')
    is_admin = g.current_user.get('role') == 'admin'

    # Parse query parameters
    status = request.args.get('status')
    industry = request.args.get('industry')
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')

    session = db_manager.get_session()

    try:
        # Build query
        query = session.query(Simulation)

        # Apply filters
        if not is_admin:
            query = query.filter(Simulation.user_id == user_id)
        if status:
            query = query.filter(Simulation.status == status)
        if industry:
            query = query.filter(Simulation.target_industry == industry)

        # Apply sorting
        sort_field = getattr(Simulation, sort_by, Simulation.created_at)
        if sort_order == 'desc':
            sort_field = sort_field.desc()
        query = query.order_by(sort_field)

        # Execute with pagination
        total = query.count()
        simulations = query.offset((page - 1) * per_page).limit(per_page).all()

        return jsonify({
            'success': True,
            'data': [sim.to_dict() for sim in simulations],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'pages': (total + per_page - 1) // per_page
            }
        })

    finally:
        session.close()


@bp.route('/<sim_id>', methods=['GET'])
@require_auth
@cache_5m(key_prefix='simulation_detail')
def get_simulation(sim_id: str):
    """Get single simulation with full details including results."""
    user_id = g.current_user.get('sub')
    is_admin = g.current_user.get('role') == 'admin'

    session = db_manager.get_session()

    try:
        sim = session.query(Simulation).options(
            joinedload(Simulation.result),
            joinedload(Simulation.timeline)
        ).filter(Simulation.id == sim_id).first()

        if not sim:
            return jsonify({'error': 'Simulation not found'}), 404

        # Check ownership
        if not is_admin and sim.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403

        response = sim.to_dict()
        if sim.result:
            response['result'] = sim.result.to_dict()
        if sim.timeline:
            response['timeline'] = [
                {
                    'day': t.day,
                    'new_users': t.new_users,
                    'churned': t.churned,
                    'revenue': t.revenue,
                    'satisfaction': t.satisfaction
                }
                for t in sim.timeline
            ]

        return jsonify({'success': True, 'data': response})

    finally:
        session.close()


@bp.route('', methods=['POST'])
@require_auth
def create_simulation():
    """Create new simulation."""
    user_id = g.current_user.get('sub')
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    session = db_manager.get_session()

    try:
        sim_id = str(uuid.uuid4())[:8]

        sim = create_simulation_db(session, sim_id, user_id, data)
        session.commit()

        # Invalidate cache
        invalidate_cache(f'simulations:list:{user_id}:*')

        return jsonify({
            'success': True,
            'data': sim.to_dict(),
            'message': 'Simulation created successfully'
        }), 201

    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        session.close()


@bp.route('/<sim_id>', methods=['PUT'])
@require_auth
def update_simulation(sim_id: str):
    """Update simulation (only allowed for pending simulations)."""
    user_id = g.current_user.get('sub')
    is_admin = g.current_user.get('role') == 'admin'
    data = request.get_json()

    session = db_manager.get_session()

    try:
        sim = session.query(Simulation).filter(Simulation.id == sim_id).first()

        if not sim:
            return jsonify({'error': 'Simulation not found'}), 404

        if not is_admin and sim.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403

        # Only allow updates to pending simulations
        if sim.status != 'pending' and not is_admin:
            return jsonify({'error': 'Can only update pending simulations'}), 400

        # Update fields
        allowed_fields = [
            'name', 'feature_description', 'target_industry',
            'persona_count', 'simulation_days', 'features',
            'pricing_tiers', 'pain_points_solved', 'differentiators'
        ]

        for field in allowed_fields:
            if field in data:
                setattr(sim, field, data[field])

        sim.updated_at = datetime.utcnow()
        session.commit()

        # Invalidate cache
        invalidate_cache(f'simulation_detail:{sim_id}')

        return jsonify({
            'success': True,
            'data': sim.to_dict(),
            'message': 'Simulation updated successfully'
        })

    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        session.close()


@bp.route('/<sim_id>', methods=['DELETE'])
@require_auth
def delete_simulation(sim_id: str):
    """Delete simulation and all related data."""
    user_id = g.current_user.get('sub')
    is_admin = g.current_user.get('role') == 'admin'

    session = db_manager.get_session()

    try:
        sim = session.query(Simulation).filter(Simulation.id == sim_id).first()

        if not sim:
            return jsonify({'error': 'Simulation not found'}), 404

        if not is_admin and sim.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403

        session.delete(sim)
        session.commit()

        # Invalidate cache
        invalidate_cache(f'simulation_detail:{sim_id}')
        invalidate_cache(f'simulations:list:{user_id}:*')

        return jsonify({
            'success': True,
            'message': 'Simulation deleted successfully'
        })

    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        session.close()


# ============================================================================
# BULK OPERATIONS
# ============================================================================

@bp.route('/bulk', methods=['POST'])
@require_auth
def bulk_create_simulations():
    """
    Create multiple simulations in one request.

    Request Body:
        {
            "simulations": [
                {"name": "Sim 1", ...},
                {"name": "Sim 2", ...}
            ]
        }
    """
    user_id = g.current_user.get('sub')
    data = request.get_json()

    if not data or 'simulations' not in data:
        return jsonify({'error': 'No simulations provided'}), 400

    simulations_data = data['simulations']

    if len(simulations_data) > 100:
        return jsonify({'error': 'Maximum 100 simulations per batch'}), 400

    session = db_manager.get_session()
    created = []
    failed = []

    try:
        for sim_data in simulations_data:
            try:
                sim_id = str(uuid.uuid4())[:8]
                sim = create_simulation_db(session, sim_id, user_id, sim_data)
                created.append(sim.to_dict())
            except Exception as e:
                failed.append({
                    'data': sim_data,
                    'error': str(e)
                })

        session.commit()

        # Invalidate cache
        invalidate_cache(f'simulations:list:{user_id}:*')

        return jsonify({
            'success': True,
            'created': len(created),
            'failed': len(failed),
            'data': created,
            'errors': failed if failed else None
        })

    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        session.close()


@bp.route('/bulk', methods=['DELETE'])
@require_auth
def bulk_delete_simulations():
    """
    Delete multiple simulations.

    Request Body:
        {"ids": ["sim1", "sim2", ...]}
    """
    user_id = g.current_user.get('sub')
    is_admin = g.current_user.get('role') == 'admin'
    data = request.get_json()

    if not data or 'ids' not in data:
        return jsonify({'error': 'No simulation IDs provided'}), 400

    sim_ids = data['ids']

    if len(sim_ids) > 100:
        return jsonify({'error': 'Maximum 100 simulations per batch'}), 400

    session = db_manager.get_session()

    try:
        query = session.query(Simulation).filter(Simulation.id.in_(sim_ids))

        if not is_admin:
            query = query.filter(Simulation.user_id == user_id)

        deleted = query.delete(synchronize_session=False)
        session.commit()

        # Invalidate cache
        for sim_id in sim_ids:
            invalidate_cache(f'simulation_detail:{sim_id}')
        invalidate_cache(f'simulations:list:{user_id}:*')

        return jsonify({
            'success': True,
            'deleted': deleted,
            'message': f'{deleted} simulations deleted'
        })

    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        session.close()


@bp.route('/bulk/status', methods=['PUT'])
@require_auth
def bulk_update_status():
    """
    Update status for multiple simulations.

    Request Body:
        {"ids": ["sim1", "sim2"], "status": "cancelled"}
    """
    user_id = g.current_user.get('sub')
    is_admin = g.current_user.get('role') == 'admin'
    data = request.get_json()

    if not data or 'ids' not in data or 'status' not in data:
        return jsonify({'error': 'IDs and status required'}), 400

    sim_ids = data['ids']
    new_status = data['status']

    session = db_manager.get_session()

    try:
        query = session.query(Simulation).filter(Simulation.id.in_(sim_ids))

        if not is_admin:
            query = query.filter(Simulation.user_id == user_id)

        updated = query.update(
            {'status': new_status, 'updated_at': datetime.utcnow()},
            synchronize_session=False
        )
        session.commit()

        # Invalidate cache
        for sim_id in sim_ids:
            invalidate_cache(f'simulation_detail:{sim_id}')

        return jsonify({
            'success': True,
            'updated': updated,
            'message': f'{updated} simulations updated'
        })

    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        session.close()


# ============================================================================
# STATISTICS & ANALYTICS
# ============================================================================

@bp.route('/stats', methods=['GET'])
@require_auth
def get_simulation_stats():
    """Get simulation statistics for the user."""
    user_id = g.current_user.get('sub')
    is_admin = g.current_user.get('role') == 'admin'

    session = db_manager.get_session()

    try:
        query = session.query(Simulation)

        if not is_admin:
            query = query.filter(Simulation.user_id == user_id)

        total = query.count()
        by_status = session.query(
            Simulation.status,
            session.func.count(Simulation.id)
        ).group_by(Simulation.status).all()

        by_industry = session.query(
            Simulation.target_industry,
            session.func.count(Simulation.id)
        ).group_by(Simulation.target_industry).all()

        recent = query.order_by(Simulation.created_at.desc()).limit(5).all()

        return jsonify({
            'success': True,
            'data': {
                'total': total,
                'by_status': {status: count for status, count in by_status},
                'by_industry': {ind: count for ind, count in by_industry},
                'recent': [sim.to_dict() for sim in recent]
            }
        })

    finally:
        session.close()


# ============================================================================
# EXPORT
# ============================================================================

@bp.route('/<sim_id>/export', methods=['GET'])
@require_auth
def export_simulation(sim_id: str):
    """
    Export simulation data.

    Query Parameters:
        - format: json, csv (default: json)
    """
    user_id = g.current_user.get('sub')
    is_admin = g.current_user.get('role') == 'admin'
    export_format = request.args.get('format', 'json').lower()

    if export_format not in ['json', 'csv']:
        return jsonify({'error': 'Supported formats: json, csv'}), 400

    session = db_manager.get_session()

    try:
        sim = session.query(Simulation).options(
            joinedload(Simulation.result),
            joinedload(Simulation.timeline)
        ).filter(Simulation.id == sim_id).first()

        if not sim:
            return jsonify({'error': 'Simulation not found'}), 404

        if not is_admin and sim.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403

        if export_format == 'json':
            data = sim.to_dict()
            if sim.result:
                data['result'] = sim.result.to_dict()
            if sim.timeline:
                data['timeline'] = [
                    {'day': t.day, 'new_users': t.new_users, 'revenue': t.revenue}
                    for t in sim.timeline
                ]

            return jsonify({'success': True, 'data': data})

        elif export_format == 'csv':
            import csv
            import io

            output = io.StringIO()
            writer = csv.writer(output)

            # Write headers
            writer.writerow(['Day', 'New Users', 'Churned', 'Revenue', 'Satisfaction'])

            # Write data
            if sim.timeline:
                for t in sim.timeline:
                    writer.writerow([t.day, t.new_users, t.churned, t.revenue, t.satisfaction])

            output.seek(0)

            from flask import Response
            return Response(
                output.getvalue(),
                mimetype='text/csv',
                headers={
                    'Content-Disposition': f'attachment; filename=simulation_{sim_id}.csv'
                }
            )

    finally:
        session.close()
