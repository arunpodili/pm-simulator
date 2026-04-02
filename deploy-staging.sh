#!/bin/bash
# Staging Deployment Script - PM Simulator v2.0
# Usage: ./deploy-staging.sh [init|deploy|rollback|logs|cleanup]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.staging.yml"
ENV_FILE="$SCRIPT_DIR/.env.staging"
BACKUP_DIR="$SCRIPT_DIR/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed."; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { log_error "Docker Compose is required but not installed."; exit 1; }

    if [ ! -f "$ENV_FILE" ]; then
        log_warn ".env.staging not found. Creating from example..."
        cp "$SCRIPT_DIR/.env.staging.example" "$ENV_FILE"
        log_warn "Please edit $ENV_FILE with your actual values before deploying."
        exit 1
    fi

    # Check if required env vars are set
    source "$ENV_FILE"
    if [ -z "$JWT_SECRET_KEY" ] || [ "$JWT_SECRET_KEY" = "your-256-bit-secret-key-change-this-in-production" ]; then
        log_error "JWT_SECRET_KEY not set or using default value. Please set a secure value in $ENV_FILE"
        exit 1
    fi

    if [ -z "$REDIS_PASSWORD" ] || [ "$REDIS_PASSWORD" = "your-strong-redis-password-change-this" ]; then
        log_error "REDIS_PASSWORD not set or using default value. Please set a secure value in $ENV_FILE"
        exit 1
    fi

    log_info "Prerequisites check passed"
}

# Initialize staging environment
init() {
    log_info "Initializing staging environment..."

    # Create required directories
    mkdir -p "$SCRIPT_DIR/nginx/ssl"
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$SCRIPT_DIR/logs"

    # Generate self-signed SSL certificate for staging
    if [ ! -f "$SCRIPT_DIR/nginx/ssl/staging.crt" ]; then
        log_info "Generating self-signed SSL certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$SCRIPT_DIR/nginx/ssl/staging.key" \
            -out "$SCRIPT_DIR/nginx/ssl/staging.crt" \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    fi

    # Pull images
    docker-compose -f "$COMPOSE_FILE" pull

    log_info "Initialization complete"
}

# Deploy to staging
deploy() {
    log_info "Starting staging deployment..."

    check_prerequisites

    # Create backup of current state
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        backup_name="backup-$(date +%Y%m%d-%H%M%S)"
        log_info "Creating backup: $backup_name"
        docker-compose -f "$COMPOSE_FILE" exec -T redis redis-cli SAVE || true
        cp -r "$SCRIPT_DIR/redis-data" "$BACKUP_DIR/$backup_name-redis" 2>/dev/null || true
    fi

    # Build and start services
    log_info "Building and starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d --build

    # Wait for health checks
    log_info "Waiting for services to be healthy..."
    sleep 10

    # Check API health
    max_attempts=30
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -sf http://localhost:5001/api/health >/dev/null 2>&1; then
            log_info "API is healthy!"
            break
        fi
        log_info "Waiting for API... (attempt $attempt/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done

    if [ $attempt -gt $max_attempts ]; then
        log_error "API failed to start. Check logs with: ./deploy-staging.sh logs"
        exit 1
    fi

    # Show status
    log_info "Deployment successful!"
    docker-compose -f "$COMPOSE_FILE" ps

    echo ""
    log_info "Services available at:"
    log_info "  - API: http://localhost:5001"
    log_info "  - Nginx: http://localhost (port 80/443)"
    echo ""
    log_info "Health check: curl http://localhost:5001/api/health"
}

# Show logs
show_logs() {
    service="${1:-}"
    if [ -z "$service" ]; then
        docker-compose -f "$COMPOSE_FILE" logs -f
    else
        docker-compose -f "$COMPOSE_FILE" logs -f "$service"
    fi
}

# Rollback to previous version
rollback() {
    log_warn "Rolling back deployment..."

    # Stop current services
    docker-compose -f "$COMPOSE_FILE" down

    # Restore from backup if exists
    latest_backup=$(ls -t "$BACKUP_DIR" | head -1)
    if [ -n "$latest_backup" ]; then
        log_info "Restoring from backup: $latest_backup"
        # Restore redis data
        if [ -d "$BACKUP_DIR/$latest_backup-redis" ]; then
            rm -rf "$SCRIPT_DIR/redis-data"
            cp -r "$BACKUP_DIR/$latest_backup-redis" "$SCRIPT_DIR/redis-data"
        fi
    fi

    # Restart services
    docker-compose -f "$COMPOSE_FILE" up -d

    log_info "Rollback complete"
}

# Cleanup old data
cleanup() {
    log_info "Running cleanup..."

    # Remove old backups (keep last 10)
    cd "$BACKUP_DIR" && ls -t | tail -n +11 | xargs -r rm -rf

    # Prune docker
    docker system prune -f

    # Trigger API cleanup
    curl -sf http://localhost:5001/api/admin/cleanup -X POST \
        -H "Authorization: Bearer $(source $ENV_FILE; echo $ADMIN_TOKEN)" \
        -H "Content-Type: application/json" \
        -d '{"action": "expired"}' 2>/dev/null || true

    log_info "Cleanup complete"
}

# Stop services
stop() {
    log_info "Stopping services..."
    docker-compose -f "$COMPOSE_FILE" down
    log_info "Services stopped"
}

# Main command handler
case "${1:-deploy}" in
    init)
        init
        ;;
    deploy)
        deploy
        ;;
    logs)
        show_logs "$2"
        ;;
    rollback)
        rollback
        ;;
    cleanup)
        cleanup
        ;;
    stop)
        stop
        ;;
    *)
        echo "Usage: $0 [init|deploy|logs|rollback|cleanup|stop]"
        echo ""
        echo "Commands:"
        echo "  init      - Initialize staging environment"
        echo "  deploy    - Deploy to staging (default)"
        echo "  logs      - Show logs [service]"
        echo "  rollback  - Rollback to previous version"
        echo "  cleanup   - Cleanup old data"
        echo "  stop      - Stop all services"
        exit 1
        ;;
esac
