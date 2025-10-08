import React from 'react';
import './StatsPanel.css';

const StatsPanel = ({ stats, snapshots }) => {
  // Get source data from the latest snapshot
  const latestSnapshot = snapshots && snapshots.length > 0 ? snapshots[0] : null;
  const sourceData = latestSnapshot ? latestSnapshot.sources : null;

  if (!sourceData) {
    return (
      <div className="stats-panel">
        <h2>Source Breakdown</h2>
        <div className="no-data">No source data available</div>
      </div>
    );
  }

  const sources = [
    { key: 'reddit', name: 'Reddit', icon: '🤖', color: '#ff4500' },
    { key: 'stocktwits', name: 'StockTwits', icon: '💬', color: '#3498db' },
    { key: 'news', name: 'News', icon: '📰', color: '#2ecc71' }
  ];

  return (
    <div className="stats-panel">
      <h2>📈 Source Breakdown</h2>
      
      <div className="source-stats">
        {sources.map(source => {
          const data = sourceData[source.key];
          if (!data) return null;

          // Calculate average score from sentiment breakdown
          const { positive, negative, neutral } = data.sentiment;
          const total = positive + negative + neutral;
          const avgScore = total > 0 ? (positive - negative) / total + 0.5 : 0.5; // Scale to 0-1
          const avgScorePercent = (avgScore * 100).toFixed(1);

          return (
            <div key={source.key} className="source-item">
              <div className="source-header">
                <span className="source-icon">{source.icon}</span>
                <span className="source-name">{source.name}</span>
              </div>
              <div className="source-count" style={{ color: source.color }}>
                {data.count}
              </div>
              <div className="source-score">
                Avg Score: {avgScorePercent}%
              </div>
              <div className="source-bar">
                <div 
                  className="source-bar-fill"
                  style={{ 
                    width: `${avgScore * 100}%`,
                    background: source.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stats-summary">
        <h3>Summary</h3>
        <div className="summary-item">
          <span className="summary-label">Total Posts:</span>
          <span className="summary-value">{stats.overall.total}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Time Period:</span>
          <span className="summary-value">{stats.period}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;

