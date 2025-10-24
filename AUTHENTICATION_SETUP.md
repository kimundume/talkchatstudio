# 🔐 Authentication System - TalkChat Studio

## Overview

Complete NextAuth.js v5 authentication system with multi-tenant support, role-based access control, and beautiful UI.

---

## ✅ What's Implemented

### 1. **NextAuth.js Configuration**
- **Location**: `src/lib/auth/`
- **Features**:
  - Credentials-based authentication
  - JWT session strategy
  - Prisma adapter for database integration
  - Custom callbacks for user data
  - 30-day session duration

### 2. **Authentication Pages**

#### Login Page (`/auth/login`)
- Beautiful split-screen design
- Brand colors (Orange & Purple gradient)
- Email/password authentication
- "Forgot password" link
- "Sign up" redirect
- Error handling with user feedback
- Loading states

#### Register Page (`/auth/register`)
- Company name field (creates tenant)
- Full name, email, password fields
- Password confirmation
- Terms & conditions checkbox
- Automatic tenant creation for new companies
- Role assignment (TENANT_ADMIN for company owners)

### 3. **User Roles**
- `SUPERADMIN` - Full platform access
- `SUPERADMIN_SUPPORT` - Support team access
- `TENANT_ADMIN` - Company administrator
- `TENANT_USER` - Regular team member

### 4. **Protected Routes**
- **Middleware**: `src/middleware.ts`
- Automatic redirects for unauthenticated users
- Callback URL preservation
- Auth route protection (logged-in users can't access login/register)

### 5. **Dashboard Layout**
- Sidebar navigation
- User menu with avatar
- Sign out functionality
- Responsive design
- Navigation items:
  - Dashboard
  - Conversations
  - Chatbots
  - Triggers
  - Team
  - Settings

### 6. **Server Actions**
- `registerUser()` - Create new user account
- `loginUser()` - Authenticate user
- `createTenant()` - Create organization

### 7. **Auth Utilities**
- `getCurrentUser()` - Get current session user
- `requireAuth()` - Require authentication
- `requireRole()` - Require specific role
- `requireTenant()` - Require tenant membership
- `isSuperAdmin()` - Check if superadmin
- `canManageTenant()` - Check tenant management permission

---

## 📁 File Structure

```
src/
├── app/
│   ├── actions/
│   │   └── auth.ts                    # Server actions for auth
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts           # NextAuth API route
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   └── register/
│   │       └── page.tsx              # Register page
│   └── dashboard/
│       ├── layout.tsx                # Protected layout
│       └── page.tsx                  # Dashboard page
├── components/
│   ├── layout/
│   │   ├── UserMenu.tsx             # User dropdown menu
│   │   └── MainLayout.tsx           # Root layout
│   └── ui/
│       ├── avatar.tsx               # Avatar component
│       ├── checkbox.tsx             # Checkbox component
│       └── dropdown-menu.tsx        # Dropdown menu
├── lib/
│   └── auth/
│       ├── auth.ts                  # NextAuth instance
│       ├── auth.config.ts           # NextAuth configuration
│       └── utils.ts                 # Auth helper functions
├── types/
│   └── next-auth.d.ts              # TypeScript definitions
└── middleware.ts                    # Route protection
```

---

## 🚀 Usage

### Testing Authentication

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Register a new account**:
   - Go to http://localhost:3000/auth/register
   - Fill in company name, name, email, password
   - Click "Create account"

3. **Login**:
   - Go to http://localhost:3000/auth/login
   - Enter your email and password
   - Click "Sign in"

4. **Access Dashboard**:
   - After login, you'll be redirected to `/dashboard`
   - See your name and company in the welcome message
   - Click your avatar to see user menu

5. **Sign Out**:
   - Click your avatar in the top right
   - Click "Sign out"

### Creating Users Programmatically

```typescript
import { registerUser } from "@/app/actions/auth";

const result = await registerUser({
  name: "John Doe",
  email: "john@example.com",
  password: "securepassword123",
  companyName: "Acme Inc.", // Optional - creates tenant
});

if (result.success) {
  console.log("User created:", result.userId);
} else {
  console.error("Error:", result.error);
}
```

### Protecting Pages

```typescript
// app/protected-page/page.tsx
import { requireAuth, requireRole } from "@/lib/auth/utils";

export default async function ProtectedPage() {
  // Require authentication
  const user = await requireAuth();
  
  // Or require specific role
  const admin = await requireRole(["TENANT_ADMIN", "SUPERADMIN"]);
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Client-Side Auth

```typescript
"use client";

import { useSession, signOut } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please sign in</div>;
  
  return (
    <div>
      <p>Welcome, {session?.user?.name}!</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

---

## 🎨 Customization

### Brand Colors

The auth pages use your brand colors defined in `src/constants/brand.ts`:
- **Primary**: Orange (#FF8C42)
- **Secondary**: Purple (#3D2E5C)
- **Accent**: Cream (#FFF5E6)

### Modify Auth Pages

Edit the following files to customize:
- `src/app/auth/login/page.tsx` - Login page
- `src/app/auth/register/page.tsx` - Register page

### Add OAuth Providers

To add Google, GitHub, etc.:

1. Install provider package:
   ```bash
   npm install @auth/[provider]-provider
   ```

2. Update `src/lib/auth/auth.config.ts`:
   ```typescript
   import Google from "next-auth/providers/google";
   
   export const authConfig = {
     providers: [
       Google({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       }),
       // ... existing providers
     ],
   };
   ```

3. Add environment variables to `.env`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT session tokens
- ✅ Secure HTTP-only cookies
- ✅ CSRF protection (built into NextAuth)
- ✅ Session expiration (30 days)
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ Tenant isolation

---

## 📝 Environment Variables

Required in `.env`:

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Database (already configured)
DATABASE_URL="your-supabase-connection-string"
```

---

## 🐛 Troubleshooting

### "Invalid credentials" error
- Check if user exists in database
- Verify password is correct
- Check database connection

### Redirect loop
- Clear browser cookies
- Check middleware configuration
- Verify NEXTAUTH_URL matches your domain

### Session not persisting
- Check NEXTAUTH_SECRET is set
- Verify cookies are enabled
- Check browser console for errors

### TypeScript errors
- Run `npm run build` to check for type errors
- Ensure `src/types/next-auth.d.ts` is included

---

## 🎯 Next Steps

1. **Email Verification**
   - Implement email sending
   - Add verification token flow
   - Update user email verification status

2. **Password Reset**
   - Create forgot password page
   - Send reset emails
   - Implement reset token flow

3. **Two-Factor Authentication**
   - Add TOTP support
   - QR code generation
   - Backup codes

4. **Social Login**
   - Add Google OAuth
   - Add GitHub OAuth
   - Add Microsoft OAuth

5. **Audit Logging**
   - Track login attempts
   - Log user actions
   - Security monitoring

---

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Authentication system is ready to use!** 🎉

Users can now register, login, and access protected routes with full multi-tenant support.
