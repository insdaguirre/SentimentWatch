const axios = require('axios');
const Parser = require('rss-parser');

class NewsService {
  constructor() {
    this.newsApiKey = process.env.NEWS_API_KEY;
    this.rssParser = new Parser();
  }

  async getNews(ticker, limit = 20) {
    const articles = [];

    // Try NewsAPI if key is available
    if (this.newsApiKey) {
      try {
        const newsApiArticles = await this.fetchFromNewsAPI(ticker, limit);
        articles.push(...newsApiArticles);
      } catch (error) {
        console.error('Error fetching from NewsAPI:', error.message);
      }
    }

    // Also fetch from free RSS feeds
    try {
      const rssArticles = await this.fetchFromRSS(ticker);
      articles.push(...rssArticles);
    } catch (error) {
      console.error('Error fetching from RSS:', error.message);
    }

    // Deduplicate by URL and sort by date
    const uniqueArticles = Array.from(
      new Map(articles.map(item => [item.url, item])).values()
    );
    
    uniqueArticles.sort((a, b) => b.publishedAt - a.publishedAt);
    
    console.log(`Fetched ${uniqueArticles.length} news articles for ${ticker}`);
    return uniqueArticles.slice(0, limit);
  }

  async fetchFromNewsAPI(ticker, limit) {
    const searchTerms = this.getSearchTerms(ticker);
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: searchTerms,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: limit,
        apiKey: this.newsApiKey
      }
    });

    return (response.data.articles || []).map(article => ({
      sourceId: `news_${Buffer.from(article.url).toString('base64').substring(0, 32)}`,
      source: 'news',
      ticker: ticker.toUpperCase(),
      title: article.title,
      content: article.description || article.content || article.title,
      author: article.author || article.source.name,
      url: article.url,
      publishedAt: new Date(article.publishedAt),
      metadata: {
        sourceName: article.source.name,
        imageUrl: article.urlToImage
      }
    }));
  }

  async fetchFromRSS(ticker) {
    const feeds = [
      'https://feeds.finance.yahoo.com/rss/2.0/headline?s=' + ticker,
      'https://www.cnbc.com/id/100003114/device/rss/rss.html'
    ];

    const articles = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await this.rssParser.parseURL(feedUrl);
        
        for (const item of feed.items) {
          const content = item.contentSnippet || item.content || item.title;
          
          // Check if article mentions the ticker
          if (content.toUpperCase().includes(ticker.toUpperCase()) ||
              item.title.toUpperCase().includes(ticker.toUpperCase())) {
            articles.push({
              sourceId: `news_${Buffer.from(item.link).toString('base64').substring(0, 32)}`,
              source: 'news',
              ticker: ticker.toUpperCase(),
              title: item.title,
              content: content,
              author: item.creator || feed.title,
              url: item.link,
              publishedAt: new Date(item.pubDate || item.isoDate),
              metadata: {
                sourceName: feed.title
              }
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching RSS feed ${feedUrl}:`, error.message);
      }
    }

    return articles;
  }

  getSearchTerms(ticker) {
    const tickerMap = {
      'SPY': 'S&P 500 OR SPY OR "S&P500"',
      'QQQ': 'NASDAQ OR QQQ',
      'DIA': 'Dow Jones OR DIA'
    };

    return tickerMap[ticker] || ticker;
  }
}

module.exports = new NewsService();

