import express from 'express';
import { getMuseums, getMuseumById, createMuseum, updateMuseum, deleteMuseum } from '../controllers/museumController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMuseums)
  .post(protect, adminOnly, createMuseum);

router.route('/:id')
  .get(getMuseumById)
  .put(protect, adminOnly, updateMuseum)
  .delete(protect, adminOnly, deleteMuseum);

export default router;
