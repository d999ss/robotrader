const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3003',
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/robotrader';
console.log('Connecting to MongoDB...'); // Debug log

// Set debug mode for mongoose
mongoose.set('debug', true);

// Create the MongoDB client options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  poolSize: 10,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 120000,
  waitQueueTimeoutMS: 30000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  w: 'majority',
  family: 4 // Force IPv4
};

// Function to connect with retries
const connectWithRetry = async (retries = 5, interval = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`MongoDB connection attempt ${i + 1} of ${retries}`);
      await mongoose.connect(MONGODB_URI, mongooseOptions);
      console.log('Connected to MongoDB successfully');
      // Test the connection
      await mongoose.connection.db.admin().ping();
      console.log('MongoDB ping successful - database is responsive');
      return; // Connection successful, exit the function
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed:`, {
        name: err.name,
        message: err.message,
        code: err.code
      });
      if (i < retries - 1) {
        console.log(`Retrying in ${interval/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }
  throw new Error(`Failed to connect to MongoDB after ${retries} attempts`);
};

// Initial connection
connectWithRetry()
  .catch(err => {
    console.error('All MongoDB connection attempts failed:', err);
    process.exit(1); // Exit if we can't connect after all retries
  });

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
  console.log('Connection readyState:', mongoose.connection.readyState);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', {
    name: err.name,
    message: err.message,
    code: err.code
  });
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  // Attempt to reconnect
  console.log('Attempting to reconnect...');
  connectWithRetry(3, 5000).catch(err => {
    console.error('Failed to reconnect:', err);
  });
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

// Routes
const robotRoutes = require('./routes/robots');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/robots', robotRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to RoboTrader API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
