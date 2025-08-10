# Vercel Environment Variables Setup Script (PowerShell)
# Run this script to set up all required environment variables for production

Write-Host "🚀 Setting up Vercel Environment Variables..." -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI is already installed" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "🔐 Setting up required environment variables..." -ForegroundColor Cyan
Write-Host ""

# Generate NEXTAUTH_SECRET
Write-Host "1. Setting up NEXTAUTH_SECRET..." -ForegroundColor Yellow
$NEXTAUTH_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
$secretPreview = $NEXTAUTH_SECRET.Substring(0, [Math]::Min(20, $NEXTAUTH_SECRET.Length))
Write-Host "Generated secure NEXTAUTH_SECRET: $secretPreview..." -ForegroundColor Green

# Set NEXTAUTH_SECRET
Write-Host $NEXTAUTH_SECRET | vercel env add NEXTAUTH_SECRET production
Write-Host $NEXTAUTH_SECRET | vercel env add NEXTAUTH_SECRET preview

Write-Host "✅ NEXTAUTH_SECRET set for production and preview" -ForegroundColor Green
Write-Host ""

# Set NEXTAUTH_URL
Write-Host "2. Setting up NEXTAUTH_URL..." -ForegroundColor Yellow
$NEXTAUTH_URL = Read-Host "Please enter your Vercel app URL (e.g., https://your-app.vercel.app)"

if (-not $NEXTAUTH_URL) {
    Write-Host "❌ NEXTAUTH_URL is required. Please run the script again." -ForegroundColor Red
    exit 1
}

Write-Host $NEXTAUTH_URL | vercel env add NEXTAUTH_URL production
Write-Host $NEXTAUTH_URL | vercel env add NEXTAUTH_URL preview

Write-Host "✅ NEXTAUTH_URL set to: $NEXTAUTH_URL" -ForegroundColor Green
Write-Host ""

# Set DATABASE_URL
Write-Host "3. Setting up DATABASE_URL..." -ForegroundColor Yellow
Write-Host "Please choose your database option:"
Write-Host "1) I have a PostgreSQL connection string"
Write-Host "2) I want to create a Vercel Postgres database"
Write-Host "3) I want to use Supabase (free)"
$db_choice = Read-Host "Enter choice (1-3)"

switch ($db_choice) {
    "1" {
        $DATABASE_URL = Read-Host "Please enter your PostgreSQL connection string"
        if (-not $DATABASE_URL) {
            Write-Host "❌ DATABASE_URL is required. Please run the script again." -ForegroundColor Red
            exit 1
        }
        Write-Host $DATABASE_URL | vercel env add DATABASE_URL production
        Write-Host $DATABASE_URL | vercel env add DATABASE_URL preview
        Write-Host "✅ DATABASE_URL set" -ForegroundColor Green
    }
    "2" {
        Write-Host "📦 Creating Vercel Postgres database..." -ForegroundColor Yellow
        vercel postgres create
        Write-Host "✅ Vercel Postgres created and DATABASE_URL automatically set" -ForegroundColor Green
    }
    "3" {
        Write-Host "🔗 Please:" -ForegroundColor Cyan
        Write-Host "1. Go to https://supabase.com"
        Write-Host "2. Create a new project"
        Write-Host "3. Go to Settings → Database"
        Write-Host "4. Copy the connection string"
        Write-Host ""
        $DATABASE_URL = Read-Host "Enter your Supabase connection string"
        if (-not $DATABASE_URL) {
            Write-Host "❌ DATABASE_URL is required. Please run the script again." -ForegroundColor Red
            exit 1
        }
        Write-Host $DATABASE_URL | vercel env add DATABASE_URL production
        Write-Host $DATABASE_URL | vercel env add DATABASE_URL preview
        Write-Host "✅ DATABASE_URL set" -ForegroundColor Green
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎯 Optional: Setting up additional environment variables..." -ForegroundColor Cyan
Write-Host ""

# Optional: Stripe
$setup_stripe = Read-Host "Would you like to set up Stripe environment variables? (y/n)"

if ($setup_stripe -eq "y" -or $setup_stripe -eq "Y") {
    $STRIPE_PUBLIC_KEY = Read-Host "Enter your Stripe Public Key (pk_live_...)"
    $STRIPE_SECRET_KEY = Read-Host "Enter your Stripe Secret Key (sk_live_...)"
    
    if ($STRIPE_PUBLIC_KEY) {
        Write-Host $STRIPE_PUBLIC_KEY | vercel env add STRIPE_PUBLIC_KEY production
        Write-Host $STRIPE_PUBLIC_KEY | vercel env add STRIPE_PUBLIC_KEY preview
        Write-Host "✅ STRIPE_PUBLIC_KEY set" -ForegroundColor Green
    }
    
    if ($STRIPE_SECRET_KEY) {
        Write-Host $STRIPE_SECRET_KEY | vercel env add STRIPE_SECRET_KEY production
        Write-Host $STRIPE_SECRET_KEY | vercel env add STRIPE_SECRET_KEY preview
        Write-Host "✅ STRIPE_SECRET_KEY set" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Environment variables setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary of what was set:" -ForegroundColor Cyan
Write-Host "✅ NEXTAUTH_SECRET (production & preview)"
Write-Host "✅ NEXTAUTH_URL (production & preview)"
Write-Host "✅ DATABASE_URL (production & preview)"
if ($setup_stripe -eq "y" -or $setup_stripe -eq "Y") {
    Write-Host "✅ STRIPE_PUBLIC_KEY (production & preview)"
    Write-Host "✅ STRIPE_SECRET_KEY (production & preview)"
}

Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: vercel --prod"
Write-Host "2. Or push to GitHub to trigger automatic deployment"
Write-Host "3. After deployment, run database migrations:"
Write-Host "   vercel env add NODE_ENV production"
Write-Host "   vercel --prod -- npx prisma migrate deploy"

Write-Host ""
Write-Host "🔍 To view all environment variables:" -ForegroundColor Cyan
Write-Host "vercel env ls"
