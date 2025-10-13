import React, { useState, useEffect } from 'react';
import { fetchGeneralNews } from '../services/api';
import NewsCard from '../components/NewsCard';
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
          <NewsCard
            key={index}
            article={article}
            theme="green"
          />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
