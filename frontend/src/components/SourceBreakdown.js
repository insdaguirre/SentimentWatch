import React from 'react';
import './SourceBreakdown.css';

const SourceBreakdown = ({ stats }) => {
  if (!stats || !stats.sourceBreakdown) return null;

  const calculateAvgScore = (sourceData) => {
    if (!sourceData || !sourceData.sentiment) return 0;

    const { positive, negative, neutral } = sourceData.sentiment;
    const total = positive + negative + neutral;

    if (total === 0) return 0.5;

    const weightedScore = (positive * 1 + neutral * 0.5 + negative * 0) / total;
    return weightedScore;
  };

  const sources = [
    {
      name: 'Reddit',
      data: {
        ...(stats.sourceBreakdown.reddit || { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } }),
        avgScore: calculateAvgScore(stats.sourceBreakdown.reddit),
      },
    },
    {
      name: 'StockTwits',
      data: {
        ...(stats.sourceBreakdown.stocktwits || { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } }),
        avgScore: calculateAvgScore(stats.sourceBreakdown.stocktwits),
      },
    },
    {
      name: 'News',
      data: {
        ...(stats.sourceBreakdown.news || { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } }),
        avgScore: calculateAvgScore(stats.sourceBreakdown.news),
      },
    },
  ];

  return (
    <div className="source-breakdown section-card">
      <div className="source-header">
        <p className="eyebrow">Source mix</p>
        <h3 className="source-title">Where the signal is coming from</h3>
      </div>

      <div className="source-list">
        {sources.map((source) => (
          <div key={source.name} className="source-item">
            <div className="source-name">{source.name}</div>
            <div className="source-stats">
              <span className="source-count">{source.data.count} mentions</span>
              <span className="source-score">
                Avg tone {isNaN(source.data.avgScore) ? '0.0' : (source.data.avgScore * 100).toFixed(0)}
              </span>
            </div>
            <div className="source-progress">
              <div
                className="source-progress-fill"
                style={{
                  width: `${Math.min(isNaN(source.data.avgScore) ? 0 : source.data.avgScore * 100, 100)}%`,
                }}
              />
            </div>
            <div className="source-split">
              <span>+{source.data.sentiment.positive}</span>
              <span>={source.data.sentiment.neutral}</span>
              <span>-{source.data.sentiment.negative}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceBreakdown;
