import React from 'react';
import './SentimentOverview.css';

const SentimentOverview = ({ stats }) => {
  if (!stats || !stats.sentimentBreakdown) return null;

  const sentimentLabel = stats.tone.label;

  return (
    <section className="sentiment-overview section-card">
      <div className="sentiment-overview__hero">
        <div>
          <p className="eyebrow">Overview</p>
          <h2 className="sentiment-title">{sentimentLabel} setup for {stats.symbol}</h2>
          <p className="sentiment-copy">{stats.summary}</p>
          <div className="pill-row">
            {stats.topThemes.map((theme) => (
              <span key={theme} className="sentiment-theme">
                {theme}
              </span>
            ))}
          </div>
        </div>
        <div className={`sentiment-score sentiment-score--${stats.tone.tone}`}>
          <span>Sentiment score</span>
          <strong>{(stats.overallScore * 100).toFixed(0)}</strong>
          <em>{stats.confidence.toFixed(2)} confidence</em>
        </div>
      </div>

      <div className="sentiment-stats">
        <div className="sentiment-stat">
          <span>24h sample</span>
          <strong>{stats.totalPosts}</strong>
        </div>
        <div className="sentiment-stat">
          <span>Price context</span>
          <strong>${stats.price.toFixed(2)}</strong>
        </div>
        <div className="sentiment-stat">
          <span>Day move</span>
          <strong className={stats.dayChange >= 0 ? 'tone-positive' : 'tone-negative'}>
            {stats.dayChange >= 0 ? '+' : ''}
            {stats.dayChange.toFixed(1)}%
          </strong>
        </div>
        <div className="sentiment-stat">
          <span>Risk note</span>
          <strong>{stats.riskNote}</strong>
        </div>
      </div>

      <div className="sentiment-breakdown">
        <div className="sentiment-item positive">
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
    </section>
  );
};

export default SentimentOverview;
