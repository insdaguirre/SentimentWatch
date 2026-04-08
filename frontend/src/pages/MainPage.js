import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { fetchGeneralNews, fetchMarketOverview, fetchTickerDirectory } from '../services/api';
import './MainPage.css';

const MainPage = () => {
  const [query, setQuery] = useState('');
  const news = fetchGeneralNews();
  const overview = fetchMarketOverview();
  const tickers = fetchTickerDirectory();
  const filteredTickers = tickers.filter((item) => {
    const haystack = `${item.symbol} ${item.company} ${item.sector}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div className="main-page page-shell">
      <section className="main-hero section-card">
        <div className="main-hero__copy">
          <span className="demo-chip">Static Demo</span>
          <p className="eyebrow">Sentiment explorer</p>
          <h1 className="page-title">Browse market mood like it is a real product.</h1>
          <p className="page-subtitle">
            Search a handful of familiar tickers, compare the tone across sources, and
            flip through charts, headlines, and social chatter without any backend setup.
          </p>
          <div className="main-hero__actions">
            <Link className="main-cta main-cta--primary" to="/dashboard?ticker=AAPL">
              Open Dashboard
            </Link>
            <Link className="main-cta" to="/feed">
              Browse Feed
            </Link>
          </div>
        </div>
        <div className="main-hero__stats">
          <div className="hero-stat">
            <span className="hero-stat__label">Tracked tickers</span>
            <strong>{overview.trackedTickers}</strong>
          </div>
          <div className="hero-stat">
            <span className="hero-stat__label">Synthetic mentions</span>
            <strong>{overview.totalMentions}</strong>
          </div>
          <div className="hero-stat">
            <span className="hero-stat__label">Strongest tone</span>
            <strong>{overview.strongest.symbol}</strong>
          </div>
          <div className="hero-stat">
            <span className="hero-stat__label">Closest to balanced</span>
            <strong>{overview.mostDebated.symbol}</strong>
          </div>
        </div>
      </section>

      <section className="main-summary">
        <div className="summary-strip section-card">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Five names. Three sources. One very opinionated feed.</h2>
          </div>
          <p>{overview.notice}</p>
        </div>
      </section>

      <section className="ticker-library">
        <div className="ticker-library__header">
          <div>
            <p className="eyebrow">Ticker universe</p>
            <h2>Explore five names with distinct sentiment profiles.</h2>
          </div>
          <label className="ticker-search">
            <span>Find ticker</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search AAPL, NVIDIA, cloud, EV..."
            />
          </label>
        </div>

        <div className="ticker-grid">
          {filteredTickers.map((ticker) => (
            <article key={ticker.symbol} className="ticker-card section-card">
              <div className="ticker-card__top">
                <div>
                  <p className="ticker-card__symbol">{ticker.symbol}</p>
                  <h3>{ticker.company}</h3>
                  <span>{ticker.sector}</span>
                </div>
                <div className={`ticker-card__tone ticker-card__tone--${ticker.tone}`}>
                  {(ticker.score * 100).toFixed(0)}
                </div>
              </div>
              <p className="ticker-card__summary">{ticker.summary}</p>
              <div className="ticker-card__stats">
                <span>${ticker.price.toFixed(2)}</span>
                <span className={ticker.dayChange >= 0 ? 'tone-positive' : 'tone-negative'}>
                  {ticker.dayChange >= 0 ? '+' : ''}
                  {ticker.dayChange.toFixed(1)}%
                </span>
              </div>
              <div className="ticker-card__actions">
                <Link to={`/dashboard?ticker=${ticker.symbol}`}>View dashboard</Link>
                <Link to={`/feed?ticker=${ticker.symbol}`}>Open feed</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="main-news">
        <div className="main-news__header">
          <div>
            <p className="eyebrow">Featured headlines</p>
            <h2>News cards with just enough drama to feel expensive.</h2>
          </div>
          <Link to="/feed" className="main-news__link">
            View full feed
          </Link>
        </div>
        <div className="news-grid">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
