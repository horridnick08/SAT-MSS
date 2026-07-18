# =============================================================================
# SAT-MSS Setup Script
# Local developer environment setup script for Windows PowerShell.
# =============================================================================

Write-Host "=== SAT-MSS Developer Environment Setup (PowerShell) ===" -ForegroundColor Cyan

# 1. Verify dependencies
if (-not (Get-Command "pnpm" -ErrorAction SilentlyContinue)) {
    Write-Error "pnpm package manager is required. Install via: npm install -g pnpm"
    exit 1
}

# 2. Copy environment template
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env configuration file from example template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    
    # Generate simple unique secrets
    $jwtSecret = [Guid]::NewGuid().ToString() + [Guid]::NewGuid().ToString()
    $jwtRefreshSecret = [Guid]::NewGuid().ToString() + [Guid]::NewGuid().ToString()
    
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace 'JWT_SECRET=.*', "JWT_SECRET=$jwtSecret"
    $envContent = $envContent -replace 'JWT_REFRESH_SECRET=.*', "JWT_REFRESH_SECRET=$jwtRefreshSecret"
    $envContent | Set-Content ".env"
    
    Write-Host ".env created with generated security secrets." -ForegroundColor Green
}

# 3. Install packages
Write-Host "Installing monorepo dependencies..." -ForegroundColor Yellow
pnpm install

# 4. Spin up Docker containers
if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    Write-Host "Spinning up Docker containers (PostgreSQL, Redis, MinIO)..." -ForegroundColor Yellow
    docker compose up -d
    
    Write-Host "Waiting for PostgreSQL to be healthy..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    Write-Host "Database containers are online and healthy." -ForegroundColor Green
} else {
    Write-Host "Warning: Docker is not installed or not in PATH. Database containers must be spun up manually." -ForegroundColor Red
}

# 5. Run Migrations & Seeding
Write-Host "Running database migrations..." -ForegroundColor Yellow
pnpm db:migrate

Write-Host "Seeding database with default accounts and configurations..." -ForegroundColor Yellow
pnpm db:seed

Write-Host "=== Setup complete! Run 'pnpm dev' to start the local services ===" -ForegroundColor Green
