import React, { useState, useEffect, useCallback } from 'react';
import SentimentOverview from '../components/SentimentOverview';
import SourceBreakdown from '../components/SourceBreakdown';
import SystemInfo from '../components/SystemInfo';
import TimelineChart from '../components/TimelineChart';
import SPYPriceChart from '../components/SPYPriceChart';
import SPYMetricsWidget from '../components/SPYMetricsWidget';
import { fetchStats, fetchTimeline } from '../services/api';
import './AgentPage.css';

const AgentPage = () => {
  const [ticker] = useState('SPY');
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, timelineData] = await Promise.all([
        fetchStats(ticker),
        fetchTimeline(ticker)
      ]);
      
      setStats(statsData);
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
        {/* Top Section - Sentiment Overview */}
        <SentimentOverview stats={stats} />
        
        {/* Middle Section - Charts and Stats */}
        <div className="middle-section">
          <div className="left-column">
            <TimelineChart data={timeline} />
            <SPYPriceChart timeWindow="5d" />
          </div>
          
          <div className="right-column">
            <SourceBreakdown stats={stats} />
            <SystemInfo stats={stats} />
          </div>
        </div>

        {/* Bottom Section - SPY Metrics */}
        <div className="bottom-section">
          <SPYMetricsWidget timeWindow="5d" />
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
