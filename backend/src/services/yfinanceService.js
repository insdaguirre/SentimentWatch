const yahooFinance = require('yahoo-finance2').default;
const NodeCache = require('node-cache');

class YFinanceService {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 300 }); // 5-minute cache
    this.lastRequestTime = 0;
    this.minRequestInterval = 2500; // 2.5 seconds between requests
  }

  async getSPYData(period = '1d', interval = '1d') {
    const cacheKey = `spy_${period}_${interval}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      console.log(`Returning cached SPY data for ${period} ${interval}`);
      return cached;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    try {
      console.log(`Fetching SPY data: period=${period}, interval=${interval}`);
      
      // Convert period to date range for yahoo-finance2
      const endDate = new Date();
      const startDate = this.getStartDate(period);
      
      // Try to get historical data first
      let data;
      try {
        data = await yahooFinance.historical('SPY', startDate, endDate, {
          interval: interval
        });
      } catch (historicalError) {
        console.log('Historical data failed, falling back to quote:', historicalError.message);
        // Fallback to quote if historical fails
        const quote = await yahooFinance.quote('SPY');
        if (!quote) {
          throw new Error('No data received from yahoo-finance2');
        }
        
        // Create single data point from quote
        data = [{
          date: new Date(),
          open: parseFloat(quote.regularMarketOpen) || 0,
          high: parseFloat(quote.regularMarketDayHigh) || 0,
          low: parseFloat(quote.regularMarketDayLow) || 0,
          close: parseFloat(quote.regularMarketPrice) || 0,
          volume: parseInt(quote.regularMarketVolume) || 0
        }];
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data received from yahoo-finance2');
      }

      const formattedData = data.map((item) => ({
        timestamp: new Date(item.date),
        open: parseFloat(item.open) || 0,
        high: parseFloat(item.high) || 0,
        low: parseFloat(item.low) || 0,
        close: parseFloat(item.close) || 0,
        volume: parseInt(item.volume) || 0
      }));

      this.cache.set(cacheKey, formattedData);
      this.lastRequestTime = Date.now();
      
      console.log(`Successfully fetched ${formattedData.length} data points for SPY`);
      return formattedData;
    } catch (error) {
      console.error('Error fetching SPY data:', error);
      throw new Error(`Failed to fetch SPY data: ${error.message}`);
    }
  }

  getStartDate(period) {
    const now = new Date();
    const periods = {
      '1d': 1,
      '5d': 5,
      '1mo': 30,
      '6mo': 180,
      '1y': 365,
      '5y': 1825
    };
    
    const days = periods[period] || 1;
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    return startDate;
  }

  getOptimalInterval(timeWindow) {
    const intervals = {
      '1d': '1m',
      '5d': '5m', 
      '1mo': '1h',
      '6mo': '1d',
      '1y': '1d',
      '5y': '1d'
    };
    return intervals[timeWindow] || '1d';
  }

  async getSPYDataWithOptimalInterval(timeWindow) {
    const interval = this.getOptimalInterval(timeWindow);
    return await this.getSPYData(timeWindow, interval);
  }

  // Health check method
  async healthCheck() {
    try {
      const data = await this.getSPYData('1d', '1d');
      return {
        status: 'healthy',
        lastDataPoint: data[data.length - 1],
        dataPoints: data.length,
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

module.exports = new YFinanceService();
