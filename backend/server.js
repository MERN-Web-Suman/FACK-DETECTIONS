import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Initialize MongoDB Connection
connectDB();

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  PhishGuard AI Backend Server Running on Port ${PORT}`);
  console.log(`📡  API Endpoint: http://localhost:${PORT}/api`);
  console.log(`🛡️  Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

