import {
  DEFAULT_TICKER,
  DEMO_LAST_UPDATED,
  DEMO_NOTICE,
  getAllFeedItems,
  getAllNewsItems,
  getDemoSummary,
  getTickerData,
  getTickerList,
  getTickerTone,
} from '../data/demoData';

export const normalizeTicker = (ticker) => {
  const upper = String(ticker || DEFAULT_TICKER).toUpperCase();
  return getTickerList().some((item) => item.symbol === upper) ? upper : DEFAULT_TICKER;
};

export const fetchTickerDirectory = () => getTickerList();

export const fetchMarketOverview = () => getDemoSummary();

export const fetchStats = (ticker) => {
  const profile = getTickerData(normalizeTicker(ticker));
  const { score, confidence, totalPosts, positive, neutral, negative, delta } = profile.sentimentSummary;

  return {
    symbol: profile.symbol,
    company: profile.company,
    sector: profile.sector,
    overallScore: score,
    confidence,
    totalPosts,
    dayChange: profile.dayChange,
    price: profile.price,
    summary: profile.summary,
    demoHeadline: profile.demoHeadline,
    topThemes: profile.themes,
    riskNote: profile.metrics.riskNote,
    conviction: profile.metrics.conviction,
    buzzChange: profile.metrics.buzzChange,
    sourceDiversity: profile.metrics.sourceDiversity,
    scoreDelta: delta,
    tone: getTickerTone(score),
    sentimentBreakdown: {
      positive: { count: positive, percentage: positive / totalPosts },
      neutral: { count: neutral, percentage: neutral / totalPosts },
      negative: { count: negative, percentage: negative / totalPosts },
    },
    sourceBreakdown: profile.sourceBreakdown,
  };
};

export const fetchTimeline = (ticker) => {
  const profile = getTickerData(normalizeTicker(ticker));
  return profile.timeline.map((point) => ({
    timestamp: point.timestamp,
    overallScore: point.overallScore,
    confidence: point.confidence,
    totalPosts: point.totalPosts,
    overallSentiment: getTickerTone(point.overallScore).label,
    positive: point.positive,
    neutral: point.neutral,
    negative: point.negative,
  }));
};

export const fetchPriceSeries = (ticker) => {
  const profile = getTickerData(normalizeTicker(ticker));
  return profile.timeline.map((point, index, list) => {
    const previous = list[Math.max(index - 1, 0)].price;
    return {
      timestamp: point.timestamp,
      close: point.price,
      open: previous,
      high: Math.max(point.price, previous) + 1.8,
      low: Math.min(point.price, previous) - 1.6,
      volume: 900000 + index * 125000,
      sentimentScore: point.overallScore,
    };
  });
};

export const fetchTickerMetrics = (ticker) => {
  const profile = getTickerData(normalizeTicker(ticker));
  const latest = profile.timeline[profile.timeline.length - 1];
  return {
    ticker: profile.symbol,
    company: profile.company,
    lastUpdated: DEMO_LAST_UPDATED,
    metrics: {
      conviction: profile.metrics.conviction,
      buzzChange: profile.metrics.buzzChange,
      sourceDiversity: profile.metrics.sourceDiversity,
      sentimentScore: Math.round(latest.overallScore * 100),
      sampleDepth: profile.feed.length,
    },
  };
};

export const fetchTickerFeed = (ticker, source = 'all') => {
  const profile = getTickerData(normalizeTicker(ticker));
  return profile.feed.filter((item) => source === 'all' || item.source === source);
};

export const fetchGeneralNews = () => getAllNewsItems().slice(0, 6);

export const fetchTickerNews = (ticker) =>
  fetchTickerFeed(normalizeTicker(ticker), 'news');

export const fetchSourceFeed = ({ ticker = 'all', source = 'all' } = {}) =>
  getAllFeedItems().filter((item) => {
    const tickerMatch = ticker === 'all' || item.ticker === normalizeTicker(ticker);
    const sourceMatch = source === 'all' || item.source === source;
    return tickerMatch && sourceMatch;
  });

export const fetchDemoInfo = () => ({
  notice: DEMO_NOTICE,
  lastUpdated: DEMO_LAST_UPDATED,
  mode: 'Local data mode',
  dataLocation: 'frontend/src/data/demoData.js',
  auth: 'No backend auth required.',
  services: ['No live APIs', 'No database', 'No background jobs', 'No server-side pipeline'],
});
