import React from 'react';
import './DevPage.css';

const DevPage = () => {
  return (
    <div className="dev-page page-shell">
      <div className="dev-header section-card">
        <span className="eyebrow">Build notes</span>
        <p className="eyebrow">About this build</p>
        <h1>SentimentWatch now runs as a frontend-only build.</h1>
        <p>
          The original hosted pipeline is out of the active path. What remains is the
          product experience, powered by local data checked into the repo.
        </p>
      </div>

      <div className="dev-content">
        <section className="dev-grid">
          <article className="dev-card section-card">
            <h2>Static by design</h2>
            <ul>
              <li>Hash-based client routing for static hosting.</li>
              <li>No live APIs, databases, cron jobs, or auth backends.</li>
              <li>All sentiment, feed, and price context comes from local data objects.</li>
            </ul>
          </article>
          <article className="dev-card section-card">
            <h2>Data location</h2>
            <p>
              <code>frontend/src/data/demoData.js</code>
            </p>
            <p>
              Five tickers are included with timelines, source breakdowns, and local
              news, Reddit, and StockTwits-style items.
            </p>
          </article>
        </section>

        <section className="dev-columns">
          <article className="dev-card section-card">
            <h2>Run locally</h2>
            <pre>
              <code>{`npm install
npm start --prefix frontend`}</code>
            </pre>
            <p>The app runs on the CRA dev server and does not require any env vars.</p>
          </article>

          <article className="dev-card section-card">
            <h2>Build the static site</h2>
            <pre>
              <code>{`npm run build`}</code>
            </pre>
            <p>
              The deployable output is written to <code>frontend/build</code> with the
              GitHub Pages subpath derived as <code>/{`<project-name>`}-demo/</code>.
            </p>
          </article>
        </section>

        <section className="dev-columns">
          <article className="dev-card section-card">
            <h2>How It Originally Ran</h2>
            <ul>
              <li>Live posts and headlines were pulled from Reddit, StockTwits, and news APIs.</li>
              <li>A backend ingestion pipeline processed that activity into rolling sentiment snapshots.</li>
              <li>Sentiment analysis used FinBERT plus custom finance-oriented rules and heuristics.</li>
              <li>The API served current sentiment, timeline views, and source breakdowns back to the React frontend.</li>
            </ul>
          </article>

          <article className="dev-card section-card">
            <h2>Original Hosted Stack</h2>
            <ul>
              <li>The backend was deployed on Heroku and ran the ingestion and API layer.</li>
              <li>Processed snapshots and related data were stored in MongoDB.</li>
              <li>Fresh data was actively ingested on a schedule rather than being hardcoded.</li>
              <li>The frontend reflected live sentiment conditions instead of a local dataset.</li>
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
};

export default DevPage;
