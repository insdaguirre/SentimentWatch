/**
 * In-memory data store for demo mode
 * Replaces MongoDB with a simple in-memory store
 * Data persists for the session but resets on restart
 */

class InMemoryDataStore {
  constructor() {
    this.sentimentPosts = []; // Mock SentimentPost collection
    this.sentimentSnapshots = []; // Mock SentimentSnapshot collection
    this.processedPostIds = []; // Mock ProcessedPostId collection
    this.spyCandles = []; // SPY price history
    this.nextId = 1;
  }

  /**
   * Initialize store with test data
   */
  async initialize(dummyDataGenerator) {
    console.log('[InMemory] Initializing in-memory data store...');

    // Generate historical SPY data (60 days)
    this.spyCandles = dummyDataGenerator.generateHistoricalSPYData(60);
    console.log(`[InMemory] Seeded ${this.spyCandles.length} historical SPY candles`);

    // Generate initial batch of posts
    const initialPosts = dummyDataGenerator.generateBatchPosts('SPY', new Date());
    this.sentimentPosts = initialPosts;
    console.log(`[InMemory] Seeded ${initialPosts.length} initial sentiment posts`);

    // Initialize processedPostIds with current posts
    this.processedPostIds = initialPosts.map(post => ({
      _id: this.nextId++,
      ticker: post.ticker,
      sourceId: post.sourceId,
      processedAt: post.ingestedAt
    }));

    console.log('[InMemory] Data store initialized');
  }

  // ===== SentimentPost methods =====

  async createSentimentPost(postData) {
    const post = {
      _id: this.nextId++,
      ...postData,
      ingestedAt: postData.ingestedAt || new Date()
    };
    this.sentimentPosts.push(post);
    return post;
  }

  async createSentimentPosts(postsData) {
    const created = [];
    for (const postData of postsData) {
      const post = await this.createSentimentPost(postData);
      created.push(post);
    }
    return created;
  }

