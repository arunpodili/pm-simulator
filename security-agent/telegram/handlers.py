"""
Telegram Command Handlers

Interactive handlers for Telegram bot commands and button callbacks.
"""

import re
from typing import Optional, Dict, Any


class TelegramHandler:
    """
    Handle incoming Telegram commands and callbacks.

    Commands:
    /start - Welcome message
    /status - Current security posture
    /scan - Trigger immediate scan
    /report - Get security report
    /help - Show available commands
    """

    def __init__(self, security_agent, threat_memory, alerter):
        self.security_agent = security_agent
        self.threat_memory = threat_memory
        self.alerter = alerter

    def handle_command(self, command: str, args: str = None) -> Optional[str]:
        """Handle a Telegram command"""
        command = command.lower().strip('/')

        handlers = {
            'start': self._handle_start,
            'status': self._handle_status,
            'scan': self._handle_scan,
            'report': self._handle_report,
            'help': self._handle_help,
            'fix': self._handle_fix,
            'dismiss': self._handle_dismiss,
        }

        handler = handlers.get(command)
        if handler:
            return handler(args)

        return f"Unknown command: {command}. Use /help for available commands."

    def handle_callback(self, callback_data: str) -> Optional[Dict[str, Any]]:
        """Handle inline button callback"""
        # Parse callback data format: action_threatId_optional
        match = re.match(r'(\w+)_(\w+)(?:_(.+))?', callback_data)

        if not match:
            return None

        action, threat_id, extra = match.groups()

        callbacks = {
            'fix': self._handle_fix_callback,
            'dismiss': self._handle_dismiss_callback,
            'snooze': self._handle_snooze_callback,
            'threat': self._handle_threat_details_callback,
            'report': self._handle_report_callback,
            'force_push': self._handle_force_push_callback,
            'trends': self._handle_trends_callback,
            'fix_pending': self._handle_fix_pending_callback,
        }

        handler = callbacks.get(action)
        if handler:
            return handler(threat_id, extra)

        return None

    def _handle_start(self, args: str = None) -> str:
        """Handle /start command"""
        return self.alerter.send_welcome_message()

    def _handle_status(self, args: str = None) -> str:
        """Handle /status command"""
        stats = self.threat_memory.get_statistics()
        score = self.threat_memory.get_security_score()

        score_emoji = "🟢" if score >= 80 else "🟡" if score >= 50 else "🔴"

        by_severity = stats.get('by_severity', {})
        by_status = stats.get('by_status', {})

        message = f"""
📊 *SECURITY STATUS*

*Security Score:* {score_emoji} {score:.0f}/100

*Open Threats:*
  🚨 Critical: {by_severity.get('critical', 0)}
  ⚠️ High: {by_severity.get('high', 0)}
  🟡 Medium: {by_severity.get('medium', 0)}
  ℹ️ Low: {by_severity.get('low', 0)}

*By Status:*
  Open: {by_status.get('open', 0)}
  Fixed: {by_status.get('fixed', 0)}
  Ignored: {by_status.get('ignored', 0)}

*New This Week:* {stats.get('new_this_week', 0)}
        """.strip()

        return message

    def _handle_scan(self, args: str = None) -> str:
        """Handle /scan command"""
        # This would trigger an async scan
        return "🔍 Starting security scan... You'll be notified when complete."

    def _handle_report(self, args: str = None) -> str:
        """Handle /report command"""
        report = self.security_agent.get_security_report()

        message = f"""
📋 *SECURITY REPORT*
Generated: {report['generated_at']}

*Security Score:* {report['security_score']:.0f}/100

*Summary:*
- Total Threats: {report['summary'].get('total_threats', 0)}
- Open: {report['open_threats_count']}
- Files Scanned: {report['summary'].get('files_scanned', 'N/A')}

*Risky Files:*
{chr(10).join(f"• `{f}` ({c} issues)" for f, c in report['risky_files'][:5])}

*Recommendations:*
{chr(10).join(f"• {r}" for r in report['recommendations'][:3])}
        """.strip()

        return message

    def _handle_help(self, args: str = None) -> str:
        """Handle /help command"""
        return """
🔐 *Security Agent - Commands*

*Information:*
/status - Current security posture
/report - Full security report
/scan - Run immediate scan

*Actions:*
/fix <id> - Get fix for specific threat
/dismiss <id> - Mark threat as false positive

*Settings:*
/settings - Configure alerts
/unsubscribe - Stop notifications

Stay secure! 🛡️
        """.strip()

    def _handle_fix(self, args: str = None) -> str:
        """Handle /fix command"""
        if not args:
            return "Usage: /fix <threat_id>"

        result = self.security_agent.fix_suggestion(args)

        if 'error' in result:
            return f"Error: {result['error']}"

        threat = result.get('threat', {})
        return f"""
🔧 *Fix for: {threat.get('threat_type')}*

*File:* `{threat.get('file_path')}:{threat.get('line_number')}`

*Recommendation:*
{threat.get('fix_recommendation')}

*Prevention Tips:*
{chr(10).join(f"• {tip}" for tip in result.get('prevention_tips', []))}
        """.strip()

    def _handle_dismiss(self, args: str = None) -> str:
        """Handle /dismiss command"""
        if not args:
            return "Usage: /dismiss <threat_id>"

        self.threat_memory.mark_threat_fixed(args, fixed_by='telegram_user')
        return f"✅ Threat `{args}` marked as fixed/dismissed."

    # Callback handlers
    def _handle_fix_callback(self, threat_id: str, extra: str = None) -> Dict:
        """Handle 'Mark Fixed' button callback"""
        self.threat_memory.mark_threat_fixed(threat_id, fixed_by='telegram_user')

        return {
            'text': f"✅ Threat `{threat_id}` marked as fixed!",
            'show_alert': True
        }

    def _handle_dismiss_callback(self, threat_id: str, extra: str = None) -> Dict:
        """Handle 'Dismiss' button callback"""
        self.threat_memory.mark_threat_fixed(threat_id, fixed_by='telegram_user')

        return {
            'text': f"Threat `{threat_id}` dismissed.",
            'show_alert': False
        }

    def _handle_snooze_callback(self, threat_id: str, extra: str = None) -> Dict:
        """Handle 'Snooze' button callback"""
        # Extra contains minutes: snooze_threatId_60
        minutes = int(extra) if extra else 60

        # In a full implementation, this would set a reminder
        return {
            'text': f"⏰ Alert snoozed for {minutes} minutes.",
            'show_alert': False
        }

    def _handle_threat_details_callback(self, threat_id: str, extra: str = None) -> Dict:
        """Handle 'View Details' button callback"""
        threat = self.threat_memory.get_threat_by_id(threat_id)

        if not threat:
            return {'text': 'Threat not found', 'show_alert': True}

        return {
            'text': f"""
📋 *Threat Details*

*Type:* {threat['threat_type']}
*Severity:* {threat['severity'].upper()}
*File:* `{threat['file_path']}:{threat['line_number']}`
*CWE:* {threat.get('cwe_id', 'N/A')}
*OWASP:* {threat.get('owasp_category', 'N/A')}

*Code:*
```
{threat['code_snippet'][:400]}
```

*Fix:* {threat['fix_recommendation']}
            """,
            'show_alert': False
        }

    def _handle_report_callback(self, threat_id: str, extra: str = None) -> Dict:
        """Handle 'Full Report' button callback"""
        stats = self.threat_memory.get_statistics()
        score = self.threat_memory.get_security_score()

        return {
            'text': f"""
📊 *Security Overview*

Score: {score:.0f}/100
Total Threats: {stats.get('total_threats', 0)}
Open: {stats['by_status'].get('open', 0)}
Fixed: {stats['by_status'].get('fixed', 0)}
            """,
            'show_alert': False
        }

    def _handle_force_push_callback(self, threat_id: str, extra: str = None) -> Dict:
        """Handle 'Force Push' button callback"""
        return {
            'text': "⚠️ Force push is NOT RECOMMENDED. Please fix the vulnerabilities instead.\n\nIf you must: git push --no-verify",
            'show_alert': True
        }

    def _handle_trends_callback(self, threat_id: str, extra: str = None) -> Dict:
        """Handle 'View Trends' button callback"""
        stats = self.threat_memory.get_statistics()

        return {
            'text': f"""
📈 *Security Trends*

Total threats tracked: {stats.get('total_threats', 0)}
New this week: {stats.get('new_this_week', 0)}

Top threat types:
{chr(10).join(f"• {k}: {v}" for k, v in list(stats.get('by_severity', {}).items())[:5])}
            """,
            'show_alert': False
        }

    def _handle_fix_pending_callback(self, threat_id: str, extra: str = None) -> Dict:
        """Handle 'Fix Pending Items' button callback"""
        threats = self.threat_memory.get_open_threats(limit=10)

        if not threats:
            return {'text': '✅ No pending threats to fix!', 'show_alert': False}

        threat_list = '\n'.join([
            f"• `{t['threat_id']}` - {t['threat_type']} ({t['severity']})"
            for t in threats
        ])

        return {
            'text': f"📋 *Open Threats (showing first 10):*\n\n{threat_list}",
            'show_alert': False
        }
