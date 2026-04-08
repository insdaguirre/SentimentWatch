const express = require('express');
const router = express.Router();
const inMemoryDataStore = require('../services/inMemoryDataStore');
const mockNewsService = require('../services/mockNewsService');

// Get general financial news
router.get('/general', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const news = await mockNewsService.getGeneralNews(limit);

    res.json({
      success: true,
      count: news.length,
      data: news.map(article => ({
        id: article.sourceId,
        title: article.title,
        content: article.content,
        source: article.source,
        url: article.url,
        author: article.author,
        publishedAt: article.publishedAt,
        sentiment: {
          label: article.sentiment.label,
          score: article.sentiment.score
        }
      })),
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error fetching general news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch general news'
    });
  }
});

// Get SPY-specific news
router.get('/spy', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const news = await mockNewsService.getNews('SPY', limit);

    // Sort by date descending
    news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.json({
      success: true,
      count: news.length,
      data: news.map(article => ({
        id: article.sourceId,
        title: article.title,
        content: article.content,
        source: article.source,
        url: article.url,
        author: article.author,
        ticker: article.ticker,
        publishedAt: article.publishedAt,
        sentiment: {
          label: article.sentiment.label,
          score: article.sentiment.score
        }
      })),
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error fetching SPY news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SPY news'
    });
  }
});

// Health check for news service
router.get('/health', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        status: 'ok',
        mode: 'demo',
        message: 'News service is running in demo mode with synthetic data',
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error checking news service health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check news service health'
    });
  }
});

module.exports = router;
