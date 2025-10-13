const NodeCache = require('node-cache');

class NewsService {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 600 }); // 10-minute cache
    this.lastRequestTime = 0;
    this.minRequestInterval = 2000; // 2 seconds between requests
  }

  async getGeneralNews() {
    const cacheKey = 'general_news';
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      console.log('Returning cached general news');
      return cached;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next news request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    try {
      console.log('Fetching general financial news');
      
      // Mock news data for now - in production, integrate with real news API
      const mockNews = [
        {
          title: "Federal Reserve Signals Potential Rate Cut Amid Economic Uncertainty",
          description: "The Federal Reserve hints at possible interest rate adjustments as inflation concerns persist and economic indicators show mixed signals.",
          url: "https://example.com/fed-rate-cut",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          source: "Financial Times"
        },
        {
          title: "Tech Stocks Rally as AI Investments Surge",
          description: "Major technology companies see significant gains as artificial intelligence investments reach record levels across the sector.",
          url: "https://example.com/tech-ai-rally",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          source: "Reuters"
        },
        {
          title: "Energy Sector Faces Volatility Amid Geopolitical Tensions",
          description: "Oil and gas companies experience significant price swings as international tensions impact global energy markets.",
          url: "https://example.com/energy-volatility",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          source: "Bloomberg"
        },
        {
          title: "Healthcare Stocks Show Resilience in Market Downturn",
          description: "Pharmaceutical and biotech companies demonstrate strong performance despite broader market challenges.",
          url: "https://example.com/healthcare-resilience",
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          source: "Wall Street Journal"
        },
        {
          title: "Cryptocurrency Market Sees Increased Institutional Adoption",
          description: "Major financial institutions announce new cryptocurrency products and services, signaling growing mainstream acceptance.",
          url: "https://example.com/crypto-institutional",
          publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
          source: "CoinDesk"
        },
        {
          title: "Real Estate Market Shows Signs of Stabilization",
          description: "Housing prices begin to level off as mortgage rates stabilize and inventory levels improve across major metropolitan areas.",
          url: "https://example.com/real-estate-stabilization",
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          source: "CNBC"
        }
      ];

      this.cache.set(cacheKey, mockNews);
      this.lastRequestTime = Date.now();
      
      console.log(`Successfully fetched ${mockNews.length} general news articles`);
      return mockNews;
    } catch (error) {
      console.error('Error fetching general news:', error);
      throw new Error(`Failed to fetch general news: ${error.message}`);
    }
  }

  async getSPYNews() {
    const cacheKey = 'spy_news';
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      console.log('Returning cached SPY news');
      return cached;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next SPY news request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    try {
      console.log('Fetching SPY-specific news');
      
      // Mock SPY-specific news data
      const mockSPYNews = [
        {
          title: "S&P 500 ETF (SPY) Sees Record Trading Volume Amid Market Volatility",
          description: "The SPDR S&P 500 ETF Trust experiences unprecedented trading activity as investors react to economic uncertainty and policy changes.",
          url: "https://example.com/spy-volume-record",
          publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          source: "MarketWatch"
        },
        {
          title: "SPY Options Activity Surges as Traders Hedge Against Market Risk",
          description: "Options trading in SPY reaches new highs as institutional investors implement sophisticated hedging strategies.",
          url: "https://example.com/spy-options-hedging",
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          source: "CBOE"
        },
        {
          title: "S&P 500 Index Components Show Divergent Performance Patterns",
          description: "Individual stocks within the S&P 500 display varying performance as sector rotation continues to reshape market dynamics.",
          url: "https://example.com/sp500-divergent-performance",
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          source: "S&P Global"
        },
        {
          title: "SPY Dividend Yield Attracts Income-Focused Investors",
          description: "The SPDR S&P 500 ETF's dividend yield becomes increasingly attractive as bond yields remain low and investors seek income alternatives.",
          url: "https://example.com/spy-dividend-yield",
          publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
          source: "ETF.com"
        },
        {
          title: "Institutional Investors Increase SPY Holdings in Q4 Rebalancing",
          description: "Major pension funds and endowments significantly increase their SPY positions as part of quarterly portfolio rebalancing activities.",
          url: "https://example.com/spy-institutional-q4",
          publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
          source: "Institutional Investor"
        },
        {
          title: "SPY Futures Point to Higher Open as Earnings Season Begins",
          description: "S&P 500 futures indicate a positive market open as major companies prepare to report quarterly earnings results.",
          url: "https://example.com/spy-futures-earnings",
          publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
          source: "Futures Trading"
        }
      ];

      this.cache.set(cacheKey, mockSPYNews);
      this.lastRequestTime = Date.now();
      
      console.log(`Successfully fetched ${mockSPYNews.length} SPY news articles`);
      return mockSPYNews;
    } catch (error) {
      console.error('Error fetching SPY news:', error);
      throw new Error(`Failed to fetch SPY news: ${error.message}`);
    }
  }

  // Health check method
  async healthCheck() {
    try {
      const generalNews = await this.getGeneralNews();
      const spyNews = await this.getSPYNews();
      return {
        status: 'healthy',
        generalNewsCount: generalNews.length,
        spyNewsCount: spyNews.length,
        cacheSize: this.cache.keys().length
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

module.exports = new NewsService();