# 🔑 API Providers - Quick Reference Card

This is a **quick reference** for setting up the three API providers. Print this or keep it handy while setting up!

---

## 1. Reddit API ⭐ **REQUIRED** (5 minutes)

### URL
🔗 https://www.reddit.com/prefs/apps

### Steps
1. ✅ Login to Reddit (or create account)
2. ✅ Scroll to bottom, click **"Create App"** or **"Create Another App"**
3. ✅ Fill form:
   - **Name**: `Stock Sentiment App` (or any name)
   - **App Type**: Select **"script"** (important!)
   - **Description**: Leave blank or add description
   - **About URL**: Leave blank
   - **Redirect URI**: `http://localhost:8080` (required but unused)
4. ✅ Click **"Create App"**
5. ✅ Copy your credentials:
   - **Client ID**: The random string under "personal use script" (e.g., `dQw4w9WgXcQ`)
   - **Client Secret**: The "secret" field (e.g., `1234567890abcdefghij`)

### Add to .env
```env
REDDIT_CLIENT_ID=paste_your_client_id_here
REDDIT_CLIENT_SECRET=paste_your_secret_here
REDDIT_USER_AGENT=StockSentimentApp/1.0
```

### Cost
✅ **FREE** - No credit card required

### Rate Limit
60 requests per minute (sufficient for multiple tickers)

---

## 2. News API 📰 **RECOMMENDED** (3 minutes)

### URL
🔗 https://newsapi.org/

### Steps
1. ✅ Click **"Get API Key"** (top right)
2. ✅ Sign up with email and password
3. ✅ Choose **"Developer"** plan (FREE)
4. ✅ Verify your email
5. ✅ Login and copy your API key from dashboard

### Add to .env
```env
NEWS_API_KEY=paste_your_api_key_here
```

### Cost
✅ **FREE** tier includes:
- 100 requests per day
- Up to 1 month of historical data
- No credit card required

### Rate Limit
100 requests per day

### Note
If you skip this, the app will still work using RSS feeds as fallback!

---

## 3. StockTwits API via RapidAPI 💬 **REQUIRED** (3 minutes)

### URL
🔗 https://rapidapi.com/stocktwits/api/stocktwits

### Steps
1. ✅ Go to RapidAPI and sign in (or create free account)
2. ✅ Search for "StockTwits" API
3. ✅ Click "Subscribe to Test" button
4. ✅ Select **"Basic"** plan (FREE - $0.00/mo)
5. ✅ Copy your **X-RapidAPI-Key** from the code snippets section

### Add to .env
```env
# Your RapidAPI key (shows in the header examples on RapidAPI)
RAPIDAPI_KEY=your_rapidapi_key_here
```

### Cost
✅ **FREE** Basic plan includes:
- 500,000 requests per month (hard limit)
- 1,000 requests per hour (rate limit)
- No credit card required

### Rate Limit
- **1,000 requests per hour**
- **500,000 requests per month**
- Much better than direct StockTwits API!

---

## 4. MongoDB 🗄️ **REQUIRED**

### Option A: Local Installation (Recommended for Development)

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. Start MongoDB service

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create cluster (M0 Free tier)
4. Create database user
5. Whitelist IP (use `0.0.0.0/0` for dev)
6. Get connection string
7. Replace password in connection string

### Add to .env
```env
# Local:
MONGODB_URI=mongodb://localhost:27017/stock-sentiment

# OR Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-sentiment
```

### Cost
✅ **FREE** - Both local and Atlas M0 tier

---

## 📋 Checklist

Before starting the app, verify:

- [ ] Reddit Client ID added to `.env`
- [ ] Reddit Client Secret added to `.env`
- [ ] RapidAPI Key added to `.env` (for StockTwits)
- [ ] News API Key added to `.env` (or left blank if skipping)
- [ ] MongoDB is running locally OR Atlas URI is configured
- [ ] Saved `.env` file in `backend/` directory

---

## 🧪 Test Your Setup

After adding credentials to `.env`, test each service:

```bash
# Test backend can start
cd backend
npm start

# Test worker can fetch data (in another terminal)
cd backend
node src/workers/ingestionWorker.js --once
```

You should see:
```
✅ Loading FinBERT model...
✅ Reddit service initialized
✅ Fetched X Reddit posts for SPY
✅ Fetched X StockTwits messages for SPY
✅ Fetched X news articles for SPY
✅ SPY: X new posts, X duplicates
```

---

## ⚠️ Common Errors

### Reddit: "401 Unauthorized"
- ❌ Wrong CLIENT_ID or CLIENT_SECRET
- ❌ Extra spaces in `.env` file
- ❌ App type is not "script"

**Fix**: Re-check credentials, ensure app type is "script"

### News API: "401 Unauthorized"
- ❌ Wrong API key
- ❌ Email not verified

**Fix**: Verify email and copy key from dashboard

### MongoDB: "Connection refused"
- ❌ MongoDB not running

**Fix**: `brew services start mongodb-community` (macOS)

---

## 💡 Pro Tips

1. **Keep credentials secret**: Never commit `.env` to Git
2. **Test one at a time**: Add Reddit first, test, then News, etc.
3. **Monitor rate limits**: Check terminal logs for rate limit warnings
4. **Use RSS fallback**: If News API hits limit, RSS will take over automatically
5. **Start simple**: Get Reddit working first (it has most data)

---

## 📞 Where to Get Help

- **Reddit API Docs**: https://www.reddit.com/dev/api
- **News API Docs**: https://newsapi.org/docs
- **StockTwits API Docs**: https://api.stocktwits.com/developers/docs
- **MongoDB Docs**: https://docs.mongodb.com/

---

## 🎯 Minimum to Get Started

**Absolute minimum** (app will work with just these):
1. ✅ Reddit API (Client ID + Secret)
2. ✅ MongoDB (local or Atlas)

**Recommended** (for best experience):
1. ✅ Reddit API
2. ✅ RapidAPI Key (for StockTwits - FREE!)
3. ✅ News API
4. ✅ MongoDB

**Note**: StockTwits is now accessed via RapidAPI with much better rate limits!

---

## ⏱️ Time Estimate

- Reddit API setup: **5 minutes**
- News API setup: **3 minutes**
- MongoDB setup: **5-10 minutes**
- Total: **~15 minutes**

---

## 🎊 Ready to Go!

Once you have:
1. ✅ API credentials in `.env`
2. ✅ MongoDB running
3. ✅ Dependencies installed (`npm install`)

You can start the app:
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd backend && npm run worker

# Terminal 3
cd frontend && npm start
```

Open http://localhost:3000 and enjoy! 📈

---

**Print this page and keep it handy during setup! 📄**

