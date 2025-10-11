const axios = require('axios');

class FinnhubService {
  constructor() {
    this.apiKey = process.env.FINNHUB_API_KEY;
    this.baseURL = 'https://finnhub.io/api/v1';
  }

  async getNews(ticker, limit = 30) {
    try {
      if (!this.apiKey) {
        console.warn('FINNHUB_API_KEY not configured, skipping Finnhub');
        return [];
      }

      const response = await axios.get(`${this.baseURL}/company-news`, {
        params: {
          symbol: ticker,
          from: this.getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000)), // Last 24 hours
          to: this.getDateString(new Date()),
          token: this.apiKey
        }
      });

      const articles = response.data || [];
      
      const processedArticles = articles.slice(0, limit).map(article => ({
        sourceId: `finnhub_${article.id}`,
        source: 'finnhub',
        ticker: ticker.toUpperCase(),
        title: article.headline,
        content: article.summary || article.headline,
        author: article.source || 'Finnhub',
        url: article.url,
        publishedAt: new Date(article.datetime * 1000),
        metadata: {
          sourceName: article.source,
          category: article.category,
          imageUrl: article.image
        }
      }));

      console.log(`Fetched ${processedArticles.length} Finnhub articles for ${ticker}`);
      return processedArticles;

    } catch (error) {
      console.error('Error fetching Finnhub news:', error.message);
      if (error.response?.status === 429) {
        console.error('Finnhub API rate limit exceeded');
      } else if (error.response?.status === 401) {
        console.error('Finnhub API key invalid or expired');
      }
      return [];
    }
  }

  getDateString(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  async getCompanyProfile(ticker) {
    try {
      if (!this.apiKey) {
        return null;
      }

      const response = await axios.get(`${this.baseURL}/stock/profile2`, {
        params: {
          symbol: ticker,
          token: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching company profile:', error.message);
      return null;
    }
  }
}

module.exports = new FinnhubService();
