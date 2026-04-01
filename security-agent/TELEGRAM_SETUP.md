# 📱 Telegram Setup Guide - 5 Minutes

Follow these steps to receive security alerts on Telegram.

---

## Step 1: Create Your Bot (2 minutes)

1. **Open Telegram** on your phone or desktop

2. **Search for @BotFather** (the official bot for creating bots)

3. **Start a chat** with BotFather and send:
   ```
   /newbot
   ```

4. **BotFather will ask for a name:**
   ```
   PM Simulator Security
   ```

5. **BotFather will ask for a username:**
   ```
   pm_sec_bot_12345
   ```
   (Must end with 'bot' and be unique - add numbers if taken)

6. **BotFather will reply with your TOKEN:**
   ```
   Done! Use this token to access the HTTP API:
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

7. **COPY THIS TOKEN** - you'll need it in Step 3

---

## Step 2: Get Your Chat ID (1 minute)

1. **Find your new bot** in Telegram (search for the username you created)

2. **Click START** or send any message like `hello`

3. **Open this URL in your browser** (replace YOUR_TOKEN with your actual token):
   ```
   https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/getUpdates
   ```

4. **Look for the JSON response** like this:
   ```json
   {
     "ok": true,
     "result": [
       {
         "message": {
           "chat": {
             "id": 987654321,
             "first_name": "Your Name",
             "type": "private"
           }
         }
       }
     ]
   }
   ```

5. **COPY the "id" number** (e.g., `987654321`) - this is your CHAT_ID

---

## Step 3: Add to .env.local (1 minute)

Open `C:\Users\DELL\pm-simulator\.env.local` and add:

```bash
# Telegram Configuration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=987654321
TELEGRAM_ENABLED=true
TELEGRAM_ALERT_LEVEL=high
```

Replace with YOUR actual token and chat ID.

---

## Step 4: Test Connection (1 minute)

### Option A: Via API

```bash
curl -X POST http://localhost:5002/api/security/telegram/test
```

### Option B: Via Python

```bash
cd security-agent
python -c "from telegram.alerter import TelegramAlerter; a = TelegramAlerter('YOUR_TOKEN', 'YOUR_CHAT_ID'); a.test_connection()"
```

### Option C: Start the Server

```bash
cd security-agent
python app.py
```

You should receive a welcome message from your bot!

---

## What You'll Receive

### 🚨 Critical Vulnerability Found
Instant alert when SQL injection, hardcoded secrets, or other critical issues are detected.

### 🛑 Commit Blocked
When you try to commit code with vulnerabilities, you'll get notified immediately.

### 📊 Daily/Weekly Summary
Optional summary of:
- Threats found
- Issues fixed
- Security score trends

---

## Troubleshooting

### "Bot not responding"
- Check if token is correct (no extra spaces)
- Ensure you sent /start to the bot
- Verify chat ID is a number (not string)

### "Not receiving alerts"
- Check `TELEGRAM_ENABLED=true` in .env.local
- Verify `TELEGRAM_ALERT_LEVEL` - set to `low` to see all alerts
- Check if bot is blocked in Telegram

### "Invalid token"
- Token format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
- No spaces, no quotes around it
- Get fresh token from @BotFather if needed

---

## Privacy & Security

- ✅ Bot only sends alerts to YOUR chat (private)
- ✅ No data shared with Telegram beyond message content
- ✅ Token stored locally in .env.local (gitignored)
- ✅ Bot cannot read your messages or files

---

## Customize Alerts

Edit `.env.local`:

```bash
# Alert levels: critical, high, medium, low
TELEGRAM_ALERT_LEVEL=high

# Summaries
TELEGRAM_DAILY_SUMMARY=false
TELEGRAM_WEEKLY_SUMMARY=true
```

---

**Done! You're now protected by a 30-year cybersecurity expert in your pocket.** 🔐
