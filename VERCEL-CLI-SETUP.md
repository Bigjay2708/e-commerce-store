# 🔧 Manual Vercel CLI Environment Setup

If you prefer to set up environment variables manually, here are the exact commands:

## Step 1: Install Vercel CLI (if needed)
```bash
npm install -g vercel
```

## Step 2: Login to Vercel
```bash
vercel login
```

## Step 3: Link Your Project
```bash
vercel link
```

## Step 4: Set Required Environment Variables

### NEXTAUTH_SECRET (Required)
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Set it (replace YOUR_GENERATED_SECRET with the output above)
vercel env add NEXTAUTH_SECRET production
# When prompted, paste your generated secret

vercel env add NEXTAUTH_SECRET preview
# When prompted, paste the same secret
```

### NEXTAUTH_URL (Required)
```bash
# Replace with your actual Vercel app URL
vercel env add NEXTAUTH_URL production
# When prompted, enter: https://your-app-name.vercel.app

vercel env add NEXTAUTH_URL preview
# When prompted, enter: https://your-app-name.vercel.app
```

### DATABASE_URL (Required)

#### Option A: Create Vercel Postgres
```bash
vercel postgres create
# This automatically sets DATABASE_URL
```

#### Option B: Use External Database
```bash
vercel env add DATABASE_URL production
# When prompted, enter your PostgreSQL connection string
# Example: postgresql://user:password@host:5432/database

vercel env add DATABASE_URL preview
# Enter the same connection string
```

#### Option C: Supabase (Free)
1. Go to https://supabase.com
2. Create project → Settings → Database
3. Copy connection string
```bash
vercel env add DATABASE_URL production
# Paste your Supabase connection string

vercel env add DATABASE_URL preview
# Paste the same connection string
```

## Step 5: Optional Environment Variables

### Stripe (for payments)
```bash
vercel env add STRIPE_PUBLIC_KEY production
# Enter: pk_live_your_public_key

vercel env add STRIPE_SECRET_KEY production
# Enter: sk_live_your_secret_key

# Repeat for preview environment
vercel env add STRIPE_PUBLIC_KEY preview
vercel env add STRIPE_SECRET_KEY preview
```

### Email Service
```bash
vercel env add EMAIL_FROM production
# Enter: noreply@yourdomain.com

vercel env add EMAIL_FROM preview
```

### Security Settings
```bash
vercel env add ALLOWED_ORIGINS production
# Enter: https://yourdomain.com

vercel env add ALLOWED_ORIGINS preview
```

## Step 6: Verify Environment Variables
```bash
# List all environment variables
vercel env ls

# Check specific environment
vercel env ls production
vercel env ls preview
```

## Step 7: Deploy
```bash
# Deploy to production
vercel --prod

# Or push to GitHub for automatic deployment
git add .
git commit -m "Add environment configuration"
git push origin main
```

## Step 8: Run Database Migrations (After First Deploy)
```bash
# Set up the database schema
vercel env add NODE_ENV production

# Run migrations on production
vercel --prod -- npx prisma migrate deploy

# Seed the database with initial data
vercel --prod -- npx prisma db seed
```

## 🔍 Troubleshooting Commands

### Check deployment logs
```bash
vercel logs your-app-name --prod
```

### Remove incorrect environment variable
```bash
vercel env rm VARIABLE_NAME production
```

### Update environment variable
```bash
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production
```

### Test environment variables
```bash
# Create a test API endpoint to verify
vercel --prod -- node -e "console.log(process.env.NEXTAUTH_SECRET ? 'Secret set' : 'Secret missing')"
```

## ✅ Required Variables Checklist
- [ ] NEXTAUTH_SECRET (32+ character string)
- [ ] NEXTAUTH_URL (https://your-app.vercel.app)
- [ ] DATABASE_URL (PostgreSQL connection string)

## 🚀 Optional Variables Checklist
- [ ] STRIPE_PUBLIC_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] EMAIL_FROM
- [ ] ALLOWED_ORIGINS

Once all required variables are set, your deployment will succeed! 🎉
