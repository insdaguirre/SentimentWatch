require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const cron = require('node-cron');
const connectDB = require('../config/database');
const SentimentPost = require('../models/SentimentPost');
const SentimentSnapshot = require('../models/SentimentSnapshot');
const redditService = require('../services/redditService');
const stocktwitsService = require('../services/stocktwitsService');
const newsService = require('../services/newsService');
const sentimentAnalyzer = require('../services/sentimentAnalyzer');

class IngestionWorker {
  constructor() {
    this.isRunning = false;
    this.tickers = ['SPY']; // Start with SPY only
  }

  async initialize() {
    try {
      await connectDB();
      await sentimentAnalyzer.initialize();
      console.log('Ingestion worker initialized');
    } catch (error) {
      console.error('Error initializing worker:', error);
      process.exit(1);
    }
  }

  async ingestData() {
    if (this.isRunning) {
      console.log('Ingestion already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log(`Starting ingestion at ${new Date().toISOString()}`);

    try {
      for (const ticker of this.tickers) {
        await this.ingestForTicker(ticker);
      }
    } catch (error) {
      console.error('Error during ingestion:', error);
    } finally {
      this.isRunning = false;
      console.log(`Ingestion completed at ${new Date().toISOString()}`);
    }
  }

  async ingestForTicker(ticker) {
    console.log(`\n=== Ingesting data for ${ticker} ===`);

    try {
      // Fetch from all sources in parallel
      const [redditPosts, stocktwitsPosts, newsArticles] = await Promise.all([
        redditService.searchPosts(ticker, 25),
        stocktwitsService.getMessages(ticker, 30),
        newsService.getNews(ticker, 20)
      ]);

      const allPosts = [...redditPosts, ...stocktwitsPosts, ...newsArticles];
      console.log(`Total posts fetched: ${allPosts.length}`);

      if (allPosts.length === 0) {
        console.log(`${ticker}: No posts to process`);
        return;
      }

      // Process posts in batches for memory efficiency
      const batchSize = 10;
      const sentiments = [];
      const processedPosts = [];

      for (let i = 0; i < allPosts.length; i += batchSize) {
        const batch = allPosts.slice(i, i + batchSize);
        
        // Analyze sentiment for batch
        const batchSentiments = await Promise.all(
          batch.map(post => sentimentAnalyzer.analyzeSentiment(post.content))
        );
        
        // Add to results
        sentiments.push(...batchSentiments);
        processedPosts.push(...batch);
        
        // Clear batch from memory
        batch.length = 0;
      }

      // Create sentiment snapshot (aggregated data)
      const snapshot = this.createSentimentSnapshot(ticker, processedPosts, sentiments);
      
      // Save snapshot to database
      await SentimentSnapshot.create(snapshot);
      
      console.log(`${ticker}: Created sentiment snapshot with ${processedPosts.length} posts`);
      console.log(`Sentiment breakdown: ${snapshot.sentimentBreakdown.positive.count} positive, ${snapshot.sentimentBreakdown.negative.count} negative, ${snapshot.sentimentBreakdown.neutral.count} neutral`);
      
      // Clear processed data from memory
      allPosts.length = 0;
      sentiments.length = 0;
      processedPosts.length = 0;
      
    } catch (error) {
      console.error(`Error ingesting data for ${ticker}:`, error);
    }
  }

  createSentimentSnapshot(ticker, posts, sentiments) {
    const now = new Date();
    
    // Initialize aggregation structure
    const snapshot = {
      ticker,
      timestamp: now,
      timeWindow: '5min',
      totalPosts: posts.length,
      sentimentBreakdown: {
        positive: { count: 0, avgScore: 0, totalScore: 0 },
        negative: { count: 0, avgScore: 0, totalScore: 0 },
        neutral: { count: 0, avgScore: 0, totalScore: 0 }
      },
      sources: {
        reddit: { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } },
        stocktwits: { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } },
        news: { count: 0, sentiment: { positive: 0, negative: 0, neutral: 0 } }
      },
      overallSentiment: 'neutral',
      confidence: 0,
      volatility: 0
    };

    // Aggregate sentiment data
    const scores = [];
    
    posts.forEach((post, index) => {
      const sentiment = sentiments[index];
      const sentimentLabel = sentiment.label;
      const sentimentScore = sentiment.score;
      
      // Update sentiment breakdown
      snapshot.sentimentBreakdown[sentimentLabel].count++;
      snapshot.sentimentBreakdown[sentimentLabel].totalScore += sentimentScore;
      
      // Update source breakdown
      snapshot.sources[post.source].count++;
      snapshot.sources[post.source].sentiment[sentimentLabel]++;
      
      // Collect scores for volatility calculation
      scores.push(sentimentScore);
    });

    // Calculate average scores
    Object.keys(snapshot.sentimentBreakdown).forEach(label => {
      const breakdown = snapshot.sentimentBreakdown[label];
      if (breakdown.count > 0) {
        breakdown.avgScore = breakdown.totalScore / breakdown.count;
      }
    });

    // Determine overall sentiment
    const { positive, negative, neutral } = snapshot.sentimentBreakdown;
    const total = positive.count + negative.count + neutral.count;
    
    if (total > 0) {
      const positiveRatio = positive.count / total;
      const negativeRatio = negative.count / total;
      
      if (positiveRatio > negativeRatio + 0.1) {
        snapshot.overallSentiment = 'bullish';
      } else if (negativeRatio > positiveRatio + 0.1) {
        snapshot.overallSentiment = 'bearish';
      } else {
        snapshot.overallSentiment = 'neutral';
      }
      
      // Calculate confidence (based on sentiment distribution)
      const maxRatio = Math.max(positiveRatio, negativeRatio, neutral.count / total);
      snapshot.confidence = maxRatio;
      
      // Calculate volatility (standard deviation of scores)
      if (scores.length > 1) {
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
        snapshot.volatility = Math.sqrt(variance);
      }
    }

    return snapshot;
  }

