/**
 * Mock News Service - replaces NewsAPI with dummy data
 */

const dummyDataGenerator = require('./dummyDataGenerator');

class MockNewsService {
  async getNews(ticker, limit = 20) {
    const posts = [];

    for (let i = 0; i < limit; i++) {
      const post = dummyDataGenerator.generateSentimentPost(ticker, 'news', new Date());
      post.source = 'news';
      posts.push(post);
    }

    console.log(`[MockNews] Generated ${posts.length} news articles for ${ticker}`);
    return posts;
  }

  async getGeneralNews(limit = 30) {
    const posts = [];

    for (let i = 0; i < limit; i++) {
      const post = dummyDataGenerator.generateSentimentPost('SPY', 'news', new Date());
      posts.push(post);
    }

    return posts;
  }

  async searchNews(query, limit = 15) {
    return this.getNews('SPY', limit);
  }
}

module.exports = new MockNewsService();
