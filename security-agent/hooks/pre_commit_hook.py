"""
Git Pre-Commit Hook - Security Scanner

Runs automatically before every git commit to catch vulnerabilities
before they enter version control.
"""

import sys
import subprocess
import json
from pathlib import Path
from typing import List, Dict, Any


class PreCommitHook:
    """
    Pre-commit security scanner hook.

    Install with:
    1. Copy this to .git/hooks/pre-commit
    2. Make executable: chmod +x .git/hooks/pre-commit

    Or use the Python pre-commit framework:
    1. pip install pre-commit
    2. Add to .pre-commit-config.yaml
    3. pre-commit install
    """

    def __init__(self, security_agent, telegram_alerter=None):
        self.security_agent = security_agent
        self.telegram_alerter = telegram_alerter

    def get_staged_files(self) -> List[str]:
        """Get list of git staged files"""
        try:
            result = subprocess.run(
                ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout.strip().split('\n') if result.stdout.strip() else []
        except subprocess.CalledProcessError:
            return []

    def get_staged_diff(self) -> str:
        """Get git diff content for staged changes"""
        try:
            result = subprocess.run(
                ['git', 'diff', '--cached'],
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout
        except subprocess.CalledProcessError:
            return ""

    def run(self) -> int:
        """
        Run pre-commit hook.

        Returns:
            0 if scan passes (commit allowed)
            1 if vulnerabilities found (commit blocked)
        """
        print("🔐 Security Agent Pre-Commit Hook")
        print("=" * 40)

        # Get staged files
        staged_files = self.get_staged_files()

        if not staged_files:
            print("No staged files to scan.")
            return 0

        print(f"Scanning {len(staged_files)} staged file(s)...")

        all_findings = []
        critical_count = 0
        high_count = 0

        # Scan each staged file
        for file_path in staged_files:
            if not file_path:
                continue

            # Skip non-code files
            if not self._is_scannable_file(file_path):
                continue

            findings = self.security_agent.scan_file(
                file_path,
                send_telegram_alert=False  # Don't spam Telegram on every commit
            )

            for finding in findings:
                severity = finding.get('severity', 'low')
                if severity == 'critical':
                    critical_count += 1
                elif severity == 'high':
                    high_count += 1

            all_findings.extend(findings)

        # Report results
        if all_findings:
            print(f"\n🚨 SECURITY ISSUES FOUND: {len(all_findings)}")
            print()

            for finding in all_findings:
                emoji = {'critical': '🚨', 'high': '⚠️', 'medium': '🟡', 'low': 'ℹ️'}.get(
                    finding['severity'], '📋'
                )
                print(f"{emoji} [{finding['severity'].upper()}] {finding['threat_type']}")
                print(f"   File: {finding['file_path']}:{finding['line_number']}")
                print(f"   Fix: {finding['fix_recommendation'][:100]}...")
                print()

            # Send Telegram alert if critical/high found
            if (critical_count > 0 or high_count > 0) and self.telegram_alerter:
                self.telegram_alerter.send_commit_blocked_alert(
                    critical_count=critical_count,
                    high_count=high_count,
                    threats=all_findings[:10]  # First 10
                )

            print("=" * 40)
            print("🛑 COMMIT BLOCKED")
            print()
            print(f"Found {critical_count} critical and {high_count} high severity issues.")
            print("Please fix these before committing.")
            print()
            print("To bypass (NOT RECOMMENDED): git commit --no-verify")

            return 1

        print("✅ No security issues found. Commit allowed.")
        return 0

    def _is_scannable_file(self, file_path: str) -> bool:
        """Check if file should be scanned"""
        scannable_extensions = {'.py', '.js', '.ts', '.jsx', '.tsx', '.env', '.yaml', '.yml', '.json'}
        path = Path(file_path)
        return path.suffix.lower() in scannable_extensions


def main():
    """Main entry point for pre-commit hook"""
    # Import security agent
    import sys
    sys.path.insert(0, str(Path(__file__).parent.parent))

    from agent.security_agent import SecurityAgent
    from telegram.alerter import TelegramAlerter

    # Initialize
    import os
    from dotenv import load_dotenv

    project_root = Path(__file__).parent.parent.parent
    load_dotenv(project_root / '.env.local')

    # Telegram setup (optional)
    telegram = None
    if os.getenv('TELEGRAM_BOT_TOKEN') and os.getenv('TELEGRAM_CHAT_ID'):
        telegram = TelegramAlerter(
            os.getenv('TELEGRAM_BOT_TOKEN'),
            os.getenv('TELEGRAM_CHAT_ID')
        )

    security_agent = SecurityAgent(
        project_root=str(project_root),
        telegram_alerter=telegram
    )

    hook = PreCommitHook(security_agent, telegram)
    sys.exit(hook.run())


if __name__ == '__main__':
    main()
