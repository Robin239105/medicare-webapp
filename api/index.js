const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });

const serverless = require('serverless-http');
const connectDB = require('../server/db');
const app = require('../server/app');

let handlerPromise;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      await connectDB();
      return serverless(app);
    })();
  }
  return handlerPromise;
}

module.exports = async (req, res) => {
  try {
    const handler = await getHandler();
    return handler(req, res);
  } catch (error) {
    console.error('SERVERLESS_STARTUP_ERROR:', error);
    res.status(500).json({
      error: 'CRITICAL_SANCTUARY_CRASH',
      message: error.message,
      stack: error.stack,
      hint: 'Check MONGODB_URI and JWT_SECRET in Vercel Dashboard'
    });
  }
};
