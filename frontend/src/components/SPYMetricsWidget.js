import React from 'react';
import './SPYMetricsWidget.css';

const SPYMetricsWidget = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="metrics-widget section-card">
      <div className="metrics-header">
        <p className="eyebrow">Snapshot metrics</p>
        <h3>Quality indicators</h3>
      </div>
      <div className="metrics-grid">
        <div className="metric-tile">
          <span>Conviction</span>
          <strong>{metrics.metrics.conviction}</strong>
        </div>
        <div className="metric-tile">
          <span>Buzz change</span>
          <strong>+{metrics.metrics.buzzChange}%</strong>
        </div>
        <div className="metric-tile">
          <span>Source diversity</span>
          <strong>{metrics.metrics.sourceDiversity}</strong>
        </div>
        <div className="metric-tile">
          <span>Visible samples</span>
          <strong>{metrics.metrics.sampleDepth}</strong>
        </div>
      </div>
      <div className="metric-footer">
        <span>Score {metrics.metrics.sentimentScore}</span>
        <span>
          Updated{' '}
          {new Date(metrics.lastUpdated).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

export default SPYMetricsWidget;