  async findSentimentPosts(query = {}, options = {}) {
    let results = [...this.sentimentPosts];

    // Apply filters
    if (query.ticker) {
      results = results.filter(p => p.ticker === query.ticker);
    }
    if (query.source) {
      results = results.filter(p => p.source === query.source);
    }
    if (query['sentiment.label']) {
      results = results.filter(p => p.sentiment.label === query['sentiment.label']);
    }
    if (query.publishedAt?.$gte) {
      results = results.filter(p => new Date(p.publishedAt) >= query.publishedAt.$gte);
    }
    if (query.publishedAt?.$lte) {
      results = results.filter(p => new Date(p.publishedAt) <= query.publishedAt.$lte);
    }

    // Sort by publishedAt descending (most recent first)
    results.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Apply limit and skip
    if (options.skip) {
      results = results.slice(options.skip);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async findSentimentPostsByTicker(ticker, limit = 50) {
    return this.findSentimentPosts(
      { ticker },
      { sort: { publishedAt: -1 }, limit }
    );
  }

  async findSentimentPostsInTicker(ticker, startDate, endDate, limit = 50) {
    return this.findSentimentPosts(
      {
        ticker,
        publishedAt: { $gte: startDate, $lte: endDate }
      },
      { limit }
    );
  }

  async deleteOlderThanDays(ticker, days) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const initialLength = this.sentimentPosts.length;
    this.sentimentPosts = this.sentimentPosts.filter(
      p => new Date(p.publishedAt) > cutoffDate || p.ticker !== ticker
    );
    const deleted = initialLength - this.sentimentPosts.length;
    console.log(`[InMemory] Deleted ${deleted} posts older than ${days} days`);
    return deleted;
  }

  // ===== SentimentSnapshot methods =====

  async createSentimentSnapshot(snapshotData) {
    const snapshot = {
      _id: this.nextId++,
      ...snapshotData,
      createdAt: new Date()
    };
    this.sentimentSnapshots.push(snapshot);
    return snapshot;
  }

  async findSentimentSnapshots(query = {}, options = {}) {
    let results = [...this.sentimentSnapshots];

    // Apply filters
    if (query.ticker) {
      results = results.filter(s => s.ticker === query.ticker);
    }
    if (query.timeWindow) {
      results = results.filter(s => s.timeWindow === query.timeWindow);
    }
    if (query.timestamp?.$gte) {
      results = results.filter(s => new Date(s.timestamp) >= query.timestamp.$gte);
    }
    if (query.timestamp?.$lte) {
      results = results.filter(s => new Date(s.timestamp) <= query.timestamp.$lte);
    }

    // Sort by timestamp descending
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply limit and skip
    if (options.skip) {
      results = results.slice(options.skip);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async findLatestSnapshot(ticker, timeWindow = '5min') {
    const snapshots = await this.findSentimentSnapshots(
      { ticker, timeWindow },
      { limit: 1 }
    );
    return snapshots[0] || null;
  }

  async deleteOlderSnapshots(ticker, cutoffDate) {
    const initialLength = this.sentimentSnapshots.length;
    this.sentimentSnapshots = this.sentimentSnapshots.filter(
      s => new Date(s.timestamp) > cutoffDate || s.ticker !== ticker
    );
    const deleted = initialLength - this.sentimentSnapshots.length;
    return deleted;
  }

  // ===== ProcessedPostId methods =====

  async createProcessedPostId(data) {
    const record = {
      _id: this.nextId++,
      ...data,
      processedAt: data.processedAt || new Date()
    };
    this.processedPostIds.push(record);
    return record;
  }

  async findProcessedPostIds(query = {}) {
    let results = [...this.processedPostIds];

    if (query.ticker) {
      results = results.filter(r => r.ticker === query.ticker);
    }
    if (query.processedAt?.$gte) {
      results = results.filter(r => new Date(r.processedAt) >= query.processedAt.$gte);
    }

    return results;
  }

  // ===== SPY Price Data methods =====

  async addSPYCandle(candle) {
    this.spyCandles.push({
      _id: this.nextId++,
      ...candle
    });
  }

  async getSPYCandles(startDate, endDate, limit = 100) {
    let results = this.spyCandles.filter(
      c => new Date(c.date) >= startDate && new Date(c.date) <= endDate
    );
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
    return results.slice(0, limit);
  }

  async getLatestSPYCandle() {
    if (this.spyCandles.length === 0) return null;
    return this.spyCandles.reduce((latest, current) =>
      new Date(current.date) > new Date(latest.date) ? current : latest
    );
  }

  // ===== Utility methods =====

  /**
   * Get statistics for sentiment posts in a time window
   */
  async getSentimentStats(ticker, startDate, endDate) {
    const posts = await this.findSentimentPostsInTicker(ticker, startDate, endDate, 10000);

    if (posts.length === 0) {
      return {
        totalPosts: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        positivePercent: 0,
        negativePercent: 0,
        neutralPercent: 0,
        avgSentimentScore: 0,
        sourceBreakdown: {}
      };
    }

    const stats = {
      positive: { count: 0, total: 0 },
      negative: { count: 0, total: 0 },
      neutral: { count: 0, total: 0 },
      sources: {}
    };

    posts.forEach(post => {
      const label = post.sentiment.label;
      stats[label].count++;
      stats[label].total += post.sentiment.score;

      if (!stats.sources[post.source]) {
        stats.sources[post.source] = { positive: 0, negative: 0, neutral: 0 };
      }
      stats.sources[post.source][label]++;
    });

    const total = posts.length;
    return {
      totalPosts: total,
      positiveCount: stats.positive.count,
      negativeCount: stats.negative.count,
      neutralCount: stats.neutral.count,
      positivePercent: ((stats.positive.count / total) * 100).toFixed(1),
      negativePercent: ((stats.negative.count / total) * 100).toFixed(1),
      neutralPercent: ((stats.neutral.count / total) * 100).toFixed(1),
      avgSentimentScore: (
        (stats.positive.total + stats.negative.total + stats.neutral.total) / total
      ).toFixed(3),
      sourceBreakdown: stats.sources
    };
  }

  /**
   * Clear old data (cleanup)
   */
  clear() {
    this.sentimentPosts = [];
    this.sentimentSnapshots = [];
    this.processedPostIds = [];
  }

  /**
   * Get store stats
   */
  getStats() {
    return {
      postsCount: this.sentimentPosts.length,
      snapshotsCount: this.sentimentSnapshots.length,
      processedIdsCount: this.processedPostIds.length,
      spyCandlesCount: this.spyCandles.length
    };
  }
}

module.exports = new InMemoryDataStore();
