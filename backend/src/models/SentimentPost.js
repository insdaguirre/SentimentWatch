const mongoose = require('mongoose');

const sentimentPostSchema = new mongoose.Schema({
  // Identification
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  source: {
    type: String,
    required: true,
    enum: ['reddit', 'stocktwits', 'news', 'finnhub'],
    index: true
  },
  sourceId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Content
  title: String,
  content: {
    type: String,
    required: true
  },
  author: String,
  url: String,
  
  // Timestamps
  publishedAt: {
    type: Date,
    required: true,
    index: true
  },
  ingestedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Sentiment Analysis
  sentiment: {
    label: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    positive: Number,
    negative: Number,
    neutral: Number
  },
  
  // Metadata
  metadata: {
    upvotes: Number,
    comments: Number,
    shares: Number,
    subreddit: String,
    sourceName: String
  },
  
  // Processing flags
  processed: {
    type: Boolean,
    default: false,
    index: true
  },
  embedded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
sentimentPostSchema.index({ ticker: 1, publishedAt: -1 });
sentimentPostSchema.index({ ticker: 1, source: 1, publishedAt: -1 });
sentimentPostSchema.index({ ticker: 1, 'sentiment.label': 1, publishedAt: -1 });

// Methods
sentimentPostSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    ticker: this.ticker,
    source: this.source,
    title: this.title,
    content: this.content,
    author: this.author,
    url: this.url,
    publishedAt: this.publishedAt,
    sentiment: this.sentiment,
    metadata: this.metadata
  };
};

// Static methods
sentimentPostSchema.statics.getRecentByTicker = function(ticker, limit = 50) {
  return this.find({ ticker, processed: true })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

sentimentPostSchema.statics.getSentimentStats = async function(ticker, hoursBack = 24) {
  const startDate = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
  
  const stats = await this.aggregate([
    {
      $match: {
        ticker,
        processed: true,
        publishedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$sentiment.label',
        count: { $sum: 1 },
        avgScore: { $avg: '$sentiment.score' }
      }
    }
  ]);
  
  const total = stats.reduce((sum, item) => sum + item.count, 0);
  const result = {
    total,
    positive: 0,
    negative: 0,
    neutral: 0,
    avgScore: 0
  };
  
  stats.forEach(item => {
    result[item._id] = item.count;
    if (item._id === 'positive' || item._id === 'negative') {
      result.avgScore += item.avgScore * item.count;
    }
  });
  
  if (total > 0) {
    result.avgScore /= total;
  }
  
  return result;
};

module.exports = mongoose.model('SentimentPost', sentimentPostSchema);

