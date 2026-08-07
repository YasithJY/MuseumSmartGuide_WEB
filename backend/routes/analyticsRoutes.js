import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getDashboardStats);

export default router;
