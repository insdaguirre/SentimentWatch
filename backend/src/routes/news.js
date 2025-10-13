const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

// Get general financial news
router.get('/general', async (req, res) => {
  try {
    const news = await newsService.getGeneralNews();
    
    res.json({
      success: true,
      data: {
        news,
        count: news.length,
        lastUpdated: new Date()
      }
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
    const news = await newsService.getSPYNews();
    
    res.json({
      success: true,
      data: {
        news,
        count: news.length,
        lastUpdated: new Date()
      }
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
    const health = await newsService.healthCheck();
    res.json({
      success: true,
      data: health
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
