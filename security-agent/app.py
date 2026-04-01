"""
Security AI Agent - Flask API

Main API server for the Security AI Agent.
Provides REST endpoints for scanning, threat management, and Telegram integration.
"""

import os
import sys
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize security agent
sys.path.insert(0, str(Path(__file__).parent))

from agent.security_agent import SecurityAgent
from agent.threat_memory import ThreatMemory
from telegram.alerter import TelegramAlerter

# Configuration
PROJECT_ROOT = Path(os.getenv('PM_SIMULATOR_ROOT', Path(__file__).parent.parent))

# Initialize Telegram
telegram_alerter = None
if os.getenv('TELEGRAM_BOT_TOKEN') and os.getenv('TELEGRAM_CHAT_ID'):
    telegram_alerter = TelegramAlerter(
        os.getenv('TELEGRAM_BOT_TOKEN'),
        os.getenv('TELEGRAM_CHAT_ID'),
        enabled=os.getenv('TELEGRAM_ENABLED', 'true').lower() == 'true'
    )

# Initialize threat memory
threat_memory = ThreatMemory()

# Initialize security agent
security_agent = SecurityAgent(
    project_root=str(PROJECT_ROOT),
    telegram_alerter=telegram_alerter,
    threat_memory=threat_memory
)


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/security/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'telegram_configured': telegram_alerter.is_configured() if telegram_alerter else False,
        'project_root': str(PROJECT_ROOT)
    })


@app.route('/api/security/scan/file', methods=['POST'])
def scan_file():
    """Scan a single file for vulnerabilities"""
    data = request.json

    if not data or 'file_path' not in data:
        return jsonify({'error': 'file_path required'}), 400

    file_path = data['file_path']
    send_alert = data.get('send_alert', True)

    findings = security_agent.scan_file(file_path, send_telegram_alert=send_alert)

    return jsonify({
        'success': True,
        'file_path': file_path,
        'findings_count': len(findings),
        'findings': findings
    })


@app.route('/api/security/scan/directory', methods=['POST'])
def scan_directory():
    """Scan entire directory for vulnerabilities"""
    data = request.json or {}

    directory = data.get('directory', str(PROJECT_ROOT))
    extensions = data.get('extensions', None)
    send_alert = data.get('send_alert', True)

    findings = security_agent.scan_directory(
        directory=directory,
        extensions=extensions,
        send_telegram_alert=send_alert
    )

    return jsonify({
        'success': True,
        'directory': directory,
        'findings_count': len(findings),
        'findings': findings
    })


@app.route('/api/security/scan/pre-commit', methods=['POST'])
def scan_pre_commit():
    """Run pre-commit security scan on staged files"""
    from hooks.pre_commit_hook import PreCommitHook

    hook = PreCommitHook(security_agent, telegram_alerter)
    result = hook.run()

    if result == 0:
        return jsonify({'success': True, 'message': 'No vulnerabilities found'})
    else:
        return jsonify({
            'success': False,
            'message': 'Vulnerabilities found - commit blocked',
            'details': 'See scan output for details'
        }), 400


@app.route('/api/security/report', methods=['GET'])
def get_security_report():
    """Get comprehensive security report"""
    report = security_agent.get_security_report()

    return jsonify(report)


@app.route('/api/security/threats', methods=['GET'])
def get_threats():
    """Get open threats with optional filters"""
    severity = request.args.get('severity')
    file_path = request.args.get('file_path')
    limit = request.args.get('limit', type=int)

    threats = threat_memory.get_open_threats(
        severity=severity,
        file_path=file_path,
        limit=limit
    )

    return jsonify({
        'threats': threats,
        'count': len(threats)
    })


@app.route('/api/security/threat/<threat_id>', methods=['GET'])
def get_threat(threat_id: str):
    """Get specific threat details"""
    threat = threat_memory.get_threat_by_id(threat_id)

    if not threat:
        return jsonify({'error': 'Threat not found'}), 404

    fix_info = security_agent.fix_suggestion(threat_id)

    return jsonify({
        'threat': threat,
        'fix_info': fix_info
    })


@app.route('/api/security/threat/<threat_id>/fix', methods=['POST'])
def mark_threat_fixed(threat_id: str):
    """Mark a threat as fixed"""
    data = request.json
    fixed_by = data.get('fixed_by', 'api_user') if data else 'api_user'

    threat_memory.mark_threat_fixed(threat_id, fixed_by=fixed_by)

    return jsonify({
        'success': True,
        'message': f'Threat {threat_id} marked as fixed'
    })


@app.route('/api/security/statistics', methods=['GET'])
def get_statistics():
    """Get security statistics"""
    stats = threat_memory.get_statistics()
    score = threat_memory.get_security_score()

    return jsonify({
        **stats,
        'security_score': score
    })


@app.route('/api/security/telegram/test', methods=['POST'])
def test_telegram():
    """Test Telegram connection"""
    if not telegram_alerter:
        return jsonify({'error': 'Telegram not configured'}), 400

    success = telegram_alerter.test_connection()

    if success:
        return jsonify({'success': True, 'message': 'Telegram alert sent!'})
    else:
        return jsonify({'success': False, 'message': 'Failed to send Telegram alert'}), 500


@app.route('/api/security/telegram/subscribe', methods=['POST'])
def subscribe_telegram():
    """Subscribe to Telegram notifications"""
    if not telegram_alerter:
        return jsonify({'error': 'Telegram not configured'}), 400

    telegram_alerter.send_welcome_message()

    return jsonify({
        'success': True,
        'message': 'Welcome! You are now subscribed to security alerts.'
    })


@app.route('/api/security/export', methods=['GET'])
def export_threats():
    """Export all threats as JSON"""
    format = request.args.get('format', 'json')
    threats_json = threat_memory.export_threats(format)

    return jsonify({
        'format': format,
        'data': threats_json
    })


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    port = int(os.getenv('SECURITY_AGENT_PORT', 5002))

    print("=" * 60)
    print("       SECURITY AI AGENT - 30+ Years Expertise")
    print("=" * 60)
    print(f"  Starting on port {port}")
    print(f"  Project: {str(PROJECT_ROOT)[:50]}")
    print(f"  Telegram: {'Enabled' if telegram_alerter else 'Disabled'}")
    print("=" * 60)
    print("")
    print("API Endpoints:")
    print("  GET  /api/security/health          - Health check")
    print("  POST /api/security/scan/file       - Scan single file")
    print("  POST /api/security/scan/directory  - Scan directory")
    print("  POST /api/security/scan/pre-commit - Pre-commit scan")
    print("  GET  /api/security/report          - Security report")
    print("  GET  /api/security/threats         - List threats")
    print("  GET  /api/security/statistics      - Statistics")
    print("")

    app.run(host='0.0.0.0', port=port, debug=True)
