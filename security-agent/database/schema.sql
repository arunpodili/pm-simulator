-- Security AI Agent - Threat Intelligence Database Schema

-- Main threats table
CREATE TABLE IF NOT EXISTS threats (
    id TEXT PRIMARY KEY,
    threat_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK(severity IN ('critical', 'high', 'medium', 'low', 'info')),
    file_path TEXT NOT NULL,
    line_number INTEGER,
    code_snippet TEXT,
    fix_recommendation TEXT,
    cwe_id TEXT,
    cve_id TEXT,
    mitre_attack_id TEXT,
    owasp_category TEXT,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'acknowledged', 'fixed', 'false_positive', 'ignored')),
    first_detected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    occurrence_count INTEGER DEFAULT 1,
    fixed_at TIMESTAMP,
    fixed_by TEXT,
    telegram_sent INTEGER DEFAULT 0,
    telegram_message_id TEXT
);

-- Threat patterns knowledge base
CREATE TABLE IF NOT EXISTS patterns (
    id TEXT PRIMARY KEY,
    pattern_name TEXT NOT NULL,
    pattern_regex TEXT NOT NULL,
    language TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT,
    fix_template TEXT,
    cwe_id TEXT,
    is_active INTEGER DEFAULT 1
);

-- Scan history
CREATE TABLE IF NOT EXISTS scan_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scan_type TEXT NOT NULL,
    files_scanned INTEGER,
    threats_found INTEGER,
    critical_count INTEGER DEFAULT 0,
    high_count INTEGER DEFAULT 0,
    medium_count INTEGER DEFAULT 0,
    low_count INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds REAL
);

-- File risk scores (track risky files over time)
CREATE TABLE IF NOT EXISTS file_risk_scores (
    file_path TEXT PRIMARY KEY,
    risk_score REAL DEFAULT 0,
    total_scans INTEGER DEFAULT 0,
    total_threats INTEGER DEFAULT 0,
    last_scan_at TIMESTAMP,
    trend TEXT CHECK(trend IN ('improving', 'stable', 'degrading'))
);

-- Developer security metrics
CREATE TABLE IF NOT EXISTS developer_metrics (
    developer TEXT PRIMARY KEY,
    total_commits INTEGER DEFAULT 0,
    threats_introduced INTEGER DEFAULT 0,
    threats_fixed INTEGER DEFAULT 0,
    security_score REAL DEFAULT 100,
    last_commit_at TIMESTAMP
);

-- Telegram notification log
CREATE TABLE IF NOT EXISTS telegram_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    threat_id TEXT,
    message_type TEXT,
    message_id TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_threats_severity ON threats(severity);
CREATE INDEX IF NOT EXISTS idx_threats_status ON threats(status);
CREATE INDEX IF NOT EXISTS idx_threats_file_path ON threats(file_path);
CREATE INDEX IF NOT EXISTS idx_threats_detected ON threats(first_detected);
CREATE INDEX IF NOT EXISTS idx_patterns_language ON patterns(language);
CREATE INDEX IF NOT EXISTS idx_patterns_active ON patterns(is_active);
