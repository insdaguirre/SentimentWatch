import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SentimentDashboard from './components/SentimentDashboard';
import PostsFeed from './components/PostsFeed';
import StatsPanel from './components/StatsPanel';
import TimelineChart from './components/TimelineChart';
import { fetchStats, fetchPosts, fetchTimeline } from './services/api';

function App() {
  const [ticker] = useState('SPY');
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, postsData, timelineData] = await Promise.all([
        fetchStats(ticker, 24),
        fetchPosts(ticker, 50),
        fetchTimeline(ticker, 24)
      ]);

      setStats(statsData);
      setPosts(postsData);
      setTimeline(timelineData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    loadData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [ticker, loadData]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>📈 Stock Sentiment Tracker</h1>
          <div className="ticker-selector">
            <span className="ticker-badge">{ticker}</span>
          </div>
        </div>
        {lastUpdate && (
          <div className="last-update">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </header>

      <main className="App-main">
        {loading && !stats ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading sentiment data...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button className="retry-button" onClick={loadData}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <SentimentDashboard stats={stats} />
            
            <div className="content-grid">
              <div className="chart-section">
                <TimelineChart data={timeline} />
              </div>
              
              <div className="stats-section">
                <StatsPanel stats={stats} />
              </div>
            </div>

            <div className="posts-section">
              <PostsFeed posts={posts} ticker={ticker} />
            </div>

            <button className="refresh-button" onClick={loadData} disabled={loading}>
              {loading ? '↻ Refreshing...' : '↻ Refresh Data'}
            </button>
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>
          Data from Reddit, StockTwits, and News sources | 
          Sentiment powered by FinBERT
        </p>
      </footer>
    </div>
  );
}

export default App;

