// Minimal serverless entry point for Vercel
let handler;
let app;
let dbConnected = false;

async function loadApp() {
  if (!app) {
    app = require('../server/app');
  }
  return app;
}

async function ensureDB() {
  if (!dbConnected) {
    const connectDB = require('../server/db');
    await connectDB();
    dbConnected = true;
  }
}

module.exports = async (req, res) => {
  // Quick diagnostic endpoint - no dependencies needed
  if (req.url === '/api/diag' || req.url === '/api/diag/') {
    const uri = process.env.MONGODB_URI || '';
    // Show if URI has database name (between .net/ and ?)
    const hasDbName = /\.mongodb\.net\/[a-zA-Z]/.test(uri);
    return res.status(200).json({
      status: 'FUNCTION_ALIVE',
      mongoUriSet: !!uri,
      mongoUriLength: uri.length,
      hasDbName: hasDbName,
      uriEndsCorrectly: uri.includes('mongodb.net/medicare') || uri.includes('mongodb.net/?'),
      jwtSecretSet: !!process.env.JWT_SECRET,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    });
  }

  // DB connection test endpoint
  if (req.url === '/api/dbtest' || req.url === '/api/dbtest/') {
    try {
      const mongoose = require('mongoose');
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        return res.status(500).json({ error: 'MONGODB_URI not set' });
      }
      
      // Try a direct connection with very short timeout
      const conn = await mongoose.createConnection(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      }).asPromise();
      
      await conn.close();
      return res.status(200).json({ 
        status: 'DB_CONNECTED',
        message: 'MongoDB Atlas connection successful!' 
      });
    } catch (error) {
      return res.status(500).json({ 
        status: 'DB_FAILED',
        error: error.message,
        code: error.code || 'UNKNOWN'
      });
    }
  }

  try {
    await ensureDB();
    const expressApp = await loadApp();
    
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
      hint: 'Check MongoDB Atlas Network Access (0.0.0.0/0) and MONGODB_URI env var'
    });
  }
};
