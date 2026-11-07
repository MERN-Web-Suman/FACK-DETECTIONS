import express from 'express';
import { getDbStatus, reconnectDB } from '../config/db.js';
import { Scan } from '../models/Scan.js';
import { User } from '../models/User.js';

const router = express.Router();

// @desc    Get live database connection status & metrics
// @route   GET /api/system/db-status
// @access  Public
router.get('/db-status', async (req, res, next) => {
  try {
    const status = getDbStatus();
    const totalScans = await Scan.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        ...status,
        totalScans,
        totalUsers,
        serverTime: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Connect to custom MongoDB database via URL
// @route   POST /api/system/connect-db
// @access  Public
router.post('/connect-db', async (req, res, next) => {
  try {
    const { mongoURI } = req.body;

    if (!mongoURI || typeof mongoURI !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid MongoDB connection URL (e.g. mongodb+srv://... or mongodb://...)'
      });
    }

    const result = await reconnectDB(mongoURI.trim());

    res.status(200).json({
      success: true,
      message: `Successfully connected to MongoDB database [${result.host}]!`,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Could not connect to MongoDB database.'
    });
  }
});

export default router;

