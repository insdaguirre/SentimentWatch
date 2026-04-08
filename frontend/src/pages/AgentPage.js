import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SentimentOverview from '../components/SentimentOverview';
import SourceBreakdown from '../components/SourceBreakdown';
import SystemInfo from '../components/SystemInfo';
import TimelineChart from '../components/TimelineChart';
import SPYPriceChart from '../components/SPYPriceChart';
import SPYMetricsWidget from '../components/SPYMetricsWidget';
import PostsFeed from '../components/PostsFeed';
import {
  fetchDemoInfo,
  fetchPriceSeries,
  fetchStats,
  fetchTickerDirectory,
  fetchTickerFeed,
  fetchTickerMetrics,
  fetchTimeline,
  normalizeTicker,
} from '../services/api';
import './AgentPage.css';

const AgentPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const ticker = normalizeTicker(searchParams.get('ticker'));
  const stats = fetchStats(ticker);
  const timeline = fetchTimeline(ticker);
  const priceSeries = fetchPriceSeries(ticker);
  const metrics = fetchTickerMetrics(ticker);
  const demoInfo = fetchDemoInfo();
  const posts = fetchTickerFeed(ticker);
  const tickerDirectory = fetchTickerDirectory();

  return (
    <div className="agent-page page-shell">
      <div className="agent-header section-card">
        <div>
          <span className="demo-chip">Demo Dashboard</span>
          <p className="eyebrow">Client-side sentiment workspace</p>
          <h1>{stats.company}</h1>
          <p>{stats.demoHeadline}</p>
        </div>
        <div className="agent-controls">
          <label>
            <span>Selected ticker</span>
            <select
              value={ticker}
              onChange={(event) => setSearchParams({ ticker: event.target.value })}
            >
              {tickerDirectory.map((item) => (
                <option key={item.symbol} value={item.symbol}>
                  {item.symbol} · {item.company}
                </option>
              ))}
            </select>
          </label>
          <div className="pill-row">
            {tickerDirectory.map((item) => (
              <button
                key={item.symbol}
                type="button"
                className={`ticker-pill ${item.symbol === ticker ? 'ticker-pill--active' : ''}`}
                onClick={() => setSearchParams({ ticker: item.symbol })}
              >
                {item.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="agent-content">
        <SentimentOverview stats={stats} />

        <div className="middle-section">
          <div className="left-column">
            <TimelineChart data={timeline} />
            <SPYPriceChart data={priceSeries} ticker={ticker} company={stats.company} />
          </div>

          <div className="right-column">
            <SourceBreakdown stats={stats} />
            <SPYMetricsWidget metrics={metrics} />
          </div>
        </div>

        <div className="bottom-section">
          <PostsFeed
            posts={posts}
            ticker={ticker}
            title="Cross-source feed"
            subtitle="Headlines, forum takes, and ticker chatter for the selected name."
          />
          <SystemInfo info={demoInfo} stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
