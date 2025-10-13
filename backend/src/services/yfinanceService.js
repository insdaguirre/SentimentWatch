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
      
      // Use the chart method instead of deprecated historical method
      let data;
      try {
        const chartData = await yahooFinance.chart('SPY', {
          period1: startDate.toISOString().split('T')[0],
          period2: endDate.toISOString().split('T')[0],
          interval: interval
        });
        
        console.log('Chart data structure:', JSON.stringify(chartData, null, 2));
        
        // Extract the quotes from the chart data
        if (chartData && chartData.quotes && chartData.quotes.length > 0) {
          data = chartData.quotes;
        } else if (chartData && chartData.timestamp && chartData.indicators && chartData.indicators.quote) {
          // Alternative data structure
          const quotes = chartData.indicators.quote[0];
          const timestamps = chartData.timestamp;
          data = timestamps.map((timestamp, index) => ({
            date: new Date(timestamp * 1000),
            open: quotes.open[index],
            high: quotes.high[index],
            low: quotes.low[index],
            close: quotes.close[index],
            volume: quotes.volume[index]
          }));
        } else if (chartData && chartData.meta) {
          // If no quotes but we have meta data, create a single data point from meta
          console.log('No quotes data, creating single data point from meta');
          data = [{
            date: new Date(chartData.meta.regularMarketTime),
            open: chartData.meta.regularMarketPrice,
            high: chartData.meta.regularMarketDayHigh,
            low: chartData.meta.regularMarketDayLow,
            close: chartData.meta.regularMarketPrice,
            volume: chartData.meta.regularMarketVolume
          }];
        } else {
          throw new Error('No quotes data in chart response');
        }
      } catch (chartError) {
        console.log('Chart data failed, falling back to quote:', chartError.message);
        // Fallback to quote if chart fails
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
      '1d': '5m',  // Use 5m instead of 1m for better data availability
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

  // Calculate volatility from price data
  calculateVolatility(priceData, period = 30) {
    if (priceData.length < 2) return { daily: 0, annualized: 0, period: 0 };
    
    // Calculate daily returns
    const returns = [];
    for (let i = 1; i < priceData.length; i++) {
      const dailyReturn = (priceData[i].close - priceData[i-1].close) / priceData[i-1].close;
      returns.push(dailyReturn);
    }
    
    // Calculate mean return
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    
    // Calculate variance
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    
    // Annualized volatility (assuming daily data)
    const annualizedVolatility = Math.sqrt(variance) * Math.sqrt(252);
    
    return {
      daily: Math.sqrt(variance),
      annualized: annualizedVolatility,
      period: returns.length
    };
  }

  // Calculate Sharpe ratio from price data
  calculateSharpeRatio(priceData, riskFreeRate = 0.02) {
    if (priceData.length < 2) return { ratio: 0, annualizedReturn: 0, annualizedVolatility: 0, riskFreeRate: 0 };
    
    const returns = [];
    for (let i = 1; i < priceData.length; i++) {
      const dailyReturn = (priceData[i].close - priceData[i-1].close) / priceData[i-1].close;
      returns.push(dailyReturn);
    }
    
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);
    
    // Annualized metrics
    const annualizedReturn = meanReturn * 252;
    const annualizedVolatility = volatility * Math.sqrt(252);
    const annualizedRiskFreeRate = riskFreeRate;
    
    const sharpeRatio = (annualizedReturn - annualizedRiskFreeRate) / annualizedVolatility;
    
    return {
      ratio: sharpeRatio,
      annualizedReturn: annualizedReturn,
      annualizedVolatility: annualizedVolatility,
      riskFreeRate: annualizedRiskFreeRate
    };
  }

  // Get SPY data with metrics
  async getSPYDataWithMetrics(period = '1d', interval = '1d') {
    const priceData = await this.getSPYData(period, interval);
    
    const volatility = this.calculateVolatility(priceData);
    const sharpeRatio = this.calculateSharpeRatio(priceData);
    
    return {
      priceData,
      metrics: {
        volatility,
        sharpeRatio,
        lastUpdated: new Date()
      }
    };
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
