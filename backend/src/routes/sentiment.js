const express = require('express');
const router = express.Router();
const SentimentPost = require('../models/SentimentPost');
const SentimentSnapshot = require('../models/SentimentSnapshot');
const { formatBytes, calculateUsagePercent, getStorageColor } = require('../utils/storageUtils');
const { getHerokuDynoStats, formatDynoStats } = require('../utils/herokuUtils');
const yfinanceService = require('../services/yfinanceService');

// General sentiment API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Stock Sentiment API - Optimized with Real-time Aggregation',
    version: '2.0.0',
    endpoints: {
      current: '/api/sentiment/current/:ticker',
      stats: '/api/sentiment/stats/:ticker',
      timeline: '/api/sentiment/timeline/:ticker',
      snapshots: '/api/sentiment/snapshots/:ticker',
      health: '/api/sentiment/health'
    },
    examples: {
      current: '/api/sentiment/current/SPY',
      stats: '/api/sentiment/stats/SPY?hours=24',
      timeline: '/api/sentiment/timeline/SPY?hours=24',
      snapshots: '/api/sentiment/snapshots/SPY?limit=10'
    },
    features: [
      'Real-time sentiment aggregation',
      '5-minute sentiment snapshots',
      'Automatic data cleanup',
      'Memory-efficient processing'
    ]
  });
});

// Get current sentiment (latest snapshot)
router.get('/current/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;

    const latestSnapshot = await SentimentSnapshot.findOne({
      ticker: ticker.toUpperCase(),
      processed: true
    }).sort({ timestamp: -1 });

    if (!latestSnapshot) {
      return res.json({
        success: true,
        data: {
          ticker: ticker.toUpperCase(),
          message: 'No sentiment data available',
          timestamp: new Date(),
          overallSentiment: 'neutral',
          confidence: 0,
          totalPosts: 0
        }
      });
    }

    res.json({
      success: true,
      data: latestSnapshot.toPublicJSON()
    });
  } catch (error) {
    console.error('Error fetching current sentiment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch current sentiment'
    });
  }
});

// Get recent sentiment snapshots
router.get('/snapshots/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const timeWindow = req.query.timeWindow || '5min';

    const snapshots = await SentimentSnapshot.getRecentSnapshots(
      ticker.toUpperCase(), 
      timeWindow, 
      limit
    );

    res.json({
      success: true,
      count: snapshots.length,
      data: snapshots.map(s => s.toPublicJSON())
    });
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch snapshots'
    });
  }
});

// Get sentiment statistics (aggregated from snapshots)
router.get('/stats/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const hours = parseInt(req.query.hours) || 24;

    const stats = await SentimentSnapshot.getSentimentStats(ticker.toUpperCase(), hours);

    res.json({
      success: true,
      data: {
        ticker: ticker.toUpperCase(),
        period: `${hours} hours`,
        overall: stats,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// Get sentiment timeline (from snapshots)
router.get('/timeline/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const hours = parseInt(req.query.hours) || 24;

    const timeline = await SentimentSnapshot.getTimeline(ticker.toUpperCase(), hours);

    res.json({
      success: true,
      data: timeline.map(snapshot => {
        // Calculate overallScore manually since virtual fields don't work with select
        const { positive, negative, neutral } = snapshot.sentimentBreakdown;
        const total = positive.count + negative.count + neutral.count;
        let overallScore = 0.5; // default neutral
        
        if (total > 0) {
          const positiveWeight = positive.count / total;
          const negativeWeight = negative.count / total;
          overallScore = positiveWeight - negativeWeight + 0.5; // Scale to 0-1
        }
        
        return {
          timestamp: snapshot.timestamp,
          overallSentiment: snapshot.overallSentiment,
          overallScore: overallScore,
          confidence: snapshot.confidence,
          totalPosts: snapshot.totalPosts
        };
      })
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch timeline'
    });
  }
});

// Get top sentiment snapshots by confidence
router.get('/top/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const sentiment = req.query.sentiment || 'bullish'; // bullish, bearish, or neutral
    const limit = parseInt(req.query.limit) || 10;
    const hours = parseInt(req.query.hours) || 24;
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const snapshots = await SentimentSnapshot.find({
      ticker: ticker.toUpperCase(),
      processed: true,
      overallSentiment: sentiment,
      timestamp: { $gte: startDate }
    })
      .sort({ confidence: -1, timestamp: -1 })
      .limit(limit)
      .select('-__v');

    res.json({
      success: true,
      count: snapshots.length,
      data: snapshots.map(s => s.toPublicJSON())
    });
  } catch (error) {
    console.error('Error fetching top snapshots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top snapshots'
    });
  }
});

// Get database storage information
router.get('/storage', async (req, res) => {
  try {
    const db = require('mongoose').connection.db;
    const stats = await db.stats();
    
    // Calculate storage usage
    const usedBytes = stats.dataSize + stats.indexSize;
    const maxBytes = 512 * 1024 * 1024; // 512MB in bytes
    const usedPercent = calculateUsagePercent(usedBytes, maxBytes);
    const remainingBytes = Math.max(0, maxBytes - usedBytes);
    
    // Get Heroku dyno stats
    let dynoStats = null;
    try {
      const dynos = await getHerokuDynoStats();
      dynoStats = formatDynoStats(dynos);
    } catch (herokuError) {
      console.warn('Could not fetch Heroku dyno stats:', herokuError.message);
    }
    
    res.json({
      success: true,
      data: {
        used: usedBytes,
        max: maxBytes,
        usedPercent: usedPercent,
        usedFormatted: formatBytes(usedBytes),
        maxFormatted: '512 MB',
        remaining: remainingBytes,
        remainingFormatted: formatBytes(remainingBytes),
        collections: stats.collections,
        indexes: stats.indexes,
        colorClass: getStorageColor(usedPercent),
        dyno: dynoStats
      }
    });
  } catch (error) {
    console.error('Error fetching storage info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch storage information'
    });
  }
});

// Get SPY price data
router.get('/spy/:timeWindow', async (req, res) => {
  try {
    const { timeWindow } = req.params;
    const validTimeWindows = ['1d', '5d', '1mo', '6mo', '1y', '5y'];
    
    if (!validTimeWindows.includes(timeWindow)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid time window. Valid options: 1d, 5d, 1mo, 6mo, 1y, 5y'
      });
    }

    const data = await yfinanceService.getSPYDataWithOptimalInterval(timeWindow);
    
    res.json({
      success: true,
      data: {
        timeWindow,
        interval: yfinanceService.getOptimalInterval(timeWindow),
        data,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching SPY data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SPY price data'
    });
  }
});

// Health check
router.get('/health', async (req, res) => {
  try {
    const snapshotCount = await SentimentSnapshot.countDocuments();
    const postCount = await SentimentPost.countDocuments();
    const latestSnapshot = await SentimentSnapshot.findOne().sort({ timestamp: -1 });
    const yfinanceHealth = await yfinanceService.healthCheck();

    res.json({
      success: true,
      data: {
        totalSnapshots: snapshotCount,
        totalPosts: postCount,
        latestSnapshot: latestSnapshot ? latestSnapshot.timestamp : null,
        status: 'healthy',
        architecture: 'optimized-aggregation',
        yfinance: yfinanceHealth
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Service unhealthy'
    });
  }
});

module.exports = router;

