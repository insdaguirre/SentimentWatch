#!/bin/bash

# Stock Sentiment Tracker - Quick Start Script

echo "🚀 Starting Stock Sentiment Tracker..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    brew services start mongodb-community 2>/dev/null || sudo systemctl start mongod 2>/dev/null
    sleep 3
fi

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp backend/env.example backend/.env
    echo "✏️  Please edit backend/.env with your API credentials and run this script again."
    exit 1
fi

# Open terminals for each service
echo "📦 Starting backend server..."
osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/backend && npm start"' &

echo "⚙️  Starting ingestion worker..."
osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/backend && npm run worker"' &

echo "🎨 Starting frontend..."
osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/frontend && npm start"' &

echo ""
echo "✅ All services starting!"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo "🔌 API: http://localhost:5000"
echo ""
echo "Note: It may take 1-2 minutes for data to appear."
echo "Run the worker once manually if needed:"
echo "  cd backend && node src/workers/ingestionWorker.js --once"

