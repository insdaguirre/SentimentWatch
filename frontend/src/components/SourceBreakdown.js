import React from 'react';
import './SourceBreakdown.css';

const SourceBreakdown = ({ stats }) => {
  if (!stats || !stats.sourceBreakdown) return null;

  const sources = [
    { name: 'Reddit', data: stats.sourceBreakdown.reddit || { count: 0, avgScore: 0 } },
    { name: 'StockTwits', data: stats.sourceBreakdown.stocktwits || { count: 0, avgScore: 0 } },
    { name: 'News', data: stats.sourceBreakdown.news || { count: 0, avgScore: 0 } },
    { name: 'Finnhub', data: stats.sourceBreakdown.finnhub || { count: 0, avgScore: 0 } }
  ];

  return (
    <div className="source-breakdown">
      <div className="source-header">
        <h3 className="source-title">📊 Source Breakdown (24h)</h3>
      </div>
      
      <div className="source-list">
        {sources.map((source, index) => (
          <div key={index} className="source-item">
            <div className="source-name">{source.name}</div>
            <div className="source-stats">
              <span className="source-count">{source.data.count} posts</span>
              <span className="source-score">Avg Score: {(source.data.avgScore * 100).toFixed(1)}%</span>
            </div>
            <div className="source-progress">
              <div 
                className="source-progress-fill"
                style={{ width: `${Math.min(source.data.avgScore * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceBreakdown;
