// Vercel provides environment variables natively — no dotenv needed
const serverless = require('serverless-http');
const connectDB = require('../server/db');
const app = require('../server/app');

let handler;

// Diagnostic endpoint that works WITHOUT database
// This helps verify env vars are set and the function runs
app.get('/api/diag', (req, res) => {
  const mongoUri = process.env.MONGODB_URI;
  const jwtSet = !!process.env.JWT_SECRET;
  res.json({
    status: 'FUNCTION_ALIVE',
    mongoUriSet: !!mongoUri,
    mongoUriPrefix: mongoUri ? mongoUri.substring(0, 20) + '...' : 'NOT_SET',
    jwtSecretSet: jwtSet,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

module.exports = async (req, res) => {
  try {
    // Skip DB connection for diagnostic endpoint
    if (req.url === '/api/diag') {
      if (!handler) handler = serverless(app);
      return handler(req, res);
    }
    
    // Connect to DB for all other routes
    await connectDB();
    
    if (!handler) {
      handler = serverless(app);
    }
    
    return handler(req, res);
  } catch (error) {
    console.error('SERVERLESS_ERROR:', error.message);
    res.status(500).json({
      error: 'API_CONNECTION_FAILED',
      message: error.message,
      hint: 'Check MongoDB Atlas Network Access (must have 0.0.0.0/0) and verify MONGODB_URI env var'
    });
  }
};
