# 📈 Stock Sentiment Tracker

A production-ready finance app that tracks real-time sentiment across Reddit, StockTwits, and news sources for stock tickers (starting with SPY). Data is ingested into MongoDB, enriched with VADER sentiment analysis enhanced with finance-specific rules, and exposed via a Node.js/Express API with a beautiful React frontend.

![Architecture](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Live_Production-success)
![Live App](https://img.shields.io/badge/Live_App-Vercel-blue)

## 🎯 Features

- **Multi-Source Sentiment Analysis**: Aggregates data from Reddit, StockTwits, and news outlets
- **AI-Powered Insights**: Uses VADER sentiment analysis enhanced with 40+ finance-specific keywords
- **Real-Time Dashboard**: Beautiful React frontend with live sentiment metrics
- **Automated Data Collection**: Background worker ingests data every 15 minutes
- **RESTful API**: Well-documented Express API with rate limiting and CORS
- **Timeline Visualization**: Track sentiment trends over time with interactive charts
- **Source Breakdown**: See sentiment distribution by platform (Reddit, StockTwits, News)
- **Cloud Deployment**: Live on Heroku (backend) + Vercel (frontend) + MongoDB Atlas

## 🚀 Live Application

**Frontend**: https://frontend-mjdwqm0t3-diego-aguirres-projects-67059f45.vercel.app  
**Backend API**: https://stocksentiment-e3cfd7d49077.herokuapp.com  
**API Health**: https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/health

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph "Data Sources"
        A[Reddit API] -->|posts| B[Ingestion Worker]
        C[StockTwits via RapidAPI] -->|messages| B
        D[News API] -->|headlines| B
    end

    B -->|normalize & dedupe| E[VADER + Finance Rules]
    E -->|sentiment scores| F[MongoDB Atlas]
    
    F -->|query| G[Express API on Heroku]
    G -->|CORS enabled| H[React Frontend on Vercel]
    
    subgraph "Deployment"
        I[Heroku Basic Dyno]
        J[Vercel Static Hosting]
        K[MongoDB Atlas Cloud]
    end
    
    G -.->|deployed on| I
    H -.->|deployed on| J
    F -.->|hosted on| K
```

## 🧠 How It Works

### Data Flow Architecture
1. **Data Collection**: Background worker runs every 15 minutes
2. **Multi-Source Ingestion**: Fetches from Reddit, StockTwits, and News APIs
3. **Sentiment Analysis**: VADER + finance-specific keyword enhancement
4. **Real-Time Aggregation**: Creates 5-minute sentiment snapshots
5. **API Exposure**: Express.js serves aggregated data via REST endpoints
6. **Frontend Visualization**: React dashboard displays live sentiment metrics

### Optimized Data Architecture (v2.0)
- **Sentiment Snapshots**: Aggregated data stored in 5-minute windows
- **Memory Efficient**: Individual posts processed and discarded immediately
- **TTL Indexes**: Automatic cleanup of old data (30-day retention)
- **End-of-Day Cleanup**: Daily maintenance at 4:00 PM EST
- **Real-Time Processing**: Batch processing for memory optimization

### Sentiment Analysis Engine

#### VADER + Finance Enhancement
- **Base Model**: VADER sentiment analysis (lightweight, fast)
- **Finance Keywords**: 40+ specialized terms for financial context
- **Memory Efficient**: Uses only ~5MB vs 400MB+ for FinBERT
- **Real-time**: Instant sentiment analysis without model loading

#### Finance-Specific Keywords
- **Positive**: bull, bullish, rally, surge, moon, HODL, diamond hands, pump, etc.
- **Negative**: bear, bearish, crash, dump, rekt, bag holder, FUD, etc.
- **Neutral**: hold, stable, consolidate, analysis, research, etc.

#### Sentiment Scoring Algorithm
```javascript
// 1. VADER base analysis
const vaderResult = vader.SentimentIntensityAnalyzer.polarity_scores(text);

// 2. Finance keyword enhancement
const financeBoost = calculateFinanceBoost(text, financeKeywords);

// 3. Enhanced compound score
const enhancedCompound = vaderResult.compound + financeBoost;

// 4. Final sentiment classification
if (enhancedCompound >= 0.05) return 'positive';
if (enhancedCompound <= -0.05) return 'negative';
return 'neutral';
```

## 📊 API Endpoints (v2.0)

### Core Endpoints
- `GET /api/sentiment` - API information and available endpoints
- `GET /api/sentiment/current/:ticker` - Get latest sentiment snapshot
- `GET /api/sentiment/snapshots/:ticker` - Get recent sentiment snapshots
- `GET /api/sentiment/stats/:ticker` - Get aggregated sentiment statistics
- `GET /api/sentiment/timeline/:ticker` - Get sentiment timeline data
- `GET /api/sentiment/top/:ticker` - Get top sentiment snapshots by confidence
- `GET /api/sentiment/health` - Health check and system status

### Data Models

#### SentimentSnapshot Schema
```javascript
{
  ticker: "SPY",
  timestamp: "2025-10-08T20:30:01.583Z",
  timeWindow: "5min",
  totalPosts: 54,
  sentimentBreakdown: {
    positive: { count: 25, avgScore: 0.78 },
    negative: { count: 11, avgScore: 0.23 },
    neutral: { count: 18, avgScore: 0.52 }
  },
  sources: {
    reddit: { count: 4, sentiment: { positive: 2, negative: 1, neutral: 1 } },
    stocktwits: { count: 30, sentiment: { positive: 15, negative: 7, neutral: 8 } },
    news: { count: 20, sentiment: { positive: 8, negative: 3, neutral: 9 } }
  },
  overallSentiment: "bullish",
  overallScore: 0.76,
  confidence: 0.46,
  volatility: 0.12
}
```

**Example Usage:**
```bash
# Get current SPY sentiment
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/current/SPY

# Get SPY sentiment stats for last 24 hours
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/stats/SPY?hours=24

# Get recent sentiment snapshots
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/snapshots/SPY?limit=10

# Get sentiment timeline
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/timeline/SPY?hours=24

# Check system health
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/health
```

## 🛠️ Technology Stack

### Backend (Node.js/Express)
- **Runtime**: Node.js 24.9.0
- **Framework**: Express.js with middleware (CORS, Helmet, Rate Limiting)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Sentiment**: VADER with custom finance rules
- **APIs**: Reddit (Snoowrap), StockTwits (RapidAPI), News API
- **Deployment**: Heroku Basic Dyno (512MB RAM)
- **Worker**: Node-cron for scheduled data ingestion

### Frontend (React)
- **Framework**: React 18.2.0 with Create React App
- **Charts**: Recharts for timeline visualization
- **Styling**: CSS with modern gradients and responsive design
- **State**: React Hooks (useState, useEffect, useCallback)
- **HTTP**: Axios for API communication
- **Deployment**: Vercel with automatic builds

### Infrastructure
- **Database**: MongoDB Atlas (M0 Free Tier)
- **Backend Hosting**: Heroku Basic ($7/month)
- **Frontend Hosting**: Vercel (Free Tier)
- **CDN**: Vercel Edge Network
- **Monitoring**: Heroku logs + Vercel analytics

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- API keys for Reddit, RapidAPI, and News API

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd StockSentiment

# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 2. Configure Environment
```bash
# Backend
cd backend
cp env.example .env
# Edit .env with your API credentials
```

Required environment variables:
```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database

# Reddit API
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
REDDIT_USER_AGENT=StockSentimentApp/1.0

# RapidAPI for StockTwits
RAPIDAPI_KEY=your_rapidapi_key

# News API
NEWS_API_KEY=your_news_api_key

# CORS (for production)
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Worker:**
```bash
cd backend
npm run worker
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🐳 Docker Deployment

```bash
# Create .env file first
cd backend
cp env.example .env
# Add your API credentials

# Start all services
cd ..
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## 🔄 Worker Process Details

### Ingestion Worker (`ingestionWorker.js`)
The background worker is the heart of the data collection system:

#### Process Flow
1. **Initialization**: Connects to MongoDB and initializes VADER sentiment analyzer
2. **Data Fetching**: Parallel requests to Reddit, StockTwits, and News APIs
3. **Batch Processing**: Processes posts in batches of 10 for memory efficiency
4. **Sentiment Analysis**: VADER + finance keyword enhancement for each post
5. **Aggregation**: Creates sentiment snapshots with breakdowns by source and sentiment
6. **Storage**: Saves aggregated snapshots to MongoDB
7. **Cleanup**: Clears processed data from memory

#### Scheduling
- **Ingestion**: Every 15 minutes (`*/15 * * * *`)
- **End-of-Day Cleanup**: Daily at 4:00 PM EST (`0 21 * * *`)
- **TTL Indexes**: Automatic cleanup after 30 days

#### Memory Management
- **Batch Processing**: 10 posts per batch to prevent memory overflow
- **Immediate Cleanup**: Individual posts discarded after processing
- **Aggregated Storage**: Only sentiment snapshots stored long-term

### Data Processing Pipeline
```mermaid
graph TD
    A[Worker Starts] --> B[Fetch from APIs]
    B --> C[Batch Processing]
    C --> D[Sentiment Analysis]
    D --> E[Aggregate Data]
    E --> F[Create Snapshot]
    F --> G[Save to MongoDB]
    G --> H[Memory Cleanup]
    H --> I[Wait 15 minutes]
    I --> A
```

## 📈 Performance & Scaling

### Current Metrics
- **Data Collection**: 50+ posts per 15-minute cycle
- **Memory Usage**: ~50MB (VADER vs 400MB+ for FinBERT)
- **API Response Time**: <200ms average
- **Uptime**: 99.9% (Heroku + Vercel)
- **Database**: 235+ posts collected and analyzed
- **Snapshot Creation**: 5-minute aggregated windows
- **Data Retention**: 30-day TTL with daily cleanup

### Scaling Considerations
- **Database**: MongoDB Atlas scales automatically
- **Backend**: Upgrade to Heroku Standard for more memory
- **Frontend**: Vercel handles global CDN automatically
- **Worker**: Can run multiple instances for higher throughput
- **Memory**: Optimized for 512MB Heroku Basic dyno

## 🧪 Testing

### Local Testing
```bash
# Backend tests
cd backend
npm test

# Test data ingestion (single run)
npm run worker -- --once  # Run one ingestion cycle

# Test API endpoints
curl http://localhost:5000/api/sentiment/health
curl http://localhost:5000/api/sentiment/current/SPY
curl http://localhost:5000/api/sentiment/snapshots/SPY?limit=5
```

### Production Testing
```bash
# Test live API endpoints
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/health
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/current/SPY
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/stats/SPY?hours=24

# Check worker status
heroku ps --app stocksentiment
heroku logs --tail --app stocksentiment
```

### Troubleshooting Common Issues

#### Duplicate Time Values on Timeline
**Problem**: Multiple snapshots with same timestamp on x-axis
**Cause**: Multiple worker processes running simultaneously
**Solution**: 
```bash
# Check running processes
heroku ps --app stocksentiment

# Stop duplicate workers
heroku ps:stop run.XXXX --app stocksentiment
```

#### Memory Issues
**Problem**: Worker crashes with R14 (Memory quota exceeded)
**Cause**: Large sentiment models or inefficient processing
**Solution**: VADER sentiment analysis (already implemented)

#### CORS Errors
**Problem**: Frontend can't access backend API
**Cause**: CORS configuration or missing environment variables
**Solution**:
```bash
# Set CORS origin for production
heroku config:set CORS_ORIGIN=https://your-frontend.vercel.app --app stocksentiment
```

## 📁 Project Structure

```
StockSentiment/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── server.js          # Express app entry point
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection
│   │   ├── models/
│   │   │   ├── SentimentPost.js      # Legacy post model (cleanup only)
│   │   │   └── SentimentSnapshot.js  # Aggregated snapshot model
│   │   ├── routes/
│   │   │   └── sentiment.js   # API endpoints (v2.0)
│   │   ├── services/
│   │   │   ├── sentimentAnalyzer.js  # VADER + finance rules
│   │   │   ├── redditService.js      # Reddit API integration
│   │   │   ├── stocktwitsService.js  # StockTwits via RapidAPI
│   │   │   └── newsService.js        # News API integration
│   │   ├── workers/
│   │   │   └── ingestionWorker.js    # Background data collector
│   │   └── tests/             # Jest test suite
│   ├── package.json           # Backend dependencies
│   ├── env.example           # Environment variables template
│   └── .env                  # Environment variables (gitignored)
│
├── frontend/                   # React Dashboard
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── components/
│   │   │   ├── SentimentDashboard.js # Main dashboard
│   │   │   ├── TimelineChart.js      # Recharts timeline
│   │   │   ├── StatsPanel.js         # Source breakdown
│   │   │   └── PostsFeed.js          # Legacy component
│   │   ├── services/
│   │   │   └── api.js         # API client
│   │   ├── App.css            # Main styles
│   │   └── index.js           # React entry point
│   ├── package.json           # Frontend dependencies
│   └── public/               # Static assets
│
├── Procfile                  # Heroku process configuration
├── vercel.json              # Vercel deployment configuration
├── docker-compose.yml       # Docker deployment
├── package.json             # Root package.json for Heroku
└── README.md                # This file
```

### Key Files Explained

#### Backend Core Files
- **`server.js`**: Express app with CORS, rate limiting, and route configuration
- **`ingestionWorker.js`**: Background worker with cron scheduling and memory management
- **`sentimentAnalyzer.js`**: VADER sentiment analysis with finance keyword enhancement
- **`SentimentSnapshot.js`**: MongoDB model for aggregated sentiment data with TTL indexes

#### Frontend Core Files
- **`App.js`**: Main React component with data fetching and state management
- **`TimelineChart.js`**: Recharts component for sentiment timeline visualization
- **`StatsPanel.js`**: Source breakdown with sentiment distribution
- **`api.js`**: Axios-based API client for backend communication

#### Configuration Files
- **`Procfile`**: Heroku process definitions (web + worker dynos)
- **`vercel.json`**: Vercel deployment configuration for frontend
- **`env.example`**: Template for required environment variables

## 🔧 API Provider Setup

### 1. Reddit API (Required)
1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App"
3. Fill in:
   - Name: `Stock Sentiment App`
   - Type: `script`
   - Redirect URI: `http://localhost:8080`
4. Copy Client ID and Secret

### 2. RapidAPI for StockTwits (Required)
1. Go to https://rapidapi.com/stocktwits/api/stocktwits
2. Subscribe to FREE Basic plan
3. Copy X-RapidAPI-Key (500k requests/month)

### 3. News API (Recommended)
1. Go to https://newsapi.org/
2. Sign up for free account
3. Copy your API key

## 🚀 Deployment

### Heroku (Backend)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set REDDIT_CLIENT_ID=your_client_id
# ... set all other env vars

# Deploy
git push heroku main
```

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
cd frontend
vercel --prod
```

## 📊 Monitoring

### Health Checks
- **Backend**: https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/health
- **Frontend**: https://frontend-mjdwqm0t3-diego-aguirres-projects-67059f45.vercel.app

### Logs
```bash
# Heroku logs
heroku logs --tail --app stocksentiment

# Vercel logs
vercel logs https://your-frontend-url.vercel.app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Recent Updates & Fixes

### v2.0.0 - Optimized Data Architecture (October 2025)
- **Real-time Aggregation**: Implemented sentiment snapshots with 5-minute windows
- **Memory Optimization**: Individual posts processed and discarded immediately
- **TTL Indexes**: Automatic cleanup of old data after 30 days
- **End-of-Day Cleanup**: Daily maintenance at 4:00 PM EST
- **Batch Processing**: 10 posts per batch for memory efficiency

### Recent Bug Fixes
- **Duplicate Timeline Values**: Fixed multiple worker processes creating duplicate snapshots
- **Time Formatting**: Enhanced timeline to show seconds (HH:mm:ss) for better distinction
- **CORS Configuration**: Dynamic CORS origin handling for Vercel deployments
- **Memory Issues**: Switched from FinBERT/DistilBERT to VADER for 512MB Heroku dyno
- **API Endpoints**: Updated to v2.0 with new snapshot-based architecture

### Performance Improvements
- **Memory Usage**: Reduced from 400MB+ to ~50MB with VADER
- **Processing Speed**: Real-time sentiment analysis without model loading
- **Data Efficiency**: Aggregated storage instead of individual post storage
- **Timeline Accuracy**: Unique timestamps with second-level precision

## 🙏 Acknowledgments

- **VADER Sentiment**: For lightweight, effective sentiment analysis
- **Reddit API**: For access to financial discussion data
- **StockTwits**: For real-time trading sentiment
- **News API**: For financial news aggregation
- **Heroku & Vercel**: For seamless cloud deployment
- **MongoDB Atlas**: For managed database hosting
- **RapidAPI**: For StockTwits API access

---

**Built with ❤️ for the financial community**