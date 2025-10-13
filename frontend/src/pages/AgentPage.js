import React, { useState, useEffect, useCallback } from 'react';
import SentimentDashboard from '../components/SentimentDashboard';
import StatsPanel from '../components/StatsPanel';
import TimelineChart from '../components/TimelineChart';
import SPYPriceChart from '../components/SPYPriceChart';
import SPYMetricsWidget from '../components/SPYMetricsWidget';
import { fetchStats, fetchSnapshots, fetchTimeline } from '../services/api';
import './AgentPage.css';

const AgentPage = () => {
  const [ticker] = useState('SPY');
  const [stats, setStats] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, snapshotsData, timelineData] = await Promise.all([
        fetchStats(ticker),
        fetchSnapshots(ticker),
        fetchTimeline(ticker)
      ]);
      
      setStats(statsData);
      setSnapshots(snapshotsData);
      setTimeline(timelineData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    loadData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div className="agent-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading agent data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agent-page">
        <div className="error-container">
          <h2>⚠️ Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-page">
      <div className="agent-header">
        <h1>🤖 Sentiment Agent</h1>
        <p>Real-time market sentiment analysis for {ticker}</p>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="agent-content">
        <div className="charts-section">
          <div className="chart-container">
            <TimelineChart data={timeline} />
          </div>
          <div className="chart-container">
            <SPYPriceChart timeWindow="5d" />
          </div>
        </div>
        
        <div className="metrics-section">
          <div className="stats-container">
            <StatsPanel stats={stats} snapshots={snapshots} />
          </div>
          <div className="metrics-container">
            <SPYMetricsWidget timeWindow="5d" />
          </div>
        </div>

        <div className="snapshots-section">
          <div className="snapshots-info">
            <h2>📊 Recent Sentiment Snapshots</h2>
            <p>Displaying aggregated sentiment data from the last 10 time windows</p>
          </div>
          <div className="snapshots-content">
            <SentimentDashboard snapshots={snapshots} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
