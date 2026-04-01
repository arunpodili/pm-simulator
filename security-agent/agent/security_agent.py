"""
Security AI Agent - Main Orchestrator

30+ Years of Cybersecurity Expertise Encoded in Software.

This agent coordinates all security scanners, manages threat intelligence,
and sends real-time alerts via Telegram.
"""

import os
import time
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

from .threat_memory import ThreatMemory
from .vulnerability_db import VulnerabilityDB

# Import scanners directly (avoiding relative import issues)
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from scanners.secrets_scanner import SecretsScanner
from scanners.injection_scanner import InjectionScanner
from scanners.xss_scanner import XSSScanner
from scanners.auth_scanner import AuthScanner
from scanners.config_scanner import ConfigScanner

logger = logging.getLogger(__name__)


class SecurityAgent:
    """
    Your 30+ year cybersecurity expert agent.

    Capabilities:
    - Multi-scanner vulnerability detection
    - Threat intelligence storage
    - Real-time Telegram alerts
    - Pre-commit blocking
    - Security scoring and trends

    Experience encoded from:
    - OWASP Top 10 (2004-2021)
    - CWE/SANS Top 25
    - MITRE ATT&CK Framework
    - Real-world penetration testing
    - Incident response lessons
    """

    def __init__(
        self,
        project_root: str = None,
        telegram_alerter = None,
        threat_memory: ThreatMemory = None
    ):
        self.project_root = Path(project_root) if project_root else Path.cwd()

        # Initialize components
        self.threat_memory = threat_memory or ThreatMemory()
        self.telegram_alerter = telegram_alerter

        # Initialize scanners
        self.scanners = {
            'secrets': SecretsScanner(),
            'injection': InjectionScanner(),
            'xss': XSSScanner(),
            'auth': AuthScanner(),
            'config': ConfigScanner(),
        }

        # Statistics
        self.stats = {
            'total_scans': 0,
            'total_threats_found': 0,
            'last_scan': None,
        }

        logger.info("Security Agent initialized - 30+ years expertise loaded")

    def scan_file(
        self,
        file_path: str,
        send_telegram_alert: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Scan a single file with all scanners.

        Returns list of findings with full details.
        """
        file_path = Path(file_path)

        if not file_path.exists():
            logger.warning(f"File not found: {file_path}")
            return []

        # Read file content
        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
        except Exception as e:
            logger.error(f"Error reading {file_path}: {e}")
            return []

        all_findings = []

        # Run all applicable scanners
        for scanner_name, scanner in self.scanners.items():
            try:
                findings = scanner.scan_file(str(file_path), content)
                all_findings.extend(findings)
            except Exception as e:
                logger.error(f"Scanner {scanner_name} failed: {e}")

        # Store findings in threat memory
        for finding in all_findings:
            threat_id = self.threat_memory.store_threat(**finding)
            finding['threat_id'] = threat_id

            # Send Telegram alert if configured
            if send_telegram_alert and self.telegram_alerter:
                if finding['severity'] in ['critical', 'high']:
                    self.telegram_alerter.send_security_alert(
                        threat_id=threat_id,
                        **finding
                    )

        self.stats['total_scans'] += 1
        self.stats['total_threats_found'] += len(all_findings)
        self.stats['last_scan'] = datetime.now().isoformat()

        return all_findings

    def scan_directory(
        self,
        directory: str = None,
        extensions: List[str] = None,
        exclude_patterns: List[str] = None,
        send_telegram_alert: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Scan entire directory recursively.

        Args:
            directory: Path to scan (defaults to project_root)
            extensions: File extensions to scan (default: .py, .js, .ts, etc.)
            exclude_patterns: Patterns to exclude (e.g., node_modules, __pycache__)
            send_telegram_alert: Whether to send Telegram notifications

        Returns:
            List of all findings
        """
        if directory is None:
            directory = self.project_root

        dir_path = Path(directory)

        if extensions is None:
            extensions = ['.py', '.js', '.ts', '.jsx', '.tsx', '.env', '.yaml', '.yml']

        if exclude_patterns is None:
            exclude_patterns = [
                'node_modules',
                '__pycache__',
                '.git',
                '.next',
                'venv',
                'env',
                '*.min.js',
                'dist',
                'build',
            ]

        all_findings = []
        files_scanned = 0
        start_time = time.time()

        for ext in extensions:
            for file_path in dir_path.rglob(f'*{ext}'):
                # Check exclusions
                file_str = str(file_path)
                if any(pattern in file_str for pattern in exclude_patterns):
                    continue

                findings = self.scan_file(
                    str(file_path),
                    send_telegram_alert=send_telegram_alert
                )
                all_findings.extend(findings)
                files_scanned += 1

        duration = time.time() - start_time

        # Record scan history
        severity_counts = self._count_by_severity(all_findings)
        self.threat_memory.add_scan_history(
            scan_type='directory',
            files_scanned=files_scanned,
            threats_found=len(all_findings),
            **severity_counts,
            duration_seconds=duration
        )

        # Send summary via Telegram
        if self.telegram_alerter:
            security_score = self.threat_memory.get_security_score()
            self.telegram_alerter.send_scan_summary(
                scan_type='Directory Scan',
                files_scanned=files_scanned,
                threats_found=len(all_findings),
                **severity_counts,
                duration=duration,
                security_score=security_score
            )

        logger.info(f"Scan complete: {files_scanned} files, {len(all_findings)} threats in {duration:.1f}s")

        return all_findings

    def scan_git_diff(
        self,
        diff_content: str,
        file_path: str = None
    ) -> List[Dict[str, Any]]:
        """
        Scan git diff output for new vulnerabilities.

        This is used in pre-commit hooks to catch issues before they're committed.
        """
        findings = []

        # Parse diff to extract added lines
        added_lines = []
        current_line = 0

        for line in diff_content.split('\n'):
            if line.startswith('+') and not line.startswith('+++'):
                added_lines.append((current_line, line[1:]))
            current_line += 1

        if not added_lines:
            return []

        # Scan added content
        content = '\n'.join([line for _, line in added_lines])

        for scanner_name, scanner in self.scanners.items():
            try:
                # Create a mock file scanner for diff content
                if hasattr(scanner, 'scan_content'):
                    scanner_findings = scanner.scan_content(content, file_path or 'diff')
                else:
                    # Use regular scan and adjust line numbers
                    scanner_findings = scanner.scan_file(file_path or 'diff', content)

                # Adjust line numbers to match diff
                for finding in scanner_findings:
                    for diff_line_num, (orig_line, _) in enumerate(added_lines):
                        if finding['line_number'] == diff_line_num + 1:
                            finding['line_number'] = orig_line
                            break

                findings.extend(scanner_findings)
            except Exception as e:
                logger.error(f"Scanner {scanner_name} failed on diff: {e}")

        return findings

    def get_security_report(self) -> Dict[str, Any]:
        """
        Generate comprehensive security report.

        Includes statistics, trends, and actionable recommendations.
        """
        stats = self.threat_memory.get_statistics()
        security_score = self.threat_memory.get_security_score()

        open_threats = self.threat_memory.get_open_threats(limit=50)

        # Group by type
        by_type = {}
        for threat in open_threats:
            threat_type = threat['threat_type']
            by_type[threat_type] = by_type.get(threat_type, 0) + 1

        # Group by file
        by_file = {}
        for threat in open_threats:
            file_path = threat['file_path']
            by_file[file_path] = by_file.get(file_path, 0) + 1

        # Top 5 risky files
        risky_files = sorted(by_file.items(), key=lambda x: x[1], reverse=True)[:5]

        report = {
            'generated_at': datetime.now().isoformat(),
            'security_score': security_score,
            'summary': stats,
            'open_threats_count': len(open_threats),
            'threats_by_type': by_type,
            'risky_files': risky_files,
            'recent_threats': open_threats[:20],
            'recommendations': self._generate_recommendations(open_threats),
        }

        return report

    def _generate_recommendations(self, threats: List[Dict]) -> List[str]:
        """Generate actionable security recommendations"""
        recommendations = []

        if not threats:
            return ["Great job! No open threats. Keep scanning regularly."]

        # Count by severity
        critical_count = sum(1 for t in threats if t['severity'] == 'critical')
        high_count = sum(1 for t in threats if t['severity'] == 'high')

        if critical_count > 0:
            recommendations.append(
                f"🚨 URGENT: Fix {critical_count} critical vulnerabilities immediately. "
                "These could lead to complete system compromise."
            )

        if high_count > 0:
            recommendations.append(
                f"⚠️ HIGH PRIORITY: Address {high_count} high-severity issues within 24 hours."
            )

        # Check for common patterns
        threat_types = set(t['threat_type'] for t in threats)

        if any('SQL' in t for t in threat_types):
            recommendations.append(
                "💡 Consider implementing a database abstraction layer with built-in "
                "parameterized queries to prevent SQL injection."
            )

        if any('Secret' in t or 'Key' in t or 'Password' in t for t in threat_types):
            recommendations.append(
                "💡 Implement a secrets management solution (e.g., AWS Secrets Manager, "
                "HashiCorp Vault) to eliminate hardcoded credentials."
            )

        if len(threats) > 20:
            recommendations.append(
                "📚 Consider scheduling a security training session for the development team. "
                "High threat count indicates systemic issues."
            )

        return recommendations

    def _count_by_severity(self, findings: List[Dict]) -> Dict[str, int]:
        """Count findings by severity level"""
        counts = {'critical_count': 0, 'high_count': 0, 'medium_count': 0, 'low_count': 0}

        for finding in findings:
            severity = finding.get('severity', 'low').lower()
            counts[f'{severity}_count'] = counts.get(f'{severity}_count', 0) + 1

        return counts

    def fix_suggestion(self, threat_id: str) -> Dict[str, Any]:
        """
        Get detailed fix suggestion for a specific threat.

        This uses the encoded 30+ years of experience to provide
        context-aware remediation guidance.
        """
        threat = self.threat_memory.get_threat_by_id(threat_id)

        if not threat:
            return {'error': 'Threat not found'}

        # Get CWE details if available
        cwe_info = {}
        if threat.get('cwe_id'):
            cwe_info = VulnerabilityDB.get_cwe_info(threat['cwe_id'])

        return {
            'threat': threat,
            'cwe_details': cwe_info,
            'fix_code_example': self._generate_fix_example(threat),
            'prevention_tips': self._get_prevention_tips(threat['threat_type']),
        }

    def _generate_fix_example(self, threat: Dict) -> str:
        """Generate code example showing the fix"""
        threat_type = threat.get('threat_type', '')
        original = threat.get('code_snippet', '')

        # SQL Injection fix
        if 'SQL' in threat_type:
            return """
# ❌ Vulnerable:
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")

# ✅ Fixed:
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
"""

        # Command Injection fix
        if 'Command' in threat_type or 'eval' in threat_type or 'exec' in threat_type:
            return """
# ❌ Vulnerable:
os.system(f"ping {user_input}")
eval(user_input)

# ✅ Fixed:
import subprocess
subprocess.run(["ping", user_input])
ast.literal_eval(user_input)  # For safe parsing
"""

        # XSS fix
        if 'XSS' in threat_type or 'Script' in threat_type:
            return """
# ❌ Vulnerable:
return f"<h1>{user_name}</h1>"

# ✅ Fixed:
import html
return f"<h1>{html.escape(user_name)}</h1>"

# Or use template engine auto-escaping
"""

        # Secrets fix
        if 'Secret' in threat_type or 'Key' in threat_type or 'Password' in threat_type:
            return """
# ❌ Vulnerable:
API_KEY = "sk-1234567890abcdef"

# ✅ Fixed:
import os
API_KEY = os.getenv("API_KEY")

# Add to .env (in .gitignore):
# API_KEY=sk-1234567890abcdef
"""

        return threat.get('fix_recommendation', 'See fix_recommendation field')

    def _get_prevention_tips(self, threat_type: str) -> List[str]:
        """Get prevention tips for a threat type"""
        prevention_db = {
            'SQL Injection': [
                "Always use parameterized queries or prepared statements",
                "Implement input validation with allowlists",
                "Use ORM frameworks that handle escaping automatically",
                "Apply least privilege to database accounts"
            ],
            'XSS': [
                "Escape all user input before rendering",
                "Use Content-Security-Policy headers",
                "Implement HTTP-only cookies",
                "Use framework auto-escaping features"
            ],
            'Command Injection': [
                "Avoid executing system commands with user input",
                "Use subprocess with list arguments (shell=False)",
                "Implement strict input validation",
                "Run processes with minimal privileges"
            ],
            'Hardcoded Credentials': [
                "Use environment variables for all secrets",
                "Implement secrets management (Vault, AWS Secrets Manager)",
                "Rotate credentials regularly",
                "Use .gitignore to exclude .env files"
            ],
        }

        for key, tips in prevention_db.items():
            if key.lower() in threat_type.lower():
                return tips

        return [
            "Follow secure coding guidelines",
            "Review OWASP Top 10 regularly",
            "Implement security scanning in CI/CD",
            "Conduct regular code reviews"
        ]
