import React, { useState, useEffect } from 'react';
import './StatsPanel.css';
import StorageWidget from './StorageWidget';
import { fetchStorage } from '../services/api';

const StatsPanel = ({ stats, snapshots }) => {
  // Storage state
  const [storageInfo, setStorageInfo] = useState(null);
  const [storageLoading, setStorageLoading] = useState(true);
  const [storageError, setStorageError] = useState(null);

  // Get source data from 24-hour aggregated stats (preferred) or fallback to latest snapshot
  const sourceData = stats?.overall?.sourceBreakdown || (snapshots && snapshots.length > 0 ? snapshots[0].sources : null);

  // Fetch storage info on component mount
  useEffect(() => {
    const loadStorageInfo = async () => {
      try {
        setStorageLoading(true);
        setStorageError(null);
        const data = await fetchStorage();
        setStorageInfo(data);
      } catch (error) {
        console.error('Error loading storage info:', error);
        setStorageError(error.message);
      } finally {
        setStorageLoading(false);
      }
    };

    loadStorageInfo();
  }, []);

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
      <h2>📈 Source Breakdown (24h)</h2>
      
      <div className="source-stats">
        {sources.map(source => {
          const data = sourceData[source.key];
          if (!data) return null;

          // Calculate average score from sentiment breakdown
          const { positive, negative, neutral } = data.sentiment;
          const total = positive + negative + neutral;
          let avgScore = 0.5; // Default to neutral
          if (total > 0) {
            const rawScore = (positive - negative) / total; // Range: -1 to 1
            avgScore = (rawScore + 1) / 2; // Scale to 0-1 range
            // Debug logging (remove in production)
            console.log(`${source.name}: pos=${positive}, neg=${negative}, neutral=${neutral}, rawScore=${rawScore}, avgScore=${avgScore}`);
          }
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

      <StorageWidget 
        storageInfo={storageInfo}
        loading={storageLoading}
        error={storageError}
      />
    </div>
  );
};

export default StatsPanel;

