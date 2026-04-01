// Vercel provides environment variables natively — no dotenv needed here
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
      error: 'Startup failed',
      message: error.message
    });
  }
};
