"""
Secrets Scanner - Detect Hardcoded Credentials

Scans for API keys, passwords, tokens, and other secrets in code.
Based on 30+ years of security audit experience.
"""

import re
from typing import List, Dict, Any
from pathlib import Path


class SecretsScanner:
    """
    Detect hardcoded secrets in source code.

    This is the #1 cause of security breaches - developers
    accidentally committing credentials to version control.
    """

    def __init__(self):
        self.findings = []

    def scan_file(self, file_path: str, content: str = None) -> List[Dict[str, Any]]:
        """Scan a file for hardcoded secrets"""
        self.findings = []

        if content is None:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception:
                return []

        # Skip certain files
        skip_patterns = [
            r'\.min\.',           # Minified files
            r'package-lock\.json', # Lock files have many hashes
            r'\.lock$',
            r'node_modules/',
            r'__pycache__/',
            r'\.pyc$',
            r'\.git/',
        ]

        for pattern in skip_patterns:
            if re.search(pattern, file_path):
                return []

        lines = content.split('\n')

        # Import patterns from VulnerabilityDB
        from agent.vulnerability_db import VulnerabilityDB
        patterns = VulnerabilityDB.SECRETS_PATTERNS

        for pattern_info in patterns:
            pattern = pattern_info['pattern']
            regex = re.compile(pattern, re.IGNORECASE)

            for line_num, line in enumerate(lines, 1):
                matches = regex.finditer(line)

                for match in matches:
                    # Don't flag example/placeholder values
                    if self._is_false_positive(line, match.group()):
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
                        'match': match.group()[:100]  # For deduplication
                    })

        return self.findings

    def _is_false_positive(self, line: str, match: str) -> bool:
        """
        Check if this is a false positive.

        Experience: Many "secrets" are actually placeholders or examples.
        """
        line_lower = line.lower()

        # Placeholder patterns
        false_positive_indicators = [
            'example',
            'placeholder',
            'your_',
            'xxx',
            '***',
            'changeme',
            'replace_me',
            'todo',
            'fixme',
            '<your',
            '${',
            'process.env',
            'os.getenv',
            'os.environ',
        ]

        for indicator in false_positive_indicators:
            if indicator in line_lower:
                return True

        # Test/fixture files often have fake data
        if 'test' in line_lower or 'fixture' in line_lower:
            if 'fake' in line_lower or 'dummy' in line_lower:
                return True

        return False

    def scan_directory(
        self,
        directory: str,
        extensions: List[str] = None
    ) -> List[Dict[str, Any]]:
        """Scan all files in a directory"""
        if extensions is None:
            extensions = ['.py', '.js', '.ts', '.jsx', '.tsx', '.env', '.yaml', '.yml', '.json', '.md']

        all_findings = []
        dir_path = Path(directory)

        for ext in extensions:
            for file_path in dir_path.rglob(f'*{ext}'):
                findings = self.scan_file(str(file_path))
                all_findings.extend(findings)

        return all_findings

    def get_severity_summary(self, findings: List[Dict]) -> Dict[str, int]:
        """Get count of findings by severity"""
        summary = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'info': 0}

        for finding in findings:
            severity = finding.get('severity', 'info').lower()
            summary[severity] = summary.get(severity, 0) + 1

        return summary
