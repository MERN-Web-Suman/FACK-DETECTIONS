import crypto from 'crypto';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    const token = generateToken(user._id || user.id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Account is suspended. Contact admin.' });
    }

    const token = generateToken(user._id || user.id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    res.status(200).json({
      success: true,
      data: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        apiKey: user.apiKey || null,
        scansCount: user.scansCount || 0,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate or regenerate personal API key
// @route   POST /api/auth/api-key
// @access  Private
export const generateApiKey = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const randomHex = crypto.randomBytes(20).toString('hex');
    const newApiKey = `pg_live_${randomHex}`;

    await User.findByIdAndUpdate(userId, { apiKey: newApiKey });

    res.status(200).json({
      success: true,
      apiKey: newApiKey,
      message: 'New API Key generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

