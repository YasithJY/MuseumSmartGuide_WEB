import express from 'express';
import { getQuizzes, getQuizById, createQuiz, submitQuiz, deleteQuiz } from '../controllers/quizController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getQuizzes)
  .post(protect, adminOnly, createQuiz);

router.route('/:id')
  .get(getQuizById)
  .delete(protect, adminOnly, deleteQuiz);

router.post('/:id/submit', protect, submitQuiz);

export default router;
