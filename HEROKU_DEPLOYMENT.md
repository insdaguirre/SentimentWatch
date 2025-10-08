# 🚀 Heroku Deployment Guide

Complete guide to deploy your Stock Sentiment Tracker to Heroku (FREE tier available!)

---

## 📋 Prerequisites

1. **Heroku Account** - Sign up at https://signup.heroku.com/
2. **Heroku CLI** - Install from https://devcenter.heroku.com/articles/heroku-cli
3. **MongoDB Atlas** - Free cloud database (already covered in SETUP.md)
4. **Git** - Already installed on your Mac

---

## 🎯 What We'll Deploy

- **Backend API** - Express server on Heroku
- **Worker** - Data ingestion worker on Heroku (same app, different dyno)
- **Frontend** - React app on Vercel (best for React)
- **Database** - MongoDB Atlas (cloud, free tier)

---

## 📦 Part 1: Install Heroku CLI

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Verify installation
heroku --version

# Login to Heroku
heroku login
```

This will open your browser to log in. After logging in, return to terminal.

---

## 🗄️ Part 2: Set Up MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Choose **FREE M0** tier
4. Select **AWS** provider and nearest region
5. Click "Create Cluster"

### Step 2: Create Database User

1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: `stocksentiment`
5. **Password**: Generate a secure password (save it!)
6. **Database User Privileges**: "Atlas admin"
7. Click "Add User"

### Step 3: Whitelist All IPs (for Heroku)

1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Click "Confirm"

**Note**: This allows Heroku to connect (Heroku IPs change dynamically)

### Step 4: Get Connection String

1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. **Driver**: Node.js, **Version**: 4.1 or later
5. Copy the connection string:
   ```
   mongodb+srv://stocksentiment:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual database password
7. Add database name before the `?`:
   ```
   mongodb+srv://stocksentiment:yourpassword@cluster0.xxxxx.mongodb.net/stock-sentiment?retryWrites=true&w=majority
   ```

**Save this connection string!** You'll need it for Heroku.

---

## 🎨 Part 3: Deploy Backend to Heroku

### Step 1: Initialize Git (if not already done)

```bash
cd /Users/diegoaguirre/StockSentimentSPY/StockSentiment

# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for Heroku deployment"
```

### Step 2: Create Heroku App

```bash
# Create app for backend (choose a unique name)
heroku create stocksentiment-backend

# This creates a new Heroku app and adds a git remote
```

**Note**: If the name is taken, try `stocksentiment-api-yourname` or let Heroku generate one.

### Step 3: Set Environment Variables on Heroku

```bash
# Set all your environment variables
heroku config:set NODE_ENV=production

# MongoDB Atlas connection string (use YOUR actual string from Part 2)
heroku config:set MONGODB_URI="mongodb+srv://stocksentiment:yourpassword@cluster0.xxxxx.mongodb.net/stock-sentiment?retryWrites=true&w=majority"

# Reddit API
heroku config:set REDDIT_CLIENT_ID="7qEOJr6l_pId9B7ejon7vw"
heroku config:set REDDIT_CLIENT_SECRET="P65UdRmg2ZrG4hDvqj3ucq7UxFSoKQ"
heroku config:set REDDIT_USER_AGENT="StockSentimentApp/1.0"
heroku config:set REDDIT_USERNAME="your_reddit_username"
heroku config:set REDDIT_PASSWORD="your_reddit_password"

# RapidAPI for StockTwits
heroku config:set RAPIDAPI_KEY="8e6943c05cmsh7ba5b7710610ce2p170db9jsnb665cc42e169"

# News API
heroku config:set NEWS_API_KEY="561d6deb63be4ef8acc5e61d163143fa"

# Worker configuration
heroku config:set INGESTION_INTERVAL_MINUTES="15"

# Verify all vars are set
heroku config
```

### Step 4: Deploy Backend

```bash
# Deploy to Heroku (from project root)
git subtree push --prefix backend heroku main

# Or if you get errors, use:
git push heroku `git subtree split --prefix backend main`:main --force
```

### Step 5: Scale Dynos

```bash
# Start the web dyno (API server) - FREE tier: 1 dyno
heroku ps:scale web=1

# Start the worker dyno (data ingestion) - FREE tier: 1 dyno
heroku ps:scale worker=1
```

### Step 6: Verify Deployment

```bash
# Check app status
heroku ps

# View logs
heroku logs --tail

# Open your API in browser
heroku open
```

Your API will be at: `https://your-app-name.herokuapp.com`

### Step 7: Test API Endpoints

```bash
# Get your Heroku URL
heroku info

# Test health endpoint
curl https://your-app-name.herokuapp.com/api/sentiment/health

# Test stats endpoint
curl https://your-app-name.herokuapp.com/api/sentiment/stats/SPY
```

---

## 🎨 Part 4: Deploy Frontend to Vercel

Vercel is the best platform for React apps (made by the Next.js team).

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Update Frontend API URL

Edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-heroku-app.herokuapp.com/api';
```

Or create `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
```

### Step 3: Deploy to Vercel

```bash
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? stock-sentiment-frontend
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

Your frontend will be at: `https://stock-sentiment-frontend.vercel.app`

### Step 4: Update Backend CORS

Add your Vercel URL to backend allowed origins:

```bash
heroku config:set CORS_ORIGIN="https://stock-sentiment-frontend.vercel.app"
```

---

## 🔄 Part 5: Update Backend CORS for Vercel

Edit `backend/src/server.js` to allow your Vercel domain:

