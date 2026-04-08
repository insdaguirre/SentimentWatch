/**
 * Database configuration for demo mode
 * Uses in-memory store instead of MongoDB
 */

const inMemoryDataStore = require('../services/inMemoryDataStore');
const dummyDataGenerator = require('../services/dummyDataGenerator');

const connectDB = async () => {
  try {
    console.log('[DB] Initializing in-memory data store for demo mode...');
    
    // Initialize the in-memory store with dummy data
    await inMemoryDataStore.initialize(dummyDataGenerator);
    
    console.log('[DB] In-memory data store ready (demo mode)');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('[DB] Shutting down gracefully...');
      process.exit(0);
    });

    return { connection: { ready: true } };
  } catch (error) {
    console.error(`[DB] Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

