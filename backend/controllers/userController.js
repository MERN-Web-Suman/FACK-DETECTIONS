import { User } from '../models/User.js';
import { Scan } from '../models/Scan.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile & scan activity
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    const recentScans = await Scan.find({ userId: req.user._id || req.user.id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        stats: {
          totalScans: recentScans.length,
          phishingDetected: recentScans.filter(s => s.status === 'Phishing').length,
          suspiciousDetected: recentScans.filter(s => s.status === 'Suspicious').length,
          legitimateChecked: recentScans.filter(s => s.status === 'Legitimate').length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, avatar, password } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates);

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

