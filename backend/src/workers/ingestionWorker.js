require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const cron = require('node-cron');
const connectDB = require('../config/database');
const SentimentPost = require('../models/SentimentPost');
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

      // Process and save posts
      let newCount = 0;
      let duplicateCount = 0;

      for (const post of allPosts) {
        try {
          // Check if post already exists
          const existing = await SentimentPost.findOne({ sourceId: post.sourceId });
          
          if (existing) {
            duplicateCount++;
            continue;
          }

          // Analyze sentiment
          const sentiment = await sentimentAnalyzer.analyzeSentiment(post.content);

          // Create and save post
          const sentimentPost = new SentimentPost({
            ...post,
            sentiment,
            processed: true
          });

          await sentimentPost.save();
          newCount++;
        } catch (error) {
          console.error(`Error processing post ${post.sourceId}:`, error.message);
        }
      }

      console.log(`${ticker}: ${newCount} new posts, ${duplicateCount} duplicates`);
    } catch (error) {
      console.error(`Error ingesting data for ${ticker}:`, error);
    }
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

    console.log('Ingestion worker is running...');
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

