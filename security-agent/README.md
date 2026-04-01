# 🔐 Security AI Agent - 30+ Years Cybersecurity Expertise

Your personal security expert that never sleeps. Scans code in real-time, sends Telegram alerts, and blocks vulnerable commits.

## Features

- **Real-Time Scanning** - Detects vulnerabilities as you type
- **Telegram Alerts** - Instant notifications on your phone
- **Pre-Commit Blocking** - Stops vulnerabilities before they're committed
- **Threat Intelligence** - Persistent database of all findings
- **5 Specialized Scanners** - Secrets, Injection, XSS, Auth, Config
- **Security Scoring** - Track your security posture over time

## Quick Start

### 1. Install Dependencies

```bash
cd security-agent
pip install -r requirements.txt
```

### 2. Setup Telegram (Optional but Recommended)

1. Open Telegram, search for `@BotFather`
2. Send `/newbot` and follow prompts
3. Copy the bot token to `.env.local`
4. Message your bot, then visit:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Find your chat ID and add to `.env.local`

```bash
# .env.local
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=987654321
```

### 3. Run the Security Agent

```bash
# Start the API server
python app.py

# Or run a one-time scan
python -c "from agent.security_agent import SecurityAgent; a = SecurityAgent(); a.scan_directory()"
```

### 4. Install Pre-Commit Hook

```bash
# Option A: Using pre-commit framework
pip install pre-commit
pre-commit install

# Option B: Manual hook
cp hooks/pre-commit-hook.py .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/security/health` | GET | Health check |
| `/api/security/scan/file` | POST | Scan single file |
| `/api/security/scan/directory` | POST | Scan directory |
| `/api/security/scan/pre-commit` | POST | Pre-commit scan |
| `/api/security/report` | GET | Security report |
| `/api/security/threats` | GET | List threats |
| `/api/security/statistics` | GET | Statistics |
| `/api/security/telegram/test` | POST | Test Telegram |

## Scanners

### Secrets Scanner
Detects hardcoded API keys, passwords, tokens:
- AWS keys
- Database connection strings
- JWT secrets
- GitHub tokens
- Anthropic/OpenAI keys

### Injection Scanner
Detects code injection vulnerabilities:
- SQL Injection (CWE-89)
- Command Injection (CWE-78)
- eval()/exec() usage (CWE-95)
- Pickle deserialization (CWE-502)

### XSS Scanner
Detects cross-site scripting:
- Unescaped user input
- dangerouslySetInnerHTML
- innerHTML assignments
- Template vulnerabilities

### Auth Scanner
Detects authentication flaws:
- Hardcoded passwords
- Weak hash algorithms (MD5, SHA1)
- JWT verification bypass
- Session fixation risks

### Config Scanner
Detects misconfigurations:
- Debug mode enabled
- CORS wildcard
- SSL verification disabled
- Insecure cookies
- Default secret keys

## Telegram Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/status` | Current security posture |
| `/report` | Full security report |
| `/scan` | Trigger immediate scan |
| `/help` | Show commands |
| `/fix <id>` | Get fix for threat |
| `/dismiss <id>` | Mark as false positive |

## Example Alert

```
🚨 SECURITY ALERT - CRITICAL

Threat: SQL Injection Vulnerability
File: src/api/users.py
Line: 42
Severity: 🔴 CRITICAL

Code:
  cursor.execute(f"SELECT * FROM users 
                  WHERE email = '{email}'")

Risk: Database can be compromised
Fix: Use parameterized queries

[📋 View Full Report] [✅ Mark Fixed]
```

## Project Structure

```
security-agent/
├── app.py                      # Flask API server
├── agent/
│   ├── security_agent.py       # Main orchestrator
│   ├── threat_detector.py      # Pattern matching
│   ├── vulnerability_db.py     # CWE/CVE knowledge
│   └── threat_memory.py        # SQLite storage
├── scanners/
│   ├── secrets_scanner.py
│   ├── injection_scanner.py
│   ├── xss_scanner.py
│   ├── auth_scanner.py
│   └── config_scanner.py
├── telegram/
│   ├── alerter.py              # Telegram sender
│   └── handlers.py             # Command handlers
├── hooks/
│   ├── pre_commit_hook.py      # Git hook
│   └── file_watcher.py         # Real-time monitor
├── database/
│   ├── schema.sql              # DB schema
│   └── threats.db              # SQLite DB (created)
└── requirements.txt
```

## Security Score

Your security score (0-100) is calculated based on:
- Open critical/high threats (heavy penalty)
- Threat fix rate
- Recent scan history

| Score | Rating |
|-------|--------|
| 90-100 | 🟢 Excellent |
| 70-89 | 🟡 Good |
| 50-69 | 🟠 Fair |
| 0-49 | 🔴 Poor |

## Contributing

To add new vulnerability patterns:

1. Edit `agent/vulnerability_db.py`
2. Add pattern to appropriate category
3. Include CWE ID and fix recommendation
4. Test with sample vulnerable code

## License

MIT - Free for educational and commercial use.

---

**Built with 30+ years of cybersecurity expertise encoded into automated scanners.**

Stay secure! 🔐
