/**
 * Mock Reddit Service - replaces snoowrap with dummy data
 */

const dummyDataGenerator = require('./dummyDataGenerator');

class MockRedditService {
  async searchPosts(ticker, limit = 75) {
    const posts = [];

    for (let i = 0; i < limit; i++) {
      const post = dummyDataGenerator.generateSentimentPost(ticker, 'reddit', new Date());
      posts.push(post);
    }

    console.log(`[MockReddit] Generated ${posts.length} Reddit posts for ${ticker}`);
    return posts;
  }

  async getSubredditPosts(subreddit, limit = 15) {
    const posts = [];

    for (let i = 0; i < limit; i++) {
      const post = dummyDataGenerator.generateSentimentPost('SPY', 'reddit', new Date());
      post.subreddit = subreddit;
      posts.push(post);
    }

    return posts;
  }
}

module.exports = new MockRedditService();
