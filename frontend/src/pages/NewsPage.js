import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import PostsFeed from '../components/PostsFeed';
import { fetchSourceFeed, fetchTickerDirectory, normalizeTicker } from '../services/api';
import './NewsPage.css';

const NewsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTicker = searchParams.get('ticker') || 'all';
  const normalizedTicker =
    selectedTicker === 'all' ? 'all' : normalizeTicker(selectedTicker);
  const tickerDirectory = fetchTickerDirectory();
  const news = fetchSourceFeed({ ticker: normalizedTicker, source: 'news' }).slice(0, 6);
  const reddit = fetchSourceFeed({ ticker: normalizedTicker, source: 'reddit' }).slice(0, 4);
  const stocktwits = fetchSourceFeed({ ticker: normalizedTicker, source: 'stocktwits' }).slice(0, 4);

  return (
    <div className="news-page page-shell">
      <div className="news-header section-card">
        <div>
          <p className="eyebrow">News, Reddit, and StockTwits</p>
          <h1>Browse the content streams.</h1>
          <p>
            Flip between editorial headlines, forum debates, and fast-twitch ticker chatter.
          </p>
        </div>
        <div className="news-header__actions">
          <div className="pill-row">
            <button
              type="button"
              className={`ticker-pill ${normalizedTicker === 'all' ? 'ticker-pill--active' : ''}`}
              onClick={() => setSearchParams({ ticker: 'all' })}
            >
              All tickers
            </button>
            {tickerDirectory.map((item) => (
              <button
                key={item.symbol}
                type="button"
                className={`ticker-pill ${normalizedTicker === item.symbol ? 'ticker-pill--active' : ''}`}
                onClick={() => setSearchParams({ ticker: item.symbol })}
              >
                {item.symbol}
              </button>
            ))}
          </div>
          {normalizedTicker !== 'all' && (
            <Link className="news-header__dashboard" to={`/dashboard?ticker=${normalizedTicker}`}>
              Open {normalizedTicker} dashboard
            </Link>
          )}
        </div>
      </div>

      <section className="news-section">
        <div className="news-section__header">
          <div>
            <p className="eyebrow">News cards</p>
            <h2>Editorial headlines</h2>
          </div>
        </div>
        <div className="news-grid">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <div className="feed-columns">
        <PostsFeed
          posts={reddit}
          title="Reddit discussion"
          subtitle="Longer takes, hot comments, and a little too much confidence."
          hideFilters
          lockedSource="reddit"
        />
        <PostsFeed
          posts={stocktwits}
          title="StockTwits tape"
          subtitle="Short, loud, and very sure of itself."
          hideFilters
          lockedSource="stocktwits"
        />
      </div>
    </div>
  );
};

export default NewsPage;
