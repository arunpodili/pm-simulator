"""
Telegram Alerter - Real-Time Security Notifications

Sends instant security alerts to your Telegram when vulnerabilities are found.
100% free, private, and works on all devices.
"""

import requests
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class TelegramAlerter:
    """
    Send security alerts to Telegram.

    Features:
    - Instant push notifications
    - Rich formatting (bold, code blocks, emojis)
    - Interactive buttons for actions
    - Rate limiting to avoid spam
    """

    EMOJIS = {
        'critical': '🚨',
        'high': '⚠️',
        'medium': '🟡',
        'low': 'ℹ️',
        'info': '📋',
        'fixed': '✅',
        'scan': '🔍',
        'summary': '📊',
        'blocked': '🛑',
    }

    SEVERITY_BADGES = {
        'critical': '🔴 CRITICAL',
        'high': '🟠 HIGH',
        'medium': '🟡 MEDIUM',
        'low': '🟢 LOW',
        'info': '⚪ INFO',
    }

    def __init__(self, bot_token: str, chat_id: str, enabled: bool = True):
        """
        Initialize Telegram alerter.

        Args:
            bot_token: Telegram bot token from @BotFather
            chat_id: Your Telegram chat ID
            enabled: Set False to disable alerts temporarily
        """
        self.bot_token = bot_token
        self.chat_id = chat_id
        self.enabled = enabled
        self.base_url = f"https://api.telegram.org/bot{bot_token}"

        if not enabled:
            logger.info("Telegram alerts disabled")
        elif not bot_token or not chat_id:
            logger.warning("Telegram not configured - missing token or chat_id")
            self.enabled = False

    def is_configured(self) -> bool:
        """Check if Telegram is properly configured"""
        return self.enabled and bool(self.bot_token) and bool(self.chat_id)

    def send_security_alert(
        self,
        threat_id: str,
        threat_type: str,
        severity: str,
        file_path: str,
        line_number: int,
        code_snippet: str,
        fix_recommendation: str,
        cwe_id: str = None,
        owasp_category: str = None
    ) -> Optional[str]:
        """
        Send a security vulnerability alert.

        Returns message_id if sent successfully, None otherwise.
        """
        if not self.is_configured():
            return None

        emoji = self.EMOJIS.get(severity.lower(), '📋')
        badge = self.SEVERITY_BADGES.get(severity.lower(), severity.upper())

        # Truncate code snippet for Telegram (max 4096 chars total)
        code_display = code_snippet[:800] if code_snippet else "No code available"

        # Build message
        message = f"""
{emoji} *SECURITY ALERT - {badge}*

*Threat:* {threat_type}
*File:* `{file_path}`
*Line:* {line_number}
{f'*CWE:* {cwe_id}' if cwe_id else ''}
{f'*OWASP:* {owasp_category}' if owasp_category else ''}

*Code:*
```python
{code_display}
```

*Recommended Fix:*
{fix_recommendation}

---
Threat ID: `{threat_id}`
        """.strip()

        # Interactive keyboard
        keyboard = {
            'inline_keyboard': [
                [
                    {'text': '📋 Full Details', 'callback_data': f'threat_{threat_id}'},
                    {'text': '✅ Mark Fixed', 'callback_data': f'fix_{threat_id}'}
                ],
                [
                    {'text': '⏰ Snooze 1hr', 'callback_data': f'snooze_{threat_id}_60'},
                    {'text': '❌ Dismiss', 'callback_data': f'dismiss_{threat_id}'}
                ]
            ]
        }

        return self._send_message(message, reply_markup=keyboard)

    def send_commit_blocked_alert(
        self,
        critical_count: int,
        high_count: int,
        threats: List[Dict]
    ) -> Optional[str]:
        """Send alert when commit is blocked due to security issues"""
        if not self.is_configured():
            return None

        threat_list = "\n".join([
            f"  • {t['threat_type']} in `{t['file_path']}:{t['line_number']}`"
            for t in threats[:5]  # Limit to first 5
        ])

        message = f"""
🛑 *COMMIT BLOCKED*

Your push was blocked due to security vulnerabilities:

🔴 Critical: {critical_count}
🟠 High: {high_count}

*Issues Found:*
{threat_list}

Resolve these before pushing to protect your codebase.

Use `--no-verify` to override (NOT RECOMMENDED).
        """.strip()

        keyboard = {
            'inline_keyboard': [
                [{'text': '📋 View Full Report', 'callback_data': 'report_full'}],
                [{'text': '⚠️ Force Push (Risky)', 'callback_data': 'force_push'}]
            ]
        }

        return self._send_message(message, reply_markup=keyboard)

    def send_scan_summary(
        self,
        scan_type: str,
        files_scanned: int,
        threats_found: int,
        critical: int = 0,
        high: int = 0,
        medium: int = 0,
        low: int = 0,
        duration: float = 0,
        security_score: float = 100
    ) -> Optional[str]:
        """Send scan summary after completion"""
        if not self.is_configured():
            return None

        emoji = self.EMOJIS['scan']

        # Determine overall status
        if critical > 0 or high > 0:
            status_emoji = "🚨"
            status_text = "Issues require attention"
        elif medium > 0:
            status_emoji = "⚠️"
            status_text = "Minor issues found"
        else:
            status_emoji = "✅"
            status_text = "No significant issues"

        message = f"""
{emoji} *SCAN COMPLETE - {status_emoji}*

Type: {scan_type}
Files Scanned: {files_scanned}
Duration: {duration:.1f}s

*Threats Found:* {threats_found}
  🚨 Critical: {critical}
  ⚠️ High: {high}
  🟡 Medium: {medium}
  ℹ️ Low: {low}

*Security Score:* {security_score:.0f}/100

{status_text}
        """.strip()

        return self._send_message(message)

    def send_daily_summary(self, stats: Dict[str, Any]) -> Optional[str]:
        """Send daily security summary"""
        if not self.is_configured():
            return None

        emoji = self.EMOJIS['summary']
        date_str = datetime.now().strftime("%B %d, %Y")

        by_severity = stats.get('by_severity', {})
        by_status = stats.get('by_status', {})

        score = stats.get('security_score', 100)
        score_emoji = "🟢" if score >= 80 else "🟡" if score >= 50 else "🔴"

        message = f"""
{emoji} *DAILY SECURITY SUMMARY*
📅 {date_str}

┌─────────────────────────────┐
│ *Total Threats:* {stats.get('total_threats', 0)}          │
│ 🚨 Critical: {by_severity.get('critical', 0)}             │
│ ⚠️ High: {by_severity.get('high', 0)}                     │
│ 🟡 Medium: {by_severity.get('medium', 0)}                 │
│ ℹ️ Low: {by_severity.get('low', 0)}                       │
└─────────────────────────────┘

*By Status:*
  Open: {by_status.get('open', 0)}
  Fixed: {by_status.get('fixed', 0)}
  Ignored: {by_status.get('ignored', 0)}

*Security Score:* {score_emoji} {score:.0f}/100

Keep your code secure! 🔐
        """.strip()

        keyboard = {
            'inline_keyboard': [
                [{'text': '📈 View Trends', 'callback_data': 'trends'}],
                [{'text': '🎯 Fix Pending Items', 'callback_data': 'fix_pending'}]
            ]
        }

        return self._send_message(message, reply_markup=keyboard)

    def send_welcome_message(self) -> Optional[str]:
        """Send welcome message when bot is first set up"""
        if not self.is_configured():
            return None

        message = """
🔐 *Security Agent Connected!*

I'm your 30+ year cybersecurity expert, now integrated into your development workflow.

*What I'll monitor:*
✅ SQL Injection vulnerabilities
✅ Hardcoded secrets & API keys
✅ XSS (Cross-Site Scripting)
✅ Command injection risks
✅ Authentication bypasses
✅ Insecure configurations
✅ Dependency vulnerabilities

*When you'll get alerts:*
🚨 Critical/High threats found
🛑 Commit blocked for security
📊 Daily/Weekly summaries

*Quick Commands:*
/status - Current security posture
/scan - Run immediate security scan
/help - Show all commands

Your code is now protected! 🛡️
        """.strip()

        return self._send_message(message, parse_mode="Markdown")

    def _send_message(
        self,
        text: str,
        parse_mode: str = "Markdown",
        reply_markup: Dict = None
    ) -> Optional[str]:
        """Send message to Telegram"""
        try:
            url = f"{self.base_url}/sendMessage"
            payload = {
                'chat_id': self.chat_id,
                'text': text,
                'parse_mode': parse_mode,
            }

            if reply_markup:
                payload['reply_markup'] = reply_markup

            response = requests.post(url, json=payload, timeout=10)
            result = response.json()

            if result.get('ok'):
                message_id = result['result']['message_id']
                logger.info(f"Telegram sent: message_id={message_id}")
                return str(message_id)
            else:
                logger.error(f"Telegram error: {result}")
                return None

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to send Telegram message: {e}")
            return None

    def test_connection(self) -> bool:
        """Test if Telegram connection works"""
        if not self.is_configured():
            return False

        message = "🔍 *Connection Test*\n\nYour Security Agent is working correctly!"
        result = self._send_message(message)
        return result is not None
