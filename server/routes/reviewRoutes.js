import express from 'express';
import { createReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createReview);
router.route('/:id').delete(protect, deleteReview);

export default router;
