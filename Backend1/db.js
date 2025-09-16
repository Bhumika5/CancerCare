// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 sec timeout
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    // Retry after 5 seconds if connection fails
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection is open');
});
mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

module.exports = connectDB;
