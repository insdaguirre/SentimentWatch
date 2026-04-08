/**
 * Generates realistic dummy data for the SentimentWatch demo
 * Replaces external API calls with synthetic but realistic-looking data
 */

class DummyDataGenerator {
  constructor() {
    this.financeTemplates = {
      bullish: [
        "🚀 {ticker} is crushing it! Just broke through resistance at {price}. Bullish chart pattern forming. This is the move we've been waiting for! #stocks #trading",
        "{ticker} looking strong after earnings beat. Revenue up {percent}% YoY. Momentum is clearly bullish here. Diamond hands = profit 💎",
        "Just did my technical analysis and {ticker} is showing classic breakout setup. Volume increasing, price action bullish. This could be the beginning of a major rally.",
        "The fundamentals are solid and technicals are screaming BUY on {ticker}. Long position opened. Let's ride this wave 📈",
        "HODL {ticker} - analysts upgrading target to ${price}. This stock is undervalued. Great buying opportunity for long-term investors.",
        "{ticker} beat earnings expectations big time. Guidance raised. Rally just starting imo. Bullish AF 🔥"
      ],
      bearish: [
        "⚠️ {ticker} dumping hard. This looks like a dead cat bounce. Sellers in control. Could see major support break. Bearish divergence on the daily. 📉",
        "{ticker} missing earnings guidance. Revenue down {percent}%. This is concerning. Technical breakdown imminent imo.",
        "Sold half my {ticker} position. The chart is looking ugly with lower highs and lower lows. Classic bearish pattern. Risk/reward not favorable here.",
        "FUD incoming on {ticker}. Sector weakness spreading. I'd be careful here. The downtrend could accelerate fast.",
        "{ticker} breaking support levels. Volume surge to downside. This looks like capitulation selling could be near.", 
        "Bearish news on {ticker} - lawsuit filed against executives. Stock is rekt. Falling knife warning ⚠️"
      ],
      neutral: [
        "{ticker} consolidating in range. $45-52 support/resistance. Waiting for breakout. Not much happening lately - good buying opportunity if you're patient.",
        "{ticker} holding sideways. Mixed signals on the technicals. Could go either direction from here. Hold for now, watch for catalyst.",
        "Neutral on {ticker} - earnings are priced in. Waiting for next catalyst. Hold current positions. Fundamentals stable.",
        "{ticker} range-bound. Need to see a clear breakout direction. Volume dying down. Waiting for confirmation.",
        "Technical analysis on {ticker}: consolidating, waiting for breakout. Not much to do here. Stay on sidelines.",
        "{ticker} in limbo. Earnings done, next major catalyst TBD. Holding for now. No clear direction yet."
      ]
    };

    this.redditSubreddits = ['wallstreetbets', 'stocks', 'investing', 'stocks', 'options'];
    this.newsHeadlines = [
      "{ticker} shares rise amid strong quarterly results",
      "Analyst lifts {ticker} price target to ${price}",
      "{ticker} rallies on positive corporate guidance",
      "{ticker} declines following disappointing earnings",
      "Market uncertainty hits {ticker} stock",
      "{ticker} faces headwinds from sector rotation",
      "Institutional investors increase {ticker} holdings",
      "Fed comments boost sentiment on {ticker}",
      "Trade tensions weigh on {ticker} outlook"
    ];

    this.authors = [
      'trader_joe', 'market_pro', 'stock_hunter', 'value_investor', 'daytrader_dave',
      'moon_mission', 'diamond_hands', 'buffett_fan', 'tech_guru', 'bear_case',
      'bull_run', 'analyst_mike', 'finance_daily', 'market_watch', 'reddit_user'
    ];
  }

  /**
   * Generate a random sentiment label and score
   * Biased toward realistic distributions (more neutral than extreme)
   */
  generateSentiment() {
    const random = Math.random();
    
    // Distribution: 40% neutral, 35% positive, 25% negative
    if (random < 0.40) {
      return {
        label: 'neutral',
        score: 0.4 + Math.random() * 0.2, // 0.4-0.6
        positive: 0.3 + Math.random() * 0.1,
        negative: 0.3 + Math.random() * 0.1,
        neutral: 0.35 + Math.random() * 0.15
      };
    } else if (random < 0.75) {
      return {
        label: 'positive',
        score: 0.6 + Math.random() * 0.4, // 0.6-1.0
        positive: 0.5 + Math.random() * 0.5,
        negative: 0.15 + Math.random() * 0.1,
        neutral: 0.15 + Math.random() * 0.1
      };
    } else {
      return {
        label: 'negative',
        score: 0.2 + Math.random() * 0.3, // 0.2-0.5
        positive: 0.15 + Math.random() * 0.1,
        negative: 0.6 + Math.random() * 0.4,
        neutral: 0.15 + Math.random() * 0.1
      };
    }
  }

