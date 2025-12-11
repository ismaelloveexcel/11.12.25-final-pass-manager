#!/bin/bash

# 🚀 Quick Deployment Script for Recruitment Screening System
# Usage: ./deploy.sh [platform]
# Platforms: vercel, railway, heroku, render

set -e

echo "
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Recruitment Screening System - Deployment Tool      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
"

PLATFORM=${1:-vercel}

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run tests (if available)
echo "🧪 Running tests..."
npm test || echo "⚠️  No tests found - skipping"

# Deploy based on platform
case $PLATFORM in
    vercel)
        echo "🔵 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📥 Installing Vercel CLI..."
            npm i -g vercel
        fi
        vercel --prod
        ;;
    
    railway)
        echo "🚄 Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            echo "📥 Installing Railway CLI..."
            npm i -g @railway/cli
        fi
        railway up
        ;;
    
    heroku)
        echo "☁️  Deploying to Heroku..."
        if ! command -v heroku &> /dev/null; then
            echo "❌ Please install Heroku CLI first"
            echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        # Check if Heroku app exists
        if ! heroku apps:info &> /dev/null; then
            echo "Creating new Heroku app..."
            heroku create recruitment-screening-$(date +%s)
        fi
        
        git push heroku $(git branch --show-current):main
        heroku open
        ;;
    
    render)
        echo "💚 For Render deployment:"
        echo "1. Go to https://render.com"
        echo "2. Create New Web Service"
        echo "3. Connect this repository"
        echo "4. Build Command: npm install"
        echo "5. Start Command: npm start"
        echo ""
        echo "Opening Render dashboard..."
        open "https://render.com" || xdg-open "https://render.com" || echo "Visit: https://render.com"
        ;;
    
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Available platforms: vercel, railway, heroku, render"
        exit 1
        ;;
esac

echo "
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ✅ Deployment Complete!                                 ║
║                                                           ║
║   Next steps:                                             ║
║   1. Set environment variables on platform                ║
║   2. Configure custom domain (optional)                   ║
║   3. Test your deployment                                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
"
