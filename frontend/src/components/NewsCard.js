import React from 'react';
import './NewsCard.css';

const NewsCard = ({ article }) => {
  const publishedLabel = new Date(article.publishedAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <article className="news-card">
      <div className="news-card__meta">
        <span className="news-card__platform">{article.platform}</span>
        <span className="news-card__ticker">{article.ticker}</span>
        <span className={`news-card__tone news-card__tone--${article.sentiment.label}`}>
          {article.sentiment.label}
        </span>
      </div>
      <div className="news-card__content">
        <h3 className="news-card__title">{article.title}</h3>
        <p className="news-card__description">{article.content}</p>
        <div className="news-card__footer">
          <span>{article.author}</span>
          <span>{publishedLabel}</span>
          <span>Synthetic sample</span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
