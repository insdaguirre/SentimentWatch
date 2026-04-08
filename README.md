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

The root build script produces a GitHub Pages-safe build with relative asset URLs by default:

```text
PUBLIC_URL=.
```

That keeps the app portable for GitHub Pages subpath hosting, including:

```text
https://insdaguirre.github.io/SentimentWatch-Demo/
https://diego-aguirre.com/sentimentwatch-demo/
```

If you specifically want a hardcoded absolute base path, you can still override it:

```bash
PUBLIC_URL=/sentimentwatch-demo npm run build:frontend
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
- In `Settings > Pages`, set `Source` to `GitHub Actions`
- The workflow builds the static frontend and publishes `frontend/build`
- The app is configured with relative asset URLs so it can be mounted from a project-site URL or a custom-domain subpath

For this repository, the deployed URL is:

```text
https://diego-aguirre.com/sentimentwatch-demo/
```

Important:

- If Pages is set to `Deploy from a branch`, GitHub will publish the repository root and may render `README.md` instead of the React app.
- A standalone project Pages repo normally publishes at `https://<user>.github.io/<repo>/`.
- To serve this demo at `https://diego-aguirre.com/sentimentwatch-demo/`, the built output needs to live under that path on your main site, typically in the `insdaguirre.github.io` repository that owns the custom domain.

## Notes

- Routing uses `HashRouter`, so the demo works cleanly on static hosts without a backend rewrite layer.
- Public asset URLs are subpath-safe and no longer assume deployment at `/`.
- The app shows a visible demo treatment in the UI and avoids implying any live market or trading functionality.
- Frontend runtime data access is handled through [frontend/src/services/api.js](/Users/diego/SentimentWatchDemo/SentimentWatch/frontend/src/services/api.js), which now reads only from local demo objects.
