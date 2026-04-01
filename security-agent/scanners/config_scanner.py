"""
Config Scanner - Security Misconfiguration Detection

Detects insecure configuration settings that could expose
the application to attacks.
"""

import re
from typing import List, Dict, Any
from pathlib import Path


class ConfigScanner:
    """
    Detect security misconfigurations.

    Misconfigurations are the #5 OWASP Top 10 vulnerability and
    often lead to complete system compromise.
    """

    def __init__(self):
        self.findings = []

    def scan_file(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Scan file for configuration vulnerabilities"""
        self.findings = []

        if content is None:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception:
                return []

        lines = content.split('\n')

        from agent.vulnerability_db import VulnerabilityDB

        for pattern_info in VulnerabilityDB.CONFIG_PATTERNS:
            regex = re.compile(pattern_info['pattern'], re.IGNORECASE)

            for line_num, line in enumerate(lines, 1):
                if regex.search(line):
                    # Context-aware checks
                    if 'debug' in line.lower():
                        # Check if it's in a test file or development config
                        if 'test' in file_path.lower() or 'dev' in file_path.lower():
                            continue  # Expected in dev/test

                    if 'cors' in line.lower() or 'origin' in line.lower():
                        # Check if it's properly configured elsewhere
                        if 'ALLOWED_HOSTS' in content or 'CORS_ALLOWED_ORIGINS' in content:
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

    def scan_env_file(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Scan .env files for security issues"""
        findings = []

        if content is None:
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
            except Exception:
                return []

        lines = content.split('\n')

        # .env specific checks
        env_patterns = [
            {
                'name': 'Empty Secret Key',
                'pattern': r'SECRET_KEY\s*=\s*$',
                'severity': 'critical',
                'fix': 'Generate a strong random secret key'
            },
            {
                'name': 'Default Django Secret',
                'pattern': r'SECRET_KEY\s*=\s*["\']changeme',
                'severity': 'critical',
                'fix': 'Replace with: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"'
            },
            {
                'name': 'Debug True in .env',
                'pattern': r'DEBUG\s*=\s*[Tt]rue',
                'severity': 'medium',
                'fix': 'Set DEBUG=False for production environments'
            },
            {
                'name': 'Database Password Exposed',
                'pattern': r'DB_PASSWORD\s*=\s*[^$]',
                'severity': 'high',
                'fix': 'Use secrets manager or ensure .env is in .gitignore'
            },
            {
                'name': 'Wildcard CORS',
                'pattern': r'CORS.*=\s*\*',
                'severity': 'medium',
                'fix': 'Specify allowed origins explicitly'
            },
        ]

        for pattern_info in env_patterns:
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
                        'cwe_id': pattern_info.get('cwe', 'CWE-489'),
                        'owasp_category': 'A05:2021 - Security Misconfiguration',
                    })

        return findings

    def scan_docker_file(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Scan Dockerfile for security issues"""
        findings = []

        if content is None:
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
            except Exception:
                return []

        lines = content.split('\n')

        docker_patterns = [
            {
                'name': 'Running as Root',
                'pattern': r'^USER\s+root',
                'severity': 'high',
                'fix': 'Create non-root user: RUN useradd -r -u 1000 appuser && USER appuser'
            },
            {
                'name': 'Hardcoded Secrets in Dockerfile',
                'pattern': r'^(ENV|ARG)\s+(PASSWORD|SECRET|KEY|TOKEN)\s*=',
                'severity': 'critical',
                'fix': 'Pass secrets at runtime via docker secrets or environment'
            },
            {
                'name': 'Using Latest Tag',
                'pattern': r'FROM\s+\S+:latest',
                'severity': 'medium',
                'fix': 'Pin specific version: FROM python:3.11.7-slim'
            },
            {
                'name': 'Adding Entire Context',
                'pattern': r'ADD\s+\.\s+',
                'severity': 'low',
                'fix': 'Use COPY with specific files instead of ADD'
            },
            {
                'name': 'Privileged Container',
                'pattern': r'--privileged',
                'severity': 'high',
                'fix': 'Use specific capabilities: --cap-add=SYS_PTRACE'
            },
        ]

        for pattern_info in docker_patterns:
            regex = re.compile(pattern_info['pattern'], re.IGNORECASE | re.MULTILINE)

            for line_num, line in enumerate(lines, 1):
                if regex.search(line):
                    findings.append({
                        'threat_type': pattern_info['name'],
                        'severity': pattern_info['severity'],
                        'file_path': file_path,
                        'line_number': line_num,
                        'code_snippet': line.strip()[:200],
                        'fix_recommendation': pattern_info['fix'],
                        'cwe_id': pattern_info.get('cwe', 'CWE-250'),
                        'owasp_category': 'A05:2021 - Security Misconfiguration',
                    })

        return findings

    def scan_yaml_config(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Scan YAML config files (Kubernetes, Docker Compose, etc.)"""
        findings = []

        if content is None:
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
            except Exception:
                return []

        # Kubernetes-specific checks
        k8s_patterns = [
            {
                'name': 'Privileged Container (K8s)',
                'pattern': r'privileged:\s*true',
                'severity': 'critical',
                'fix': 'Remove privileged: true or use specific capabilities'
            },
            {
                'name': 'Running as Root (K8s)',
                'pattern': r'runAsUser:\s*0',
                'severity': 'high',
                'fix': 'Use non-root user: runAsUser: 1000'
            },
            {
                'name': 'Secrets in Environment',
                'pattern': r'value:\s*["\']?(password|secret|key)',
                'severity': 'high',
                'fix': 'Use secretKeyRef instead of hardcoded values'
            },
            {
                'name': 'Host Network Enabled',
                'pattern': r'hostNetwork:\s*true',
                'severity': 'high',
                'fix': 'Remove hostNetwork unless absolutely necessary'
            },
        ]

        for pattern_info in k8s_patterns:
            regex = re.compile(pattern_info['pattern'], re.IGNORECASE)
            matches = regex.findall(content)

            if matches:
                line_num = content.count('\n', 0, content.find(matches[0])) + 1
                findings.append({
                    'threat_type': pattern_info['name'],
                    'severity': pattern_info['severity'],
                    'file_path': file_path,
                    'line_number': line_num,
                    'code_snippet': matches[0],
                    'fix_recommendation': pattern_info['fix'],
                    'cwe_id': pattern_info.get('cwe', 'CWE-250'),
                    'owasp_category': 'A05:2021 - Security Misconfiguration',
                })

        return findings
