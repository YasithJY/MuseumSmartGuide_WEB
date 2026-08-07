import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserPointsAndBadges } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile/rewards', protect, updateUserPointsAndBadges);

export default router;
