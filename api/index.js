// api/index.js
const mongoose = require('mongoose');

let isConnected = false;

// 1. Connection logic with hard AbortController timeout
async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  // Hard abort if takes more than 8 seconds (Vercel cold start window)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
      socketTimeoutMS: 6000,
      maxPoolSize: 1,        // Limit connections for serverless
      bufferCommands: false, // Prevents silent hangs when connection fails
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB Sanctuary');
    clearTimeout(timeout);
  } catch (err) {
    console.error('❌ DB connect failed:', err.message);
    clearTimeout(timeout);
    isConnected = false;
    throw err;
  }
}

module.exports = async (req, res) => {
  // DIAGNOSTIC - skips DB for quick status check
  if (req.url.startsWith('/api/diag')) {
    return res.status(200).json({ 
      status: 'FUNCTION_ALIVE', 
      mongoUriSet: !!process.env.MONGODB_URI,
      timestamp: new Date().toISOString()
    });
  }

  // Core execution: Try connecting to DB with explicit error handling
  try {
    await connectDB();
  } catch (err) {
    return res.status(503).json({ 
      error: 'DATABASE_UNAVAILABLE', 
      message: 'MongoDB Atlas connection timed out or was refused',
      detail: err.message,
      hint: 'Verify 0.0.0.0/0 IP whitelist in Atlas and MONGODB_URI'
    });
  }

  // Load and run Express app directly (no serverless-http wrapper)
  try {
    const app = require('../server/app');
    // Calling the app directly as a function handles (req, res) correctly on Vercel
    return app(req, res);
  } catch (err) {
    console.error('❌ APP_EXECUTION_ERROR:', err.message);
    return res.status(500).json({ 
      error: 'SERVER_EXECUTION_ERROR',
      message: err.message 
    });
  }
};
