# TalkChat Studio - Docker Setup Script
# This script helps set up the Docker environment

Write-Host "🐳 TalkChat Studio - Docker Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host ""
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Desktop is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Attempting to start Docker Desktop..." -ForegroundColor Yellow
    
    $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerPath) {
        Start-Process $dockerPath
        Write-Host "Docker Desktop is starting... Please wait 30 seconds" -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        # Check again
        try {
            docker ps | Out-Null
            Write-Host "✅ Docker is now running" -ForegroundColor Green
        } catch {
            Write-Host "❌ Docker failed to start. Please start it manually" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Could not find Docker Desktop at: $dockerPath" -ForegroundColor Red
        exit 1
    }
}

# Check if containers are already running
Write-Host ""
Write-Host "Checking existing containers..." -ForegroundColor Yellow
$existingContainers = docker ps -a --filter "name=talkchat" --format "{{.Names}}"

if ($existingContainers) {
    Write-Host "Found existing TalkChat containers:" -ForegroundColor Yellow
    $existingContainers | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    
    $response = Read-Host "Do you want to remove and recreate them? (y/N)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "Stopping and removing existing containers..." -ForegroundColor Yellow
        docker-compose down -v
        Write-Host "✅ Containers removed" -ForegroundColor Green
    }
}

# Start containers
Write-Host ""
Write-Host "Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Containers started successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start containers" -ForegroundColor Red
    exit 1
}

# Wait for PostgreSQL to be ready
Write-Host ""
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    try {
        $result = docker exec talkchat-postgres pg_isready -U postgres 2>&1
        if ($result -like "*accepting connections*") {
            Write-Host "✅ PostgreSQL is ready" -ForegroundColor Green
            break
        }
    } catch {
        # Continue waiting
    }
    
    if ($attempt -eq $maxAttempts) {
        Write-Host "❌ PostgreSQL failed to start" -ForegroundColor Red
        Write-Host "Check logs with: docker logs talkchat-postgres" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "  Waiting... ($attempt/$maxAttempts)" -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

# Check .env file
Write-Host ""
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check if DATABASE_URL is set
    $envContent = Get-Content ".env" -Raw
    if ($envContent -like "*DATABASE_URL*") {
        Write-Host "✅ DATABASE_URL is configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  DATABASE_URL not found in .env" -ForegroundColor Yellow
        Write-Host "Add this line to your .env file:" -ForegroundColor Yellow
        Write-Host 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/talkchat_studio"' -ForegroundColor Cyan
    }
} else {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "Creating .env file with default values..." -ForegroundColor Yellow
    
    $envContent = @"
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/talkchat_studio"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/talkchat_studio"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
}

# Display container status
Write-Host ""
Write-Host "Container Status:" -ForegroundColor Cyan
docker ps --filter "name=talkchat" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Docker setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run database migrations:" -ForegroundColor White
Write-Host "   npx prisma migrate dev --name init" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Open Prisma Studio to view your database:" -ForegroundColor White
Write-Host "   npx prisma studio" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  docker ps                    - View running containers" -ForegroundColor Gray
Write-Host "  docker logs talkchat-postgres - View PostgreSQL logs" -ForegroundColor Gray
Write-Host "  docker-compose down          - Stop containers" -ForegroundColor Gray
Write-Host "  docker-compose restart       - Restart containers" -ForegroundColor Gray
Write-Host ""