  async runOnce() {
    await this.initialize();
    await this.ingestData();
    process.exit(0);
  }

  async start() {
    await this.initialize();

    // Run immediately on start
    await this.ingestData();

    // Schedule periodic ingestion
    const intervalMinutes = process.env.INGESTION_INTERVAL_MINUTES || 15;
    const cronSchedule = `*/${intervalMinutes} * * * *`;
    
    console.log(`Scheduling ingestion every ${intervalMinutes} minutes`);
    
    cron.schedule(cronSchedule, () => {
      this.ingestData();
    });

    // Schedule end-of-day cleanup (4:00 PM EST / 9:00 PM UTC)
    console.log('Scheduling end-of-day cleanup at 4:00 PM EST (9:00 PM UTC)');
    cron.schedule('0 21 * * *', () => {
      this.endOfTradingDay();
    });

    console.log('Ingestion worker is running...');
  }

  async endOfTradingDay() {
    console.log('\n=== End of Trading Day Cleanup ===');
    
    try {
      // Create daily summary
      const dailySummary = await this.createDailySummary();
      console.log('Daily summary created:', dailySummary);
      
      // Clear old snapshots (keep only last 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const deleteResult = await SentimentSnapshot.deleteMany({
        timestamp: { $lt: twentyFourHoursAgo }
      });
      
      console.log(`Cleaned up ${deleteResult.deletedCount} old snapshots`);
      
      // Clear old individual posts (if any exist)
      const postDeleteResult = await SentimentPost.deleteMany({
        ingestedAt: { $lt: twentyFourHoursAgo }
      });
      
      if (postDeleteResult.deletedCount > 0) {
        console.log(`Cleaned up ${postDeleteResult.deletedCount} old individual posts`);
      }
      
      console.log('End-of-day cleanup completed successfully');
      
    } catch (error) {
      console.error('Error during end-of-day cleanup:', error);
    }
  }

  async createDailySummary() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    // Get all snapshots from today
    const todaysSnapshots = await SentimentSnapshot.find({
      timestamp: { $gte: startOfDay, $lt: endOfDay },
      processed: true
    }).sort({ timestamp: 1 });
    
    if (todaysSnapshots.length === 0) {
      return { message: 'No data to summarize for today' };
    }
    
    // Aggregate daily metrics
    let totalPosts = 0;
    let totalPositive = 0;
    let totalNegative = 0;
    let totalNeutral = 0;
    let avgConfidence = 0;
    let avgVolatility = 0;
    let sourceBreakdown = {
      reddit: 0,
      stocktwits: 0,
      news: 0
    };
    
    todaysSnapshots.forEach(snapshot => {
      totalPosts += snapshot.totalPosts;
      totalPositive += snapshot.sentimentBreakdown.positive.count;
      totalNegative += snapshot.sentimentBreakdown.negative.count;
      totalNeutral += snapshot.sentimentBreakdown.neutral.count;
      avgConfidence += snapshot.confidence;
      avgVolatility += snapshot.volatility;
      
      sourceBreakdown.reddit += snapshot.sources.reddit.count;
      sourceBreakdown.stocktwits += snapshot.sources.stocktwits.count;
      sourceBreakdown.news += snapshot.sources.news.count;
    });
    
    const summary = {
      date: startOfDay.toISOString().split('T')[0],
      totalSnapshots: todaysSnapshots.length,
      totalPosts,
      sentimentBreakdown: {
        positive: totalPositive,
        negative: totalNegative,
        neutral: totalNeutral
      },
      sourceBreakdown,
      avgConfidence: avgConfidence / todaysSnapshots.length,
      avgVolatility: avgVolatility / todaysSnapshots.length,
      createdAt: new Date()
    };
    
    // Log summary (in production, you might want to save this to a separate collection or send to analytics)
    console.log('Daily Summary:', JSON.stringify(summary, null, 2));
    
    return summary;
  }
}

// Run the worker
const worker = new IngestionWorker();

if (require.main === module) {
  // Check if run-once flag is provided
  const runOnce = process.argv.includes('--once');
  
  if (runOnce) {
    worker.runOnce();
  } else {
    worker.start();
  }
}

module.exports = IngestionWorker;

