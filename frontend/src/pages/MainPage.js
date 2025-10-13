import React, { useState, useEffect } from 'react';
import { fetchGeneralNews } from '../services/api';
import './MainPage.css';

const MainPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const newsData = await fetchGeneralNews();
        setNews(newsData);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
    
    // Refresh news every 10 minutes
    const interval = setInterval(loadNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="main-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading financial news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-page">
        <div className="error-container">
          <h2>⚠️ Error Loading News</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-page">
      <div className="main-header">
        <h1>📊 SentimentWatch</h1>
        <p>Real-time financial sentiment analysis and market intelligence</p>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="news-grid">
        {news.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-tile"
          >
            <div className="news-tile-header">
              <span className="news-source">{article.source}</span>
              <span className="news-time">{formatTimeAgo(article.publishedAt)}</span>
            </div>
            <h3 className="news-title">{article.title}</h3>
            <p className="news-description">{article.description}</p>
            <div className="news-tile-footer">
              <span className="read-more">Read more →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
