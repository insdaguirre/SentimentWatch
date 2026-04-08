/**
 * Mock StockTwits Service - replaces RapidAPI with dummy data
 */

const dummyDataGenerator = require('./dummyDataGenerator');

class MockStockTwitsService {
  async getMessages(ticker, limit = 60) {
    const posts = [];

    for (let i = 0; i < limit; i++) {
      const post = dummyDataGenerator.generateSentimentPost(ticker, 'stocktwits', new Date());
      post.source = 'stocktwits';
      posts.push(post);
    }

    console.log(`[MockStockTwits] Generated ${posts.length} StockTwits messages for ${ticker}`);
    return posts;
  }

  async getWatchlist(limit = 50) {
    const posts = [];

    for (let i = 0; i < limit; i++) {
      const post = dummyDataGenerator.generateSentimentPost('SPY', 'stocktwits', new Date());
      posts.push(post);
    }

    return posts;
  }
}

module.exports = new MockStockTwitsService();
