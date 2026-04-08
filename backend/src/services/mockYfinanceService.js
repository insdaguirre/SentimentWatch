/**
 * Mock Yahoo Finance Service - replaces yahoo-finance2 with dummy data
 */

const dummyDataGenerator = require('./dummyDataGenerator');

class MockYfinanceService {
  async getHistoricalData(ticker, options = {}) {
    const candles = dummyDataGenerator.generateHistoricalSPYData(30);
    console.log(`[MockYfinance] Generated ${candles.length} candles for ${ticker}`);
    return candles;
  }

  async getQuote(ticker) {
    const latestCandle = dummyDataGenerator.generateSPYCandle(new Date());
    return {
      ticker: ticker,
      price: latestCandle.close,
      change: (latestCandle.close - latestCandle.open).toFixed(2),
      changePercent: (((latestCandle.close - latestCandle.open) / latestCandle.open) * 100).toFixed(2),
      high: latestCandle.high,
      low: latestCandle.low,
      open: latestCandle.open,
      close: latestCandle.close,
      volume: latestCandle.volume,
      timestamp: new Date()
    };
  }

  async getDailyData(ticker, startDate, endDate) {
    const candles = [];
    let currentPrice = 450;
    const current = new Date(startDate);

    while (current <= endDate) {
      // Skip weekends
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        const candle = dummyDataGenerator.generateSPYCandle(new Date(current), currentPrice);
        candles.push(candle);
        currentPrice = candle.close;
      }
      current.setDate(current.getDate() + 1);
    }

    return candles;
  }
}

module.exports = new MockYfinanceService();
