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
  const handler = await getHandler();
  return handler(req, res);
};
