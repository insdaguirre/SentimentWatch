import React from 'react';
import './SourceBreakdown.css';

const SourceBreakdown = ({ stats }) => {
  if (!stats || !stats.sourceBreakdown) return null;

  // Calculate average score from sentiment data
  const calculateAvgScore = (sourceData) => {
    if (!sourceData || !sourceData.sentiment) return 0;
    
    const { positive, negative, neutral } = sourceData.sentiment;
    const total = positive + negative + neutral;
    
    if (total === 0) return 0.5; // Default to neutral if no data
    
    // Calculate weighted average: positive = 1, neutral = 0.5, negative = 0
    const weightedScore = (positive * 1 + neutral * 0.5 + negative * 0) / total;
    return weightedScore;
  };

  const sources = [
    { 
      name: 'Reddit', 
      data: {
        ...(stats.sourceBreakdown.reddit || { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } }),
        avgScore: calculateAvgScore(stats.sourceBreakdown.reddit)
      }
    },
    { 
      name: 'StockTwits', 
      data: {
        ...(stats.sourceBreakdown.stocktwits || { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } }),
        avgScore: calculateAvgScore(stats.sourceBreakdown.stocktwits)
      }
    },
    { 
      name: 'News', 
      data: {
        ...(stats.sourceBreakdown.news || { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } }),
        avgScore: calculateAvgScore(stats.sourceBreakdown.news)
      }
    },
    { 
      name: 'Finnhub', 
      data: {
        ...(stats.sourceBreakdown.finnhub || { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } }),
        avgScore: calculateAvgScore(stats.sourceBreakdown.finnhub)
      }
    }
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
              <span className="source-score">
                Avg Score: {isNaN(source.data.avgScore) ? '0.0' : (source.data.avgScore * 100).toFixed(1)}%
              </span>
            </div>
            <div className="source-progress">
              <div 
                className="source-progress-fill"
                style={{ 
                  width: `${Math.min(isNaN(source.data.avgScore) ? 0 : source.data.avgScore * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceBreakdown;
