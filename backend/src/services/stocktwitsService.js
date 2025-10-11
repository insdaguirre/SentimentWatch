const axios = require('axios');

class StockTwitsService {
  constructor() {
    // Using StockTwits via RapidAPI
    this.baseURL = 'https://stocktwits.p.rapidapi.com';
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
  }

  async getMessages(ticker, limit = 60) {
    try {
      // Check if RapidAPI key is configured
      if (!this.rapidApiKey) {
        console.warn('RAPIDAPI_KEY not configured, skipping StockTwits');
        return [];
      }

      const response = await axios.get(`${this.baseURL}/streams/symbol/${ticker}.json`, {
        params: { limit },
        headers: {
          'x-rapidapi-host': 'stocktwits.p.rapidapi.com',
          'x-rapidapi-key': this.rapidApiKey
        }
      });

      const messages = response.data.messages || [];
      
      const posts = messages.map(msg => ({
        sourceId: `stocktwits_${msg.id}`,
        source: 'stocktwits',
        ticker: ticker.toUpperCase(),
        title: null,
        content: msg.body,
        author: msg.user.username,
        url: `https://stocktwits.com/${msg.user.username}/message/${msg.id}`,
        publishedAt: new Date(msg.created_at),
        metadata: {
          shares: msg.reshares?.reshare_count || 0,
          comments: msg.conversation?.replies || 0,
          sentiment: msg.entities?.sentiment?.basic || null
        }
      }));

      console.log(`Fetched ${posts.length} StockTwits messages for ${ticker} (via RapidAPI)`);
      return posts;
    } catch (error) {
      console.error('Error fetching StockTwits messages:', error.message);
      if (error.response?.status === 429) {
        console.error('RapidAPI rate limit exceeded (1000/hour or 500k/month)');
      }
      return [];
    }
  }

  async getTrending() {
    try {
      if (!this.rapidApiKey) {
        console.warn('RAPIDAPI_KEY not configured, skipping trending');
        return [];
      }

      const response = await axios.get(`${this.baseURL}/trending/symbols.json`, {
        headers: {
          'x-rapidapi-host': 'stocktwits.p.rapidapi.com',
          'x-rapidapi-key': this.rapidApiKey
        }
      });
      return response.data.symbols || [];
    } catch (error) {
      console.error('Error fetching trending symbols:', error.message);
      return [];
    }
  }
}

module.exports = new StockTwitsService();

