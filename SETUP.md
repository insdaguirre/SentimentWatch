# Stock Sentiment Tracker - Setup Guide

This guide will walk you through setting up all required API providers and getting the application running.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Setup](#mongodb-setup)
3. [API Provider Setup](#api-provider-setup)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)

---

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Installation Guide](#mongodb-setup)
- **npm** or **yarn** package manager

---

## MongoDB Setup

### Option 1: Local MongoDB Installation

#### macOS (using Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify MongoDB is running
mongosh
```

#### Windows
1. Download MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB service from Services panel
4. Or run: `net start MongoDB`

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free M0 tier)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
7. Replace `<password>` with your database user password
8. Use this connection string in your `.env` file

---

## API Provider Setup

### 1. Reddit API

**Required for**: Reddit posts and comments

#### Setup Steps:
1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Log in to your Reddit account (or create one)
3. Click "Create App" or "Create Another App" at the bottom
4. Fill in the form:
   - **Name**: Stock Sentiment App (or any name)
   - **App Type**: Select "script"
   - **Description**: Optional
   - **About URL**: Optional
   - **Redirect URI**: `http://localhost:8080` (required but not used)
5. Click "Create App"
6. You'll see your credentials:
   - **Client ID**: The string under "personal use script"
   - **Client Secret**: The "secret" field

#### Add to .env:
```env
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=StockSentimentApp/1.0
```

**Cost**: Free ✅

---

### 2. StockTwits API (via RapidAPI)

**Required for**: StockTwits messages

#### Setup Steps:
1. Go to [rapidapi.com/stocktwits/api/stocktwits](https://rapidapi.com/stocktwits/api/stocktwits)
2. Sign in to RapidAPI (or create a free account)
3. Click **"Subscribe to Test"** button
4. Select the **"Basic"** plan (FREE - $0.00/month)
5. Click **"Subscribe"** (no credit card required)
6. Once subscribed, you'll see code snippets on the right
7. Copy your **X-RapidAPI-Key** from the header examples

**Example header:**
```
x-rapidapi-key: 8e6943c05cmsh7ba5b7710610ce2p170db9jsnb665cc42e169
```

#### Add to .env:
```env
RAPIDAPI_KEY=your_rapidapi_key_here
```

**Cost**: Free ✅

**Free tier includes:**
- ✅ 500,000 requests per month (hard limit)
- ✅ 1,000 requests per hour (rate limit)
- ✅ No credit card required
- ✅ Much better limits than direct StockTwits API!

**Note**: This is now the recommended way to access StockTwits as they've restricted new direct API signups

---

### 3. News API

**Required for**: News articles

#### Setup Steps:
1. Go to [newsapi.org](https://newsapi.org/)
2. Click "Get API Key" button
3. Sign up for a free account:
   - Email
   - Password
   - Choose a plan: **Developer** (Free)
4. Verify your email
5. Log in and copy your API key from the dashboard

#### Add to .env:
```env
NEWS_API_KEY=your_news_api_key_here
```

**Cost**: Free tier includes:
- ✅ 100 requests per day
- ✅ Up to 1 month of historical data
- ✅ Perfect for development

**Note**: If you need more requests, consider using only RSS feeds (already configured as fallback in the app)

---

## Installation

### 1. Clone and Install Backend

```bash
cd backend
npm install
```

### 2. Configure Backend Environment

```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your credentials
nano .env  # or use any text editor
```

Update the `.env` file with your API credentials from above.

### 3. Install Frontend

```bash
cd ../frontend
npm install
```

---

## Running the Application

### Terminal 1: Start MongoDB (if running locally)
```bash
# macOS/Linux
brew services start mongodb-community@7.0

# Or manually
mongod --config /usr/local/etc/mongod.conf

# Windows
net start MongoDB
```

### Terminal 2: Start Backend Server
```bash
cd backend
npm start

# For development with auto-reload
npm run dev
```

The backend will start on `http://localhost:5000`

### Terminal 3: Start Ingestion Worker
```bash
cd backend
npm run worker

# For one-time run (useful for testing)
node src/workers/ingestionWorker.js --once
```

The worker will:
- Fetch data from Reddit, StockTwits, and News sources
- Analyze sentiment using FinBERT
- Store results in MongoDB
- Run every 15 minutes (configurable in .env)

### Terminal 4: Start Frontend
```bash
cd frontend
npm start
```

The frontend will open automatically at `http://localhost:3000`

---

## Testing

### Test Backend API

1. **Health Check**:
```bash
curl http://localhost:5000/api/sentiment/health
```

2. **Get Stats**:
```bash
curl http://localhost:5000/api/sentiment/stats/SPY
```

3. **Get Posts**:
```bash
curl http://localhost:5000/api/sentiment/posts/SPY?limit=10
```

### Test Data Ingestion

Run the worker once to test data collection:

```bash
cd backend
node src/workers/ingestionWorker.js --once
```

Expected output:
```
Ingestion worker initialized
Loading FinBERT sentiment model...
FinBERT model loaded successfully
Starting ingestion at 2024-10-08T...

=== Ingesting data for SPY ===
Fetched X Reddit posts for SPY
Fetched X StockTwits messages for SPY
Fetched X news articles for SPY
Total posts fetched: X
SPY: X new posts, X duplicates

Ingestion completed at 2024-10-08T...
```

### Verify Frontend

1. Open `http://localhost:3000`
2. You should see:
   - Overall sentiment gauge
   - Sentiment breakdown (positive/negative/neutral)
   - Timeline chart
   - Source breakdown
   - Recent posts feed

If you see "No data available", the worker may still be processing. Wait 1-2 minutes and refresh.

---

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoServerError: Authentication failed`
- Check your MongoDB URI in `.env`
- Verify username/password are correct
- For Atlas, ensure IP is whitelisted

**Error**: `MongooseError: connect ECONNREFUSED`
- Ensure MongoDB is running: `brew services list | grep mongodb`
- Check if MongoDB is on the correct port (default: 27017)

### Reddit API Issues

**Error**: `401 Unauthorized`
- Verify CLIENT_ID and CLIENT_SECRET are correct
- Ensure there are no extra spaces in .env file
- Check that USER_AGENT is set

**Error**: `429 Too Many Requests`
- Reddit has rate limits (60 requests/minute)
- The app includes built-in rate limiting
- Wait a few minutes and try again

### StockTwits API Issues

**Error**: `403 Forbidden`
- You may have exceeded rate limits
- Try adding an access token
- Wait 1 hour for rate limit reset

### News API Issues

**Error**: `426 Upgrade Required`
- Free tier only allows HTTPS in production
- Use `http://` for localhost development
- Or upgrade to paid plan

**Error**: `429 Too Many Requests`
- Free tier: 100 requests/day
- The app uses RSS fallbacks automatically
- Consider spreading out worker runs

### Frontend Issues

**Error**: `Failed to load data`
- Ensure backend is running on port 5000
- Check browser console for specific errors
- Verify CORS settings in backend

**No data showing**:
- Run the worker at least once
- Check MongoDB has data: `mongosh` → `use stock-sentiment` → `db.sentimentposts.count()`
- Check backend logs for errors

---

## Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri

# Use HTTPS URLs in production
CORS_ORIGIN=https://yourdomain.com
```

### Recommended Hosting Options

**Backend**:
- Heroku (easy, free tier available)
- Railway.app (modern, generous free tier)
- DigitalOcean App Platform
- AWS Elastic Beanstalk

**Frontend**:
- Vercel (recommended for React)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

**Database**:
- MongoDB Atlas (recommended, free tier)
- AWS DocumentDB
- DigitalOcean Managed MongoDB

**Worker**:
- Same server as backend
- Heroku Worker dyno
- Railway Background Worker
- AWS Lambda (scheduled)

---

## Rate Limits Summary

| Service | Free Tier Limit | Notes |
|---------|----------------|-------|
| Reddit | 60 req/min | Per OAuth client |
| StockTwits (RapidAPI) | 1000 req/hr | 500k req/month via RapidAPI |
| News API | 100 req/day | 1000 req/day on paid plans |
| MongoDB Atlas | 512 MB storage | Free M0 tier |

**Recommended Worker Schedule**:
- Every 15 minutes (default) - ~384 requests/day
- Every 30 minutes - ~192 requests/day (safer for free tiers)
- Every hour - ~96 requests/day (very conservative)

Adjust `INGESTION_INTERVAL_MINUTES` in `.env` based on your needs.

---

## Support

If you encounter issues not covered here:

1. Check the logs:
   - Backend: Terminal running `npm start`
   - Worker: Terminal running `npm run worker`
   - Browser: Developer Console (F12)

2. Verify all services are running:
   - MongoDB
   - Backend API
   - Worker
   - Frontend

3. Common fixes:
   - Restart MongoDB
   - Clear MongoDB data: `mongosh` → `use stock-sentiment` → `db.dropDatabase()`
   - Delete `node_modules` and run `npm install` again
   - Clear browser cache

---

## Next Steps

Once everything is working:

1. **Add More Tickers**: Edit `backend/src/workers/ingestionWorker.js` line 10:
   ```javascript
   this.tickers = ['SPY', 'QQQ', 'AAPL', 'TSLA'];
   ```

2. **Customize Sentiment Model**: Replace with actual FinBERT in `backend/src/services/sentimentAnalyzer.js`

3. **Add Embeddings**: Integrate vector embeddings for semantic search

4. **Add Cold Storage**: Implement S3/R2 archival as shown in architecture diagram

5. **Add LLM Summaries**: Integrate local LLM for post summaries

---

## Summary

✅ **Required APIs** (all free):
1. Reddit API - [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. StockTwits via RapidAPI - [rapidapi.com/stocktwits/api/stocktwits](https://rapidapi.com/stocktwits/api/stocktwits)
3. News API - [newsapi.org](https://newsapi.org/) (or use RSS only)

✅ **Database**:
- MongoDB local or Atlas (free tier)

✅ **Start Order**:
1. MongoDB
2. Backend server
3. Ingestion worker
4. Frontend

✅ **Verify**:
- Health endpoint returns data
- Worker logs show successful ingestion
- Frontend displays sentiment data

Enjoy your Stock Sentiment Tracker! 📈

