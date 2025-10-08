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

## 🧠 Sentiment Analysis

### VADER + Finance Enhancement
- **Base Model**: VADER sentiment analysis (lightweight, fast)
- **Finance Keywords**: 40+ specialized terms for financial context
- **Memory Efficient**: Uses only ~5MB vs 400MB+ for FinBERT
- **Real-time**: Instant sentiment analysis without model loading

### Finance-Specific Keywords
- **Positive**: bull, bullish, rally, surge, moon, HODL, diamond hands, pump, etc.
- **Negative**: bear, bearish, crash, dump, rekt, bag holder, FUD, etc.
- **Neutral**: hold, stable, consolidate, analysis, research, etc.

## 📊 API Endpoints

### Sentiment Data
- `GET /api/sentiment` - API information and available endpoints
- `GET /api/sentiment/posts/:ticker` - Get recent posts with sentiment
- `GET /api/sentiment/stats/:ticker` - Get sentiment statistics
- `GET /api/sentiment/timeline/:ticker` - Get hourly sentiment timeline
- `GET /api/sentiment/top/:ticker` - Get top posts by sentiment
- `GET /api/sentiment/health` - Health check and system status

**Example Usage:**
```bash
# Get SPY sentiment stats for last 24 hours
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/stats/SPY?hours=24

# Get recent SPY posts
curl https://stocksentiment-e3cfd7d49077.herokuapp.com/api/sentiment/posts/SPY?limit=10

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

## 📈 Performance & Scaling

### Current Metrics
- **Data Collection**: 50+ posts per 15-minute cycle
- **Memory Usage**: ~50MB (VADER vs 400MB+ for FinBERT)
- **API Response Time**: <200ms average
- **Uptime**: 99.9% (Heroku + Vercel)
- **Database**: 235+ posts collected and analyzed

### Scaling Considerations
- **Database**: MongoDB Atlas scales automatically
- **Backend**: Upgrade to Heroku Standard for more memory
- **Frontend**: Vercel handles global CDN automatically
- **Worker**: Can run multiple instances for higher throughput

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Test data ingestion
npm run worker -- --once  # Run one ingestion cycle

# Test API endpoints
curl http://localhost:5000/api/sentiment/health
```

## 📁 Project Structure

```
StockSentiment/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── server.js          # Express app entry point
│   │   ├── config/            # Database configuration
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # External APIs + VADER sentiment
│   │   ├── workers/           # Background data collector
│   │   └── tests/             # Jest test suite
│   ├── package.json           # Backend dependencies
│   ├── Procfile              # Heroku deployment config
│   └── .env                  # Environment variables
│
├── frontend/                   # React Dashboard
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── components/        # Dashboard, Charts, Feed
│   │   ├── services/          # API client
│   │   └── index.js           # React entry point
│   ├── package.json           # Frontend dependencies
│   └── vercel.json           # Vercel deployment config
│
├── docker-compose.yml         # Docker deployment
├── package.json              # Root package.json for Heroku
└── README.md                 # This file
```

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

## 🙏 Acknowledgments

- **VADER Sentiment**: For lightweight, effective sentiment analysis
- **Reddit API**: For access to financial discussion data
- **StockTwits**: For real-time trading sentiment
- **News API**: For financial news aggregation
- **Heroku & Vercel**: For seamless cloud deployment
- **MongoDB Atlas**: For managed database hosting

---

**Built with ❤️ for the financial community**