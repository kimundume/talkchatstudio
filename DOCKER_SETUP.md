# 🐳 Docker Setup Guide - TalkChat Studio

## Prerequisites

✅ Docker Desktop is installed (you have Docker version 28.3.2)

## Quick Start

### Step 1: Start Docker Desktop

1. Open **Docker Desktop** from your Start menu
2. Wait for Docker to fully start (the whale icon in system tray should be steady)
3. You'll see "Docker Desktop is running" in the system tray

### Step 2: Start the Database Containers

Open your terminal in the project directory and run:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on port 5432
- **Redis** on port 6379

### Step 3: Verify Containers are Running

```bash
docker ps
```

You should see two containers:
- `talkchat-postgres`
- `talkchat-redis`

### Step 4: Configure Environment Variables

Your `.env` file should have:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/talkchat_studio"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/talkchat_studio"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
```

**Generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 5: Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all the tables in your PostgreSQL database.

### Step 6: Verify Database

Open Prisma Studio to view your database:

```bash
npx prisma studio
```

Opens at: http://localhost:5555

---

## 🎯 Useful Docker Commands

### View Running Containers
```bash
docker ps
```

### View Container Logs
```bash
# PostgreSQL logs
docker logs talkchat-postgres

# Redis logs
docker logs talkchat-redis

# Follow logs in real-time
docker logs -f talkchat-postgres
```

### Stop Containers
```bash
docker-compose down
```

### Stop and Remove All Data
```bash
docker-compose down -v
```

### Restart Containers
```bash
docker-compose restart
```

### Access PostgreSQL CLI
```bash
docker exec -it talkchat-postgres psql -U postgres -d talkchat_studio
```

Useful PostgreSQL commands:
- `\dt` - List all tables
- `\d table_name` - Describe table structure
- `\q` - Quit

### Access Redis CLI
```bash
docker exec -it talkchat-redis redis-cli
```

Useful Redis commands:
- `PING` - Test connection
- `KEYS *` - List all keys
- `FLUSHALL` - Clear all data
- `exit` - Quit

---

## 🔧 Troubleshooting

### Docker Desktop Not Starting

1. Check if WSL 2 is installed (required for Docker on Windows)
2. Restart Docker Desktop
3. Check Docker settings → Resources → ensure enough memory allocated (4GB+)

### Port Already in Use

If port 5432 or 6379 is already in use:

**Option 1: Stop the conflicting service**
```bash
# Find what's using the port
netstat -ano | findstr :5432
```

**Option 2: Change the port in docker-compose.yml**
```yaml
ports:
  - "5433:5432"  # Use 5433 instead of 5432
```

Then update your DATABASE_URL to use the new port.

### Cannot Connect to Database

1. Verify containers are running: `docker ps`
2. Check container logs: `docker logs talkchat-postgres`
3. Restart containers: `docker-compose restart`
4. Verify DATABASE_URL in `.env` matches the container settings

### Database Connection Timeout

```bash
# Check if PostgreSQL is ready
docker exec talkchat-postgres pg_isready -U postgres
```

Should return: `postgres:5432 - accepting connections`

### Reset Everything

If you need to start fresh:

```bash
# Stop and remove containers + volumes
docker-compose down -v

# Remove any orphaned volumes
docker volume prune

# Start fresh
docker-compose up -d

# Run migrations again
npx prisma migrate dev --name init
```

---

## 📊 Database Credentials

**PostgreSQL:**
- Host: `localhost`
- Port: `5432`
- Database: `talkchat_studio`
- Username: `postgres`
- Password: `postgres`

**Redis:**
- Host: `localhost`
- Port: `6379`
- No password (development only)

⚠️ **Security Note:** These are development credentials. Use strong passwords in production!

---

## 🚀 Production Deployment

For production, consider:

1. **Managed PostgreSQL:**
   - Supabase (free tier available)
   - Railway
   - Render
   - AWS RDS
   - Digital Ocean Managed Databases

2. **Managed Redis:**
   - Upstash (serverless Redis)
   - Redis Cloud
   - AWS ElastiCache

3. **Container Orchestration:**
   - Docker Swarm
   - Kubernetes
   - AWS ECS/Fargate

---

## ✅ Next Steps

Once Docker containers are running:

1. ✅ Containers started: `docker-compose up -d`
2. ✅ Environment configured: `.env` file created
3. ✅ Migrations run: `npx prisma migrate dev --name init`
4. ✅ Database verified: `npx prisma studio`
5. 🚀 Start development: `npm run dev`

---

**Need help?** Check the main DATABASE_SETUP.md for more details or alternative setups.
