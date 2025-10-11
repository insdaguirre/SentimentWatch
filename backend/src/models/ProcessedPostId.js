const mongoose = require('mongoose');

const processedPostIdSchema = new mongoose.Schema({
  sourceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  ticker: {
    type: String,
    required: true,
    index: true
  },
  processedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false
});

// TTL index for automatic cleanup (7 days)
processedPostIdSchema.index({ processedAt: 1 }, { expireAfterSeconds: 604800 });

// Compound index for efficient queries
processedPostIdSchema.index({ ticker: 1, processedAt: -1 });

module.exports = mongoose.model('ProcessedPostId', processedPostIdSchema);
