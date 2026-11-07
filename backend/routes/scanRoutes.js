import express from 'express';
import {
  analyzeURL,
  getScanHistory,
  getScanById,
  getUserStats,
  deleteScan,
  analyzeEmailContent
} from '../controllers/scanController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, analyzeURL);
router.post('/analyze', protect, analyzeURL);
router.post('/analyze-email', protect, analyzeEmailContent);
router.get('/history', protect, getScanHistory);
router.get('/stats', protect, getUserStats);
router.route('/:id')
  .get(getScanById)
  .delete(protect, deleteScan);

export default router;

