"""
Threat Memory - Persistent Security Knowledge Storage

Stores all discovered threats, patterns, and learnings in SQLite.
This is the "brain" of the Security AI Agent - it remembers everything.
"""

import sqlite3
import json
import hashlib
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path


class ThreatMemory:
    """
    Persistent storage for all security threats and intelligence.

    This is the institutional memory of your security efforts -
    it tracks what was found, when, where, and how it was fixed.
    """

    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = Path(__file__).parent.parent / "database" / "threats.db"

        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_database()

    def _init_database(self):
        """Initialize database with schema"""
        schema_path = Path(__file__).parent.parent / "database" / "schema.sql"

        conn = sqlite3.connect(self.db_path)
        if schema_path.exists():
            with open(schema_path, 'r') as f:
                conn.executescript(f.read())
        conn.commit()
        conn.close()

    def _get_connection(self):
        """Get database connection with row factory"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def store_threat(
        self,
        threat_type: str,
        severity: str,
        file_path: str,
        line_number: int,
        code_snippet: str,
        fix_recommendation: str,
        cwe_id: str = None,
        cve_id: str = None,
        mitre_attack_id: str = None,
        owasp_category: str = None
    ) -> str:
        """
        Store a new threat in the database.

        Returns threat ID for tracking.
        """
        threat_id = hashlib.md5(
            f"{threat_type}:{file_path}:{line_number}:{code_snippet[:50]}".encode()
        ).hexdigest()[:12]

        conn = self._get_connection()
        cursor = conn.cursor()

        # Check if threat already exists
        cursor.execute(
            "SELECT id, occurrence_count FROM threats WHERE id = ?",
            (threat_id,)
        )
        existing = cursor.fetchone()

        if existing:
            # Update existing threat
            cursor.execute(
                """UPDATE threats SET
                   last_seen = ?,
                   occurrence_count = occurrence_count + 1
                   WHERE id = ?""",
                (datetime.now().isoformat(), threat_id)
            )
        else:
            # Insert new threat
            cursor.execute(
                """INSERT INTO threats
                   (id, threat_type, severity, file_path, line_number,
                    code_snippet, fix_recommendation, cwe_id, cve_id,
                    mitre_attack_id, owasp_category)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (threat_id, threat_type, severity, file_path, line_number,
                 code_snippet, fix_recommendation, cwe_id, cve_id,
                 mitre_attack_id, owasp_category)
            )

        conn.commit()
        conn.close()

        return threat_id

    def mark_threat_fixed(self, threat_id: str, fixed_by: str = None):
        """Mark a threat as fixed"""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """UPDATE threats SET
               status = 'fixed',
               fixed_at = ?,
               fixed_by = ?
               WHERE id = ?""",
            (datetime.now().isoformat(), fixed_by, threat_id)
        )

        conn.commit()
        conn.close()

    def get_open_threats(
        self,
        severity: str = None,
        file_path: str = None,
        limit: int = None
    ) -> List[Dict]:
        """Get open threats, optionally filtered"""
        conn = self._get_connection()
        cursor = conn.cursor()

        query = "SELECT * FROM threats WHERE status = 'open'"
        params = []

        if severity:
            query += " AND severity = ?"
            params.append(severity)

        if file_path:
            query += " AND file_path LIKE ?"
            params.append(f"%{file_path}%")

        query += " ORDER BY "
        query += "CASE severity "
        query += "WHEN 'critical' THEN 1 "
        query += "WHEN 'high' THEN 2 "
        query += "WHEN 'medium' THEN 3 "
        query += "WHEN 'low' THEN 4 "
        query += "ELSE 5 END, "
        query += "first_detected DESC"

        if limit:
            query += " LIMIT ?"
            params.append(limit)

        cursor.execute(query, params)
        threats = [dict(row) for row in cursor.fetchall()]
        conn.close()

        return threats

    def get_threat_by_id(self, threat_id: str) -> Optional[Dict]:
        """Get a specific threat by ID"""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM threats WHERE id = ?", (threat_id,))
        row = cursor.fetchone()
        conn.close()

        return dict(row) if row else None

    def get_statistics(self) -> Dict[str, Any]:
        """Get overall security statistics"""
        conn = self._get_connection()
        cursor = conn.cursor()

        # Total threats by status
        cursor.execute("""
            SELECT status, COUNT(*) as count
            FROM threats
            GROUP BY status
        """)
        by_status = {row['status']: row['count'] for row in cursor.fetchall()}

        # Total threats by severity
        cursor.execute("""
            SELECT severity, COUNT(*) as count
            FROM threats
            GROUP BY severity
        """)
        by_severity = {row['severity']: row['count'] for row in cursor.fetchall()}

        # Top risky files
        cursor.execute("""
            SELECT file_path, COUNT(*) as threat_count
            FROM threats
            GROUP BY file_path
            ORDER BY threat_count DESC
            LIMIT 10
        """)
        risky_files = [dict(row) for row in cursor.fetchall()]

        # Recent activity
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM threats
            WHERE first_detected >= datetime('now', '-7 days')
        """)
        new_this_week = cursor.fetchone()['count']

        conn.close()

        return {
            'by_status': by_status,
            'by_severity': by_severity,
            'risky_files': risky_files,
            'new_this_week': new_this_week,
            'total_threats': sum(by_status.values())
        }

    def log_telegram_notification(
        self,
        threat_id: str,
        message_type: str,
        message_id: str,
        status: str = 'sent'
    ):
        """Log that a Telegram notification was sent"""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """INSERT INTO telegram_log
               (threat_id, message_type, message_id, status)
               VALUES (?, ?, ?, ?)""",
            (threat_id, message_type, message_id, status)
        )

        cursor.execute(
            "UPDATE threats SET telegram_sent = 1 WHERE id = ?",
            (threat_id,)
        )

        conn.commit()
        conn.close()

    def get_threats_needing_telegram(self) -> List[Dict]:
        """Get open threats that haven't been sent to Telegram yet"""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM threats
            WHERE status = 'open'
            AND telegram_sent = 0
            ORDER BY
                CASE severity
                WHEN 'critical' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                ELSE 4 END
        """)

        threats = [dict(row) for row in cursor.fetchall()]
        conn.close()

        return threats

    def add_scan_history(
        self,
        scan_type: str,
        files_scanned: int,
        threats_found: int,
        critical_count: int = 0,
        high_count: int = 0,
        medium_count: int = 0,
        low_count: int = 0,
        duration_seconds: float = 0
    ):
        """Record a scan in history"""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """INSERT INTO scan_history
               (scan_type, files_scanned, threats_found,
                critical_count, high_count, medium_count, low_count,
                duration_seconds)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (scan_type, files_scanned, threats_found,
             critical_count, high_count, medium_count, low_count,
             duration_seconds)
        )

        conn.commit()
        conn.close()

    def get_security_score(self) -> float:
        """
        Calculate overall security score (0-100).

        Based on:
        - Open critical/high threats (heavy penalty)
        - Threat fix rate
        - Recent scan history
        """
        stats = self.get_statistics()

        score = 100.0

        # Penalty for open threats
        score -= stats['by_severity'].get('critical', 0) * 15
        score -= stats['by_severity'].get('high', 0) * 8
        score -= stats['by_severity'].get('medium', 0) * 3
        score -= stats['by_severity'].get('low', 0) * 1

        # Bonus for fix rate
        total = stats['total_threats']
        if total > 0:
            fixed = stats['by_status'].get('fixed', 0)
            fix_rate = fixed / total
            score += fix_rate * 10

        return max(0, min(100, score))

    def export_threats(self, format: str = 'json') -> str:
        """Export all threats for reporting"""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM threats ORDER BY first_detected DESC")
        threats = [dict(row) for row in cursor.fetchall()]
        conn.close()

        if format == 'json':
            return json.dumps(threats, indent=2, default=str)

        return str(threats)
