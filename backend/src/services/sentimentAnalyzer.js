const { pipeline } = require('@xenova/transformers');

class SentimentAnalyzer {
  constructor() {
    this.classifier = null;
    this.isInitialized = false;
    
    // Finance-specific sentiment enhancement rules
    this.financeKeywords = {
      positive: [
        'bull', 'bullish', 'rally', 'surge', 'gain', 'profit', 'growth', 'up', 'rise', 'climb',
        'breakout', 'momentum', 'strong', 'buy', 'long', 'optimistic', 'positive', 'beat',
        'exceed', 'outperform', 'soar', 'jump', 'spike', 'boom', 'thrive', 'flourish',
        'recovery', 'rebound', 'bounce', 'rally', 'advance', 'increase', 'boost', 'lift'
      ],
      negative: [
        'bear', 'bearish', 'crash', 'plunge', 'loss', 'decline', 'down', 'fall', 'drop',
        'sell', 'short', 'pessimistic', 'negative', 'miss', 'disappoint', 'weak', 'struggle',
        'tumble', 'slump', 'collapse', 'dive', 'sink', 'plummet', 'crash', 'bust',
        'recession', 'crisis', 'panic', 'fear', 'concern', 'worry', 'risk', 'volatile',
        'uncertain', 'turbulent', 'unstable', 'decline', 'decrease', 'downturn', 'correction'
      ],
      neutral: [
        'hold', 'stable', 'flat', 'sideways', 'consolidate', 'range', 'support', 'resistance',
        'neutral', 'mixed', 'uncertain', 'wait', 'watch', 'monitor', 'evaluate', 'assess'
      ]
    };
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('Loading DistilBERT sentiment model with finance rules...');
      // Using DistilBERT for sentiment analysis with custom finance enhancement
      this.classifier = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
      
      this.isInitialized = true;
      console.log('DistilBERT model with finance rules loaded successfully');
    } catch (error) {
      console.error('Error loading sentiment model:', error);
      throw error;
    }
  }

  async analyzeSentiment(text) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Truncate text to avoid model limits
      const truncatedText = text.substring(0, 512);
      
      const result = await this.classifier(truncatedText);
      
      // Map the result to our format
      const label = result[0].label.toLowerCase();
      const score = result[0].score;
      
      // Apply finance-specific sentiment enhancement
      const enhancedResult = this.enhanceWithFinanceRules(text, label, score);
      
      return enhancedResult;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      // Return neutral sentiment on error
      return {
        label: 'neutral',
        score: 0.5,
        positive: 0.33,
        negative: 0.33,
        neutral: 0.34
      };
    }
  }

  enhanceWithFinanceRules(text, baseLabel, baseScore) {
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
    
    // Apply enhancement to base sentiment
    let enhancedScore = baseScore;
    let sentimentLabel = baseLabel;
    
    if (financeBoost !== 0) {
      enhancedScore = Math.max(0, Math.min(1, baseScore + financeBoost));
      
      // Adjust label based on enhanced score
      if (enhancedScore > 0.6) {
        sentimentLabel = 'positive';
      } else if (enhancedScore < 0.4) {
        sentimentLabel = 'negative';
      } else {
        sentimentLabel = 'neutral';
      }
    }
    
    return {
      label: sentimentLabel,
      score: enhancedScore,
      positive: sentimentLabel === 'positive' ? enhancedScore : (sentimentLabel === 'neutral' ? 0.5 : 1 - enhancedScore),
      negative: sentimentLabel === 'negative' ? enhancedScore : (sentimentLabel === 'neutral' ? 0.5 : 1 - enhancedScore),
      neutral: sentimentLabel === 'neutral' ? enhancedScore : 0.5,
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

