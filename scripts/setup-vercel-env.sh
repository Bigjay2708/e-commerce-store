#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this script to set up all required environment variables for production

echo "🚀 Setting up Vercel Environment Variables..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 Setting up required environment variables..."
echo ""

# Generate NEXTAUTH_SECRET if not provided
echo "1. Setting up NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
echo "Generated secure NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:20}..."

# Set NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"
vercel env add NEXTAUTH_SECRET preview <<< "$NEXTAUTH_SECRET"

echo "✅ NEXTAUTH_SECRET set for production and preview"
echo ""

# Set NEXTAUTH_URL
echo "2. Setting up NEXTAUTH_URL..."
echo "Please enter your Vercel app URL (e.g., https://your-app.vercel.app):"
read -r NEXTAUTH_URL

if [ -z "$NEXTAUTH_URL" ]; then
    echo "❌ NEXTAUTH_URL is required. Please run the script again."
    exit 1
fi

vercel env add NEXTAUTH_URL production <<< "$NEXTAUTH_URL"
vercel env add NEXTAUTH_URL preview <<< "$NEXTAUTH_URL"

echo "✅ NEXTAUTH_URL set to: $NEXTAUTH_URL"
echo ""

# Set DATABASE_URL
echo "3. Setting up DATABASE_URL..."
echo "Please choose your database option:"
echo "1) I have a PostgreSQL connection string"
echo "2) I want to create a Vercel Postgres database"
echo "3) I want to use Supabase (free)"
read -r db_choice

case $db_choice in
    1)
        echo "Please enter your PostgreSQL connection string:"
        read -r DATABASE_URL
        if [ -z "$DATABASE_URL" ]; then
            echo "❌ DATABASE_URL is required. Please run the script again."
            exit 1
        fi
        vercel env add DATABASE_URL production <<< "$DATABASE_URL"
        vercel env add DATABASE_URL preview <<< "$DATABASE_URL"
        echo "✅ DATABASE_URL set"
        ;;
    2)
        echo "📦 Creating Vercel Postgres database..."
        vercel postgres create
        echo "✅ Vercel Postgres created and DATABASE_URL automatically set"
        ;;
    3)
        echo "🔗 Please:"
        echo "1. Go to https://supabase.com"
        echo "2. Create a new project"
        echo "3. Go to Settings → Database"
        echo "4. Copy the connection string"
        echo ""
        echo "Enter your Supabase connection string:"
        read -r DATABASE_URL
        if [ -z "$DATABASE_URL" ]; then
            echo "❌ DATABASE_URL is required. Please run the script again."
            exit 1
        fi
        vercel env add DATABASE_URL production <<< "$DATABASE_URL"
        vercel env add DATABASE_URL preview <<< "$DATABASE_URL"
        echo "✅ DATABASE_URL set"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Optional: Setting up additional environment variables..."
echo ""

# Optional: Stripe
echo "Would you like to set up Stripe environment variables? (y/n)"
read -r setup_stripe

if [ "$setup_stripe" = "y" ] || [ "$setup_stripe" = "Y" ]; then
    echo "Enter your Stripe Public Key (pk_live_...):"
    read -r STRIPE_PUBLIC_KEY
    echo "Enter your Stripe Secret Key (sk_live_...):"
    read -r STRIPE_SECRET_KEY
    
    if [ -n "$STRIPE_PUBLIC_KEY" ]; then
        vercel env add STRIPE_PUBLIC_KEY production <<< "$STRIPE_PUBLIC_KEY"
        vercel env add STRIPE_PUBLIC_KEY preview <<< "$STRIPE_PUBLIC_KEY"
        echo "✅ STRIPE_PUBLIC_KEY set"
    fi
    
    if [ -n "$STRIPE_SECRET_KEY" ]; then
        vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_SECRET_KEY"
        vercel env add STRIPE_SECRET_KEY preview <<< "$STRIPE_SECRET_KEY"
        echo "✅ STRIPE_SECRET_KEY set"
    fi
fi

echo ""
echo "🎉 Environment variables setup complete!"
echo ""
echo "📋 Summary of what was set:"
echo "✅ NEXTAUTH_SECRET (production & preview)"
echo "✅ NEXTAUTH_URL (production & preview)"
echo "✅ DATABASE_URL (production & preview)"
if [ "$setup_stripe" = "y" ] || [ "$setup_stripe" = "Y" ]; then
    echo "✅ STRIPE_PUBLIC_KEY (production & preview)"
    echo "✅ STRIPE_SECRET_KEY (production & preview)"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Run: vercel --prod"
echo "2. Or push to GitHub to trigger automatic deployment"
echo "3. After deployment, run database migrations:"
echo "   vercel env add NODE_ENV production"
echo "   vercel --prod -- npx prisma migrate deploy"

echo ""
echo "🔍 To view all environment variables:"
echo "vercel env ls"
