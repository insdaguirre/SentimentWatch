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
npm run build
```

The output is written to `frontend/build`.

The root build script derives the GitHub Pages subpath from the repo folder or GitHub repository name and sets:

```text
PUBLIC_URL=/<project-name>-demo
```

For this repo, the production base path is:

```text
/sentimentwatch-demo/
```

If you want the raw CRA build without the GitHub Pages subpath, use:

```bash
npm run build:frontend
```

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

### GitHub Pages

The repo now includes a Pages workflow at [.github/workflows/github-pages-demo.yml](/Users/diego/SentimentWatchDemo/SentimentWatch/.github/workflows/github-pages-demo.yml).

Deployment assumptions:

- Push the demo-ready code to the `demo` branch
- Enable GitHub Pages to deploy from GitHub Actions
- The workflow builds the static frontend and publishes `frontend/build`
- The app is configured to resolve assets from `/<project-name>-demo/`

For this repository, the deployed URL is:

```text
https://diego-aguirre.com/sentimentwatch-demo/
```

## Notes

- Routing uses `HashRouter`, so the demo works cleanly on static hosts without a backend rewrite layer.
- Public asset URLs are subpath-safe and no longer assume deployment at `/`.
- The app shows a visible demo treatment in the UI and avoids implying any live market or trading functionality.
- Frontend runtime data access is handled through [frontend/src/services/api.js](/Users/diego/SentimentWatchDemo/SentimentWatch/frontend/src/services/api.js), which now reads only from local demo objects.
