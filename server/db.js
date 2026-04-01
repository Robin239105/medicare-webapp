const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is MISSING in environment variables!');
    throw new Error('MONGODB_URI is not defined');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };
    
    console.log('📡 Connecting to MongoDB...');
    cached.promise = mongoose.connect(uri, opts)
      .then((m) => {
        console.log('✅ Connected to MongoDB');
        return m;
      })
      .catch(err => {
        console.error('❌ MongoDB Error:', err.message);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;
