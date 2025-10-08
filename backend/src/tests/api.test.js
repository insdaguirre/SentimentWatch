const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const SentimentPost = require('../models/SentimentPost');

describe('Sentiment API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    const testDbUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/stock-sentiment-test';
    await mongoose.connect(testDbUri);
  });

  afterAll(async () => {
    // Clean up and close connection
    await SentimentPost.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    await SentimentPost.deleteMany({});
  });

  describe('GET /api/sentiment/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/sentiment/health')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status');
      expect(res.body.data.status).toBe('healthy');
    });
  });

  describe('GET /api/sentiment/posts/:ticker', () => {
    beforeEach(async () => {
      // Create test posts
      await SentimentPost.create([
        {
          ticker: 'SPY',
          source: 'reddit',
          sourceId: 'test1',
          content: 'Test post 1',
          publishedAt: new Date(),
          sentiment: {
            label: 'positive',
            score: 0.9,
            positive: 0.9,
            negative: 0.05,
            neutral: 0.05
          },
          processed: true
        },
        {
          ticker: 'SPY',
          source: 'stocktwits',
          sourceId: 'test2',
          content: 'Test post 2',
          publishedAt: new Date(),
          sentiment: {
            label: 'negative',
            score: 0.8,
            positive: 0.1,
            negative: 0.8,
            neutral: 0.1
          },
          processed: true
        }
      ]);
    });

    it('should return posts for a ticker', async () => {
      const res = await request(app)
        .get('/api/sentiment/posts/SPY')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('ticker', 'SPY');
    });

    it('should filter posts by source', async () => {
      const res = await request(app)
        .get('/api/sentiment/posts/SPY?source=reddit')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].source).toBe('reddit');
    });

    it('should limit number of posts', async () => {
      const res = await request(app)
        .get('/api/sentiment/posts/SPY?limit=1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('GET /api/sentiment/stats/:ticker', () => {
    beforeEach(async () => {
      const now = new Date();
      await SentimentPost.create([
        {
          ticker: 'SPY',
          source: 'reddit',
          sourceId: 'stat1',
          content: 'Positive post',
          publishedAt: now,
          sentiment: { label: 'positive', score: 0.9, positive: 0.9, negative: 0.05, neutral: 0.05 },
          processed: true
        },
        {
          ticker: 'SPY',
          source: 'reddit',
          sourceId: 'stat2',
          content: 'Negative post',
          publishedAt: now,
          sentiment: { label: 'negative', score: 0.8, positive: 0.1, negative: 0.8, neutral: 0.1 },
          processed: true
        },
        {
          ticker: 'SPY',
          source: 'news',
          sourceId: 'stat3',
          content: 'Neutral post',
          publishedAt: now,
          sentiment: { label: 'neutral', score: 0.5, positive: 0.33, negative: 0.33, neutral: 0.34 },
          processed: true
        }
      ]);
    });

    it('should return sentiment statistics', async () => {
      const res = await request(app)
        .get('/api/sentiment/stats/SPY')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('overall');
      expect(res.body.data.overall.total).toBe(3);
      expect(res.body.data.overall.positive).toBe(1);
      expect(res.body.data.overall.negative).toBe(1);
      expect(res.body.data.overall.neutral).toBe(1);
    });

    it('should return breakdown by source', async () => {
      const res = await request(app)
        .get('/api/sentiment/stats/SPY')
        .expect(200);

      expect(res.body.data).toHaveProperty('bySource');
      expect(res.body.data.bySource).toHaveProperty('reddit');
      expect(res.body.data.bySource).toHaveProperty('news');
      expect(res.body.data.bySource.reddit.count).toBe(2);
      expect(res.body.data.bySource.news.count).toBe(1);
    });
  });

  describe('GET /api/sentiment/timeline/:ticker', () => {
    it('should return sentiment timeline', async () => {
      const now = new Date();
      await SentimentPost.create({
        ticker: 'SPY',
        source: 'reddit',
        sourceId: 'timeline1',
        content: 'Timeline test',
        publishedAt: now,
        sentiment: { label: 'positive', score: 0.9, positive: 0.9, negative: 0.05, neutral: 0.05 },
        processed: true
      });

      const res = await request(app)
        .get('/api/sentiment/timeline/SPY')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/sentiment/top/:ticker', () => {
    beforeEach(async () => {
      await SentimentPost.create([
        {
          ticker: 'SPY',
          source: 'reddit',
          sourceId: 'top1',
          content: 'Very positive',
          publishedAt: new Date(),
          sentiment: { label: 'positive', score: 0.95, positive: 0.95, negative: 0.025, neutral: 0.025 },
          processed: true,
          metadata: { upvotes: 100 }
        },
        {
          ticker: 'SPY',
          source: 'reddit',
          sourceId: 'top2',
          content: 'Somewhat positive',
          publishedAt: new Date(),
          sentiment: { label: 'positive', score: 0.7, positive: 0.7, negative: 0.15, neutral: 0.15 },
          processed: true,
          metadata: { upvotes: 50 }
        }
      ]);
    });

    it('should return top positive posts', async () => {
      const res = await request(app)
        .get('/api/sentiment/top/SPY?sentiment=positive')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      // Should be sorted by score descending
      expect(res.body.data[0].sentiment.score).toBeGreaterThan(res.body.data[1].sentiment.score);
    });
  });
});

