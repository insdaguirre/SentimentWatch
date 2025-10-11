import React from 'react';
import './SentimentDashboard.css';

const SentimentDashboard = ({ stats }) => {
  if (!stats) return null;

  const { overall } = stats;
  const total = overall.total || 0;
  const paperUrl = 'https://ojs.aaai.org/index.php/ICWSM/article/view/14550';
  
  const positivePercent = total > 0 ? ((overall.positive / total) * 100).toFixed(1) : 0;
  const negativePercent = total > 0 ? ((overall.negative / total) * 100).toFixed(1) : 0;
  const neutralPercent = total > 0 ? ((overall.neutral / total) * 100).toFixed(1) : 0;

  const getSentimentColor = () => {
    if (positivePercent > negativePercent + 10) return '#10b981';
    if (negativePercent > positivePercent + 10) return '#ef4444';
    return '#f59e0b';
  };

  const getSentimentLabel = () => {
    if (positivePercent > negativePercent + 10) return 'Bullish 🚀';
    if (negativePercent > positivePercent + 10) return 'Bearish 📉';
    return 'Neutral ⚖️';
  };

  return (
    <div className="sentiment-dashboard">
      <div className="overall-sentiment" style={{ borderColor: getSentimentColor() }}>
        <div className="sentiment-label" style={{ color: getSentimentColor() }}>
          {getSentimentLabel()}
        </div>
        <div className="sentiment-score">
          Overall Sentiment Score: {(overall.avgScore * 100).toFixed(1)}%
        </div>
        <div className="total-posts">
          Based on {total} posts in the last {stats.period}
        </div>
      </div>

      <div className="sentiment-breakdown">
        <a className="sentiment-card-link" href={paperUrl} target="_blank" rel="noopener noreferrer">
        <div className="sentiment-card positive">
          <div className="sentiment-icon">📈</div>
          <div className="sentiment-info">
            <div className="sentiment-count">{overall.positive}</div>
            <div className="sentiment-percentage">{positivePercent}%</div>
            <div className="sentiment-name">Positive</div>
          </div>
          <div className="sentiment-bar">
            <div 
              className="sentiment-bar-fill positive-fill"
              style={{ width: `${positivePercent}%` }}
            ></div>
          </div>
        </div>
        </a>

        <a className="sentiment-card-link" href={paperUrl} target="_blank" rel="noopener noreferrer">
        <div className="sentiment-card neutral">
          <div className="sentiment-icon">➡️</div>
          <div className="sentiment-info">
            <div className="sentiment-count">{overall.neutral}</div>
            <div className="sentiment-percentage">{neutralPercent}%</div>
            <div className="sentiment-name">Neutral</div>
          </div>
          <div className="sentiment-bar">
            <div 
              className="sentiment-bar-fill neutral-fill"
              style={{ width: `${neutralPercent}%` }}
            ></div>
          </div>
        </div>
        </a>

        <a className="sentiment-card-link" href={paperUrl} target="_blank" rel="noopener noreferrer">
        <div className="sentiment-card negative">
          <div className="sentiment-icon">📉</div>
          <div className="sentiment-info">
            <div className="sentiment-count">{overall.negative}</div>
            <div className="sentiment-percentage">{negativePercent}%</div>
            <div className="sentiment-name">Negative</div>
          </div>
          <div className="sentiment-bar">
            <div 
              className="sentiment-bar-fill negative-fill"
              style={{ width: `${negativePercent}%` }}
            ></div>
          </div>
        </div>
        </a>
      </div>
    </div>
  );
};

export default SentimentDashboard;

