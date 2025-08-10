# 🚀 Vercel Deployment Guide

## 📋 **Required Environment Variables**

Your deployment failed because environment variables are missing. Here's how to set them up:

### **1. Required Variables for Vercel:**

```bash
# Authentication (REQUIRED)
NEXTAUTH_SECRET=your-32-character-secret-key-here
NEXTAUTH_URL=https://your-app-name.vercel.app

# Database (REQUIRED for production)
DATABASE_URL=postgresql://username:password@host:port/database

# Optional but recommended
STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
EMAIL_FROM=noreply@yourdomain.com
```

### **2. Setting Environment Variables in Vercel:**

#### **Option A: Vercel Dashboard**

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - `NEXTAUTH_SECRET`: Generate a 32+ character random string
   - `NEXTAUTH_URL`: Your Vercel app URL (e.g., `https://your-app.vercel.app`)
   - `DATABASE_URL`: Your PostgreSQL connection string

#### **Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add DATABASE_URL production

# Deploy
vercel --prod
```

### **3. Generate NEXTAUTH_SECRET:**

```bash
# Generate a secure secret (32+ characters)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### **4. Database Setup for Production:**

#### **Option A: Vercel Postgres (Recommended)**

```bash
# Add Vercel Postgres to your project
vercel postgres create

# This automatically sets DATABASE_URL
```

#### **Option B: External PostgreSQL**

Use services like:

- **Supabase**: Free PostgreSQL with good Next.js integration
- **PlanetScale**: MySQL-compatible with edge capabilities
- **Railway**: Simple PostgreSQL hosting
- **Neon**: Serverless PostgreSQL

Example DATABASE_URL formats:

```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Supabase
DATABASE_URL="postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres"
```

### **5. Quick Production Setup:**

1. **Set minimum required variables:**

   ```bash
   NEXTAUTH_SECRET=your-generated-32-char-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   DATABASE_URL=your-postgres-connection-string
   ```

2. **Redeploy:**
   ```bash
   git push origin main
   # Or trigger manual deploy in Vercel dashboard
   ```

### **6. Development vs Production:**

| Environment     | Database       | Authentication | Payments         |
| --------------- | -------------- | -------------- | ---------------- |
| **Development** | SQLite (local) | Local testing  | Stripe test keys |
| **Production**  | PostgreSQL     | Secure secrets | Stripe live keys |

### **7. Post-Deployment Steps:**

1. **Database Migration:**

   ```bash
   # After first deploy, run migrations
   npx prisma migrate deploy
   npx prisma db seed
   ```

2. **Test Critical Paths:**
   - User registration/login
   - Product browsing
   - Cart functionality
   - Payment flow (with test cards)

### **8. Common Issues & Solutions:**

#### **Build Fails with Environment Validation:**

- ✅ **Solution**: Set required environment variables in Vercel

#### **Database Connection Errors:**

- ✅ **Solution**: Verify DATABASE_URL format and network access

#### **NextAuth Errors:**

- ✅ **Solution**: Ensure NEXTAUTH_SECRET is 32+ characters and NEXTAUTH_URL matches your domain

#### **CORS Issues:**

- ✅ **Solution**: Update ALLOWED_ORIGINS in environment variables

### **9. Security Checklist:**

- [ ] NEXTAUTH_SECRET is 32+ characters
- [ ] DATABASE_URL uses SSL (`?sslmode=require`)
- [ ] NEXTAUTH_URL uses HTTPS
- [ ] Stripe keys are LIVE keys (pk*live*, sk*live*)
- [ ] Email service configured
- [ ] CORS origins restricted to your domain

### **10. Monitoring & Maintenance:**

- [ ] Set up Vercel analytics
- [ ] Configure error monitoring (Sentry)
- [ ] Set up database backups
- [ ] Monitor performance metrics
- [ ] Set up uptime monitoring

---

## 🎯 **Quick Fix for Current Deployment:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project → Settings → Environment Variables
3. Add these three variables:
   ```
   NEXTAUTH_SECRET: [generate 32+ char string]
   NEXTAUTH_URL: https://your-app.vercel.app
   DATABASE_URL: [your postgres connection]
   ```
4. Redeploy from Dashboard or push new commit

Your deployment will succeed once these variables are set! 🚀
