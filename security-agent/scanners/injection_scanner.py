"""
Injection Scanner - SQL, Command, Code Injection Detection

Detects injection vulnerabilities that allow attackers to execute
arbitrary code or commands.
"""

import re
import ast
from typing import List, Dict, Any
from pathlib import Path


class InjectionScanner:
    """
    Detect injection vulnerabilities.

    Injection flaws are consistently in OWASP Top 10 because
    they allow complete system compromise.
    """

    def __init__(self):
        self.findings = []

    def scan_file(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Scan file for injection vulnerabilities"""
        self.findings = []

        if content is None:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception:
                return []

        lines = content.split('\n')

        from agent.vulnerability_db import VulnerabilityDB

        # SQL Injection patterns
        for pattern_info in VulnerabilityDB.SQL_INJECTION_PATTERNS:
            self._scan_pattern(lines, file_path, pattern_info)

        # Command Injection patterns
        for pattern_info in VulnerabilityDB.COMMAND_INJECTION_PATTERNS:
            self._scan_pattern(lines, file_path, pattern_info)

        return self.findings

    def _scan_pattern(
        self,
        lines: List[str],
        file_path: str,
        pattern_info: Dict
    ):
        """Scan lines for a specific pattern"""
        pattern = pattern_info['pattern']
        regex = re.compile(pattern, re.IGNORECASE)

        for line_num, line in enumerate(lines, 1):
            if regex.search(line):
                # Additional context checks for SQL injection
                if 'sql' in pattern_info['name'].lower() or 'sqli' in pattern_info['id']:
                    # Check if it's actually SQL
                    sql_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE', 'JOIN']
                    if not any(kw in line.upper() for kw in sql_keywords):
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

    def scan_python_ast(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """
        Use AST analysis for more accurate Python injection detection.

        Regex can have false positives - AST analysis understands
        the actual code structure.
        """
        if content is None:
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
            except Exception:
                return []

        try:
            tree = ast.parse(content)
        except SyntaxError:
            return []

        findings = []

        for node in ast.walk(tree):
            # Detect eval() calls
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name):
                    if node.func.id == 'eval':
                        findings.append({
                            'threat_type': 'eval() Usage',
                            'severity': 'critical',
                            'file_path': file_path,
                            'line_number': node.lineno,
                            'code_snippet': f'eval() at line {node.lineno}',
                            'fix_recommendation': 'Use ast.literal_eval() for safe parsing or avoid entirely',
                            'cwe_id': 'CWE-95',
                            'owasp_category': 'A03:2021 - Injection',
                        })

                    elif node.func.id == 'exec':
                        findings.append({
                            'threat_type': 'exec() Usage',
                            'severity': 'critical',
                            'file_path': file_path,
                            'line_number': node.lineno,
                            'code_snippet': f'exec() at line {node.lineno}',
                            'fix_recommendation': 'Refactor to use functions/dicts instead of dynamic code',
                            'cwe_id': 'CWE-95',
                            'owasp_category': 'A03:2021 - Injection',
                        })

        return findings

    def scan_for_ssrf(self, content: str, file_path: str) -> List[Dict[str, Any]]:
        """Detect Server-Side Request Forgery vulnerabilities"""
        findings = []
        lines = content.split('\n')

        from agent.vulnerability_db import VulnerabilityDB

        for pattern_info in VulnerabilityDB.SSRF_PATTERNS:
            regex = re.compile(pattern_info['pattern'], re.IGNORECASE)

            for line_num, line in enumerate(lines, 1):
                if regex.search(line):
                    # Check if user input is actually involved
                    user_input_patterns = [
                        'request', 'input', 'params', 'query', 'body',
                        'user_', 'data', 'arg', 'argv'
                    ]

                    has_user_input = any(
                        pattern in line.lower()
                        for pattern in user_input_patterns
                    )

                    if has_user_input or 'f"' in line or "f'" in line or '+' in line:
                        findings.append({
                            'threat_type': pattern_info['name'],
                            'severity': pattern_info['severity'],
                            'file_path': file_path,
                            'line_number': line_num,
                            'code_snippet': line.strip()[:200],
                            'fix_recommendation': pattern_info['fix'],
                            'cwe_id': pattern_info.get('cwe'),
                            'owasp_category': pattern_info.get('owasp'),
                        })

        return findings

    def get_injection_risk_score(self, findings: List[Dict]) -> float:
        """
        Calculate injection risk score (0-100).

        Based on number and severity of injection flaws.
        """
        if not findings:
            return 0

        severity_weights = {
            'critical': 25,
            'high': 15,
            'medium': 5,
            'low': 1,
        }

        total_score = sum(
            severity_weights.get(f.get('severity', 'low'), 1)
            for f in findings
        )

        return min(100, total_score)
