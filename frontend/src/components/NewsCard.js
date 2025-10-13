import React from 'react';
import './NewsCard.css';

const NewsCard = ({ article, theme = 'green' }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`news-card news-card--${theme}`}
    >
      <div className="news-card__image-container">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="news-card__image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&crop=center';
          }}
        />
        <div className="news-card__overlay">
          <div className="news-card__source">{article.source}</div>
          <div className="news-card__time">{formatTimeAgo(article.publishedAt)}</div>
        </div>
      </div>
      
      <div className="news-card__content">
        <h3 className="news-card__title">{article.title}</h3>
        <p className="news-card__description">{article.description}</p>
        
        <div className="news-card__footer">
          <span className="news-card__read-more">Read more →</span>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
