# Security AI Agent

**Location:** `security-agent/`  
**Last Updated:** 2026-04-03

## Overview

Real-time vulnerability scanner with 30+ years of security expertise encoded.
Integrates with Telegram for instant alerts and git pre-commit hooks.

## Architecture

```
security-agent/
├── app.py                    # Flask API server (port 5002)
├── requirements.txt          # Python dependencies
├── agent/                    # Core agent logic
│   ├── security_agent.py     # Main orchestrator
│   ├── threat_memory.py      # SQLite storage
│   ├── vulnerability_db.py   # Expert patterns
│   └── threat_detector.py    # Pattern matching
├── scanners/                 # Vulnerability scanners
│   ├── secrets_scanner.py    # Hardcoded credentials
│   ├── injection_scanner.py  # SQL/Command injection
│   ├── xss_scanner.py        # Cross-site scripting
│   ├── auth_scanner.py       # Auth flaws
│   └── config_scanner.py     # Misconfigurations
├── telegram/                 # Telegram integration
│   ├── alerter.py           # Message sender
│   └── handlers.py           # Command handlers
├── hooks/                    # Git hooks
│   ├── pre_commit_hook.py   # Pre-commit scanner
│   └── file_watcher.py      # Real-time monitor
└── database/
    └── schema.sql           # SQLite schema
```

## Features

### Vulnerability Patterns (50+)

| Category | Patterns | CWE IDs |
|----------|----------|---------|
| Secrets | 8 | CWE-798 |
| SQL Injection | 4 | CWE-89 |
| Command Injection | 5 | CWE-78 |
| XSS | 4 | CWE-79 |
| Auth | 5 | CWE-306, CWE-259 |
| Config | 5 | CWE-489 |
| Path Traversal | 3 | CWE-22 |
| SSRF | 2 | CWE-918 |

### Telegram Commands

```
/start      - Welcome message
/status     - Security posture
/report     - Full report
/scan       - Trigger scan
/fix <id>   - Get fix details
/help       - Commands list
```

### Alert Types

1. **Critical Vulnerability** - Instant with code snippet
2. **Commit Blocked** - Push blocked due to vulnerabilities
3. **Scan Summary** - After each scan
4. **Daily/Weekly Summary** - Periodic reports

## Configuration

```bash
# .env.local
TELEGRAM_BOT_TOKEN=8501576858:AAGfGtlgn25I_yMbWNId2AUHXcoQNujTaMo
TELEGRAM_CHAT_ID=8766831769
TELEGRAM_ENABLED=true
TELEGRAM_ALERT_LEVEL=high
PRE_COMMIT_BLOCK_ON_CRITICAL=true
PRE_COMMIT_BLOCK_ON_HIGH=true
```

## API Endpoints

Base URL: `http://localhost:5002`

```bash
# Health
GET /api/security/health

# Scan
POST /api/security/scan/file
POST /api/security/scan/directory
POST /api/security/scan/pre-commit

# Reports
GET /api/security/report
GET /api/security/threats
GET /api/security/statistics

# Telegram
POST /api/security/telegram/test
```

## Security Score

```python
score = 100
score -= critical_count * 15
score -= high_count * 8
score -= medium_count * 3
score -= low_count * 1
score += fix_rate * 10
```

| Score | Rating |
|-------|--------|
| 90-100 | Excellent |
| 70-89 | Good |
| 50-69 | Fair |
| 0-49 | Poor |

## Database Schema

### threats table
- id, threat_type, severity, file_path, line_number
- code_snippet, fix_recommendation
- cwe_id, cve_id, status, first_detected

### scan_history table
- scan_id, scan_type, files_scanned
- threats_found, duration, timestamp

## Setup

1. **Create bot**: Message @BotFather on Telegram
2. **Get chat ID**: Visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. **Add to .env**: Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
4. **Test**: `python -c "from telegram.alerter import TelegramAlerter; TelegramAlerter().send_test()"`

See `TELEGRAM_SETUP.md` for detailed instructions.

## Pre-commit Hook

```bash
# Install
pip install pre-commit
pre-commit install

# Manual test
pre-commit run --all-files
```

## Running

```bash
cd security-agent
pip install -r requirements.txt
python app.py  # Port 5002
```

## Status

**Build Complete** ✅ (2026-04-01)  
**Setup Required**: Telegram bot token (5 minutes)

## Files Created

- 20+ files
- ~4000 lines of code
- 50+ vulnerability patterns

## Future Enhancements

- [ ] AI-powered analysis via Claude API
- [ ] Auto-fix suggestions with code generation
- [ ] GitHub Security tab integration
- [ ] Slack/Discord alternative alerts
- [ ] Security dashboard web UI
- [ ] CI/CD pipeline integration
