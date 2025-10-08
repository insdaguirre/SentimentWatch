# ⚡ Quick Heroku Deployment (5 Minutes)

The absolute fastest way to get your app on Heroku!

---

## 🎯 Prerequisites (2 minutes)

### 1. Install Heroku CLI
```bash
brew tap heroku/brew && brew install heroku
```

### 2. Login to Heroku
```bash
heroku login
```

This opens your browser - login with your Heroku account.

### 3. Setup MongoDB Atlas (Cloud Database)

**Quick Steps:**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up → Create FREE M0 cluster → Choose AWS
3. Database Access → Add User → Username: `stocksentiment`, Password: (generate & save)
4. Network Access → Add IP → Allow Access from Anywhere → Confirm
5. Database → Connect → Connect your application → Copy connection string
6. Replace `<password>` and add `/stock-sentiment` before the `?`:
   ```
   mongodb+srv://stocksentiment:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/stock-sentiment?retryWrites=true&w=majority
   ```

**Save this connection string!**

---

## 🚀 Deploy (3 minutes)

### Option 1: Automated Script

```bash
cd /Users/diegoaguirre/StockSentimentSPY/StockSentiment
./deploy-heroku.sh
```

Follow the prompts and enter your API keys when asked!

### Option 2: Manual Commands

```bash
# Create Heroku app
heroku create stocksentiment-backend

# Set all environment variables
heroku config:set \
  NODE_ENV=production \
  MONGODB_URI="your_mongodb_atlas_connection_string" \
  REDDIT_CLIENT_ID="7qEOJr6l_pId9B7ejon7vw" \
  REDDIT_CLIENT_SECRET="P65UdRmg2ZrG4hDvqj3ucq7UxFSoKQ" \
  REDDIT_USER_AGENT="StockSentimentApp/1.0" \
  REDDIT_USERNAME="your_reddit_username" \
  REDDIT_PASSWORD="your_reddit_password" \
  RAPIDAPI_KEY="8e6943c05cmsh7ba5b7710610ce2p170db9jsnb665cc42e169" \
  NEWS_API_KEY="561d6deb63be4ef8acc5e61d163143fa" \
  INGESTION_INTERVAL_MINUTES="15"

# Deploy backend
git subtree push --prefix backend heroku main

# Start dynos
heroku ps:scale web=1 worker=1

# View logs
heroku logs --tail
```

---

## 🎨 Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Create production env file with Heroku URL
cd frontend
echo "REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api" > .env.production

# Deploy
vercel login
vercel --prod
```

---

## ✅ Verify Everything Works

```bash
# Test API
curl https://your-heroku-app.herokuapp.com/api/sentiment/health

# View logs
heroku logs --tail

# Check dyno status
heroku ps
```

Expected output:
```
web.1: up
worker.1: up
```

---

## 🎯 Your Live URLs

- **Backend API**: https://your-app.herokuapp.com
- **Frontend**: https://your-app.vercel.app
- **API Docs**: https://your-app.herokuapp.com/api/sentiment/health

---

## 🐛 Quick Troubleshooting

### App not responding?
```bash
heroku logs --tail
```

### Need to restart?
```bash
heroku restart
```

### Update environment variables?
```bash
heroku config:set KEY=value
```

### Redeploy after code changes?
```bash
git add .
git commit -m "Update"
git subtree push --prefix backend heroku main
```

---

## 💰 Cost: $0/month

**FREE tier includes:**
- ✅ 550 dyno hours/month (enough for 24/7 operation)
- ✅ 1 web dyno + 1 worker dyno
- ✅ Automatic HTTPS
- ✅ Free domain

**Keep app awake:**
Use UptimeRobot (free) to ping your app every 5 minutes:
https://uptimerobot.com/

---

## 📚 Full Documentation

For detailed guide, see **[HEROKU_DEPLOYMENT.md](HEROKU_DEPLOYMENT.md)**

---

**That's it! You're live on Heroku!** 🎉

