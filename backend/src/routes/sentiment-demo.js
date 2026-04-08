const express = require('express');
const router = express.Router();
const inMemoryDataStore = require('../services/inMemoryDataStore');
const mockYfinanceService = require('../services/mockYfinanceService');

// General sentiment API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SentimentWatch API - Demo Version with Dummy Data',
    version: '1.0.0-demo',
    mode: 'Demo (All data is synthetic)',
    endpoints: {
      current: '/api/sentiment/current/:ticker',
      stats: '/api/sentiment/stats/:ticker',
      timeline: '/api/sentiment/timeline/:ticker',
      posts: '/api/sentiment/posts/:ticker',
      health: '/api/sentiment/health'
    },
    examples: {
      current: '/api/sentiment/current/SPY',
      stats: '/api/sentiment/stats/SPY?hours=24',
      timeline: '/api/sentiment/timeline/SPY?hours=24',
      posts: '/api/sentiment/posts/SPY'
    }
  });
});

// Get current sentiment (latest data)
router.get('/current/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const upperTicker = ticker.toUpperCase();

    // Get latest sentiment posts
    const recentPosts = await inMemoryDataStore.findSentimentPosts(
      { ticker: upperTicker },
      { limit: 100 }
    );

    if (recentPosts.length === 0) {
      return res.json({
        success: true,
        data: {
          ticker: upperTicker,
          message: 'No sentiment data available yet',
          timestamp: new Date(),
          overallSentiment: 'neutral',
          confidence: 0,
          totalPosts: 0
        }
      });
    }

    // Calculate sentiment breakdown
    const stats = {
      positive: 0,
      negative: 0,
      neutral: 0,
      positiveScore: 0,
      negativeScore: 0,
      neutralScore: 0
    };

    recentPosts.forEach(post => {
      stats[post.sentiment.label]++;
      if (post.sentiment.label === 'positive') {
        stats.positiveScore += post.sentiment.score;
      } else if (post.sentiment.label === 'negative') {
        stats.negativeScore += post.sentiment.score;
      } else {
        stats.neutralScore += post.sentiment.score;
      }
    });

    const total = recentPosts.length;
    const avgScore = (
      (stats.positiveScore + stats.negativeScore + stats.neutralScore) / total
    ).toFixed(3);

    // Determine overall sentiment
    let overallSentiment = 'neutral';
    if (stats.positive / total > stats.negative / total + 0.1) {
      overallSentiment = 'bullish';
    } else if (stats.negative / total > stats.positive / total + 0.1) {
      overallSentiment = 'bearish';
    }

    res.json({
      success: true,
      data: {
        ticker: upperTicker,
        overallSentiment,
        confidence: Math.max(
          stats.positive / total,
          stats.negative / total,
          stats.neutral / total
        ),
        averageScore: parseFloat(avgScore),
        totalPosts: total,
        sentimentBreakdown: {
          positive: {
            count: stats.positive,
            percentage: (stats.positive / total * 100).toFixed(1)
          },
          negative: {
            count: stats.negative,
            percentage: (stats.negative / total * 100).toFixed(1)
          },
          neutral: {
            count: stats.neutral,
            percentage: (stats.neutral / total * 100).toFixed(1)
          }
        },
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching current sentiment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch current sentiment'
    });
  }
});

// Get sentiment statistics
router.get('/stats/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const hours = parseInt(req.query.hours) || 24;
    const upperTicker = ticker.toUpperCase();

    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    const endDate = new Date();

    const stats = await inMemoryDataStore.getSentimentStats(
      upperTicker,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: {
        ticker: upperTicker,
        period: `${hours} hours`,
        timeRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        totalPosts: stats.totalPosts,
        sentimentBreakdown: {
          positive: {
            count: stats.positiveCount,
            percentage: stats.positivePercent
          },
          negative: {
            count: stats.negativeCount,
            percentage: stats.negativePercent
          },
          neutral: {
            count: stats.neutralCount,
            percentage: stats.neutralPercent
          }
        },
        averageSentimentScore: stats.avgSentimentScore,
        sourceBreakdown: stats.sourceBreakdown,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sentiment stats'
    });
  }
});

