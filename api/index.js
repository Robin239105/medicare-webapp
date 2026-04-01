// Vercel provides environment variables natively — no dotenv needed
const serverless = require('serverless-http');
const connectDB = require('../server/db');
const app = require('../server/app');

let handler;

module.exports = async (req, res) => {
  try {
    // Connect to DB on each request (uses cached connection after first success)
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
