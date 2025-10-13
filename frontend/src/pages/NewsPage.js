import React, { useState, useEffect } from 'react';
import { fetchSPYNews } from '../services/api';
import NewsCard from '../components/NewsCard';
import './NewsPage.css';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const newsData = await fetchSPYNews();
        setNews(newsData);
      } catch (err) {
        console.error('Error loading SPY news:', err);
        setError('Failed to load SPY news');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
    
    // Refresh news every 10 minutes
    const interval = setInterval(loadNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);


  if (loading) {
    return (
      <div className="news-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading SPY news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <div className="error-container">
          <h2>⚠️ Error Loading News</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>📰 SPY News</h1>
        <p>Latest news and analysis related to S&P 500 ETF (SPY)</p>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="news-grid">
        {news.map((article, index) => (
          <NewsCard
            key={index}
            article={article}
            theme="red"
          />
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
