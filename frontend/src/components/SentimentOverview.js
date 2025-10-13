import React from 'react';
import './SentimentOverview.css';

const SentimentOverview = ({ stats }) => {
  if (!stats || !stats.sentimentBreakdown) return null;

  const getSentimentLabel = (score) => {
    if (score > 0.6) return 'Bullish';
    if (score > 0.4) return 'Neutral';
    return 'Bearish';
  };

  const getSentimentIcon = (score) => {
    if (score > 0.6) return '🚀';
    if (score > 0.4) return '➡️';
    return '📉';
  };

  const sentimentLabel = getSentimentLabel(stats.overallScore || 0.5);
  const sentimentIcon = getSentimentIcon(stats.overallScore || 0.5);

  return (
    <div className="sentiment-overview">
      <div className="sentiment-header">
        <h2 className="sentiment-title">
          {sentimentLabel} {sentimentIcon}
        </h2>
        <div className="sentiment-score">
          Overall Sentiment Score: {((stats.overallScore || 0.5) * 100).toFixed(1)}%
        </div>
        <div className="sentiment-meta">
          Based on {stats.totalPosts || 0} posts in the last 24 hours
        </div>
      </div>
      
      <div className="sentiment-breakdown">
        <div className="sentiment-item positive">
          <div className="sentiment-icon">📈</div>
          <div className="sentiment-numbers">
            <span className="sentiment-count">{stats.sentimentBreakdown.positive?.count || 0}</span>
            <span className="sentiment-percentage">{((stats.sentimentBreakdown.positive?.percentage || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="sentiment-label">POSITIVE</div>
          <div className="sentiment-progress">
            <div 
              className="sentiment-progress-fill positive"
              style={{ width: `${(stats.sentimentBreakdown.positive?.percentage || 0) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="sentiment-item neutral">
          <div className="sentiment-icon">➡️</div>
          <div className="sentiment-numbers">
            <span className="sentiment-count">{stats.sentimentBreakdown.neutral?.count || 0}</span>
            <span className="sentiment-percentage">{((stats.sentimentBreakdown.neutral?.percentage || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="sentiment-label">NEUTRAL</div>
          <div className="sentiment-progress">
            <div 
              className="sentiment-progress-fill neutral"
              style={{ width: `${(stats.sentimentBreakdown.neutral?.percentage || 0) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="sentiment-item negative">
          <div className="sentiment-icon">📉</div>
          <div className="sentiment-numbers">
            <span className="sentiment-count">{stats.sentimentBreakdown.negative?.count || 0}</span>
            <span className="sentiment-percentage">{((stats.sentimentBreakdown.negative?.percentage || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="sentiment-label">NEGATIVE</div>
          <div className="sentiment-progress">
            <div 
              className="sentiment-progress-fill negative"
              style={{ width: `${(stats.sentimentBreakdown.negative?.percentage || 0) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentOverview;
