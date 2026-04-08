#!/bin/bash

set -e

echo "Starting SentimentWatch static demo..."

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --prefix frontend
fi

echo "Opening the client-only demo on http://localhost:3000"
npm start --prefix frontend
