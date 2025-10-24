# 🗄️ Database Connection Guide

## Current Issue

You're seeing this error:
```
Can't reach database server at `aws-1-eu-west-1.pooler.supabase.com:5432`
```

This means your `.env` file has a Supabase database URL, but either:
1. The database doesn't exist yet
2. The connection string is incorrect
3. The database is not accessible

---

## ✅ Quick Fix Options

### **Option 1: Use Local PostgreSQL (Recommended for Development)**

1. **Install PostgreSQL locally:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Or use Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres`

2. **Update your `.env` file:**
   ```env
   # Local PostgreSQL
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/talkchat?schema=public"
   DIRECT_URL="postgresql://postgres:postgres@localhost:5432/talkchat?schema=public"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

---

### **Option 2: Set Up Supabase (Free Cloud Database)**

1. **Create a Supabase account:**
   - Go to https://supabase.com
   - Sign up for free
   - Create a new project

2. **Get your connection strings:**
   - In Supabase dashboard, go to **Settings** → **Database**
   - Copy the **Connection string** (Transaction mode)
   - Copy the **Direct connection** string

3. **Update your `.env` file:**
   ```env
   # Supabase
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

---

### **Option 3: Use Railway (Alternative Cloud Database)**

1. **Create Railway account:**
   - Go to https://railway.app
   - Sign up with GitHub
   - Create new project → Add PostgreSQL

2. **Get connection string:**
   - Click on PostgreSQL service
   - Go to **Variables** tab
   - Copy `DATABASE_URL`

3. **Update your `.env` file:**
   ```env
   DATABASE_URL="[YOUR-RAILWAY-DATABASE-URL]"
   DIRECT_URL="[YOUR-RAILWAY-DATABASE-URL]"
   
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

---

## 🔧 Complete `.env` Template

Create a `.env` file in your project root with this content:

```env
# ============================================
# DATABASE
# ============================================
# Choose ONE of the following:

# Option 1: Local PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/talkchat?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/talkchat?schema=public"

# Option 2: Supabase (replace with your values)
# DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

# Option 3: Railway (replace with your values)
# DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway"
# DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway"

# ============================================
# NEXTAUTH
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-secret-key"

# Generate a secret with: openssl rand -base64 32
```

---

## 📝 Step-by-Step Setup

### 1. **Choose Your Database**

For beginners, I recommend **Local PostgreSQL** for development.

### 2. **Install PostgreSQL Locally**

**Windows:**
```bash
# Download installer from postgresql.org
# OR use Chocolatey:
choco install postgresql

# OR use Docker:
docker run -d --name talkchat-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres
```

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3. **Create Database**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE talkchat;

# Exit
\q
```

### 4. **Update `.env` File**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/talkchat?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/talkchat?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"
```

### 5. **Run Migrations**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to view data
npx prisma studio
```

### 6. **Restart Dev Server**

```bash
npm run dev
```

---

## 🐛 Troubleshooting

### **Error: "Can't reach database server"**

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   Get-Service -Name postgresql*
   
   # Mac/Linux
   sudo systemctl status postgresql
   ```

2. Verify connection string format:
   ```
   postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
   ```

3. Test connection:
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

### **Error: "Unknown field `assignments`"**

**Solution:** Already fixed! The field is now `assignedChats`.

### **Error: "Hydration mismatch"**

**Solution:** This is caused by the Logo component. Already fixed by converting it to a Client Component.

### **Error: "Database does not exist"**

**Solution:**
```bash
# Create the database
createdb talkchat -U postgres

# Or in psql:
psql -U postgres
CREATE DATABASE talkchat;
```

---

## ✅ Verify Setup

After setup, verify everything works:

```bash
# 1. Check Prisma connection
npx prisma db push

# 2. Open Prisma Studio
npx prisma studio

# 3. Start dev server
npm run dev

# 4. Visit http://localhost:3000
```

You should see:
- ✅ No database connection errors
- ✅ Dashboard loads
- ✅ Can register new account
- ✅ Can login

---

## 🚀 Production Deployment

For production, use a cloud database:

**Recommended:**
- ✅ **Supabase** - Free tier, great for startups
- ✅ **Railway** - Easy setup, good free tier
- ✅ **Neon** - Serverless PostgreSQL
- ✅ **PlanetScale** - MySQL alternative

**Not Recommended:**
- ❌ Local PostgreSQL (not accessible from deployed app)

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

## 🆘 Still Having Issues?

1. **Check your `.env` file exists** in the project root
2. **Restart your dev server** after changing `.env`
3. **Clear Next.js cache**: Delete `.next` folder and restart
4. **Check PostgreSQL is running**: `psql -U postgres`
5. **Verify database exists**: `psql -U postgres -l`

---

**Need help?** The error logs will show exactly what's wrong. Common issues:
- Wrong password in connection string
- Database doesn't exist
- PostgreSQL not running
- Firewall blocking connection
