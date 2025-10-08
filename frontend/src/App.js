import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SentimentDashboard from './components/SentimentDashboard';
// import PostsFeed from './components/PostsFeed'; // Removed - using snapshots instead of individual posts
import StatsPanel from './components/StatsPanel';
import TimelineChart from './components/TimelineChart';
import { fetchStats, fetchSnapshots, fetchTimeline } from './services/api';

function App() {
  const [ticker] = useState('SPY');
  const [stats, setStats] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, snapshotsData, timelineData] = await Promise.all([
        fetchStats(ticker, 24),
        fetchSnapshots(ticker, 10),
        fetchTimeline(ticker, 24)
      ]);

      setStats(statsData);
      setSnapshots(snapshotsData);
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
                <StatsPanel stats={stats} snapshots={snapshots} />
              </div>
            </div>

            <div className="snapshots-section">
              <div className="snapshots-info">
                <h2>📊 Recent Sentiment Snapshots</h2>
                <p>Showing aggregated sentiment data from the last {snapshots.length} time windows</p>
                {snapshots.length > 0 && (
                  <div className="snapshots-list">
                    {snapshots.slice(0, 3).map((snapshot, index) => (
                      <div key={snapshot.id || index} className="snapshot-item">
                        <div className="snapshot-header">
                          <span className="snapshot-time">
                            {new Date(snapshot.timestamp).toLocaleString()}
                          </span>
                          <span className={`snapshot-sentiment sentiment-${snapshot.overallSentiment}`}>
                            {snapshot.overallSentiment} ({snapshot.totalPosts} posts)
                          </span>
                        </div>
                        <div className="snapshot-details">
                          <div className="sentiment-breakdown">
                            <span className="sentiment-item positive">+{snapshot.sentimentBreakdown.positive.count}</span>
                            <span className="sentiment-item neutral">{snapshot.sentimentBreakdown.neutral.count}</span>
                            <span className="sentiment-item negative">-{snapshot.sentimentBreakdown.negative.count}</span>
                          </div>
                          <div className="snapshot-metrics">
                            <span className="metric">Confidence: {(snapshot.confidence * 100).toFixed(0)}%</span>
                            <span className="metric">Score: {snapshot.overallScore.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
          Sentiment powered by VADER with Finance Rules
        </p>
      </footer>
    </div>
  );
}

export default App;

