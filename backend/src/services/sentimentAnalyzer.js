const vader = require('vader-sentiment');

class SentimentAnalyzer {
  constructor() {
    this.isInitialized = false;
    
    // Finance-specific sentiment enhancement rules
    this.financeKeywords = {
      positive: [
        'bull', 'bullish', 'rally', 'surge', 'gain', 'profit', 'growth', 'up', 'rise', 'climb',
        'breakout', 'momentum', 'strong', 'buy', 'long', 'optimistic', 'positive', 'beat',
        'exceed', 'outperform', 'soar', 'jump', 'spike', 'boom', 'thrive', 'flourish',
        'recovery', 'rebound', 'bounce', 'rally', 'advance', 'increase', 'boost', 'lift',
        'moon', 'rocket', 'pump', 'hodl', 'diamond', 'hands', 'yolo', 'tendies'
      ],
      negative: [
        'bear', 'bearish', 'crash', 'plunge', 'loss', 'decline', 'down', 'fall', 'drop',
        'sell', 'short', 'pessimistic', 'negative', 'miss', 'disappoint', 'weak', 'struggle',
        'tumble', 'slump', 'collapse', 'dive', 'sink', 'plummet', 'crash', 'bust',
        'recession', 'crisis', 'panic', 'fear', 'concern', 'worry', 'risk', 'volatile',
        'uncertain', 'turbulent', 'unstable', 'decline', 'decrease', 'downturn', 'correction',
        'dump', 'rekt', 'bag', 'holder', 'fud', 'scam', 'bubble', 'overvalued'
      ],
      neutral: [
        'hold', 'stable', 'flat', 'sideways', 'consolidate', 'range', 'support', 'resistance',
        'neutral', 'mixed', 'uncertain', 'wait', 'watch', 'monitor', 'evaluate', 'assess',
        'analysis', 'research', 'due', 'diligence', 'fundamentals', 'technical'
      ]
    };
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('Initializing VADER sentiment analyzer with finance rules...');
      // VADER is lightweight and doesn't require model loading
      this.isInitialized = true;
      console.log('VADER sentiment analyzer with finance rules initialized successfully');
    } catch (error) {
      console.error('Error initializing sentiment analyzer:', error);
      throw error;
    }
  }

  async analyzeSentiment(text) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Get VADER sentiment scores
      const vaderResult = vader.SentimentIntensityAnalyzer.polarity_scores(text);
      
      // Apply finance-specific sentiment enhancement
      const enhancedResult = this.enhanceWithFinanceRules(text, vaderResult);
      
      return enhancedResult;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      // Return neutral sentiment on error
      return {
        label: 'neutral',
        score: 0.5,
        positive: 0.33,
        negative: 0.33,
        neutral: 0.34,
        compound: 0
      };
    }
  }

  enhanceWithFinanceRules(text, vaderResult) {
    const lowerText = text.toLowerCase();
    
    // Count finance-specific keywords
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    
    this.financeKeywords.positive.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        positiveCount++;
      }
    });
    
    this.financeKeywords.negative.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        negativeCount++;
      }
    });
    
    this.financeKeywords.neutral.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        neutralCount++;
      }
    });
    
    // Calculate finance enhancement factor
    const totalFinanceWords = positiveCount + negativeCount + neutralCount;
    let financeBoost = 0;
    
    if (totalFinanceWords > 0) {
      // Strong finance context - apply more weight to finance keywords
      if (positiveCount > negativeCount) {
        financeBoost = Math.min(0.3, positiveCount * 0.1);
      } else if (negativeCount > positiveCount) {
        financeBoost = -Math.min(0.3, negativeCount * 0.1);
      }
    }
    
    // Apply enhancement to VADER compound score
    let enhancedCompound = vaderResult.compound + financeBoost;
    enhancedCompound = Math.max(-1, Math.min(1, enhancedCompound));
    
    // Determine sentiment label based on enhanced compound score
    let sentimentLabel;
    if (enhancedCompound >= 0.05) {
      sentimentLabel = 'positive';
    } else if (enhancedCompound <= -0.05) {
      sentimentLabel = 'negative';
    } else {
      sentimentLabel = 'neutral';
    }
    
    // Calculate individual scores
    const positive = Math.max(0, vaderResult.pos + (financeBoost > 0 ? financeBoost : 0));
    const negative = Math.max(0, vaderResult.neg + (financeBoost < 0 ? Math.abs(financeBoost) : 0));
    const neutral = vaderResult.neu;
    
    return {
      label: sentimentLabel,
      score: Math.abs(enhancedCompound),
      positive: positive,
      negative: negative,
      neutral: neutral,
      compound: enhancedCompound,
      financeKeywords: {
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount,
        boost: financeBoost
      }
    };
  }

  async analyzeBatch(texts) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const results = [];
    for (const text of texts) {
      const sentiment = await this.analyzeSentiment(text);
      results.push(sentiment);
    }
    return results;
  }
}

// Export singleton instance
module.exports = new SentimentAnalyzer();

