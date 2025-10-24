# 🚀 TalkChat Studio - Deployment Guide

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ Supabase project created
- ✅ Database connection string
- ✅ NextAuth secret generated
- ✅ All environment variables ready

---

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended)**

Vercel is the easiest way to deploy Next.js applications.

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Login to Vercel**
```bash
vercel login
```

#### **Step 3: Deploy**
```bash
vercel
```

#### **Step 4: Add Environment Variables**

In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add all variables from `.env`:

```env
# Database
DATABASE_URL=your_supabase_connection_string
DIRECT_URL=your_supabase_direct_url

# NextAuth
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://your-app.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### **Step 5: Redeploy**
```bash
vercel --prod
```

---

### **Option 2: Railway**

Railway offers easy PostgreSQL hosting with your app.

#### **Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

#### **Step 2: Login**
```bash
railway login
```

#### **Step 3: Initialize**
```bash
railway init
```

#### **Step 4: Add PostgreSQL**
```bash
railway add postgresql
```

#### **Step 5: Deploy**
```bash
railway up
```

#### **Step 6: Set Environment Variables**
```bash
railway variables set NEXTAUTH_SECRET=your_secret
railway variables set NEXTAUTH_URL=https://your-app.railway.app
```

---

### **Option 3: Netlify**

#### **Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

#### **Step 2: Login**
```bash
netlify login
```

#### **Step 3: Deploy**
```bash
netlify deploy --prod
```

---

## 🔧 Environment Variables Setup

### **Required Variables:**

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# NextAuth.js
NEXTAUTH_SECRET="generate_with: openssl rand -base64 32"
NEXTAUTH_URL="https://your-production-domain.com"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### **Generate NEXTAUTH_SECRET:**

**Windows:**
```powershell
# Using OpenSSL (if installed)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

---

## 🗄️ Database Migration

After deploying, run migrations:

### **Using Vercel:**
```bash
# Add to package.json scripts:
"postinstall": "prisma generate",
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

### **Manual Migration:**
```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="your_production_database_url"

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

---

## 🎨 Widget Embed Code

After deployment, your embed code will be:

```html
<!-- Basic Embed -->
<script src="https://your-app.vercel.app/widget.js" 
        data-chatbot-id="YOUR_CHATBOT_ID"
        data-position="bottom-right">
</script>

<!-- Advanced Embed -->
<script>
  window.TalkChatConfig = {
    chatbotId: 'YOUR_CHATBOT_ID',
    position: 'bottom-right',
    primaryColor: '#FF8C42',
    greeting: 'Hi! How can I help you?',
    autoOpen: false
  };
</script>
<script src="https://your-app.vercel.app/widget.js"></script>
```

---

## 🧪 Testing Embed Code

### **Test on Local HTML File:**

Create `test-embed.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TalkChat Widget Test</title>
</head>
<body>
    <h1>Testing TalkChat Widget</h1>
    <p>The chat widget should appear in the bottom-right corner.</p>

    <!-- Your embed code -->
    <script src="https://your-app.vercel.app/widget.js" 
            data-chatbot-id="YOUR_CHATBOT_ID">
    </script>
</body>
</html>
```

### **Test on Different Websites:**

1. **WordPress:**
   - Add to footer.php or use plugin like "Insert Headers and Footers"

2. **Shopify:**
   - Theme → Edit Code → theme.liquid → Add before `</body>`

3. **Wix:**
   - Settings → Custom Code → Add to footer

4. **Webflow:**
   - Project Settings → Custom Code → Footer Code

---

## 🔒 Security Checklist

Before going live:

- [ ] Enable RLS on Supabase (run `prisma/migrations/enable_rls.sql`)
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Verify CORS settings
- [ ] Enable HTTPS only
- [ ] Set secure cookie settings
- [ ] Review API rate limits
- [ ] Enable Supabase Auth policies
- [ ] Test authentication flows
- [ ] Verify tenant isolation

---

## 📊 Post-Deployment Monitoring

### **Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### **Error Tracking (Sentry):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🚨 Troubleshooting

### **Build Fails:**

1. **Check Node version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

2. **Clear cache:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

3. **Check environment variables:**
   - Ensure all required vars are set
   - No typos in variable names
   - Values are properly quoted

### **Database Connection Fails:**

1. **Verify connection string:**
   - Check Supabase dashboard for correct URL
   - Ensure password is correct
   - Use pooler URL for serverless

2. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Check Supabase project status:**
   - Project should be active
   - Database should be running

### **Widget Not Loading:**

1. **Check CORS settings:**
   - Add allowed domains in Supabase
   - Verify API routes are accessible

2. **Check embed code:**
   - Correct chatbot ID
   - Correct domain URL
   - Script tag properly closed

3. **Browser console:**
   - Check for JavaScript errors
   - Verify network requests succeed

---

## 🔄 Continuous Deployment

### **Vercel (Auto-deploy on push):**

1. Connect GitHub repository in Vercel dashboard
2. Every push to `main` branch auto-deploys
3. Pull requests get preview deployments

### **GitHub Actions:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📱 Mobile Testing

Test widget on:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile responsive design
- [ ] Touch interactions
- [ ] Keyboard behavior

---

## 🎯 Performance Optimization

### **Before Deployment:**

1. **Optimize images:**
   ```bash
   npm install sharp
   ```

2. **Enable compression:**
   - Vercel does this automatically
   - For custom hosting, enable gzip

3. **Minimize bundle size:**
   ```bash
   npm run build
   # Check .next/analyze for bundle size
   ```

4. **Enable caching:**
   - Static assets cached automatically
   - Set proper cache headers for API routes

---

## 📈 Scaling Considerations

### **Database:**
- Supabase Free: 500MB, 2GB bandwidth
- Upgrade to Pro for production: $25/month
- Consider read replicas for high traffic

### **Serverless Functions:**
- Vercel Free: 100GB-hours
- Pro: 1000GB-hours
- Monitor function execution time

### **CDN:**
- Vercel provides global CDN
- Assets served from nearest edge location
- Automatic image optimization

---

## 🎉 Launch Checklist

Final steps before going live:

- [ ] Test all features in production
- [ ] Verify embed code on test website
- [ ] Check mobile responsiveness
- [ ] Test authentication flows
- [ ] Verify email notifications work
- [ ] Test chatbot responses
- [ ] Check analytics tracking
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Prepare support documentation
- [ ] Announce launch! 🚀

---

## 📞 Support

If you encounter issues:

1. Check Vercel/Railway logs
2. Review Supabase logs
3. Check browser console
4. Verify environment variables
5. Test database connection

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

**Your app is ready to deploy!** 🚀

Follow the steps above for your chosen platform and you'll be live in minutes!
