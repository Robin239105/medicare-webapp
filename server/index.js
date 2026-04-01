require('dotenv').config();
const connectDB = require('./db');
const app = require('./app');

const PORT = process.env.PORT || 5005;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ Could not connect to MongoDB:', err));
