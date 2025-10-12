import React, { useState, useEffect } from 'react';
import { fetchSPYMetrics } from '../services/api';
import './SPYMetricsWidget.css';

const SPYMetricsWidget = ({ timeWindow = '5d' }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSPYMetrics(timeWindow);
        setMetrics(data.metrics);
      } catch (err) {
        console.error('Error loading SPY metrics:', err);
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [timeWindow]);

  if (loading) {
    return (
      <div className="metrics-widget">
        <h3>📊 SPY Metrics</h3>
        <div className="loading">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="metrics-widget">
        <h3>📊 SPY Metrics</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="metrics-widget">
        <h3>📊 SPY Metrics</h3>
        <div className="no-data">No metrics available</div>
      </div>
    );
  }

  const formatTimeWindow = (tw) => {
    const windows = {
      '1d': '1 Day',
      '5d': '5 Days',
      '1mo': '1 Month',
      '6mo': '6 Months',
      '1y': '1 Year',
      '5y': '5 Years'
    };
    return windows[tw] || tw;
  };

  return (
    <div className="metrics-widget">
      <h3>📊 SPY Metrics ({formatTimeWindow(timeWindow)})</h3>
      
      <div className="metric-section">
        <h4>Volatility</h4>
        <div className="metric-value">
          <span className="value">{(metrics.volatility.annualized * 100).toFixed(2)}%</span>
          <span className="label">Annualized</span>
        </div>
        <div className="metric-value">
          <span className="value">{(metrics.volatility.daily * 100).toFixed(2)}%</span>
          <span className="label">Daily</span>
        </div>
        <div className="metric-details">
          <div>Period: {metrics.volatility.period} data points</div>
        </div>
      </div>

      <div className="metric-section">
        <h4>Sharpe Ratio</h4>
        <div className="metric-value">
          <span className="value">{metrics.sharpeRatio.ratio.toFixed(3)}</span>
          <span className="label">Risk-Adjusted Return</span>
        </div>
        <div className="metric-details">
          <div>Return: {(metrics.sharpeRatio.annualizedReturn * 100).toFixed(2)}%</div>
          <div>Risk-Free: {(metrics.sharpeRatio.riskFreeRate * 100).toFixed(2)}%</div>
          <div>Volatility: {(metrics.sharpeRatio.annualizedVolatility * 100).toFixed(2)}%</div>
        </div>
      </div>

      <div className="metric-footer">
        <div className="last-updated">
          Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default SPYMetricsWidget;
