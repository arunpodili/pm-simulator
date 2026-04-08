#!/bin/bash
# Production Deployment Script for PM Simulator
# Usage: ./deploy-production.sh [environment]

set -e

ENVIRONMENT="${1:-production}"
COMPOSE_FILE="docker-compose.production.yml"

echo "🚀 Deploying PM Simulator to $ENVIRONMENT..."
echo "=========================================="

# Check environment file
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found"
    echo "Copy .env.staging.example to .env.production and configure values"
    exit 1
fi

# Load environment variables
source .env.production

# Validate required variables
if [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET_KEY" ] || [ -z "$SECRET_KEY" ]; then
    echo "❌ Error: Required environment variables not set"
    echo "Please set: DB_PASSWORD, JWT_SECRET_KEY, SECRET_KEY"
    exit 1
fi

echo "✅ Environment variables loaded"

# Pull latest images
echo "📦 Pulling latest images..."
docker-compose -f $COMPOSE_FILE pull

# Database backup before migration
echo "💾 Creating database backup..."
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
docker-compose -f $COMPOSE_FILE exec -T database pg_dump \
    -U postgres pm_simulator > "$BACKUP_DIR/db_backup.sql" || echo "⚠️ Backup failed, continuing..."

# Rolling deployment - deploy one service at a time
echo "🔄 Starting rolling deployment..."

# 1. Database migrations (run first)
echo "🔧 Running database migrations..."
docker-compose -f $COMPOSE_FILE up -d database
sleep 5  # Wait for database to be ready
docker-compose -f $COMPOSE_FILE exec -T backend python -c "
import sys
sys.path.insert(0, 'backend')
from migrations.setup import run_migrations
run_migrations()
" || echo "⚠️ Migrations may have already been applied"

# 2. Deploy Redis
echo "🔧 Deploying Redis..."
docker-compose -f $COMPOSE_FILE up -d redis
sleep 3

# 3. Deploy Backend
echo "🔧 Deploying Backend..."
docker-compose -f $COMPOSE_FILE up -d backend
echo "⏳ Waiting for backend to be healthy..."
for i in {1..30}; do
    if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
        echo "✅ Backend is healthy"
        break
    fi
    sleep 2
done

# 4. Deploy Celery Workers
echo "🔧 Deploying Celery workers..."
docker-compose -f $COMPOSE_FILE up -d celery celery-beat

# 5. Deploy Frontend
echo "🔧 Deploying Frontend..."
docker-compose -f $COMPOSE_FILE up -d frontend

# 6. Deploy Nginx (load balancer)
echo "🔧 Deploying Nginx..."
docker-compose -f $COMPOSE_FILE up -d nginx

# Verify deployment
echo ""
echo "🔍 Verifying deployment..."
HEALTH=$(curl -s http://localhost/api/health || echo '{"status":"unavailable"}')
echo "Health Check: $HEALTH"

# Cleanup old images
echo ""
echo "🧹 Cleaning up old images..."
docker image prune -f

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo ""
echo "Services:"
echo "  - Frontend: http://localhost"
echo "  - Backend API: http://localhost/api"
echo "  - Health Check: http://localhost/api/health"
echo ""
echo "To view logs:"
echo "  docker-compose -f $COMPOSE_FILE logs -f"
echo ""
echo "To stop:"
echo "  docker-compose -f $COMPOSE_FILE down"
echo "=========================================="
