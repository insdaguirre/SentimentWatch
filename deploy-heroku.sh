#!/bin/bash

# Stock Sentiment Tracker - Heroku Deployment Script
# This script helps deploy your app to Heroku

set -e  # Exit on error

echo "🚀 Stock Sentiment Tracker - Heroku Deployment"
echo "================================================"
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found!"
    echo "📦 Install it with: brew tap heroku/brew && brew install heroku"
    exit 1
fi

echo "✅ Heroku CLI found"
echo ""

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku..."
    heroku login
fi

echo "✅ Logged in to Heroku as: $(heroku auth:whoami)"
echo ""

# Prompt for app name
read -p "Enter your Heroku app name (e.g., stocksentiment-backend): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "❌ App name cannot be empty"
    exit 1
fi

# Check if app exists
if heroku apps:info --app $APP_NAME &> /dev/null; then
    echo "✅ App '$APP_NAME' already exists"
else
    echo "📦 Creating Heroku app: $APP_NAME"
    heroku create $APP_NAME
fi

echo ""
echo "🔧 Setting environment variables..."
echo ""

# MongoDB URI
read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI
heroku config:set MONGODB_URI="$MONGODB_URI" --app $APP_NAME

# Reddit API
read -p "Enter REDDIT_CLIENT_ID: " REDDIT_CLIENT_ID
heroku config:set REDDIT_CLIENT_ID="$REDDIT_CLIENT_ID" --app $APP_NAME

read -p "Enter REDDIT_CLIENT_SECRET: " REDDIT_CLIENT_SECRET
heroku config:set REDDIT_CLIENT_SECRET="$REDDIT_CLIENT_SECRET" --app $APP_NAME

read -p "Enter REDDIT_USERNAME: " REDDIT_USERNAME
heroku config:set REDDIT_USERNAME="$REDDIT_USERNAME" --app $APP_NAME

read -s -p "Enter REDDIT_PASSWORD: " REDDIT_PASSWORD
echo ""
heroku config:set REDDIT_PASSWORD="$REDDIT_PASSWORD" --app $APP_NAME

# RapidAPI
read -p "Enter RAPIDAPI_KEY: " RAPIDAPI_KEY
heroku config:set RAPIDAPI_KEY="$RAPIDAPI_KEY" --app $APP_NAME

# News API
read -p "Enter NEWS_API_KEY: " NEWS_API_KEY
heroku config:set NEWS_API_KEY="$NEWS_API_KEY" --app $APP_NAME

# Other configs
heroku config:set NODE_ENV=production --app $APP_NAME
heroku config:set REDDIT_USER_AGENT="StockSentimentApp/1.0" --app $APP_NAME
heroku config:set INGESTION_INTERVAL_MINUTES=15 --app $APP_NAME

echo ""
echo "✅ Environment variables set!"
echo ""

# Add Heroku remote if not exists
if ! git remote | grep -q heroku; then
    heroku git:remote --app $APP_NAME
fi

echo "📦 Deploying backend to Heroku..."
echo ""

# Deploy using subtree
git subtree push --prefix backend heroku main || \
git push heroku `git subtree split --prefix backend main`:main --force

echo ""
echo "⚙️  Scaling dynos..."
heroku ps:scale web=1 worker=1 --app $APP_NAME

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Your API is available at: https://$APP_NAME.herokuapp.com"
echo ""
echo "📊 View logs:"
echo "   heroku logs --tail --app $APP_NAME"
echo ""
echo "🧪 Test your API:"
echo "   curl https://$APP_NAME.herokuapp.com/api/sentiment/health"
echo ""
echo "🎨 Next: Deploy frontend to Vercel"
echo "   cd frontend && vercel"
echo ""

