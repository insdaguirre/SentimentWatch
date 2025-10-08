const mongoose = require('mongoose');

const sentimentSnapshotSchema = new mongoose.Schema({
  // Identification
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  
  // Time window
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  timeWindow: {
    type: String,
    required: true,
    enum: ['5min', '15min', '1hour', '1day'],
    index: true
  },
  
  // Aggregated metrics
  totalPosts: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Sentiment breakdown
  sentimentBreakdown: {
    positive: {
      count: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 }
    },
    negative: {
      count: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 }
    },
    neutral: {
      count: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 }
    }
  },
  
  // Source breakdown
  sources: {
    reddit: {
      count: { type: Number, default: 0 },
      sentiment: {
        positive: { type: Number, default: 0 },
        negative: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 }
      }
    },
    stocktwits: {
      count: { type: Number, default: 0 },
      sentiment: {
        positive: { type: Number, default: 0 },
        negative: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 }
      }
    },
    news: {
      count: { type: Number, default: 0 },
      sentiment: {
        positive: { type: Number, default: 0 },
        negative: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 }
      }
    }
  },
  
  // Key metrics
  overallSentiment: {
    type: String,
    enum: ['bullish', 'bearish', 'neutral'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  volatility: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  
  // Processing metadata
  processed: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
sentimentSnapshotSchema.index({ ticker: 1, timestamp: -1 });
sentimentSnapshotSchema.index({ ticker: 1, timeWindow: 1, timestamp: -1 });
sentimentSnapshotSchema.index({ ticker: 1, overallSentiment: 1, timestamp: -1 });
sentimentSnapshotSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

// Virtual for overall sentiment score
sentimentSnapshotSchema.virtual('overallScore').get(function() {
  const { positive, negative, neutral } = this.sentimentBreakdown;
  const total = positive.count + negative.count + neutral.count;
  
  if (total === 0) return 0.5;
  
  const positiveWeight = positive.count / total;
  const negativeWeight = negative.count / total;
  
  return positiveWeight - negativeWeight + 0.5; // Scale to 0-1
});

// Methods
sentimentSnapshotSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    ticker: this.ticker,
    timestamp: this.timestamp,
    timeWindow: this.timeWindow,
    totalPosts: this.totalPosts,
    sentimentBreakdown: this.sentimentBreakdown,
    sources: this.sources,
    overallSentiment: this.overallSentiment,
    overallScore: this.overallScore,
    confidence: this.confidence,
    volatility: this.volatility
  };
};

// Static methods
sentimentSnapshotSchema.statics.getRecentSnapshots = function(ticker, timeWindow = '5min', limit = 50) {
  return this.find({ 
    ticker, 
    timeWindow, 
    processed: true 
  })
    .sort({ timestamp: -1 })
    .limit(limit);
};

sentimentSnapshotSchema.statics.getSentimentStats = async function(ticker, hoursBack = 24) {
  const startDate = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
  
  const snapshots = await this.find({
    ticker,
    processed: true,
    timestamp: { $gte: startDate },
    timeWindow: '5min'
  }).sort({ timestamp: -1 });
  
  if (snapshots.length === 0) {
    return {
      total: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
      avgScore: 0.5,
      confidence: 0,
      volatility: 0,
      trend: 'neutral'
    };
  }
  
  // Aggregate across all snapshots
  let totalPosts = 0;
  let totalPositive = 0;
  let totalNegative = 0;
  let totalNeutral = 0;
  let totalConfidence = 0;
  let scores = [];
  
  snapshots.forEach(snapshot => {
    totalPosts += snapshot.totalPosts;
    totalPositive += snapshot.sentimentBreakdown.positive.count;
    totalNegative += snapshot.sentimentBreakdown.negative.count;
    totalNeutral += snapshot.sentimentBreakdown.neutral.count;
    totalConfidence += snapshot.confidence;
    scores.push(snapshot.overallScore);
  });
  
  // Calculate volatility (standard deviation of scores)
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
  const volatility = Math.sqrt(variance);
  
  // Determine trend (comparing first half vs second half)
  const midPoint = Math.floor(snapshots.length / 2);
  const firstHalfAvg = scores.slice(0, midPoint).reduce((sum, score) => sum + score, 0) / midPoint;
  const secondHalfAvg = scores.slice(midPoint).reduce((sum, score) => sum + score, 0) / (snapshots.length - midPoint);
  
  let trend = 'neutral';
  if (secondHalfAvg > firstHalfAvg + 0.1) trend = 'improving';
  else if (secondHalfAvg < firstHalfAvg - 0.1) trend = 'declining';
  
  return {
    total: totalPosts,
    positive: totalPositive,
    negative: totalNegative,
    neutral: totalNeutral,
    avgScore: avgScore,
    confidence: totalConfidence / snapshots.length,
    volatility: volatility,
    trend: trend,
    snapshots: snapshots.length
  };
};

sentimentSnapshotSchema.statics.getTimeline = async function(ticker, hoursBack = 24) {
  const startDate = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
  
  return this.find({
    ticker,
    processed: true,
    timestamp: { $gte: startDate },
    timeWindow: '5min'
  })
    .sort({ timestamp: 1 })
    .select('timestamp overallSentiment confidence totalPosts sentimentBreakdown');
};

module.exports = mongoose.model('SentimentSnapshot', sentimentSnapshotSchema);
