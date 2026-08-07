import express from 'express';
import { 
  getExhibits, 
  getExhibitById, 
  createExhibit, 
  updateExhibit, 
  deleteExhibit, 
  toggleFavourite, 
  getFavourites 
} from '../controllers/exhibitController.js';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Favourites routes
router.route('/favourites')
  .get(protect, getFavourites)
  .post(protect, toggleFavourite);

router.route('/')
  .get(getExhibits)
  .post(protect, adminOnly, createExhibit);

router.route('/:id')
  .get(optionalProtect, getExhibitById)
  .put(protect, adminOnly, updateExhibit)
  .delete(protect, adminOnly, deleteExhibit);

export default router;
