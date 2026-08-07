import express from 'express';
import { getGalleries, getGalleryById, createGallery, updateGallery, deleteGallery } from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getGalleries)
  .post(protect, adminOnly, createGallery);

router.route('/:id')
  .get(getGalleryById)
  .put(protect, adminOnly, updateGallery)
  .delete(protect, adminOnly, deleteGallery);

export default router;
