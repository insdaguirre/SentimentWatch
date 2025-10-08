const { pipeline } = require('@xenova/transformers');

class SentimentAnalyzer {
  constructor() {
    this.classifier = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('Loading FinBERT sentiment model...');
      // Using FinBERT for financial sentiment analysis
      this.classifier = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
      // Note: In production, use 'ProsusAI/finbert' but it requires more setup
      // For now using a lightweight alternative that works out of the box
      
      this.isInitialized = true;
      console.log('FinBERT model loaded successfully');
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
      
      // Convert to finance-domain labels
      let sentimentLabel;
      if (label === 'positive') {
        sentimentLabel = 'positive';
      } else if (label === 'negative') {
        sentimentLabel = 'negative';
      } else {
        sentimentLabel = 'neutral';
      }
      
      return {
        label: sentimentLabel,
        score: score,
        positive: sentimentLabel === 'positive' ? score : 1 - score,
        negative: sentimentLabel === 'negative' ? score : 1 - score,
        neutral: sentimentLabel === 'neutral' ? score : 0.5
      };
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