  /**
   * Generate a random post content based on sentiment
   */
  generatePostContent(ticker, sentiment) {
    let templates;
    if (sentiment.label === 'positive') {
      templates = this.financeTemplates.bullish;
    } else if (sentiment.label === 'negative') {
      templates = this.financeTemplates.bearish;
    } else {
      templates = this.financeTemplates.neutral;
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    const price = (350 + Math.random() * 100).toFixed(2);
    const percent = (Math.random() * 50).toFixed(1);

    return template
      .replace(/{ticker}/g, ticker)
      .replace(/{price}/g, price)
      .replace(/{percent}/g, percent);
  }

  /**
   * Generate a sentiment post for a given source
   */
  generateSentimentPost(ticker, source = 'reddit', date = new Date()) {
    const sentiment = this.generateSentiment();
    const content = this.generatePostContent(ticker, sentiment);

    const sources = {
      reddit: {
        title: content.substring(0, 80),
        author: this.authors[Math.floor(Math.random() * this.authors.length)],
        subreddit: this.redditSubreddits[Math.floor(Math.random() * this.redditSubreddits.length)],
        url: `https://reddit.com/r/stocks/comments/${Math.random().toString(36).substr(2, 9)}`,
        sourceId: `reddit_${Math.random().toString(36).substr(2, 15)}`
      },
      stocktwits: {
        title: null,
        author: this.authors[Math.floor(Math.random() * this.authors.length)],
        url: `https://stocktwits.com/message/${Math.floor(Math.random() * 1000000000)}`,
        sourceId: `stocktwits_${Math.floor(Math.random() * 1000000000)}`
      },
      news: {
        title: this.newsHeadlines[Math.floor(Math.random() * this.newsHeadlines.length)]
          .replace(/{ticker}/g, ticker)
          .replace(/{price}/g, (350 + Math.random() * 100).toFixed(2)),
        author: 'News Source',
        url: `https://news.example.com/${Math.random().toString(36).substr(2, 15)}`,
        sourceId: `news_${Math.random().toString(36).substr(2, 15)}`
      },
      finnhub: {
        title: this.newsHeadlines[Math.floor(Math.random() * this.newsHeadlines.length)]
          .replace(/{ticker}/g, ticker)
          .replace(/{price}/g, (350 + Math.random() * 100).toFixed(2)),
        author: 'Finnhub News',
        url: `https://finnhub.io/news/${Math.random().toString(36).substr(2, 15)}`,
        sourceId: `finnhub_${Math.random().toString(36).substr(2, 15)}`
      }
    };

    const sourceConfig = sources[source] || sources.reddit;

    return {
      ticker: ticker.toUpperCase(),
      source: source,
      sourceId: sourceConfig.sourceId,
      title: sourceConfig.title || content.substring(0, 100),
      content: content,
      author: sourceConfig.author,
      url: sourceConfig.url,
      publishedAt: date,
      ingestedAt: new Date(),
      sentiment: {
        label: sentiment.label,
        score: sentiment.score,
        positive: sentiment.positive,
        negative: sentiment.negative,
        neutral: sentiment.neutral
      },
      // Additional metadata based on source
      ...(source === 'reddit' && {
        subreddit: sourceConfig.subreddit,
        upvotes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 500)
      }),
      ...(source === 'stocktwits' && {
        likes: Math.floor(Math.random() * 1000),
        replies: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 10000)
      })
    };
  }

  /**
   * Generate several posts for a given ticker (simulating an ingestion cycle)
   */
  generateBatchPosts(ticker, date = new Date()) {
    const posts = [];
    
    const counts = {
      reddit: 75,
      stocktwits: 60,
      news: 20,
      finnhub: 8
    };

    for (const [source, count] of Object.entries(counts)) {
      for (let i = 0; i < count; i++) {
        // Vary timestamps slightly (within current 15-min window)
        const variance = Math.random() * 15 * 60 * 1000; // 15 minutes in ms
        const postDate = new Date(date.getTime() - variance);
        
        posts.push(this.generateSentimentPost(ticker, source, postDate));
      }
    }

    return posts;
  }

  /**
   * Generate SPY price data (OHLCV)
   */
  generateSPYCandle(date = new Date(), previousClose = 450) {
    const volatility = 0.02; // 2% typical daily volatility
    const change = (Math.random() - 0.5) * volatility * previousClose;
    const open = previousClose + change * 0.2;
    const close = previousClose + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.floor(50000000 + Math.random() * 150000000);

    return {
      date: date,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume,
      ticker: 'SPY'
    };
  }

  /**
   * Generate historical SPY data (for seeding 60 days of history)
   */
  generateHistoricalSPYData(days = 60) {
    const candles = [];
    let currentPrice = 450;
    const now = new Date();

    for (let i = days; i > 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }

      const candle = this.generateSPYCandle(date, currentPrice);
      candles.push(candle);
      currentPrice = candle.close;
    }

    return candles;
  }

  /**
   * Simulate time-series data evolution
   * Returns a sentiment meter that progresses realistically over time
   */
  getTimeSeriesMultiplier(timestamp = Date.now()) {
    // Create a simple sine-wave pattern over 7 days for realistic market cycles
    const cycleDays = 7;
    const cycleMs = cycleDays * 24 * 60 * 60 * 1000;
    const position = (timestamp % cycleMs) / cycleMs; // 0 to 1
    
    // Sine wave: creates bullish and bearish periods
    const sineValue = Math.sin(position * Math.PI * 2);
    
    // Map to sentiment shift: ranges from -0.2 to +0.2
    return sineValue * 0.2;
  }
}

module.exports = new DummyDataGenerator();
