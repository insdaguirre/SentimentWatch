require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const sentimentRoutes = require('./routes/sentiment');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Heroku (required for rate limiting)
app.set('trust proxy', 1);

// CORS - must be before helmet
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://*.vercel.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));

// Security middleware - disable some features that interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/sentiment', sentimentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Stock Sentiment API',
    version: '1.0.0',
    endpoints: {
      posts: '/api/sentiment/posts/:ticker',
      stats: '/api/sentiment/stats/:ticker',
      timeline: '/api/sentiment/timeline/:ticker',
      top: '/api/sentiment/top/:ticker',
      health: '/api/sentiment/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;

