import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_phishguard_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