// Get sentiment timeline
router.get('/timeline/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const hours = parseInt(req.query.hours) || 24;
    const upperTicker = ticker.toUpperCase();

    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    const endDate = new Date();

    const posts = await inMemoryDataStore.findSentimentPostsInTicker(
      upperTicker,
      startDate,
      endDate,
      10000
    );

    if (posts.length === 0) {
      return res.json({
        success: true,
        data: {
          ticker: upperTicker,
          timeline: [],
          message: 'No timeline data available'
        }
      });
    }

    // Group posts by hour and calculate sentiment
    const timeline = {};
    posts.forEach(post => {
      const hour = new Date(post.publishedAt);
      hour.setMinutes(0, 0, 0);
      const hourKey = hour.toISOString();

      if (!timeline[hourKey]) {
        timeline[hourKey] = {
          timestamp: hour,
          count: 0,
          positive: 0,
          negative: 0,
          neutral: 0,
          avgScore: 0
        };
      }

      timeline[hourKey].count++;
      timeline[hourKey][post.sentiment.label]++;
      timeline[hourKey].avgScore += post.sentiment.score;
    });

    // Calculate averages
    const tlArray = Object.values(timeline).map(entry => ({
      ...entry,
      avgScore: (entry.avgScore / entry.count).toFixed(3)
    }));

    tlArray.sort((a, b) => a.timestamp - b.timestamp);

    res.json({
      success: true,
      data: {
        ticker: upperTicker,
        period: `${hours} hours`,
        timeRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        dataPoints: tlArray.length,
        timeline: tlArray
      }
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sentiment timeline'
    });
  }
});

// Get recent sentiment posts
router.get('/posts/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const upperTicker = ticker.toUpperCase();

    const posts = await inMemoryDataStore.findSentimentPostsByTicker(upperTicker, limit);

    const formattedPosts = posts.map(post => ({
      id: post._id,
      ticker: post.ticker,
      source: post.source,
      title: post.title || post.content.substring(0, 100),
      content: post.content,
      author: post.author,
      url: post.url,
      sentiment: {
        label: post.sentiment.label,
        score: post.sentiment.score
      },
      publishedAt: post.publishedAt,
      ingestedAt: post.ingestedAt,
      metadata: {
        subreddit: post.subreddit,
        upvotes: post.upvotes,
        comments: post.comments,
        likes: post.likes,
        replies: post.replies
      }
    }));

    res.json({
      success: true,
      count: formattedPosts.length,
      data: formattedPosts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sentiment posts'
    });
  }
});

// Get SPY price metrics
router.get('/spy/metrics/:timeWindow', async (req, res) => {
  try {
    const { timeWindow } = req.params;

    const latestCandle = await inMemoryDataStore.getLatestSPYCandle();

    if (!latestCandle) {
      return res.json({
        success: true,
        data: {
          ticker: 'SPY',
          message: 'No price data available yet',
          timestamp: new Date()
        }
      });
    }

    res.json({
      success: true,
      data: {
        ticker: 'SPY',
        timeWindow,
        price: latestCandle.close,
        change: (latestCandle.close - latestCandle.open).toFixed(2),
        changePercent: (
          ((latestCandle.close - latestCandle.open) / latestCandle.open) * 100
        ).toFixed(2),
        open: latestCandle.open,
        high: latestCandle.high,
        low: latestCandle.low,
        close: latestCandle.close,
        volume: latestCandle.volume,
        timestamp: latestCandle.date
      }
    });
  } catch (error) {
    console.error('Error fetching SPY metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SPY metrics'
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  const stats = inMemoryDataStore.getStats();
  res.json({
    success: true,
    status: 'ok',
    mode: 'demo',
    timestamp: new Date(),
    dataStore: stats
  });
});

module.exports = router;
