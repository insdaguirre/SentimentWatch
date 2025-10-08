import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './PostsFeed.css';

const PostsFeed = ({ posts, ticker }) => {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');

  if (!posts || posts.length === 0) {
    return (
      <div className="posts-feed">
        <h2>📝 Recent Posts</h2>
        <div className="no-posts">No posts available yet. Check back soon!</div>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => {
    if (sourceFilter !== 'all' && post.source !== sourceFilter) return false;
    if (sentimentFilter !== 'all' && post.sentiment.label !== sentimentFilter) return false;
    return true;
  });

  const getSentimentBadgeClass = (label) => {
    return `sentiment-badge sentiment-${label}`;
  };

  const getSentimentIcon = (label) => {
    switch (label) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      case 'neutral': return '➡️';
      default: return '❓';
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'reddit': return '🤖';
      case 'stocktwits': return '💬';
      case 'news': return '📰';
      default: return '📄';
    }
  };

  return (
    <div className="posts-feed">
      <div className="posts-header">
        <h2>📝 Recent Posts</h2>
        
        <div className="filters">
          <select 
            value={sourceFilter} 
            onChange={(e) => setSourceFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Sources</option>
            <option value="reddit">Reddit</option>
            <option value="stocktwits">StockTwits</option>
            <option value="news">News</option>
          </select>

          <select 
            value={sentimentFilter} 
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
      </div>

      <div className="posts-count">
        Showing {filteredPosts.length} of {posts.length} posts
      </div>

      <div className="posts-list">
        {filteredPosts.map((post, index) => (
          <div key={post.id || index} className="post-card">
            <div className="post-header">
              <div className="post-source">
                <span className="source-icon">{getSourceIcon(post.source)}</span>
                <span className="source-text">{post.source}</span>
              </div>
              <div className="post-meta">
                <span className="post-time">
                  {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {post.title && (
              <h3 className="post-title">{post.title}</h3>
            )}

            <p className="post-content">
              {post.content.length > 300 
                ? `${post.content.substring(0, 300)}...` 
                : post.content}
            </p>

            <div className="post-footer">
              <div className={getSentimentBadgeClass(post.sentiment.label)}>
                <span className="sentiment-icon">
                  {getSentimentIcon(post.sentiment.label)}
                </span>
                <span className="sentiment-text">
                  {post.sentiment.label}
                </span>
                <span className="sentiment-score">
                  {(post.sentiment.score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="post-stats">
                {post.metadata?.upvotes && (
                  <span className="stat-item">
                    👍 {post.metadata.upvotes}
                  </span>
                )}
                {post.metadata?.comments && (
                  <span className="stat-item">
                    💬 {post.metadata.comments}
                  </span>
                )}
              </div>

              {post.url && (
                <a 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="post-link"
                >
                  View Source →
                </a>
              )}
            </div>

            {post.author && (
              <div className="post-author">
                by {post.author}
                {post.metadata?.subreddit && ` in r/${post.metadata.subreddit}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsFeed;

