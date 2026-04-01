// Minimal serverless entry point for Vercel
// All requires are deferred to avoid top-level crashes

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
    return res.status(200).json({
      status: 'FUNCTION_ALIVE',
      mongoUriSet: !!process.env.MONGODB_URI,
      mongoUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 25) + '...' : 'NOT_SET',
      jwtSecretSet: !!process.env.JWT_SECRET,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    });
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
