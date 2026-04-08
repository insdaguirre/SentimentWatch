require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const sentimentRoutes = require('./routes/sentiment-demo');
const newsRoutes = require('./routes/news-demo');
const IngestionWorker = require('./workers/ingestionWorker');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Heroku (required for rate limiting)
app.set('trust proxy', 1);

// CORS - must be before helmet
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);
    
    // Allow all Vercel domains
    if (origin.includes('vercel.app')) return callback(null, true);
    
    // Allow specific CORS_ORIGIN if set
    if (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) {
      return callback(null, true);
    }
    
    // Allow the request
    callback(null, true);
  },
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

// Connect to Database (in-memory for demo)
connectDB();

// Serve React frontend
const frontendBuildPath = path.join(__dirname, '../../frontend/build');
const developerNotePath = path.join(__dirname, '../public');

// Check if frontend build exists, create fallback if in development
let frontendPath = frontendBuildPath;

if (!fs.existsSync(frontendBuildPath)) {
  // In development, serve a simple HTML page pointing to the instructions
  console.log('[Server] Frontend build not found. Build the frontend first:');
  console.log('[Server]   cd frontend && npm run build && cd ..');
  
  // Create public folder if it doesn't exist
  if (!fs.existsSync(developerNotePath)) {
    fs.mkdirSync(developerNotePath, { recursive: true });
  }
  
  frontendPath = developerNotePath;
} else {
  console.log('[Server] Frontend build found, serving static files');
}

app.use(express.static(frontendPath));

// Routes
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/news', newsRoutes);

// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res) => {
  // If it's an API route, it was already handled above
  // Otherwise, serve the React index.html or development info
  const indexPath = path.join(frontendPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      error: 'Frontend not built',
      message: 'Build the React frontend first: cd frontend && npm run build && cd ..',
      apiEndpoint: 'API is available at /api/sentiment and /api/news',
      steps: [
        '1. cd frontend',
        '2. npm install',
        '3. npm run build',
        '4. cd ..',
        '5. npm start --prefix backend'
      ]
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server and ingestion worker
const server = app.listen(PORT, async () => {
  console.log(`\n🚀 SentimentWatch Demo Server started on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} in your browser`);
  console.log(`🔄 Running in demo mode with dummy data (no external APIs required)\n`);
  
  // Start the ingestion worker after a short delay
  setTimeout(async () => {
    try {
      const worker = new IngestionWorker();
      console.log('[Worker] Starting data ingestion worker...');
      await worker.start();
    } catch (error) {
      console.error('[Worker] Error starting ingestion worker:', error);
    }
  }, 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;