```javascript
// CORS - must be before helmet
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CORS_ORIGIN || 'https://your-vercel-app.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Then redeploy:

```bash
cd /Users/diegoaguirre/StockSentimentSPY/StockSentiment
git add backend/src/server.js
git commit -m "Update CORS for production"
git push heroku `git subtree split --prefix backend main`:main --force
```

---

## 💰 Heroku Free Tier Limits

### What's FREE:
- ✅ 550-1000 dyno hours/month (enough for 1 web + 1 worker 24/7)
- ✅ Automatic HTTPS
- ✅ Free domain: `your-app.herokuapp.com`
- ✅ Easy deploys with Git
- ✅ Environment variables
- ✅ Logging

### Free Tier Notes:
- Dynos sleep after 30 minutes of inactivity (web dyno only)
- First request after sleep takes ~10 seconds (cold start)
- Worker dyno stays running 24/7
- 512 MB RAM per dyno

### Keep Your App Awake:
Use a free service like **UptimeRobot** to ping your app every 5 minutes:
1. Go to https://uptimerobot.com/
2. Create free account
3. Add monitor for `https://your-app.herokuapp.com/api/sentiment/health`
4. Set interval to 5 minutes

---

## 📊 Monitoring & Logs

### View Logs:
```bash
# Real-time logs
heroku logs --tail

# Last 1000 lines
heroku logs -n 1000

# Only worker logs
heroku logs --dyno worker --tail

# Only web logs
heroku logs --dyno web --tail
```

### Check Dyno Status:
```bash
heroku ps
```

### Restart Dynos:
```bash
# Restart all
heroku restart

# Restart specific dyno
heroku restart web
heroku restart worker
```

---

## 🔧 Common Heroku Commands

```bash
# View app info
heroku info

# Open app in browser
heroku open

# View environment variables
heroku config

# Set environment variable
heroku config:set KEY=value

# Remove environment variable
heroku config:unset KEY

# Run one-off commands
heroku run node src/workers/ingestionWorker.js --once

# Access Heroku bash
heroku run bash

# View database status
heroku addons
```

---

## 🐛 Troubleshooting

### App Crashes on Startup

**Check logs:**
```bash
heroku logs --tail
```

**Common issues:**
- Missing environment variables
- MongoDB connection string incorrect
- Port binding (Heroku provides PORT env var)

**Verify env vars:**
```bash
heroku config
```

### MongoDB Connection Fails

**Error**: `MongoServerError: Authentication failed`

**Fix**:
1. Verify MongoDB Atlas password is correct
2. Check connection string format
3. Ensure IP whitelist includes `0.0.0.0/0`

### Worker Not Running

**Check worker status:**
```bash
heroku ps
```

**Start worker:**
```bash
heroku ps:scale worker=1
```

**View worker logs:**
```bash
heroku logs --dyno worker --tail
```

### CORS Errors on Frontend

**Fix**:
1. Add Vercel URL to CORS_ORIGIN
2. Update backend CORS configuration
3. Redeploy backend

---

## 🔄 Updating Your App

### Update Backend:

```bash
# Make changes to code
# Commit changes
git add .
git commit -m "Update backend"

# Deploy
git push heroku `git subtree split --prefix backend main`:main --force
```

### Update Frontend:

```bash
cd frontend

# Make changes
# Deploy
vercel --prod
```

---

## 💡 Pro Tips

### 1. Use Heroku Scheduler (FREE Add-on)

Instead of running worker 24/7, use Heroku Scheduler to run ingestion:

```bash
# Add scheduler
heroku addons:create scheduler:standard

# Open scheduler dashboard
heroku addons:open scheduler

# Add job: node src/workers/ingestionWorker.js --once
# Frequency: Every hour
```

This saves dyno hours!

### 2. View Real-Time Activity

```bash
# Monitor in real-time
heroku logs --tail | grep "Fetched"
```

### 3. Database Backup

MongoDB Atlas automatic backups (free tier):
- Dashboard → Clusters → Your Cluster → Backup

### 4. Custom Domain (Optional)

```bash
# Add custom domain
heroku domains:add yourdomain.com

# Configure DNS
# Add CNAME record pointing to your-app.herokuapp.com
```

---

## 📈 Scaling (When You're Ready)

### Upgrade Dynos:

```bash
# See current plan
heroku ps

# Upgrade to Hobby ($7/month - no sleep)
heroku dyno:type hobby

# Scale horizontally
heroku ps:scale web=2
```

### MongoDB Scaling:

Upgrade Atlas tier when you need:
- More storage
- More connections
- Better performance
- Backups

---

## ✅ Deployment Checklist

Before going live:

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Connection string copied and tested
- [ ] Heroku account created
- [ ] Heroku CLI installed
- [ ] Git initialized and committed
- [ ] Heroku app created
- [ ] All environment variables set on Heroku
- [ ] Backend deployed to Heroku
- [ ] Web dyno started (`heroku ps:scale web=1`)
- [ ] Worker dyno started (`heroku ps:scale worker=1`)
- [ ] API endpoints tested
- [ ] Frontend deployed to Vercel
- [ ] CORS configured for Vercel domain
- [ ] Frontend can fetch data from backend

---

## 🎉 You're Live!

**Your Stack:**
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-app.herokuapp.com
- **Database**: MongoDB Atlas (cloud)
- **Worker**: Heroku worker dyno (24/7)

**All FREE!** 🎊

---

## 📞 Support

### Heroku Help:
- Docs: https://devcenter.heroku.com/
- Status: https://status.heroku.com/
- Support: https://help.heroku.com/

### Vercel Help:
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

### MongoDB Atlas Help:
- Docs: https://docs.atlas.mongodb.com/
- Support: https://support.mongodb.com/

---

**Ready to deploy? Let's get you on Heroku!** 🚀

