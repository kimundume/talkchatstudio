# 🚀 Quick Start - TalkChat Studio

Get up and running in 5 minutes!

## Prerequisites

- ✅ Node.js installed
- ✅ Docker Desktop installed and running

## Setup Steps

### 1. Start Docker Desktop

Make sure Docker Desktop is running (check the system tray for the whale icon).

### 2. Run the Automated Setup

```bash
npm run db:setup
```

This script will:
- ✅ Check if Docker is running
- ✅ Start PostgreSQL and Redis containers
- ✅ Create your `.env` file with database credentials
- ✅ Wait for the database to be ready

### 3. Run Database Migrations

```bash
npm run db:migrate
```

When prompted for a migration name, press Enter to use the default or type: `init`

This creates all the tables in your database.

### 4. Start the Development Server

```bash
npm run dev
```

Your app will be running at: **http://localhost:3000**

---

## 🎯 Useful Commands

### Database Management
```bash
npm run db:studio      # Open visual database browser
npm run db:migrate     # Create and run a new migration
npm run db:push        # Push schema changes without migration
npm run db:generate    # Regenerate Prisma Client
npm run db:reset       # Reset database (⚠️ deletes all data)
```

### Docker Management
```bash
npm run docker:up      # Start containers
npm run docker:down    # Stop containers
npm run docker:logs    # View container logs
```

### Development
```bash
npm run dev            # Start Next.js dev server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint
```

---

## 📊 Access Your Services

- **App**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (run `npm run db:studio`)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

---

## 🔧 Troubleshooting

### Docker Not Starting?

1. Open Docker Desktop manually
2. Wait for it to fully start (whale icon steady in system tray)
3. Run `npm run db:setup` again

### Port Already in Use?

Check what's using the port:
```bash
netstat -ano | findstr :5432
netstat -ano | findstr :6379
```

### Database Connection Issues?

```bash
# Check if containers are running
docker ps

# View PostgreSQL logs
docker logs talkchat-postgres

# Restart containers
npm run docker:down
npm run docker:up
```

### Reset Everything?

```bash
# Stop containers and remove data
docker-compose down -v

# Start fresh
npm run db:setup
npm run db:migrate
```

---

## 📚 Next Steps

1. ✅ Database is running
2. ✅ Tables are created
3. 🚀 Start building!

Check out:
- `DATABASE_SETUP.md` - Detailed database documentation
- `DOCKER_SETUP.md` - Docker-specific guide
- `BRAND_GUIDE.md` - Design system and brand colors

---

## 🆘 Need Help?

- Check the logs: `npm run docker:logs`
- View database: `npm run db:studio`
- Read full docs: `DATABASE_SETUP.md`

**Happy coding! 🎉**
