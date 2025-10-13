import React from 'react';
import './DevPage.css';

const DevPage = () => {
  return (
    <div className="dev-page">
      <div className="dev-header">
        <h1>🔧 Developer Information</h1>
        <p>Technical documentation and project resources</p>
      </div>

      <div className="dev-content">
        <div className="dev-section">
          <h2>📁 GitHub Repository</h2>
          <div className="github-link-container">
            <a 
              href="https://github.com/insdaguirre/SentimentWatch" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              <span className="github-icon">📦</span>
              <span className="github-text">View on GitHub</span>
              <span className="github-arrow">→</span>
            </a>
          </div>
        </div>

        <div className="dev-section">
          <h2>🏗️ Information Architecture</h2>
          <div className="architecture-content">
            <div className="architecture-diagram">
              <div className="diagram-title">System Overview</div>
              <div className="diagram-content">
                <div className="diagram-layer">
                  <div className="layer-title">Frontend (React)</div>
                  <div className="layer-items">
                    <span>• Main Page (News Tiles)</span>
                    <span>• Agent Page (Sentiment Analysis)</span>
                    <span>• News Page (SPY News)</span>
                    <span>• Dev Page (Documentation)</span>
                  </div>
                </div>
                <div className="diagram-arrow">↓</div>
                <div className="diagram-layer">
                  <div className="layer-title">Backend (Node.js/Express)</div>
                  <div className="layer-items">
                    <span>• Sentiment Analysis API</span>
                    <span>• SPY Price Data API</span>
                    <span>• News Aggregation API</span>
                    <span>• MongoDB Integration</span>
                  </div>
                </div>
                <div className="diagram-arrow">↓</div>
                <div className="diagram-layer">
                  <div className="layer-title">External Services</div>
                  <div className="layer-items">
                    <span>• Reddit API</span>
                    <span>• StockTwits API</span>
                    <span>• Yahoo Finance API</span>
                    <span>• News APIs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dev-section">
          <h2>🔄 Data Pipeline</h2>
          <div className="pipeline-content">
            <div className="pipeline-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Data Collection</h3>
                <p>Automated ingestion from multiple sources (Reddit, StockTwits, News APIs)</p>
              </div>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Sentiment Analysis</h3>
                <p>Real-time processing using natural language processing algorithms</p>
              </div>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Data Storage</h3>
                <p>Aggregated data stored in MongoDB with time-series optimization</p>
              </div>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>API Delivery</h3>
                <p>RESTful APIs with caching and rate limiting for frontend consumption</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dev-section">
          <h2>🛠️ Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>React 18</li>
                <li>React Router</li>
                <li>Recharts</li>
                <li>CSS3</li>
                <li>Vercel (Deployment)</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB</li>
                <li>Mongoose</li>
                <li>Heroku (Deployment)</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>APIs & Services</h3>
              <ul>
                <li>Reddit API</li>
                <li>StockTwits API</li>
                <li>Yahoo Finance API</li>
                <li>News APIs</li>
                <li>Natural Language Processing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="dev-section">
          <h2>📊 API Endpoints</h2>
          <div className="api-endpoints">
            <div className="endpoint-group">
              <h3>Sentiment Analysis</h3>
              <div className="endpoint-list">
                <div className="endpoint">
                  <span className="method">GET</span>
                  <span className="path">/api/sentiment/stats/:ticker</span>
                  <span className="description">Get sentiment statistics</span>
                </div>
                <div className="endpoint">
                  <span className="method">GET</span>
                  <span className="path">/api/sentiment/timeline/:ticker</span>
                  <span className="description">Get sentiment timeline</span>
                </div>
                <div className="endpoint">
                  <span className="method">GET</span>
                  <span className="path">/api/sentiment/posts/:ticker</span>
                  <span className="description">Get recent posts</span>
                </div>
              </div>
            </div>
            <div className="endpoint-group">
              <h3>SPY Data</h3>
              <div className="endpoint-list">
                <div className="endpoint">
                  <span className="method">GET</span>
                  <span className="path">/api/sentiment/spy/:timeWindow</span>
                  <span className="description">Get SPY price data</span>
                </div>
                <div className="endpoint">
                  <span className="method">GET</span>
                  <span className="path">/api/sentiment/spy/metrics/:timeWindow</span>
                  <span className="description">Get SPY metrics (volatility, Sharpe ratio)</span>
                </div>
              </div>
            </div>
            <div className="endpoint-group">
              <h3>News</h3>
              <div className="endpoint-list">
                <div className="endpoint">
                  <span className="method">GET</span>
                  <span className="path">/api/news/general</span>
                  <span className="description">Get general financial news</span>
                </div>
                <div className="endpoint">
                  <span className="method">GET</span>
                  <span className="path">/api/news/spy</span>
                  <span className="description">Get SPY-specific news</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevPage;
