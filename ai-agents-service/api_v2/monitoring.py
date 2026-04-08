"""
Monitoring API Endpoints
Health checks, metrics, and analytics
"""
from flask import Blueprint, jsonify
from monitoring.metrics import metrics_collector, health_checker, track_performance
from database import db_manager
from auth_middleware import require_auth, require_role

monitoring_bp = Blueprint('monitoring', __name__, url_prefix='/api/v2')


@monitoring_bp.route('/health', methods=['GET'])
def health_check():
    """System health check endpoint"""
    # Register default checks
    def check_database():
        try:
            session = db_manager.get_session()
            session.execute("SELECT 1")
            session.close()
            return True
        except Exception:
            return False

    def check_memory():
        import psutil
        memory = psutil.virtual_memory()
        return memory.percent < 90  # Fail if memory usage > 90%

    if 'database' not in health_checker.checks:
        health_checker.register_check('database', check_database, 'Database connectivity')
    if 'memory' not in health_checker.checks:
        health_checker.register_check('memory', check_memory, 'Memory usage')

    results = health_checker.run_checks()
    status_code = 200 if results['status'] == 'healthy' else 503
    return jsonify(results), status_code


@monitoring_bp.route('/metrics', methods=['GET'])
@require_auth
def get_metrics():
    """Get application and business metrics"""
    return jsonify(metrics_collector.get_metrics_summary())


@monitoring_bp.route('/metrics/business', methods=['GET'])
@require_auth
def get_business_metrics():
    """Get business-specific metrics"""
    return jsonify({
        'business': metrics_collector.business_metrics,
        'timestamp': metrics_collector.get_metrics_summary()['timestamp']
    })


@monitoring_bp.route('/analytics/dashboard', methods=['GET'])
@require_auth
def get_analytics_dashboard():
    """Get comprehensive analytics for dashboard"""
    from database import db_session
    from database import Simulation, User
    from models.simulation_persona import SimulationPersona
    from models.change_log import ChangeLog

    try:
        # Aggregate statistics
        total_simulations = db_session.query(Simulation).count()
        completed_simulations = db_session.query(Simulation).filter_by(status='completed').count()
        total_users = db_session.query(User).count()
        total_personas = db_session.query(SimulationPersona).count()
        total_changes = db_session.query(ChangeLog).count()

        # Recent activity (last 24 hours)
        from datetime import datetime, timedelta
        yesterday = datetime.utcnow() - timedelta(hours=24)
        recent_simulations = db_session.query(Simulation).filter(
            Simulation.created_at >= yesterday
        ).count()
        recent_users = db_session.query(User).filter(
            User.created_at >= yesterday
        ).count()

        return jsonify({
            'overview': {
                'total_simulations': total_simulations,
                'completed_simulations': completed_simulations,
                'completion_rate': round(completed_simulations / total_simulations * 100, 2) if total_simulations > 0 else 0,
                'total_users': total_users,
                'total_personas': total_personas,
                'total_changes': total_changes
            },
            'activity': {
                'recent_simulations': recent_simulations,
                'recent_users': recent_users
            },
            'business': metrics_collector.business_metrics,
            'performance': metrics_collector._compute_timer_stats(),
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
