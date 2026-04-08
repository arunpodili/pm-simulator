# Production Deployment Guide

This guide walks through deploying PM Simulator to a production server.

## Prerequisites

- **Server**: Ubuntu 22.04 LTS (or compatible)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 50GB SSD minimum
- **Domain**: Configured DNS pointing to your server
- **SSL**: Let's Encrypt certificates (optional but recommended)

## Quick Deploy (Automated)

If CI/CD is configured:

1. Push to `main` branch
2. GitHub Actions automatically:
   - Runs tests
   - Builds Docker images
   - Deploys to your server

## Manual Deployment

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository -y "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install git
sudo apt install -y git
```

### Step 2: Clone Repository

```bash
# Create deployment directory
sudo mkdir -p /opt/pm-simulator
sudo chown $USER:$USER /opt/pm-simulator

# Clone repository
git clone https://github.com/arunpodili/pm-simulator.git /opt/pm-simulator
cd /opt/pm-simulator
```

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.production.example .env.production

# Generate secure secrets
JWT_SECRET=$(openssl rand -hex 32)
SECRET_KEY=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -base64 24)

# Edit .env.production
nano .env.production
```

**Required values to set:**

```bash
# Security (use generated values from above)
JWT_SECRET_KEY=$JWT_SECRET
SECRET_KEY=$SECRET_KEY
DB_PASSWORD=$DB_PASSWORD

# If using Ollama for LLM mode (optional)
# Requires 7GB+ RAM for qwen3.5 model
# OLLAMA_URL=http://ollama:11434

# Cloud LLM (optional but recommended)
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
```

Save and exit (`Ctrl+X`, `Y`, `Enter`).

### Step 4: SSL Certificates (Optional)

For HTTPS support:

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Install certbot
sudo apt install -y certbot

# Generate certificate (if you have a domain)
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
sudo chown -R $USER:$USER nginx/ssl/

# Update nginx config for SSL
# Uncomment HTTPS server section in nginx/nginx.production.conf
```

### Step 5: Run Deployment

```bash
# Make deploy script executable
chmod +x deploy-production.sh

# Run deployment
./deploy-production.sh
```

The deployment script will:
1. Load environment variables
2. Create database backup
3. Run database migrations
4. Deploy services in order (database → redis → backend → celery → frontend → nginx)
5. Verify health checks
6. Clean up old Docker images

### Step 6: Verify Deployment

```bash
# Check all services are running
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Test health endpoint
curl http://localhost/api/health

# Should return:
# {"status":"healthy","timestamp":"2026-04-08T10:30:00Z"}
```

### Step 7: Setup Reverse Proxy (External Nginx)

If using external nginx (not the container):

```bash
# Install nginx
sudo apt install -y nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/pm-simulator
```

Add configuration:

```nginx
upstream pm_backend {
    server localhost:5001;
    keepalive 32;
}

upstream pm_frontend {
    server localhost:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # API requests
    location /api/ {
        proxy_pass http://pm_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SSE streaming
    location /api/simulation/stream {
        proxy_pass http://pm_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
    }

    # Static files
    location /_next/static/ {
        proxy_pass http://pm_frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # All other requests
    location / {
        proxy_pass http://pm_frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/pm-simulator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Maintenance

### Updating the Application

**With CI/CD:**
```bash
# Just push to main, CI/CD handles the rest
git push origin main
```

**Manual update:**
```bash
cd /opt/pm-simulator

# Pull latest changes
git pull origin main

# Re-run deployment
./deploy-production.sh
```

### Database Migrations

Migrations run automatically during deployment, but for manual control:

```bash
# View migration status
docker-compose -f docker-compose.production.yml exec backend python -c "
import sys
sys.path.insert(0, 'backend')
from migrations.setup import get_migration_status
print(get_migration_status())
"

# Run migrations manually
docker-compose -f docker-compose.production.yml exec backend python -c "
import sys
sys.path.insert(0, 'backend')
from migrations.setup import run_migrations
run_migrations()
"
```

### Database Backups

The deployment script backs up before migrations. For manual backups:

```bash
# Create backup directory
mkdir -p ./backups/$(date +%Y%m%d_%H%M%S)

# Backup database
docker-compose -f docker-compose.production.yml exec -T database pg_dump \
    -U postgres pm_simulator > ./backups/$(date +%Y%m%d_%H%M%S)/manual_backup.sql

# Backup to S3 (optional)
aws s3 cp ./backups/ s3://your-bucket/pm-simulator-backups/ --recursive
```

### Restore from Backup

```bash
# Stop app
docker-compose -f docker-compose.production.yml down

# Restore database
docker-compose -f docker-compose.production.yml up -d database
sleep 5
cat ./backups/20260408_120000/db_backup.sql | \
    docker-compose -f docker-compose.production.yml exec -T database psql -U postgres pm_simulator

# Restart app
./deploy-production.sh
```

### Monitoring Logs

```bash
# All services
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker-compose -f docker-compose.production.yml logs -f backend
docker-compose -f docker-compose.production.yml logs -f celery

# View last 100 lines
docker-compose -f docker-compose.production.yml logs --tail=100 backend
```

### Scaling

**Scale Celery workers:**
```bash
# Add more workers
docker-compose -f docker-compose.production.yml up -d --scale celery=3

# Or edit docker-compose.production.yml and redeploy
```

**Database connection limits:**
```bash
# Check current connections
docker-compose -f docker-compose.production.yml exec database psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs for errors
docker-compose -f docker-compose.production.yml logs --tail=50

# Verify environment variables
source .env.production && echo $JWT_SECRET_KEY

# Check disk space
df -h

# Check memory
free -h
```

### Database Connection Failed

```bash
# Check database is running
docker-compose -f docker-compose.production.yml ps database

# Verify credentials
docker-compose -f docker-compose.production.yml exec database psql -U postgres -c "\l"

# Check connection from backend
docker-compose -f docker-compose.production.yml exec backend python -c "
from database import db_manager
db_manager.init_engine()
print('Connection successful')
"
```

### 502 Bad Gateway

```bash
# Check backend health
curl http://localhost:5001/api/health

# Restart backend
docker-compose -f docker-compose.production.yml restart backend

# Check nginx configuration
sudo nginx -t
```

### High Memory Usage

```bash
# Check container memory
docker stats

# If Ollama is using too much:
# Edit docker-compose to limit memory or disable LLM mode
docker-compose -f docker-compose.production.yml exec ollama ollama stop qwen3.5
```

## Security Checklist

- [ ] Change default passwords in `.env.production`
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure firewall (only open 80, 443, SSH)
- [ ] Set up fail2ban for SSH protection
- [ ] Enable automatic security updates
- [ ] Regular database backups
- [ ] Log monitoring and alerting
- [ ] Keep Docker images updated

## Rollback Procedure

If a deployment fails:

```bash
cd /opt/pm-simulator

# 1. Stop services
docker-compose -f docker-compose.production.yml down

# 2. Restore previous Docker images (if available)
docker-compose -f docker-compose.production.yml pull

# 3. Restore database from backup
# (Use most recent backup from ./backups/)
cat ./backups/BACKUP_DIR/db_backup.sql | \
    docker-compose -f docker-compose.production.yml exec -T database psql -U postgres pm_simulator

# 4. Re-deploy
git checkout HEAD~1  # Go to previous commit if needed
./deploy-production.sh
```

## Support

- **Issues**: https://github.com/arunpodili/pm-simulator/issues
- **Documentation**: https://docs.pm-simulator.com
- **Email**: support@pm-simulator.com
