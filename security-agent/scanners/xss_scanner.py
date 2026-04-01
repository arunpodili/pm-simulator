"""
XSS Scanner - Cross-Site Scripting Detection

Detects vulnerabilities that allow attackers to inject malicious
scripts into web pages viewed by other users.
"""

import re
from typing import List, Dict, Any


class XSSScanner:
    """
    Detect Cross-Site Scripting (XSS) vulnerabilities.

    XSS is one of the most common web vulnerabilities,
    allowing session hijacking, defacement, and malware distribution.
    """

    def __init__(self):
        self.findings = []

    def scan_file(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Scan file for XSS vulnerabilities"""
        self.findings = []

        if content is None:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception:
                return []

        lines = content.split('\n')

        from agent.vulnerability_db import VulnerabilityDB

        for pattern_info in VulnerabilityDB.XSS_PATTERNS:
            regex = re.compile(pattern_info['pattern'], re.IGNORECASE)

            for line_num, line in enumerate(lines, 1):
                if regex.search(line):
                    # Context-aware checks
                    if 'dangerouslySetInnerHTML' in line:
                        # Check if it's properly sanitized
                        if 'DOMPurify' in content[:1000] or 'sanitize' in line.lower():
                            continue  # Likely sanitized

                    if 'innerHTML' in line:
                        # Check if it's a safe assignment
                        safe_patterns = ['textContent', 'innerText', 'createTextNode']
                        if any(s in content[max(0, content.find(line)-200):content.find(line)+200]
                               for s in safe_patterns):
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

    def scan_javascript(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Specialized scanner for JavaScript/TypeScript files"""
        findings = []

        if content is None:
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
            except Exception:
                return []

        lines = content.split('\n')

        # JavaScript-specific XSS patterns
        js_patterns = [
            {
                'name': 'document.write() with Variable',
                'pattern': r'document\.write\s*\([^)]*\$',
                'severity': 'high',
                'fix': 'Use textContent or sanitize before writing'
            },
            {
                'name': 'eval() in JavaScript',
                'pattern': r'\beval\s*\(',
                'severity': 'high',
                'fix': 'Avoid eval(); use JSON.parse() for JSON'
            },
            {
                'name': 'Function Constructor',
                'pattern': r'new\s+Function\s*\(',
                'severity': 'high',
                'fix': 'Use regular functions instead of dynamic constructors'
            },
            {
                'name': 'setTimeout/setInterval with String',
                'pattern': r'set(Timeo|Interval)\s*\(\s*["\']',
                'severity': 'medium',
                'fix': 'Pass function reference instead of string'
            },
            {
                'name': 'Unsanitized URL in href',
                'pattern': r'href\s*=\s*\{[^}]+\}',
                'severity': 'medium',
                'fix': 'Validate URLs against allowlist, use javascript:void(0) fallback'
            },
        ]

        for pattern_info in js_patterns:
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
                        'cwe_id': 'CWE-79',
                        'owasp_category': 'A03:2021 - Injection',
                    })

        return findings

    def scan_template_files(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Scan HTML/template files for XSS risks"""
        findings = []

        if content is None:
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
            except Exception:
                return []

        lines = content.split('\n')

        # Template-specific patterns (React, Vue, Angular, Jinja, etc.)
        template_patterns = [
            # React
            {
                'name': 'React Unescaped Interpolation',
                'pattern': r'\{\s*__html\s*:',
                'severity': 'high',
                'fix': 'Use DOMPurify.sanitize() before rendering'
            },
            # Vue
            {
                'name': 'Vue v-html Directive',
                'pattern': r'v-html\s*=',
                'severity': 'medium',
                'fix': 'Ensure content is sanitized; use v-text for plain text'
            },
            # Angular
            {
                'name': 'Angular Bypass Security',
                'pattern': r'bypassSecurityTrust',
                'severity': 'high',
                'fix': 'Only use with trusted content, validate input'
            },
            # Jinja2
            {
                'name': 'Jinja2 Autoescape Disabled',
                'pattern': r'\|\s*safe\s*\}',
                'severity': 'medium',
                'fix': 'Only mark trusted content as safe'
            },
        ]

        for pattern_info in template_patterns:
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
                        'cwe_id': 'CWE-79',
                        'owasp_category': 'A03:2021 - Injection',
                    })

        return findings
