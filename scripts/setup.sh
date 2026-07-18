#!/bin/bash
# =============================================================================
# SAT-MSS Setup Script
# Local developer environment setup script for UNIX-like environments.
# =============================================================================

set -e

echo "=== SAT-MSS Developer Environment Setup ==="

# 1. Verify dependencies
if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm package manager is required. Install via: npm install -g pnpm"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "Warning: docker is not installed. Local databases will not start automatically."
fi

# 2. Copy environment template
if [ ! -f .env ]; then
    echo "Creating .env configuration file from example template..."
    cp .env.example .env
    # Generate random secrets
    JWT_SECRET_RAND=$(openssl rand -hex 32 2>/dev/null || echo "fallback_jwt_secret_random_64_characters_long_fallback_value_123")
    JWT_REFRESH_SECRET_RAND=$(openssl rand -hex 32 2>/dev/null || echo "fallback_jwt_refresh_secret_random_64_characters_long_value_456")
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET_RAND/" .env
    sed -i.bak "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET_RAND/" .env
    rm -f .env.bak
    echo ".env created with generated security secrets."
fi

# 3. Install packages
echo "Installing monorepo dependencies..."
pnpm install

# 4. Spin up Docker containers
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo "Spinning up Docker containers (PostgreSQL, Redis, MinIO)..."
    docker compose up -d
    echo "Waiting for PostgreSQL to be healthy..."
    until docker exec satmss_postgres pg_isready -U satmss -d satmss > /dev/null 2>&1; do
        sleep 1
    done
    echo "Database containers are online and healthy."
fi

# 5. Run Migrations & Seeding
echo "Running database migrations..."
pnpm db:migrate

echo "Seeding database with default accounts and configurations..."
pnpm db:seed

echo "=== Setup complete! Run 'pnpm dev' to start the local services ==="
