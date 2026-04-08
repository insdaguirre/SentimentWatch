/**
 * Mock Finnhub Service - replaces Finnhub API with dummy data
 */

const dummyDataGenerator = require('./dummyDataGenerator');

class MockFinnhubService {
  async getNews(ticker, limit = 8) {
    const posts = [];

    for (let i = 0; i < limit; i++) {
      const post = dummyDataGenerator.generateSentimentPost(ticker, 'finnhub', new Date());
      post.source = 'finnhub';
      posts.push(post);
    }

    console.log(`[MockFinnhub] Generated ${posts.length} Finnhub articles for ${ticker}`);
    return posts;
  }

  async getCompanyNews(ticker, limit = 10) {
    return this.getNews(ticker, limit);
  }

  async getEarningsCalendar(limit = 50) {
    return [];
  }
}

module.exports = new MockFinnhubService();
