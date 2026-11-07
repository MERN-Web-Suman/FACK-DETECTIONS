import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  // 1. Check for Developer API Key Header first
  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    try {
      const user = await User.findOne({ apiKey });
      if (user) {
        req.user = user;
        return next();
      }
      return res.status(401).json({ success: false, message: 'Invalid or revoked API Key provided.' });
    } catch (_) {}
  }

  // 2. Otherwise check Bearer JWT Token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_phishguard_2026');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.'
    });
  }
};

// Optional auth middleware (identifies user if token is sent, but allows guests)
export const optionalProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_phishguard_2026');
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (_) {}
  }
  next();
};

