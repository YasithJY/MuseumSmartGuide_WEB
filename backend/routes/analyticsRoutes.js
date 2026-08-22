import express from 'express';
import { getDashboardStats, getUserAnalytics } from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getDashboardStats);
router.get('/user-analytics', protect, adminOnly, getUserAnalytics);

export default router;
