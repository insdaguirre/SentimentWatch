const snoowrap = require('snoowrap');

class RedditService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      this.client = new snoowrap({
        userAgent: process.env.REDDIT_USER_AGENT,
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD
      });
      
      this.isInitialized = true;
      console.log('Reddit service initialized');
    } catch (error) {
      console.error('Error initializing Reddit service:', error);
      throw error;
    }
  }

  async searchPosts(ticker, limit = 25) {
    if (!this.isInitialized) {
      this.initialize();
    }

    try {
      const subreddits = ['wallstreetbets', 'stocks', 'investing', 'SPACs', 'options'];
      const posts = [];
      
      for (const subreddit of subreddits) {
        try {
          const subredditPosts = await this.client
            .getSubreddit(subreddit)
            .search({
              query: ticker,
              time: 'day',
              sort: 'relevance',
              limit: Math.ceil(limit / subreddits.length)
            });

          for (const post of subredditPosts) {
            const content = post.selftext || post.title;
            
            // Only include posts that actually mention the ticker
            if (content.toUpperCase().includes(ticker.toUpperCase())) {
              posts.push({
                sourceId: `reddit_${post.id}`,
                source: 'reddit',
                ticker: ticker.toUpperCase(),
                title: post.title,
                content: content,
                author: post.author.name,
                url: `https://reddit.com${post.permalink}`,
                publishedAt: new Date(post.created_utc * 1000),
                metadata: {
                  upvotes: post.ups,
                  comments: post.num_comments,
                  subreddit: post.subreddit.display_name
                }
              });
            }
          }
        } catch (subError) {
          console.error(`Error fetching from r/${subreddit}:`, subError.message);
          // Continue with other subreddits
        }
      }

      console.log(`Fetched ${posts.length} Reddit posts for ${ticker}`);
      return posts;
    } catch (error) {
      console.error('Error searching Reddit posts:', error);
      return [];
    }
  }

  async getHotPosts(ticker, limit = 10) {
    if (!this.isInitialized) {
      this.initialize();
    }

    try {
      const posts = await this.client
        .getSubreddit('wallstreetbets')
        .getHot({ limit });

      const filtered = posts
        .filter(post => {
          const text = `${post.title} ${post.selftext}`.toUpperCase();
          return text.includes(ticker.toUpperCase());
        })
        .map(post => ({
          sourceId: `reddit_${post.id}`,
          source: 'reddit',
          ticker: ticker.toUpperCase(),
          title: post.title,
          content: post.selftext || post.title,
          author: post.author.name,
          url: `https://reddit.com${post.permalink}`,
          publishedAt: new Date(post.created_utc * 1000),
          metadata: {
            upvotes: post.ups,
            comments: post.num_comments,
            subreddit: post.subreddit.display_name
          }
        }));

      return filtered;
    } catch (error) {
      console.error('Error fetching hot Reddit posts:', error);
      return [];
    }
  }
}

module.exports = new RedditService();

