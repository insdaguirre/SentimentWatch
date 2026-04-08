# SentimentWatch Demo

SentimentWatch is now a fully static product demo. The app preserves the original concept of stock sentiment tracking, but every number, chart, headline, and post is synthetic demo data checked into the repo.

## What This Repo Is Now

- Static React frontend only
- No live APIs, databases, workers, auth backends, or scheduled jobs
- No real news, Reddit, StockTwits, market data, or sentiment analysis
- Deployable as a free static site

The active demo flow lives in the frontend. Legacy backend code may still exist in the repo for reference, but it is not required to run or deploy the demo.

## Demo Data

The demo dataset lives in [frontend/src/data/demoData.js](/Users/diego/SentimentWatchDemo/SentimentWatch/frontend/src/data/demoData.js).

It includes synthetic coverage for:

- `AAPL`
- `TSLA`
- `NVDA`
- `MSFT`
- `AMZN`

For each ticker, the dataset includes:

- A synthetic sentiment summary
- Multi-day time-series sentiment points
- Synthetic price context for charts
- Source breakdowns for news, Reddit-style, and StockTwits-like chatter
- Fictional feed items over multiple dates
- Top themes and demo summary copy

All content is intentionally fictional and presented as a showcase only.

## Local Run

From the repo root:

```bash
npm install
npm start --prefix frontend
```

The app runs on `http://localhost:3000`.

No backend, database, `.env`, or API keys are required.

## Static Build

Build the deployable static site with:

```bash
npm run build --prefix frontend
```

The output is written to `frontend/build`.

## Free Deployment

### Vercel

Use these settings at the repo root:

```text
Install Command: cd frontend && npm install
Build Command: cd frontend && npm run build
Output Directory: frontend/build
```

The repo already includes a root [vercel.json](/Users/diego/SentimentWatchDemo/SentimentWatch/vercel.json) for this frontend-only build.

### Netlify

Use these settings:

```text
Base directory: frontend
Build command: npm run build
Publish directory: build
```

## Notes

- Routing uses `HashRouter`, so the demo works cleanly on static hosts without a backend rewrite layer.
- The app shows a visible demo treatment in the UI and avoids implying any live market or trading functionality.
- Frontend runtime data access is handled through [frontend/src/services/api.js](/Users/diego/SentimentWatchDemo/SentimentWatch/frontend/src/services/api.js), which now reads only from local demo objects.
