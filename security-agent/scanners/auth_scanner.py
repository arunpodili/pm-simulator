"""
Auth Scanner - Authentication & Authorization Vulnerabilities

Detects flaws in authentication and authorization logic that could
allow unauthorized access or privilege escalation.
"""

import re
from typing import List, Dict, Any


class AuthScanner:
    """
    Detect authentication and authorization vulnerabilities.

    Broken access control is #1 in OWASP Top 10 2021.
    These flaws allow attackers to access unauthorized data or functions.
    """

    def __init__(self):
        self.findings = []

    def scan_file(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Scan file for auth vulnerabilities"""
        self.findings = []

        if content is None:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception:
                return []

        lines = content.split('\n')

        from agent.vulnerability_db import VulnerabilityDB

        for pattern_info in VulnerabilityDB.AUTH_PATTERNS:
            regex = re.compile(pattern_info['pattern'], re.IGNORECASE)

            for line_num, line in enumerate(lines, 1):
                if regex.search(line):
                    # Context-aware checks
                    if 'md5' in line.lower() or 'sha1' in line.lower():
                        # Check if it's for non-security purposes (e.g., checksums)
                        non_security_contexts = ['checksum', 'hashmap', 'fingerprint', 'cache_key']
                        if any(ctx in content[max(0, content.find(line)-500):content.find(line)+500].lower()
                               for ctx in non_security_contexts):
                            continue  # Likely not for auth

                    if 'jwt' in line.lower() and 'verify' in line.lower():
                        # Check if verify is actually set to False
                        if 'verify=False' not in line and 'verify = False' not in line:
                            continue

                    self.findings.append({
                        'threat_type': pattern_info['name'],
                        'severity': pattern_info['severity'],
                        'file_path': file_path,
                        'line_number': line_num,
                        'code_snippet': line.strip()[:200],
                        'fix_recommendation': pattern_info['fix'],
                        'cwe_id': pattern_info.get('cwe'),
                        'owasp_category': pattern_info.get('owasp'),
                    })

        return self.findings

    def scan_password_handling(self, content: str, file_path: str) -> List[Dict[str, Any]]:
        """Specific scanner for password handling issues"""
        findings = []
        lines = content.split('\n')

        # Password-related patterns
        password_patterns = [
            {
                'name': 'Plain Text Password Storage',
                'pattern': r'(password|passwd|pwd)\s*=\s*[^h][^a][^s].*$',
                'severity': 'critical',
                'fix': 'Use bcrypt or argon2 for password hashing'
            },
            {
                'name': 'Password in URL',
                'pattern': r'(https?|ftp):\/\/[^:]+:([^@]+)@',
                'severity': 'critical',
                'fix': 'Use environment variables for credentials'
            },
            {
                'name': 'Weak Password Requirements',
                'pattern': r'(minlength|min_length|minLen)\s*[=:]\s*[1-5]\b',
                'severity': 'medium',
                'fix': 'Require minimum 8 characters with complexity'
            },
        ]

        for pattern_info in password_patterns:
            regex = re.compile(pattern_info['pattern'], re.IGNORECASE)

            for line_num, line in enumerate(lines, 1):
                if regex.search(line):
                    findings.append({
                        'threat_type': pattern_info['name'],
                        'severity': pattern_info['severity'],
                        'file_path': file_path,
                        'line_number': line_num,
                        'code_snippet': line.strip()[:200],
                        'fix_recommendation': pattern_info['fix'],
                        'cwe_id': 'CWE-259',
                        'owasp_category': 'A07:2021 - Identification and Authentication Failures',
                    })

        return findings

    def scan_session_security(self, content: str, file_path: str) -> List[Dict[str, Any]]:
        """Scan for session management vulnerabilities"""
        findings = []
        lines = content.split('\n')

        session_patterns = [
            {
                'name': 'Session ID in URL',
                'pattern': r'(sessionid|session_id|sid|phpsessid)[=:][a-zA-Z0-9]+',
                'severity': 'high',
                'fix': 'Use cookies with HttpOnly and Secure flags'
            },
            {
                'name': 'Missing Session Expiration',
                'pattern': r'session\[.*\]\s*=.*(?!.*expire|.*timeout|.*max_age)',
                'severity': 'medium',
                'fix': 'Set session timeout and implement idle expiration'
            },
            {
                'name': 'Insecure Cookie Settings',
                'pattern': r'(httponly|secure)\s*=\s*(False|false|0)',
                'severity': 'medium',
                'fix': 'Set HttpOnly=True and Secure=True for session cookies'
            },
        ]

        for pattern_info in session_patterns:
            regex = re.compile(pattern_info['pattern'], re.IGNORECASE)

            for line_num, line in enumerate(lines, 1):
                if regex.search(line):
                    findings.append({
                        'threat_type': pattern_info['name'],
                        'severity': pattern_info['severity'],
                        'file_path': file_path,
                        'line_number': line_num,
                        'code_snippet': line.strip()[:200],
                        'fix_recommendation': pattern_info['fix'],
                        'cwe_id': 'CWE-614',
                        'owasp_category': 'A05:2021 - Security Misconfiguration',
                    })

        return findings

    def check_auth_bypass_patterns(self, content: str, file_path: str) -> List[Dict[str, Any]]:
        """Check for common authentication bypass patterns"""
        findings = []

        # Look for commented-out auth checks
        auth_bypass_indicators = [
            (r'#\s*(auth|login|verify|check|permission)', 'Commented auth check'),
            (r'//\s*(auth|login|verify|check|permission)', 'Commented auth check'),
            (r'if\s*\(\s*false\s*\)', 'Disabled condition'),
            (r'if\s*\(\s*true\s*\)', 'Bypassed condition'),
            (r'return\s+True\s*#\s*(temp|todo|fixme)', 'Temporary bypass'),
        ]

        for pattern, threat_name in auth_bypass_indicators:
            regex = re.compile(pattern, re.IGNORECASE)
            matches = regex.findall(content)

            if matches:
                findings.append({
                    'threat_type': f'Potential Auth Bypass - {threat_name}',
                    'severity': 'high',
                    'file_path': file_path,
                    'line_number': content.count('\n', 0, content.find(matches[0])) + 1 if matches else 0,
                    'code_snippet': f'Pattern: {matches[0]}',
                    'fix_recommendation': 'Restore authentication checks, remove temporary bypasses',
                    'cwe_id': 'CWE-306',
                    'owasp_category': 'A01:2021 - Broken Access Control',
                })

        return findings
