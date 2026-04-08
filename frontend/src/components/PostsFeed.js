import React, { useState } from 'react';
import './PostsFeed.css';

const sourceLabels = {
  news: 'News',
  reddit: 'Reddit',
  stocktwits: 'StockTwits',
};

const PostsFeed = ({
  posts,
  ticker,
  title = 'Recent Feed',
  subtitle = '',
  hideFilters = false,
  lockedSource = null,
}) => {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const effectiveSource = lockedSource || sourceFilter;

  if (!posts || posts.length === 0) {
    return (
      <div className="posts-feed section-card">
        <div className="posts-empty">
          <h2>{title}</h2>
          <p>No items matched the current filter.</p>
        </div>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => {
    if (effectiveSource !== 'all' && post.source !== effectiveSource) return false;
    if (sentimentFilter !== 'all' && post.sentiment.label !== sentimentFilter) return false;
    return true;
  });

  return (
    <div className="posts-feed section-card">
      <div className="posts-header">
        <div>
          <p className="eyebrow">{ticker ? `${ticker} feed` : 'Feed'}</p>
          <h2>{title}</h2>
          {subtitle && <p className="posts-subtitle">{subtitle}</p>}
        </div>

        {!hideFilters && (
          <div className="filters">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All sources</option>
              <option value="news">News</option>
              <option value="reddit">Reddit</option>
              <option value="stocktwits">StockTwits</option>
            </select>

            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All sentiment</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        )}
      </div>

      <div className="posts-count">Showing {filteredPosts.length} of {posts.length} items</div>

      <div className="posts-list">
        {filteredPosts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-source">
                <span className="source-text">{sourceLabels[post.source] || post.source}</span>
                <span className="source-platform">{post.platform}</span>
              </div>
              <div className="post-meta">
                <span className="post-time">
                  {new Date(post.publishedAt).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {post.title && <h3 className="post-title">{post.title}</h3>}

            <p className="post-content">{post.content}</p>

            <div className="post-footer">
              <div className={`sentiment-badge sentiment-${post.sentiment.label}`}>
                <span className="sentiment-text">{post.sentiment.label}</span>
                <span className="sentiment-score">
                  {(post.sentiment.score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="post-stats">
                {post.metrics?.reactions && (
                  <span className="stat-item">
                    {post.metrics.reactions} reactions
                  </span>
                )}
                {post.metrics?.comments && (
                  <span className="stat-item">
                    {post.metrics.comments} comments
                  </span>
                )}
              </div>
            </div>

            {post.author && <div className="post-author">{post.author}</div>}
          </article>
        ))}
      </div>
    </div>
  );
};

export default PostsFeed;
