import express from 'express';
import { subscribeNewsletter, getSubscribers } from '../controllers/newsletterController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(subscribeNewsletter)
  .get(protect, authorize('admin'), getSubscribers);

export default router;
