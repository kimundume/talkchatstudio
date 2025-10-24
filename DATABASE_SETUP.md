# Database Setup Guide - TalkChat Studio

## 🚀 Quick Setup with Supabase (Recommended)

Supabase provides a free PostgreSQL database that's perfect for development and production deployment.

### Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email

### Step 2: Create a New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: `talkchat-studio`
   - **Database Password**: (generate a strong password and save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is perfect to start

3. Wait 2-3 minutes for the project to be created

### Step 3: Get Your Connection Strings

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the following:

   **Connection Pooling (recommended for serverless)**:
   ```
   postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

   **Direct Connection**:
   ```
   postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 4: Update Your .env File

Add these to your `.env` file:

```env
# Database URLs
DATABASE_URL="postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
```

**To get the Supabase keys:**
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Or use: https://generate-secret.vercel.app/32

### Step 5: Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables in your Supabase database
- Generate the Prisma Client
- Set up the multi-tenant schema

### Step 6: Verify the Setup

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555`

---

## 🐳 Alternative: Docker Setup (Local Development)

If you prefer Docker for local development:

### Create docker-compose.yml

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: talkchat-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: talkchat_studio
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Start Docker Database

```bash
docker-compose up -d
```

### Update .env for Docker

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/talkchat_studio"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/talkchat_studio"
```

### Run Migrations

```bash
npx prisma migrate dev --name init
```

---

## 📊 Database Schema Overview

Our multi-tenant architecture includes:

### Core Tables
- **User** - All users (tenants, admins, superadmins)
- **Tenant** - Company/organization accounts
- **Account/Session** - NextAuth authentication
- **VerificationToken** - Email verification

### Chatbot System
- **Chatbot** - Bot configurations per tenant
- **Trigger** - Automated actions and workflows
- **Conversation** - Chat sessions
- **Message** - Individual messages
- **ChatAssignment** - Agent assignments

### Multi-Channel
- **Channel** - Integration configurations (WhatsApp, Facebook, etc.)

### User Roles
- `SUPERADMIN` - Full platform access
- `SUPERADMIN_SUPPORT` - Support team
- `TENANT_ADMIN` - Company admin
- `TENANT_USER` - Regular team member

---

## 🔧 Useful Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open Prisma Studio (visual database browser)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

---

## 🚀 Deployment

### Vercel + Supabase (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Supabase handles:
- ✅ Database hosting
- ✅ Automatic backups
- ✅ Connection pooling
- ✅ Real-time subscriptions
- ✅ Row Level Security (RLS)

### Railway / Render

Both support PostgreSQL databases and work great with Prisma:
- Railway: Automatic PostgreSQL provisioning
- Render: Free PostgreSQL tier available

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use connection pooling** - Prevents connection exhaustion
3. **Rotate secrets regularly** - Especially in production
4. **Enable RLS in Supabase** - Row Level Security for data isolation
5. **Use service role key only server-side** - Never expose in client code

---

## 📚 Additional Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Multi-tenancy with Prisma](https://www.prisma.io/docs/guides/database/multi-tenancy)

---

## 🆘 Troubleshooting

### Connection Issues
```bash
# Test database connection
npx prisma db pull
```

### Migration Conflicts
```bash
# Mark migration as applied without running
npx prisma migrate resolve --applied [migration_name]
```

### Reset Everything
```bash
# Delete migrations and database
npx prisma migrate reset
```

---

**Ready to proceed?** Once your `.env` is configured, run:
```bash
npx prisma migrate dev --name init
npm run dev
```
