// Minimal serverless entry point for Vercel
let handler;
let app;
let dbConnected = false;

// 1. Defer loading the heavy Express app until needed
async function loadApp() {
  if (!app) {
    app = require('../server/app');
  }
  return app;
}

// 2. Defer MongoDB connection until needed
async function ensureDB() {
  if (!dbConnected) {
    const connectDB = require('../server/db');
    await connectDB();
    dbConnected = true;
  }
}

module.exports = async (req, res) => {
  // DIAGNOSTIC ENDPOINT: Checks if function is alive and sees Env Vars
  if (req.url === '/api/diag' || req.url === '/api/diag/') {
    const uri = process.env.MONGODB_URI || '';
    const hasDbName = /\.mongodb\.net\/[a-zA-Z]/.test(uri);
    return res.status(200).json({
      status: 'FUNCTION_ALIVE',
      mongoUriSet: !!uri,
      hasDbName: hasDbName,
      jwtSecretSet: !!process.env.JWT_SECRET,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    });
  }

  // DB TEST ENDPOINT: Verifies Atlas connection directly
  if (req.url === '/api/dbtest' || req.url === '/api/dbtest/') {
    try {
      const mongoose = require('mongoose');
      const uri = process.env.MONGODB_URI;
      if (!uri) return res.status(500).json({ error: 'MONGODB_URI not set' });
      
      const conn = await mongoose.createConnection(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      }).asPromise();
      
      await conn.close();
      return res.status(200).json({ status: 'DB_CONNECTED', message: 'Atlas connection successful!' });
    } catch (error) {
      return res.status(500).json({ status: 'DB_FAILED', error: error.message });
    }
  }

  // MAIN APP EXECUTION
  try {
    const expressApp = await loadApp();  // 🚀 Load app weight first for smoother cold start
    await ensureDB();                    // 📡 Then connect to data
    
    if (!handler) {
      const serverless = require('serverless-http');
      handler = serverless(expressApp);
    }
    
    return handler(req, res);
  } catch (error) {
    console.error('API_ERROR:', error.message);
    return res.status(500).json({
      error: 'API_CONNECTION_FAILED',
      message: error.message,
      hint: 'Check Atlas 0.0.0.0/0 Whitelist and MONGODB_URI'
    });
  }
};
