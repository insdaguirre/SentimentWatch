const express = require('express');
const router = express.Router();
const SentimentPost = require('../models/SentimentPost');

// Get recent posts for a ticker
router.get('/posts/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const source = req.query.source; // optional filter by source

    const query = { 
      ticker: ticker.toUpperCase(), 
      processed: true 
    };
    
    if (source) {
      query.source = source;
    }

    const posts = await SentimentPost.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('-__v');

    res.json({
      success: true,
      count: posts.length,
      data: posts.map(p => p.toPublicJSON())
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts'
    });
  }
});

// Get sentiment statistics
router.get('/stats/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const hours = parseInt(req.query.hours) || 24;

    const stats = await SentimentPost.getSentimentStats(ticker.toUpperCase(), hours);

    // Get breakdown by source
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    const sourceBreakdown = await SentimentPost.aggregate([
      {
        $match: {
          ticker: ticker.toUpperCase(),
          processed: true,
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          avgScore: { $avg: '$sentiment.score' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ticker: ticker.toUpperCase(),
        period: `${hours} hours`,
        overall: stats,
        bySource: sourceBreakdown.reduce((acc, item) => {
          acc[item._id] = {
            count: item.count,
            avgScore: item.avgScore
          };
          return acc;
        }, {})
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

// Get sentiment timeline (hourly breakdown)
router.get('/timeline/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const hours = parseInt(req.query.hours) || 24;
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const timeline = await SentimentPost.aggregate([
      {
        $match: {
          ticker: ticker.toUpperCase(),
          processed: true,
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            hour: { $dateToString: { format: '%Y-%m-%d %H:00', date: '$publishedAt' } }
          },
          positive: {
            $sum: { $cond: [{ $eq: ['$sentiment.label', 'positive'] }, 1, 0] }
          },
          negative: {
            $sum: { $cond: [{ $eq: ['$sentiment.label', 'negative'] }, 1, 0] }
          },
          neutral: {
            $sum: { $cond: [{ $eq: ['$sentiment.label', 'neutral'] }, 1, 0] }
          },
          avgScore: { $avg: '$sentiment.score' }
        }
      },
      { $sort: { '_id.hour': 1 } }
    ]);

    res.json({
      success: true,
      data: timeline.map(t => ({
        timestamp: t._id.hour,
        positive: t.positive,
        negative: t.negative,
        neutral: t.neutral,
        avgScore: t.avgScore
      }))
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch timeline'
    });
  }
});

// Get top posts by sentiment
router.get('/top/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const sentiment = req.query.sentiment || 'positive'; // positive, negative, or neutral
    const limit = parseInt(req.query.limit) || 10;
    const hours = parseInt(req.query.hours) || 24;
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const posts = await SentimentPost.find({
      ticker: ticker.toUpperCase(),
      processed: true,
      'sentiment.label': sentiment,
      publishedAt: { $gte: startDate }
    })
      .sort({ 'sentiment.score': -1, 'metadata.upvotes': -1 })
      .limit(limit)
      .select('-__v');

    res.json({
      success: true,
      count: posts.length,
      data: posts.map(p => p.toPublicJSON())
    });
  } catch (error) {
    console.error('Error fetching top posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top posts'
    });
  }
});

// Health check
router.get('/health', async (req, res) => {
  try {
    const count = await SentimentPost.countDocuments();
    const latest = await SentimentPost.findOne().sort({ ingestedAt: -1 });

    res.json({
      success: true,
      data: {
        totalPosts: count,
        latestIngestion: latest ? latest.ingestedAt : null,
        status: 'healthy'
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

